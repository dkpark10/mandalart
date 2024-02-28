"use client";

// import Cell from "./components/cell";
import React, { useEffect, useRef, useState, type  KeyboardEvent } from "react";
import styles from "./page.module.scss";
import { clsx } from "clsx";
import { z } from "zod";

const LOCAL_STORAGE_KEY = "MANDATRA";
const MandatraValueSchema = z.array(z.array(z.string()));

interface MandatraItem {
  row: number;
  col: number;
}

export default function Mandatra() {
  const mainRef = useRef<HTMLDivElement>(null);
  const contentEditableListRef = useRef<Array<Array<HTMLDivElement | null>>>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
  );

  const nineNine = useRef<Array<Array<MandatraItem>>>(
    Array.from({ length: 9 }, (_, row) =>
      Array.from({ length: 9 }, (_, col) => ({
        row,
        col,
      }))
    )
  );

  const onImageSaveClick = async () => {
    if (!mainRef.current) return;
    const html2canvas = await import("html2canvas").then((mod) => mod.default);
    /** @todo 이미지 저장 */
    const canvas = await html2canvas(mainRef.current);
  };

  const onDelete = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    for (let i = 0; i < 9; i += 1) {
      for (let j = 0; j < 9; j += 1) {
        (contentEditableListRef.current[i][j] as HTMLDivElement).innerHTML = '';
      }
    }
  }

  const onKeyUp =
    (row: number, col: number) => (e: KeyboardEvent<HTMLDivElement>) => {
      const subTitleTarget = contentEditableListRef.current[col][row];
      const isCenter = row === 4 && col === 4;
      if (!subTitleTarget || isCenter) return;
      subTitleTarget.innerHTML = e.currentTarget.innerHTML;

      const stringValues = contentEditableListRef.current.map((row) =>
        row.map((col) => col?.innerHTML ?? "")
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stringValues));
    };

  useEffect(() => {
    const val = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!val) return;

    const result = MandatraValueSchema.safeParse(JSON.parse(val));
    if (!result.success) return;

    for (let i = 0; i < 9; i += 1) {
      for (let j = 0; j < 9; j += 1) {
        (contentEditableListRef.current[i][j] as HTMLDivElement).innerHTML =
          result.data[i][j];
      }
    }
  }, []);

  return (
    <React.Fragment>
      <header className={styles["header"]}>
        <h1>만다라트</h1>
      </header>
      <div className={styles["container"]}>
        <main ref={mainRef} className={styles["main-container"]}>
          {nineNine.current.map((_, row) => {
            const isCenterArea = row === 4;

            return (
              <section key={row} className={styles["cell-container"]}>
                {_.map((_, col) => {
                  const isMainTitleArea = isCenterArea && col === 4;

                  return (
                    <div
                      id={clsx(isMainTitleArea && styles["main-title"])}
                      key={`${row}-${col}`}
                      className={clsx(styles["cell"], styles["sub-title"])}
                    >
                      <div
                        contentEditable
                        ref={(el) => {
                          if (!el) return;
                          contentEditableListRef.current[row][col] = el;
                        }}
                        onKeyUp={onKeyUp(row, col)}
                      />
                    </div>
                  );
                })}
              </section>
            );
          })}
        </main>
        <div className={styles["btn-container"]}>
          <button className={styles["save-btn"]} onClick={onImageSaveClick}>
            이미지 저장하기
          </button>
          <button className={styles["del-btn"]} onClick={onDelete}>
            삭제
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
