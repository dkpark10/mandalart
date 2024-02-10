"use client";

import styles from "./cell.module.scss";
import { clsx } from "clsx";
import { useRef } from "react";

interface CellProps {
  idx: number;
}

export default function Cell({ idx }: CellProps) {
  const textAreaRefList = useRef<Array<HTMLTextAreaElement>>([]);

  const isCenter = idx === 4;
  const centerStyle = isCenter && styles["center"];

  return (
    <section className={clsx(styles["cell-container"], centerStyle)}>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className={styles["cell"]}>
          <textarea
            ref={(el) => {
              if (!el) return;
              textAreaRefList.current[i] = el;
            }}
          />
        </div>
      ))}
    </section>
  );
}
