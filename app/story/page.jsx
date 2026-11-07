"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import KineticText from "@/components/ui/KineticText";
import Reveal from "@/components/ui/Reveal";
import RiseImage from "@/components/ui/RiseImage";
import ScrubText from "@/components/ui/ScrubText";

import styles from "./Story.module.css";

const chapters = [
  {
    number: "01",
    category: "Movement",
    title: "THE BODY IN MOTION.",
    description:
      "Movement is the starting point. Everything SPIRIT creates begins with how the body moves.",
    image: "/images/campaigns/coreperformance.jpeg",
    alt: "Athlete sprinting through a concrete stairwell",
  },
  {
    number: "02",
    category: "Design",
    title: "FORM FOLLOWS FUNCTION.",
    description:
      "A considered approach to silhouette, proportion and performance — designed without unnecessary detail.",
    image: "/images/campaigns/legging.jpeg",
    alt: "Athlete walking along a concrete corridor",
  },
  {
    number: "03",
    category: "Performance",
    title: "BUILT FOR THE EVERYDAY.",
    description:
      "Performance does not stop when training ends. SPIRIT is designed to move through the complete day.",
    image: "/images/collections/men.jpeg",
    alt: "Athlete walking through a column of light",
  },
];

export default function StoryPage() {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef([]);

  /* the chapter crossing the middle of the viewport drives the image */
  useEffect(() => {
    const nodes = chapterRefs.current.filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <PageHero
        index="01"
        label="STORY"
        title={["STORIES", "IN MOTION."]}
        outline={[1]}
        intro="A visual journal exploring movement, performance, design and the culture surrounding an active life."
        aside={"Culture / Movement / Design\nLahore / Pakistan"}
        visual="image"
        image="/images/campaigns/form corp.jpeg"
        imageAlt="Athlete striding past concrete and glass"
      />

      {/* featured */}
      <section className={`${styles.featured} surface-ink`}>
        <div className="wrap">
          <div className="meta">
            <span>02</span>
            <span>Featured story</span>
            <span>Movement / 2026</span>
          </div>

          <div className={styles.featuredGrid}>
            <RiseImage
              src="/images/campaigns/aeroflextee.jpeg"
              alt="Athlete standing in a brutalist courtyard"
              ratio="16 / 11"
              sizes="(max-width: 1000px) 92vw, 62vw"
            />

            <Reveal className={styles.featuredCopy}>
              <span className="eyebrow reveal">Movement / 2026</span>
              <KineticText
                as="h2"
                lines={["THE BODY", "IN MOTION."]}
                outline={[1]}
                className={`display ${styles.featuredTitle}`}
              />
              <p className="reveal" style={{ "--rd": "120ms" }}>
                We design around movement — not as a trend, but as a constant
                part of everyday life.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* chapters */}
      <section className={`${styles.chapters} surface-bone`}>
        <div className="wrap">
          <div className="meta">
            <span>03</span>
            <span>Chapters</span>
            <span>Ideas, images, observations</span>
          </div>

          <div className={styles.chapterGrid}>
            <div className={styles.sticky} aria-hidden="true">
              <div className={styles.stack}>
                {chapters.map((chapter, index) => (
                  <span
                    key={chapter.number}
                    className={styles.stackFrame}
                    data-state={
                      index === active ? "active" : index < active ? "past" : "next"
                    }
                  >
                    <Image src={chapter.image} alt="" fill sizes="(max-width: 1000px) 0px, 44vw" />
                  </span>
                ))}

                <span className={styles.stackIndex}>
                  {chapters[active].number} / 0{chapters.length}
                </span>
              </div>
            </div>

            <ol className={styles.chapterList}>
              {chapters.map((chapter, index) => (
                <li
                  key={chapter.number}
                  ref={(node) => {
                    chapterRefs.current[index] = node;
                  }}
                  data-index={index}
                  className={styles.chapter}
                  data-active={index === active ? "true" : "false"}
                >
                  <div className={styles.inlineImage}>
                    <Image src={chapter.image} alt={chapter.alt} fill sizes="92vw" />
                  </div>
                  <span className={styles.chapterMeta}>
                    {chapter.number} — {chapter.category}
                  </span>
                  <h3 className="display">{chapter.title}</h3>
                  <p>{chapter.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* manifesto */}
      <section className={`${styles.manifesto} surface-ink`}>
        <div className="wrap">
          <div className="meta">
            <span>04</span>
            <span>Manifesto</span>
            <span>SPIRIT / 2026</span>
          </div>

          <KineticText
            as="h2"
            lines={["MOVE", "WITH", "INTENT."]}
            outline={[1]}
            className={`display ${styles.manifestoTitle}`}
          />

          <ScrubText
            className={styles.manifestoText}
            text="SPIRIT exists for people who see movement as part of who they are. The training. The commute. The recovery. Everything between."
          />
        </div>
      </section>

      <CtaBand
        index="05"
        label="SPIRIT / Story"
        title={["FIND", "YOUR SPIRIT."]}
        copy="Performance for the body. Design for the life around it."
        href="/collections"
        cta="Explore collections"
      />
    </main>
  );
}
