
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(1);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const duration = 2400;
    const start = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const value = Math.min(
        100,
        Math.floor((elapsed / duration) * 100)
      );

      setProgress(value);

      if (value >= 100) {
        clearInterval(timer);
        setTimeout(() => setFinished(true), 350);
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={onComplete}
    >
      {!finished && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(12px)",
            transition: {
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-[100] bg-[#090909]
            pointer-events-none"
        >

          {/* Bottom Right Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-8 right-8
              sm:bottom-12 sm:right-16
              flex flex-col items-end"
          >
            <motion.span
              key={progress}
              initial={{ opacity: 0.7, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bricolage font-semibold
                text-7xl sm:text-8xl text-white
                tracking-tighter tabular-nums"
            >
              {String(progress).padStart(2, "0")}
            </motion.span>

            <div className="w-32 sm:w-40 h-[2px]
              bg-white/20 mt-3 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>

            <span className="text-[10px]
              tracking-[0.3em] text-gray-500 mt-3">
              PLEASE WAIT
            </span>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
