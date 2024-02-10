"use client";

// import Cell from "./components/cell";
import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { clsx } from "clsx";
import { z } from "zod";

const LOCAL_STORAGE_KEY = "MANDATRA";
const MandatraValueSchema = z.array(z.array(z.string()));

type MandatraValues = z.infer<typeof MandatraValueSchema>;

export default function Mandatra() {
  const [values, setValues] = useState<MandatraValues>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => ""))
  );

  const onChange = (row: number, col: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const isCenterArea = row === 4;
    const { value } = e.target;

    setValues((prev) => {
      /** @desc 서브 타이틀 입력 칸이라면 */
      if ((isCenterArea && col !== 4) || (col === 4)) {
        prev[col][row] = value;
      }

      prev[row][col] = value;
      return [...prev];
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
  }

  useEffect(() => {
    const val = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!val) return;
    const result = MandatraValueSchema.safeParse(JSON.parse(val));
    if (result.success) {
      setValues(result.data);
    }
  }, []);

  return (
    <main className={styles["main-container"]}>
      {values.map((rowValue, row) => {
        const isCenterArea = row === 4;
        const centerStyle = isCenterArea && styles["center"];

        return (
          <section key={row} className={clsx(styles["cell-container"], centerStyle)}>
            {rowValue.map((colValue, col) => {
              return (
                <div key={`${row}-${col}`} className={styles["cell"]}>
                  <textarea value={colValue} onChange={onChange(row, col)} />
                </div>
              );
            })}
          </section>
        );
      })}
    </main>
  );
}
