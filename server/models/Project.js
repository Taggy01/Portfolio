import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    number: {
      type: String,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    description: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    liveUrl: {
      type: String,
    },
    stack: {
      type: [String],
    },
    order: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
