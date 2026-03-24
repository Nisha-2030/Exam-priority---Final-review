const Quiz = require('../models/Quiz');

// Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('topic')
      .populate('subject')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quizzes by topic
const getQuizzesByTopic = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ topic: req.params.topicId })
      .populate('topic')
      .populate('subject');
    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quizzes by subject
const getQuizzesBySubject = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ subject: req.params.subjectId })
      .populate('topic')
      .populate('subject');
    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuizByTopic = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ topic: req.params.topicId }).populate('topic');
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, topic, subject, description, type, pdfUrl, questions } = req.body;

    // Validation
    if (!title || !topic) {
      return res.status(400).json({ 
        success: false,
        error: 'Title and topic are required' 
      });
    }

    if (!subject) {
      return res.status(400).json({ 
        success: false,
        error: 'Subject is required' 
      });
    }

    if (type === 'pdf' && !pdfUrl) {
      return res.status(400).json({ 
        success: false,
        error: 'PDF URL required for PDF type quiz' 
      });
    }

    if (type === 'interactive' && (!questions || questions.length === 0)) {
      return res.status(400).json({ 
        success: false,
        error: 'Questions required for interactive quiz' 
      });
    }

    // Validate Subject and Topic exist
    const Topic = require('../models/Topic');
    const Subject = require('../models/Subject');
    
    const topicExists = await Topic.findById(topic);
    const subjectExists = await Subject.findById(subject);

    if (!topicExists || !subjectExists) {
      return res.status(404).json({ 
        success: false,
        error: 'Topic or Subject not found' 
      });
    }

    const quiz = new Quiz({
      title,
      topic,
      subject,
      description: description || '',
      type,
      pdfUrl: type === 'pdf' ? pdfUrl : null,
      questions: type === 'interactive' ? questions : [],
    });

    await quiz.save();
    
    // Populate references
    await quiz.populate('topic');
    await quiz.populate('subject');

    // Add quiz to topic
    await Topic.findByIdAndUpdate(topic, { $push: { quizzes: quiz._id } });

    res.status(201).json({ 
      success: true,
      message: 'Quiz created successfully', 
      data: quiz 
    });
  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { title, description, type, pdfUrl, questions } = req.body;

    if (type === 'pdf' && !pdfUrl) {
      return res.status(400).json({ error: 'PDF URL required for PDF type quiz' });
    }

    const updateData = {
      title,
      description,
      type,
      pdfUrl: type === 'pdf' ? pdfUrl : null,
      questions: type === 'interactive' ? questions : [],
    };

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('topic').populate('subject');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz updated successfully', quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Remove quiz from topic
    const Topic = require('../models/Topic');
    await Topic.findByIdAndUpdate(quiz.topic, { $pull: { quizzes: quiz._id } });

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitQuuzAnswer = async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    const results = [];

    quiz.questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) score++;

      results.push({
        questionText: question.text,
        userAnswer: question.options[answers[index]],
        correctAnswer: question.options[question.correctAnswer],
        explanation: question.explanation,
        isCorrect,
      });
    });

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      percentage: ((score / quiz.questions.length) * 100).toFixed(2),
      results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllQuizzes,
  getQuizzesByTopic,
  getQuizzesBySubject,
  getQuizByTopic,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuuzAnswer,
};
