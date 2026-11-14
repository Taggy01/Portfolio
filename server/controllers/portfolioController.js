import About from "../models/About.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Achievement from "../models/Achievement.js";
import Contact from "../models/Contact.js";

// ==================== ABOUT ====================

// @desc    Get about data
// @route   GET /api/portfolio/about
// @access  Public
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    return res.status(200).json({ success: true, data: about });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create or update about data
// @route   POST /api/portfolio/about
// @access  Private
export const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (about) {
      about = await About.findByIdAndUpdate(about._id, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      about = await About.create(req.body);
    }

    return res.status(200).json({ success: true, data: about });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ==================== PROJECTS ====================

// @desc    Get all projects
// @route   GET /api/portfolio/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/portfolio/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/portfolio/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/portfolio/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ==================== SKILLS ====================

// @desc    Get all skills
// @route   GET /api/portfolio/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    return res.status(200).json({ success: true, data: skills });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create a skill
// @route   POST /api/portfolio/skills
// @access  Private
export const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    return res.status(201).json({ success: true, data: skill });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update a skill
// @route   PUT /api/portfolio/skills/:id
// @access  Private
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    return res.status(200).json({ success: true, data: skill });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/portfolio/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ==================== ACHIEVEMENTS ====================

// @desc    Get all achievements
// @route   GET /api/portfolio/achievements
// @access  Public
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1 });
    return res.status(200).json({ success: true, data: achievements });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create an achievement
// @route   POST /api/portfolio/achievements
// @access  Private
export const createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    return res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update an achievement
// @route   PUT /api/portfolio/achievements/:id
// @access  Private
export const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, message: "Achievement not found" });
    }

    return res.status(200).json({ success: true, data: achievement });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete an achievement
// @route   DELETE /api/portfolio/achievements/:id
// @access  Private
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, message: "Achievement not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Achievement deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ==================== CONTACT ====================

// @desc    Get contact data
// @route   GET /api/portfolio/contact
// @access  Public
export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne();
    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create or update contact data
// @route   POST /api/portfolio/contact
// @access  Private
export const updateContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (contact) {
      contact = await Contact.findByIdAndUpdate(contact._id, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      contact = await Contact.create(req.body);
    }

    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
