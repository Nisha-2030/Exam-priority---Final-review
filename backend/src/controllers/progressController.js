const Progress = require('../models/Progress');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    const progress = await Progress.find({ student: studentId })
      .populate('topic')
      .populate({
        path: 'topic',
        populate: { path: 'subject' },
      });

    const student = await User.findById(studentId).select('targetExam');
    let totalTopics = 0;
    let completedTopics = 0;

    if (student?.targetExam) {
      const subjects = await Subject.find({ exam: student.targetExam }).select('_id');
      const subjectIds = subjects.map((s) => s._id);
      const topics = await Topic.find({ subject: { $in: subjectIds } }).select('_id');
      const topicIds = topics.map((t) => t._id);

      totalTopics = topicIds.length;
      completedTopics = await Progress.countDocuments({
        student: studentId,
        isCompleted: true,
        topic: { $in: topicIds },
      });
    } else {
      totalTopics = await Topic.countDocuments();
      completedTopics = await Progress.countDocuments({
        student: studentId,
        isCompleted: true,
      });
    }

    res.json({
      completedTopics,
      totalTopics,
      progressPercentage: totalTopics ? ((completedTopics / totalTopics) * 100).toFixed(2) : 0,
      progress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markTopicComplete = async (req, res) => {
  try {
    const { studentId, topicId } = req.params;
    const userId = studentId || req.user.id;

    let progress = await Progress.findOne({
      student: userId,
      topic: topicId,
    });

    if (!progress) {
      progress = new Progress({
        student: userId,
        topic: topicId,
        isCompleted: true,
      });
    } else {
      progress.isCompleted = true;
    }

    await progress.save();

    res.json({ message: 'Topic marked as completed', progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const recordQuizAttempt = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { score, totalQuestions, answers } = req.body;
    const studentId = req.user.id;

    let progress = await Progress.findOne({
      student: studentId,
      topic: topicId,
    });

    if (!progress) {
      progress = new Progress({
        student: studentId,
        topic: topicId,
      });
    }

    progress.quizAttempts.push({
      score,
      totalQuestions,
      attemptedAt: new Date(),
      answers,
    });

    await progress.save();

    res.json({ message: 'Quiz attempt recorded', progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const blockStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findByIdAndUpdate(
      studentId,
      { isBlocked: true },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student blocked successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unblockStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findByIdAndUpdate(
      studentId,
      { isBlocked: false },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student unblocked successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    await User.findByIdAndDelete(studentId);
    await Progress.deleteMany({ student: studentId });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTargetExam = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user.id;

    const student = await User.findByIdAndUpdate(
      studentId,
      { targetExam: examId },
      { new: true }
    ).populate('targetExam');

    res.json({ message: 'Target exam updated', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStudentProgress,
  markTopicComplete,
  recordQuizAttempt,
  getAllStudents,
  blockStudent,
  unblockStudent,
  deleteStudent,
  updateTargetExam,
};
