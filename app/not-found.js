import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import StrokeText from "@/components/StrokeText";

import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <div className={styles.meta}>
        <span>404</span>
        <span>SPIRIT / ERROR</span>
        <span>2026</span>
      </div>

      <div className={styles.content}>
        <h1 className={styles.heading}>
          404
          <br />
          <StrokeText
            color="#101317"
            strokeColor="rgba(16, 19, 23, 0.92)"
            strokeWidth={1.2}
            className={styles.stroke}
          >
            NOTHING HERE.
          </StrokeText>
        </h1>

        <div className={styles.side}>
          <p>
            The page you are looking for does
            not exist, or has moved
            somewhere else.
          </p>

          <Link href="/" className={styles.homeLink}>
            <span>RETURN HOME</span>

            <span className={styles.homeIcon}>
              <ArrowUpRight
                size={17}
                strokeWidth={1.1}
              />
            </span>
          </Link>
        </div>
      </div>

      <div className={styles.footer}>
        <span>SPIRIT / DESIGNED FOR MOVEMENT</span>
        <span>MOVE WITH INTENT.</span>
      </div>
    </main>
  );
}