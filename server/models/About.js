import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    heroName: {
      type: String,
    },
    heroRole: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: [String],
    },
    education: {
      title: { type: String },
      institution: { type: String },
      duration: { type: String },
      cgpa: { type: String },
    },
    experience: {
      title: { type: String },
      company: { type: String },
      duration: { type: String },
      location: { type: String },
      description: { type: String },
      stack: { type: [String] },
    },
  },
  { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);

export default About;
