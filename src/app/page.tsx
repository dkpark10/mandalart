import Cell from "./components/cell";
import styles from "./page.module.scss";

export default function Mandatra() {
  return (
    <main className={styles["main-container"]}>
      {Array.from({ length: 9 }, (_, idx) => (
        <Cell key={idx} idx={idx} />
      ))}
    </main>
  );
}
