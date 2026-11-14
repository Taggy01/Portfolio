import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    github: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    heading: {
      type: String,
    },
    subheading: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
