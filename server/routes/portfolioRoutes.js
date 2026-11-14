import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAbout,
  updateAbout,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getContact,
  updateContact,
} from "../controllers/portfolioController.js";

const router = Router();

// About routes
router.get("/about", getAbout);
router.post("/about", protect, updateAbout);

// Project routes
router.get("/projects", getProjects);
router.post("/projects", protect, createProject);
router.put("/projects/:id", protect, updateProject);
router.delete("/projects/:id", protect, deleteProject);

// Skill routes
router.get("/skills", getSkills);
router.post("/skills", protect, createSkill);
router.put("/skills/:id", protect, updateSkill);
router.delete("/skills/:id", protect, deleteSkill);

// Achievement routes
router.get("/achievements", getAchievements);
router.post("/achievements", protect, createAchievement);
router.put("/achievements/:id", protect, updateAchievement);
router.delete("/achievements/:id", protect, deleteAchievement);

// Contact routes
router.get("/contact", getContact);
router.post("/contact", protect, updateContact);

export default router;
