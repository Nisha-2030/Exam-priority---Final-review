const Material = require('../models/Material');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// ============ GET MATERIALS ============
const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate('subject', 'name')
      .populate('topic', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getMaterialsByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const materials = await Material.find({ topic: topicId })
      .populate('subject', 'name')
      .populate('topic', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getMaterialsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const materials = await Material.find({ subject: subjectId })
      .populate('subject', 'name')
      .populate('topic', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get single material by id
const getMaterialById = async (req, res) => {
  try {
    const { materialId } = req.params;
    const material = await Material.findById(materialId)
      .populate('subject', 'name')
      .populate('topic', 'name');
    if (!material) {
      return res.status(404).json({ success: false, error: 'Material not found' });
    }
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ============ CREATE MATERIAL ============
const createMaterial = async (req, res) => {
  try {
    const { title, subject, topic, content, referenceBook, category } = req.body;

    // Validate required fields
    if (!title || !subject || !topic || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }
    // referenceBook is optional; treat empty string or nil as none
    const ref = referenceBook && referenceBook.trim().toLowerCase() !== 'nil' ? referenceBook : '';

    // Check if subject and topic exist
    const subjectExists = await Subject.findById(subject);
    const topicExists = await Topic.findById(topic);

    if (!subjectExists || !topicExists) {
      return res.status(404).json({
        success: false,
        error: 'Subject or Topic not found',
      });
    }

    const material = new Material({
      title,
      subject,
      topic,
      content,
      referenceBook: ref,
      category: category || 'theory',
    });

    await material.save();
    // populate each separately to avoid chaining error
    await material.populate('subject', 'name');
    await material.populate('topic', 'name');

    res.status(201).json({
      success: true,
      message: 'Material created successfully',
      data: material,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============ UPDATE MATERIAL ============
const updateMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { title, content, referenceBook, category } = req.body;

    const material = await Material.findByIdAndUpdate(
      materialId,
      {
        title: title || undefined,
        content: content || undefined,
        referenceBook: referenceBook || undefined,
        category: category || undefined,
      },
      { new: true }
    )
      .populate('subject', 'name')
      .populate('topic', 'name');

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    res.json({
      success: true,
      message: 'Material updated successfully',
      data: material,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============ DELETE MATERIAL ============
const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await Material.findByIdAndDelete(materialId);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    res.json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAllMaterials,
  getMaterialsByTopic,
  getMaterialsBySubject,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
