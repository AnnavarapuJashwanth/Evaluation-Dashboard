const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Answer Sub-Schema
const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: [true, 'Question index is required'],
    min: [0, 'Question index cannot be negative']
  },
  selectedOption: {
    type: Number,
    required: [true, 'Selected option is required'],
    min: [0, 'Selected option cannot be negative']
  },
  isCorrect: {
    type: Boolean,
    required: [true, 'Correctness flag is required']
  },
  timeSpent: {
    type: Number, // in seconds
    min: [0, 'Time spent cannot be negative'],
    default: 0
  }
}, {
  _id: false,
  timestamps: false
});

// Main QuizResult Schema
const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz ID is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative']
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions count is required'],
    min: [1, 'Total questions must be at least 1']
  },
  totalPoints: {
    type: Number,
    required: [true, 'Total points is required'],
    min: [0, 'Total points cannot be negative']
  },
  earnedPoints: {
    type: Number,
    required: [true, 'Earned points is required'],
    min: [0, 'Earned points cannot be negative']
  },
  percentageScore: {
    type: Number,
    required: [true, 'Percentage score is required'],
    min: [0, 'Percentage score cannot be negative'],
    max: [100, 'Percentage score cannot exceed 100']
  },
  timeSpent: {
    type: Number, // in seconds
    required: [true, 'Time spent is required'],
    min: [0, 'Time spent cannot be negative']
  },
  answers: {
    type: [answerSchema],
    required: [true, 'Answers are required'],
    validate: {
      validator: function(answers) {
        return answers.length > 0;
      },
      message: 'At least one answer is required'
    }
  },
  passed: {
    type: Boolean,
    required: [true, 'Passed status is required']
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time spent in minutes
quizResultSchema.virtual('timeSpentMinutes').get(function() {
  return (this.timeSpent / 60).toFixed(2);
});

// Virtual for average time per question
quizResultSchema.virtual('avgTimePerQuestion').get(function() {
  return (this.timeSpent / this.totalQuestions).toFixed(2);
});

// Index for better query performance
quizResultSchema.index({ user: 1, completedAt: -1 });
quizResultSchema.index({ quiz: 1, completedAt: -1 });
quizResultSchema.index({ user: 1, quiz: 1 });
quizResultSchema.index({ passed: 1 });

// Add pagination plugin
quizResultSchema.plugin(mongoosePaginate);

// Static method to get user's quiz results
quizResultSchema.statics.findByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, sort = { completedAt: -1 } } = options;
  
  return this.paginate(
    { user: userId },
    { page, limit, sort, populate: 'quiz' }
  );
};

// Static method to get quiz results for a specific quiz
quizResultSchema.statics.findByQuiz = function(quizId, options = {}) {
  const { page = 1, limit = 10, sort = { completedAt: -1 } } = options;
  
  return this.paginate(
    { quiz: quizId },
    { page, limit, sort, populate: 'user' }
  );
};

// Static method to get user's best score for a quiz
quizResultSchema.statics.findBestScore = function(userId, quizId) {
  return this.findOne({ user: userId, quiz: quizId })
    .sort({ percentageScore: -1, timeSpent: 1 })
    .populate('quiz');
};

// Static method to get average score for a quiz
quizResultSchema.statics.getQuizStatistics = async function(quizId) {
  const stats = await this.aggregate([
    { $match: { quiz: mongoose.Types.ObjectId(quizId) } },
    {
      $group: {
        _id: '$quiz',
        averageScore: { $avg: '$percentageScore' },
        highestScore: { $max: '$percentageScore' },
        lowestScore: { $min: '$percentageScore' },
        totalAttempts: { $sum: 1 },
        passCount: { $sum: { $cond: ['$passed', 1, 0] } },
        averageTime: { $avg: '$timeSpent' }
      }
    }
  ]);
  
  return stats[0] || null;
};

// Instance method to get performance category
quizResultSchema.methods.getPerformanceCategory = function() {
  if (this.percentageScore >= 90) return 'Excellent';
  if (this.percentageScore >= 75) return 'Good';
  if (this.percentageScore >= 60) return 'Average';
  return 'Needs Improvement';
};

module.exports = mongoose.model('QuizResult', quizResultSchema);