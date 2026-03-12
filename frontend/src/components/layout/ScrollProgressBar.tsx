import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4
  });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-cyan via-white to-coral"
      style={{ scaleX: width, transformOrigin: "0% 50%" }}
    />
  );
}
