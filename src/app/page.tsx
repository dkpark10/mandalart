"use client";

// import Cell from "./components/cell";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import { clsx } from "clsx";
import { z } from "zod";
import { WestBottomArrow } from "./components/arrow";
import { ImArrowDownLeft } from "react-icons/im";

const LOCAL_STORAGE_KEY = "MANDATRA";
const MandatraValueSchema = z.array(z.array(z.string()));

interface MandatraItem {
  value: string;
  lineCount: number;
}

export default function Mandatra() {
  const mainRef = useRef<HTMLDivElement>(null);
  const textAreaListRef = useRef<Array<Array<HTMLTextAreaElement | null>>>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
  );

  const [values, setValues] = useState<Array<Array<MandatraItem>>>(
    Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({
        value: "",
        lineCount: 0,
      }))
    )
  );

  const onImageSaveClick = async () => {
    if (!mainRef.current) return;
    const html2canvas = await import("html2canvas").then((mod) => mod.default);
    /** @todo 이미지 저장 */
    const canvas = await html2canvas(mainRef.current);
  };

  const onChange =
    (row: number, col: number) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const engRegex = /^[a-z|A-Z]+$/;

      const isCenterArea = row === 4;
      const { value } = e.target;
      const lineCount = value.split("\n").length;

      if (lineCount >= 4 || engRegex.exec(value)) return;

      setValues((prev) => {
        /** @desc 서브 타이틀 입력 칸이라면 */
        if ((isCenterArea && col !== 4) || col === 4) {
          prev[col][row] = {
            value,
            lineCount,
          };
        }

        prev[row][col] = {
          value,
          lineCount,
        };
        return [...prev];
      });

      const stringValues = values.map((row) => row.map((col) => col.value));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stringValues));
    };

  useEffect(() => {
    const val = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!val) return;

    const result = MandatraValueSchema.safeParse(JSON.parse(val));
    if (!result.success) return;

    const data = result.data.map((row) =>
      row.map(
        (col): MandatraItem => ({
          value: col,
          lineCount: col.split("\n").length,
        })
      )
    );

    setValues(data);
  }, []);

  return (
    <div className={styles["container"]}>
      {/* <textarea className={styles["textareatemp"]} />
      <textarea className={styles["textareatemp"]} /> */}
      <main ref={mainRef} className={styles["main-container"]}>
        {values.map((rowValue, row) => {
          const isCenterArea = row === 4;

          return (
            <section key={row} className={styles["cell-container"]}>
              {rowValue.map(({ value, lineCount }, col) => {
                const isMainTitleArea = isCenterArea && col === 4;

                return (
                  <div
                    id={isMainTitleArea ? styles["main-title"] : ""}
                    key={`${row}-${col}`}
                    className={styles["cell"]}
                  >
                    <textarea
                      ref={(el) => {
                        if (!el) return;
                        textAreaListRef.current[row][col] = el;
                      }}
                      className={clsx(
                        styles["first-line"],
                        styles[`line-${lineCount}`]
                      )}
                      value={value}
                      onChange={onChange(row, col)}
                    />
                  </div>
                );
              })}
            </section>
          );
        })}
      </main>
      <button className={styles["save-btn"]} onClick={onImageSaveClick}>
        이미지 저장하기
      </button>
    </div>
  );
}
