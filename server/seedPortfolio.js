import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import About from "./models/About.js";
import Project from "./models/Project.js";
import Skill from "./models/Skill.js";
import Achievement from "./models/Achievement.js";
import Contact from "./models/Contact.js";

const seedPortfolio = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for portfolio seeding");

    await About.updateOne(
      {},
      {
        $setOnInsert: {
          heroName: "Aditya Kumar",
          heroRole: "Full Stack MERN Developer",
          title: "A little about me",
          description: [
            "I'm Aditya Kumar, a fourth-year Computer Science and Engineering student at Bengal College of Engineering and Technology, Durgapur.",
            "I'm a Full Stack MERN Developer passionate about building modern, responsive and functional web applications. I enjoy working across both frontend and backend technologies, turning ideas into practical digital experiences.",
            "I love exploring new technologies, solving problems and continuously improving my development skills. For me, good development is about creating experiences that are useful, intuitive and meaningful.",
          ],
          education: {
            title: "B.Tech in Computer Science",
            institution: "Bengal College of Engineering and Technology",
            duration: "2023 – 2027",
            cgpa: "7.4/10",
          },
          experience: {
            title: "Full Stack Web Development Intern",
            company: "Prodigy InfoTech",
            duration: "August 2026",
            location: "Remote",
            description:
              "Developed full-stack authentication and user management systems using React, Node.js, Express.js and MongoDB. Implemented JWT authentication, bcrypt password hashing, protected routes and RESTful APIs. Also built an Employee Management System with CRUD operations and responsive React interfaces.",
            stack: [
              "React.js",
              "Node.js",
              "Express.js",
              "MongoDB",
              "JWT",
              "Tailwind CSS",
            ],
          },
        },
      },
      { upsert: true }
    );

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          number: "01",
          name: "GrabMate",
          type: "Full Stack Development",
          description:
            "A full-stack canteen ordering platform that allows users to explore food items, search and filter categories, manage their carts, place orders and view order history.",
          stack: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Tailwind CSS",
          ],
          order: 1,
        },
        {
          number: "02",
          name: "Code Vision",
          type: "Full Stack Development",
          description:
            "A redesigned website for Code Vision, the technical club of BCET, showcasing its events, community, achievements and activities through a modern interface.",
          stack: ["React.js", "JavaScript", "Tailwind CSS"],
          order: 2,
        },
      ]);
    }

    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        { category: "Languages", items: ["Java", "JavaScript", "HTML", "CSS"], order: 1 },
        { category: "Frontend", items: ["React.js", "Vite", "Tailwind CSS", "React Router"], order: 2 },
        { category: "Backend", items: ["Node.js", "Express.js", "REST APIs"], order: 3 },
        { category: "Database", items: ["MongoDB", "Mongoose"], order: 4 },
        { category: "Authentication", items: ["JWT", "bcrypt", "HTTP Cookies"], order: 5 },
        { category: "Tools", items: ["Git", "GitHub", "Postman", "Figma", "VS Code"], order: 6 },
        { category: "Deployment", items: ["Render", "Vercel"], order: 7 },
      ]);
    }

    const achievementCount = await Achievement.countDocuments();
    if (achievementCount === 0) {
      await Achievement.insertMany([
        {
          title: "Winner — CODESTORM 2026",
          description:
            "Entrepreneurship Development Cell, Bengal College of Engineering and Technology",
          date: "February 2026",
          icon: "🏆",
          order: 1,
        },
        {
          title: "1st Position — Bug Buster",
          description: "CONSOLE 2026 · Code Vision",
          date: "2026",
          icon: "🥇",
          order: 2,
        },
      ]);
    }

    await Contact.updateOne(
      {},
      {
        $setOnInsert: {
          email: "adityakumar20741@gmail.com",
          github: "https://github.com/Taggy01",
          linkedin: "https://linkedin.com/in/taggy0",
          heading: "Let's build something",
          subheading: "together.",
          description:
            "Have an idea, an opportunity or just want to connect? Feel free to reach out. I'd love to hear from you.",
        },
      },
      { upsert: true }
    );

    console.log("Portfolio content seeded (existing content was preserved)");
    await mongoose.disconnect();
  } catch (error) {
    console.error(`Portfolio seeding error: ${error.message}`);
    await mongoose.disconnect();
    process.exitCode = 1;
  }
};

seedPortfolio();
