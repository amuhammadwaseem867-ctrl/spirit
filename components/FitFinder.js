"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  RotateCcw,
  X,
} from "lucide-react";

import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import useDialogA11y from "@/lib/useDialogA11y";

import styles from "./FitFinder.module.css";

const questions = [
  {
    id: "movement",
    eyebrow: "01 / MOVEMENT",
    title: "HOW DO YOU MOVE?",
    description:
      "Tell us where your wardrobe needs to perform most.",
    options: [
      {
        id: "training",
        label: "TRAINING",
        detail: "Focused sessions and structured workouts.",
      },
      {
        id: "everyday",
        label: "EVERYDAY",
        detail: "Movement that continues beyond the gym.",
      },
      {
        id: "running",
        label: "RUNNING",
        detail: "Rhythm, repetition and forward motion.",
      },
      {
        id: "mixed",
        label: "A BIT OF EVERYTHING",
        detail: "One system for different kinds of movement.",
      },
    ],
  },
  {
    id: "feel",
    eyebrow: "02 / FEEL",
    title: "HOW SHOULD IT FEEL?",
    description:
      "Choose the relationship you want between body and garment.",
    options: [
      {
        id: "close",
        label: "CLOSE & PRECISE",
        detail: "A more controlled, body-aware feel.",
      },
      {
        id: "balanced",
        label: "BALANCED",
        detail: "A considered middle ground.",
      },
      {
        id: "free",
        label: "FREE & EASY",
        detail: "More room for natural movement.",
      },
    ],
  },
  {
    id: "wardrobe",
    eyebrow: "03 / WARDROBE",
    title: "WHAT ARE YOU BUILDING?",
    description:
      "Finish your system with the pieces you reach for most.",
    options: [
      {
        id: "performance",
        label: "PERFORMANCE",
        detail: "Technical pieces for focused movement.",
      },
      {
        id: "essentials",
        label: "ESSENTIALS",
        detail: "Refined pieces for everyday rotation.",
      },
      {
        id: "training",
        label: "TRAINING",
        detail: "Purposeful layers built around training.",
      },
    ],
  },
];

const results = {
  training: {
    title: "THE TRAINING SYSTEM",
    description:
      "Purposeful pieces built around focused movement, control and repeat performance.",
    category: "TRAINING",
    href: "/shop?category=TRAINING",
  },
  everyday: {
    title: "THE ESSENTIAL SYSTEM",
    description:
      "Refined activewear designed to move naturally between training and everyday life.",
    category: "ESSENTIALS",
    href: "/shop?category=ESSENTIALS",
  },
  running: {
    title: "THE PERFORMANCE SYSTEM",
    description:
      "Movement-led pieces for a wardrobe that stays focused when the pace changes.",
    category: "PERFORMANCE",
    href: "/shop?category=PERFORMANCE",
  },
  mixed: {
    title: "THE SPIRIT SYSTEM",
    description:
      "A considered starting point for a wardrobe designed around different states of movement.",
    category: "ALL",
    href: "/shop",
  },
};

export default function FitFinder({ isOpen = true, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const closeButtonRef = useRef(null);

  /*
   * Focus, Tab cycling, Escape and focus restoration are
   * handled by the shared dialog helper. Escape closes the
   * experience from any step, including the result view.
   */
  const dialogRef = useDialogA11y({
    isOpen,
    onClose,
    initialFocusRef: closeButtonRef,
  });

  const currentQuestion = questions[step];

  const progress = useMemo(
    () => ((step + 1) / questions.length) * 100,
    [step]
  );

  useEffect(() => {
    if (!isOpen) return;

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  const selectAnswer = (value) => {
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };

    setAnswers(nextAnswers);

    if (step < questions.length - 1) {
      window.setTimeout(() => {
        setStep((current) => current + 1);
      }, 180);
      return;
    }

    const movement = nextAnswers.movement || "mixed";
    setResult(results[movement] || results.mixed);
  };

  const goBack = () => {
    if (result) {
      setResult(null);
      return;
    }

    setStep((current) => Math.max(0, current - 1));
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} data-lenis-prevent>
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Fit finder"
        className={styles.panel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>
              <span>SPIRIT</span>
              <span>FIT FINDER</span>
            </div>

            <div className={styles.headerMeta}>
              <span>LAHORE / PAKISTAN</span>
              <span>2026</span>
            </div>

            {onClose && (
              <button
                type="button"
                ref={closeButtonRef}
                className={styles.close}
                onClick={onClose}
                aria-label="Close fit finder"
              >
                <span>CLOSE</span>
                <X size={19} strokeWidth={1.1} />
              </button>
            )}
          </div>
        </header>

        <main className={styles.main}>
          {!result ? (
            <>
              <div className={styles.top}>
                <div className={styles.topMeta}>
                  <span>FIND YOUR FIT</span>
                  <span>
                    {String(step + 1).padStart(2, "0")} /{" "}
                    {String(questions.length).padStart(2, "0")}
                  </span>
                </div>

                <div className={styles.progress}>
                  <motion.span
                    animate={{ width: `${progress}%` }}
                    transition={{
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.section
                  key={currentQuestion.id}
                  className={styles.question}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.42,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className={styles.questionIntro}>
                    <span className={styles.eyebrow}>
                      {currentQuestion.eyebrow}
                    </span>

                    <h1>{currentQuestion.title}</h1>

                    <p>{currentQuestion.description}</p>
                  </div>

                  <div className={styles.options}>
                    {currentQuestion.options.map((option, index) => {
                      const selected =
                        answers[currentQuestion.id] === option.id;

                      return (
                        <motion.button
                          key={option.id}
                          type="button"
                          className={`${styles.option} ${
                            selected ? styles.optionSelected : ""
                          }`}
                          onClick={() => selectAnswer(option.id)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.055,
                            duration: 0.38,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <span className={styles.optionNumber}>
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className={styles.optionContent}>
                            <span className={styles.optionLabel}>
                              {option.label}
                            </span>

                            <span className={styles.optionDetail}>
                              {option.detail}
                            </span>
                          </span>

                          <span className={styles.optionArrow}>
                            {selected ? (
                              <Check size={17} strokeWidth={1.2} />
                            ) : (
                              <ArrowUpRight
                                size={17}
                                strokeWidth={1.1}
                              />
                            )}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.section>
              </AnimatePresence>

              <footer className={styles.questionFooter}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={goBack}
                  disabled={step === 0}
                >
                  <ArrowLeft size={15} strokeWidth={1.1} />
                  <span>BACK</span>
                </button>

                <span>DESIGNED FOR MOVEMENT</span>
              </footer>
            </>
          ) : (
            <motion.section
              className={styles.result}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className={styles.resultMeta}>
                <span>FIT FINDER / RESULT</span>
                <span>04 / 04</span>
              </div>

              <div className={styles.resultContent}>
                <span className={styles.resultEyebrow}>
                  YOUR SYSTEM
                </span>

                <h1>
                  {result.title.split(" ").map((word, index) => (
                    <span key={`${word}-${index}`}>
                      {word}
                      {index < result.title.split(" ").length - 1
                        ? " "
                        : ""}
                    </span>
                  ))}
                </h1>

                <p>{result.description}</p>

                <div className={styles.resultCategory}>
                  <span>RECOMMENDED DIRECTION</span>
                  <strong>{result.category}</strong>
                </div>

                <div className={styles.resultActions}>
                  <Link
                    href={result.href}
                    className={styles.primaryAction}
                    onClick={onClose}
                  >
                    <span>EXPLORE YOUR SYSTEM</span>
                    <ArrowUpRight size={17} strokeWidth={1.1} />
                  </Link>

                  <button
                    type="button"
                    className={styles.secondaryAction}
                    onClick={restart}
                  >
                    <RotateCcw size={15} strokeWidth={1.1} />
                    <span>START AGAIN</span>
                  </button>
                </div>
              </div>

              <div className={styles.resultFooter}>
                <span>SPIRIT / LAHORE</span>
                <span>YOUR MOVEMENT. YOUR SYSTEM.</span>
              </div>
            </motion.section>
          )}
        </main>
      </motion.div>
    </div>
  );
}