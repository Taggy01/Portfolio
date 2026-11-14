
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Home() {
    const [content, setContent] = useState({
        about: null,
        projects: [],
        skills: [],
        achievements: [],
        contact: null,
    });
    const [dataError, setDataError] = useState("");

    useEffect(() => {
        const loadContent = async () => {
            try {
                const endpoints = [
                    "about",
                    "projects",
                    "skills",
                    "achievements",
                    "contact",
                ];
                const responses = await Promise.all(
                    endpoints.map((endpoint) =>
                        fetch(`${API_BASE}/api/portfolio/${endpoint}`)
                    )
                );
                const results = await Promise.all(
                    responses.map(async (response) => {
                        if (!response.ok) {
                            throw new Error("Unable to load portfolio content");
                        }
                        return response.json();
                    })
                );

                if (results.some((result) => !result.success)) {
                    throw new Error("Unable to load portfolio content");
                }

                const [about, projects, skills, achievements, contact] = results;
                setContent({
                    about: about.data,
                    projects: projects.data || [],
                    skills: skills.data || [],
                    achievements: achievements.data || [],
                    contact: contact.data,
                });
                setDataError("");
            } catch (error) {
                setDataError(error.message);
            }
        };

        loadContent();
    }, []);

    const about = content.about;
    const experience = about?.experience;
    const contact = content.contact;

    return (
        <main className="min-h-screen bg-transparent text-white">
            {dataError && (
                <p role="status" className="px-6 pt-4 text-center text-sm text-red-400">
                    {dataError}. Make sure the backend is running and portfolio data is seeded.
                </p>
            )}

            {/* ================= HERO ================= */}
            <section
                id="home"
                className="h-screen w-full flex items-center
    justify-center px-6 text-center"
            >
                <motion.div
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.1, delay: 2.7 }}
                    className="w-full max-w-7xl mx-auto"
                >
                    <h1 className="font-bricolage font-bold
      text-6xl sm:text-8xl md:text-9xl
      tracking-tight leading-none">
                        {about?.heroName}
                    </h1>

                    <p className="mt-6 text-lg sm:text-2xl md:text-3xl
      text-gray-400 tracking-wide">
                        {about?.heroRole}
                    </p>
                </motion.div>
            </section>


            {/* ================= ABOUT ================= */}
            <section
                id="about"
                className="max-w-5xl mx-auto px-6 py-28 scroll-mt-24"
            >
                <p className="text-sm text-gray-500 mb-4 tracking-widest">
                    01 / ABOUT ME
                </p>

                <h2 className="text-4xl sm:text-5xl font-bricolage
          font-semibold tracking-tight">
                    {about?.title}<span className="text-gray-500">.</span>
                </h2>

                <div className="mt-10 max-w-3xl space-y-5
          text-gray-400 text-base sm:text-lg leading-relaxed">
                    {about?.description?.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {about?.education && (
                        <div className="rounded-2xl border border-white/10
            bg-white/[0.02] p-6 hover:border-white/20 transition">

                            <p className="text-gray-500 text-sm">Education</p>

                            <h3 className="mt-3 text-lg font-semibold font-bricolage">
                                {about.education.title}
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                {about.education.institution}
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                {about.education.duration}
                                {about.education.cgpa && ` · CGPA ${about.education.cgpa}`}
                            </p>
                        </div>
                    )}

                    {experience && (
                        <div className="rounded-2xl border border-white/10
            bg-white/[0.02] p-6 hover:border-white/20 transition">

                            <p className="text-gray-500 text-sm">Experience</p>

                            <h3 className="mt-3 text-lg font-semibold font-bricolage">
                                {experience.title}
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                {experience.company}
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                {[experience.duration, experience.location].filter(Boolean).join(" · ")}
                            </p>
                        </div>
                    )}

                </div>
            </section>


            {/* ================= PROJECTS ================= */}
            <section
                id="projects"
                className="max-w-5xl mx-auto px-6 py-28 scroll-mt-24"
            >
                <p className="text-sm text-gray-500 mb-4 tracking-widest">
                    02 / SELECTED WORK
                </p>

                <h2 className="text-4xl sm:text-5xl font-bricolage
          font-semibold tracking-tight">
                    Things I've built<span className="text-gray-500">.</span>
                </h2>

                <p className="mt-5 text-gray-500 max-w-xl">
                    A collection of projects where I turn ideas into
                    functional and meaningful digital experiences.
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6">

                    {content.projects.map((project) => (
                        <article
                            key={project._id}
                            className="group rounded-2xl border border-white/10
              bg-white/[0.02] p-7 sm:p-10
              hover:bg-white/[0.04] hover:border-white/25
              transition-all duration-300"
                        >

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    {String(project.number || "").padStart(2, "0")}
                                </span>

                                <span className="text-xs text-gray-500">
                                    {project.type}
                                </span>
                            </div>

                            <h3 className="mt-8 text-3xl sm:text-4xl
                font-bricolage font-semibold
                group-hover:text-gray-300 transition">
                                {project.name}
                            </h3>

                            <p className="mt-4 max-w-2xl text-gray-400
                leading-relaxed">
                                {project.description}
                            </p>

                            <div className="mt-7 flex flex-wrap gap-2">
                                {(project.stack || []).map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full border border-white/10
                    bg-white/[0.03] px-3 py-1.5
                    text-xs text-gray-400"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {(project.githubUrl || project.liveUrl) && (
                                <div className="mt-8 flex flex-wrap gap-3">
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-full border border-white/15 px-4 py-2 bg-gray-700 text-sm text-gray-300 hover:border-white/70 hover:text-white transition"
                                        >
                                            GitHub Repository
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-300 transition"
                                        >
                                            Live Project
                                        </a>
                                    )}
                                </div>
                            )}

                        </article>
                    ))}

                </div>
            </section>


            {/* ================= SKILLS ================= */}
            <section
                id="skills"
                className="max-w-5xl mx-auto px-6 py-28 scroll-mt-24"
            >
                <p className="text-sm text-gray-500 mb-4 tracking-widest">
                    03 / TECHNICAL SKILLS
                </p>

                <h2 className="text-4xl sm:text-5xl font-bricolage
          font-semibold tracking-tight">
                    My toolkit<span className="text-gray-500">.</span>
                </h2>

                <p className="mt-5 text-gray-500 max-w-xl">
                    Technologies and tools I use to build, develop
                    and bring applications to life.
                </p>


                <div className="mt-12 border-t border-white/10">

                    {content.skills.map((skill, index) => (
                        <div
                            key={skill._id}
                            className="group grid grid-cols-1 sm:grid-cols-[180px_1fr]
      gap-4 sm:gap-10 py-7 border-b border-white/10
      transition-colors hover:bg-white/[0.02] px-3"
                        >

                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-gray-600">
                                    0{index + 1}
                                </span>

                                <h3 className="text-base font-semibold font-bricolage
          text-gray-300 group-hover:text-white transition">
                                    {skill.category}
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                {(skill.items || []).map((item) => (
                                    <span
                                        key={item}
                                        className="text-sm text-gray-500
            hover:text-white transition-colors cursor-default"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>

                        </div>
                    ))}

                </div>

            </section>


            {/* ================= EXPERIENCE ================= */}
            {experience && <section
                id="experience"
                className="max-w-5xl mx-auto px-6 py-20 scroll-mt-24"
            >
                <p className="text-sm text-gray-500 mb-4 tracking-widest">
                    04 / EXPERIENCE
                </p>

                <h2 className="text-4xl sm:text-5xl font-bricolage
          font-semibold tracking-tight">
                    Where I've worked<span className="text-gray-500">.</span>
                </h2>

                <div className="mt-12 border-l border-white/20 pl-6 sm:pl-8">

                    <p className="text-xs text-gray-500 tracking-widest">
                        {[experience.duration, experience.location]
                            .filter(Boolean)
                            .join(" · ")
                            .toUpperCase()}
                    </p>

                    <h3 className="mt-4 text-2xl font-bricolage font-semibold">
                        {experience.company}
                    </h3>

                    <p className="mt-2 text-gray-400">
                        {experience.title}
                    </p>

                    <p className="mt-5 max-w-2xl text-sm sm:text-base
            text-gray-500 leading-relaxed">
                        {experience.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {(experience.stack || []).map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-full border border-white/10
                px-3 py-1.5 text-xs text-gray-400"
                                >
                                    {tech}
                                </span>
                            ))}
                    </div>

                </div>
            </section>}


            {/* ================= ACHIEVEMENTS ================= */}
            <section
                id="achievements"
                className="max-w-5xl mx-auto px-6 py-28 scroll-mt-24"
            >
                <p className="text-sm text-gray-500 mb-4 tracking-widest">
                    05 / ACHIEVEMENTS
                </p>

                <h2 className="text-4xl sm:text-5xl font-bricolage
          font-semibold tracking-tight">
                    Milestones<span className="text-gray-500">.</span>
                </h2>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {content.achievements.map((achievement) => (
                        <div
                            key={achievement._id}
                            className="rounded-2xl border border-white/10
              bg-white/[0.02] p-6
              hover:border-white/20 transition"
                        >

                            <div className="text-2xl">
                                {achievement.icon}
                            </div>

                            <h3 className="mt-5 text-lg font-semibold font-bricolage">
                                {achievement.title}
                            </h3>

                            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                                {achievement.description}
                            </p>

                            <p className="mt-5 text-xs text-gray-600">
                                {achievement.date}
                            </p>

                        </div>
                    ))}

                </div>
            </section>


            {/* ================= CONTACT ================= */}
            <section
                id="contact"
                className="max-w-5xl mx-auto px-6 py-32
        text-center scroll-mt-24"
            >

                <p className="text-sm text-gray-500 mb-5 tracking-widest">
                    06 / CONTACT
                </p>

                <h2 className="text-4xl sm:text-6xl font-bricolage
          font-bold tracking-tight">
                    {contact?.heading}
                    <br />
                    <span className="text-gray-500">{contact?.subheading}</span>
                </h2>

                <p className="mt-7 max-w-xl mx-auto text-gray-400">
                    {contact?.description}
                </p>

                {contact?.email && (
                    <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center gap-2 mt-9
          rounded-full bg-white px-7 py-3
          text-sm font-semibold text-black
          hover:bg-gray-200 transition"
                    >
                        Say Hello
                    </a>
                )}

                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    {contact?.email && (
                        <a
                            href={`mailto:${contact.email}`}
                            className="rounded-full border border-white/10
            px-5 py-3 text-sm text-white bg-blue-500
            hover:bg-blue-700 transition"
                        >
                            Email
                        </a>
                    )}

                    {contact?.github && (
                        <a
                            href={contact.github}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-white/10
            px-5 py-3 text-sm text-white bg-blue-500
            hover:bg-blue-700 transition"
                        >
                            GitHub
                        </a>
                    )}

                    {contact?.linkedin && (
                        <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-white/10
            px-5 py-3 text-sm text-white bg-blue-500
            hover:bg-blue-700 transition"
                        >
                            LinkedIn
                        </a>
                    )}

                </div>

                <footer className="mt-24 border-t border-white/10 pt-7">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} {about?.heroName}. Designed & Built with React.
                    </p>
                </footer>

            </section>

        </main>
    );
}
