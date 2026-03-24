const Exam = require('../models/Exam');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// Exam Controllers
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('subjects');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate({
      path: 'subjects',
      populate: { path: 'topics' },
    });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createExam = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exam = new Exam({
      name,
      description,
    });

    await exam.save();
    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json({ message: 'Exam updated successfully', exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Subject Controllers
const getSubjectsByExam = async (req, res) => {
  try {
    const subjects = await Subject.find({ exam: req.params.examId }).populate('topics');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, exam } = req.body;

    const subject = new Subject({
      name,
      exam,
    });

    await subject.save();

    // Add subject to exam
    await Exam.findByIdAndUpdate(exam, { $push: { subjects: subject._id } });

    res.status(201).json({ message: 'Subject created successfully', subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { name } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({ message: 'Subject updated successfully', subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Remove subject from exam
    await Exam.findByIdAndUpdate(subject.exam, { $pull: { subjects: subject._id } });

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Topic Controllers
const getTopicsBySubject = async (req, res) => {
  try {
    const topics = await Topic.find({ subject: req.params.subjectId }).populate('quizzes');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('quizzes').populate('subject', 'name');
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHighMediumTopics = async (req, res) => {
  try {
    const topics = await Topic.find({
      subject: req.params.subjectId,
      priority: { $in: ['High', 'Medium'] },
    }).populate('quizzes');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTopic = async (req, res) => {
  try {
    const { name, subject, priority, studyMaterial, videos } = req.body;

    const topic = new Topic({
      name,
      subject,
      priority,
      studyMaterial,
      videos: videos || [],
    });

    await topic.save();

    // Add topic to subject
    await Subject.findByIdAndUpdate(subject, { $push: { topics: topic._id } });

    res.status(201).json({ message: 'Topic created successfully', topic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTopic = async (req, res) => {
  try {
    const { name, priority, studyMaterial, videos } = req.body;

    const update = { name, priority, studyMaterial };
    if (videos !== undefined) update.videos = videos;

    const topic = await Topic.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.json({ message: 'Topic updated successfully', topic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Remove topic from subject
    await Subject.findByIdAndUpdate(topic.subject, { $pull: { topics: topic._id } });

    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getSubjectsByExam,
  createSubject,
  updateSubject,
  deleteSubject,
  getTopicsBySubject,
  getHighMediumTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicById,
};
