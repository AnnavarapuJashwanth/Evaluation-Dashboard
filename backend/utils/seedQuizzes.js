const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const dotenv = require('dotenv');

dotenv.config();

// Use a valid user ID from your database or create a test user
const SAMPLE_USER_ID = new mongoose.Types.ObjectId(); // This creates a new ID

const sampleQuizzes = [
  {
    title: "Modern Software Development Fundamentals",
    subject: "MSD",
    description: "Test your knowledge of modern software development practices, tools, and methodologies.",
    timeLimit: 30,
    questions: [
      {
        question: "Which principle is NOT part of SOLID?",
        options: [
          "Single Responsibility",
          "Open-Closed",
          "Liskov Substitution",
          "Rapid Development"
        ],
        correctAnswer: 3,
        explanation: "Rapid Development is not part of SOLID principles. SOLID stands for Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
        points: 1
      },
      {
        question: "What does CI/CD stand for?",
        options: [
          "Continuous Integration/Continuous Deployment",
          "Code Integration/Code Deployment",
          "Continuous Improvement/Continuous Delivery",
          "Code Inspection/Code Documentation"
        ],
        correctAnswer: 0,
        explanation: "CI/CD stands for Continuous Integration and Continuous Deployment/Delivery, which is a method to frequently deliver apps to customers by introducing automation into the stages of app development.",
        points: 1
      },
      // ... (rest of your questions with points field added)
    ],
    createdBy: SAMPLE_USER_ID,
    isActive: true,
    isPublic: true, // ADD THIS
    difficulty: "Medium",
    tags: ["software", "development", "msd"]
  },
  {
    title: "Machine Learning Fundamentals",
    subject: "ML",
    description: "Test your knowledge of machine learning concepts, algorithms, and applications.",
    timeLimit: 30,
    questions: [
      {
        question: "Which algorithm is used for classification?",
        options: [
          "Logistic Regression",
          "Linear Regression",
          "K-Means",
          "PCA"
        ],
        correctAnswer: 0,
        explanation: "Logistic Regression is used for classification problems, while Linear Regression is used for regression, K-Means for clustering, and PCA for dimensionality reduction.",
        points: 1
      },
      // ... (rest of your questions with points field added)
    ],
    createdBy: SAMPLE_USER_ID,
    isActive: true,
    isPublic: true, // ADD THIS
    difficulty: "Medium",
    tags: ["machine", "learning", "ml"]
  }
];

const seedQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    // Insert sample quizzes
    await Quiz.insertMany(sampleQuizzes);
    console.log('Sample quizzes added successfully');

    // Verify the quizzes were added
    const quizCount = await Quiz.countDocuments();
    console.log(`Total quizzes in database: ${quizCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
};

seedQuizzes();