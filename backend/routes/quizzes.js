const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const auth = require('../middleware/auth');

// Error messages
const ERROR_MESSAGES = {
  SERVER_ERROR: 'Internal server error',
  QUIZ_NOT_FOUND: 'Quiz not found',
  INVALID_QUIZ_ID: 'Invalid quiz ID format'
};

// Success messages
const SUCCESS_MESSAGES = {
  QUIZZES_FETCHED: 'Quizzes fetched successfully',
  QUIZ_FETCHED: 'Quiz fetched successfully',
  QUIZ_SUBMITTED: 'Quiz submitted successfully',
  RESULTS_FETCHED: 'Quiz results fetched successfully'
};

// Validation: Check if MongoDB ObjectId is valid
const isValidObjectId = (id) => {
  return id.match(/^[0-9a-fA-F]{24}$/);
};

// Get all quizzes - UPDATED to handle missing isPublic field AND validation issues
router.get('/', async (req, res) => {
  try {
    // Find quizzes that are active AND (public OR missing isPublic field)
    // ADD .setOptions({ validateBeforeSave: false }) to bypass validation errors
    const quizzes = await Quiz.find({ 
      isActive: true,
      $or: [
        { isPublic: true },
        { isPublic: { $exists: false } }
      ]
    })
    .select('-questions.correctAnswer')
    .sort({ createdAt: -1 })
    .setOptions({ validateBeforeSave: false }); // ← CRITICAL FIX

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.QUIZZES_FETCHED,
      data: quizzes,
      count: quizzes.length
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: error.message
    });
  }
});

// Get quiz by ID - UPDATED to handle missing isPublic field AND validation issues
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_QUIZ_ID
      });
    }

    // Find quiz that is active AND (public OR missing isPublic field)
    // ADD .setOptions({ validateBeforeSave: false }) to bypass validation errors
    const quiz = await Quiz.findOne({
      _id: id,
      isActive: true,
      $or: [
        { isPublic: true },
        { isPublic: { $exists: false } }
      ]
    })
    .select('-questions.correctAnswer')
    .setOptions({ validateBeforeSave: false }); // ← CRITICAL FIX

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.QUIZ_NOT_FOUND
      });
    }

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.QUIZ_FETCHED,
      data: quiz
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: error.message
    });
  }
});

// Submit quiz results - FIXED validation issues
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeSpent } = req.body;
    const userId = req.user.id;

    console.log('Quiz submission received:', { id, userId, answersCount: answers?.length, timeSpent });

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_QUIZ_ID
      });
    }

    // FIX: Use validation bypass when fetching the quiz
    const quiz = await Quiz.findById(id)
      .setOptions({ validateBeforeSave: false }); // ← CRITICAL FIX

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.QUIZ_NOT_FOUND
      });
    }

    if (!quiz.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This quiz is no longer active'
      });
    }

    // Validate answers array
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format: answers array is required'
      });
    }

    // Calculate total points if not set
    if (!quiz.totalPoints || quiz.totalPoints === 0) {
      quiz.totalPoints = quiz.questions.reduce((total, question) => {
        return total + (question.points || 1);
      }, 0);
      // Use validation bypass when saving
      await quiz.save({ validateBeforeSave: false });
    }

    // Evaluate answers
    let earnedPoints = 0;
    const evaluatedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      
      // Handle case where question might not exist
      if (!question) {
        return {
          questionIndex: index,
          selectedOption: answer.selectedOption !== undefined ? answer.selectedOption : -1,
          isCorrect: false,
          timeSpent: answer.timeSpent || 0
        };
      }

      // Validate answer structure
      if (answer.selectedOption === undefined || answer.selectedOption === null) {
        return {
          questionIndex: index,
          selectedOption: -1,
          isCorrect: false,
          timeSpent: answer.timeSpent || 0
        };
      }

      const isCorrect = answer.selectedOption === question.correctAnswer;
     
      if (isCorrect) {
        earnedPoints += question.points || 1;
      }
     
      return {
        questionIndex: index,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    });

    // FIXED: Calculate percentage score safely to prevent Infinity
    let percentageScore = 0;
    if (quiz.totalPoints > 0) {
      percentageScore = (earnedPoints / quiz.totalPoints) * 100;
    }
    
    // Ensure percentageScore is a finite number between 0-100
    percentageScore = Math.max(0, Math.min(100, percentageScore));
    const passed = percentageScore >= (quiz.passPercentage || 60);

    // Save quiz result
    const quizResult = new QuizResult({
      user: userId,
      quiz: id,
      score: evaluatedAnswers.filter(a => a.isCorrect).length,
      totalQuestions: quiz.questions.length,
      totalPoints: quiz.totalPoints,
      earnedPoints,
      percentageScore,
      timeSpent: timeSpent || 0,
      answers: evaluatedAnswers,
      passed
    });

    await quizResult.save();

    console.log('Quiz result saved successfully:', { 
      userId, 
      quizId: id, 
      score: quizResult.score, 
      percentageScore: quizResult.percentageScore 
    });

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.QUIZ_SUBMITTED,
      data: {
        score: quizResult.score,
        totalQuestions: quizResult.totalQuestions,
        totalPoints: quizResult.totalPoints,
        earnedPoints: quizResult.earnedPoints,
        percentageScore: Math.round(quizResult.percentageScore * 100) / 100,
        timeSpent: quizResult.timeSpent,
        passed: quizResult.passed,
        answers: evaluatedAnswers
      }
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }

    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get user's quiz results history
router.get('/results/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { completedAt: -1 },
      populate: {
        path: 'quiz',
        select: 'title subject description'
      }
    };

    const results = await QuizResult.paginate(
      { user: userId },
      options
    );

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.RESULTS_FETCHED,
      data: results.docs,
      pagination: {
        page: results.page,
        totalPages: results.totalPages,
        totalResults: results.totalDocs,
        hasNext: results.hasNextPage,
        hasPrev: results.hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: error.message
    });
  }
});

// Get specific quiz result by ID
router.get('/results/:resultId', auth, async (req, res) => {
  try {
    const { resultId } = req.params;
    const userId = req.user.id;

    if (!isValidObjectId(resultId)) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_QUIZ_ID
      });
    }

    const result = await QuizResult.findOne({
      _id: resultId,
      user: userId
    }).populate('quiz', 'title subject questions');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Quiz result not found'
      });
    }

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.RESULTS_FETCHED,
      data: result
    });
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: error.message
    });
  }
});

module.exports = router;