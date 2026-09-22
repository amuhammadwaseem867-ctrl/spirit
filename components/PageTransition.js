"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import styles from "./PageTransition.module.css";

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className={styles.page}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: 1,
          },
          exit: {
            opacity: 0,
          },
        }}
        transition={{
          /*
           * Kept short so a route change never feels like a
           * loading state.
           */
          duration: 0.26,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.div
          className={styles.wipe}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{
            duration: 0.44,
            ease: [0.76, 0, 0.24, 1],
          }}
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
}