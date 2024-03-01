<template>
  <header>
    <h1>만다라트</h1>
  </header>
  <div class="container">
    <main ref="mainRef" class="main-container">
      <section v-for="(rows, row) in nineNine" :key="row" class="cell-container">
        <div :id="isCenter(row, col) ? 'main-goal' : ''" class="cell" v-for="(_, col) in rows" :key="`${row}-${col}`">
          <div @keyup="onKeyUp(row, col, $event)" contenteditable :ref="(el) => {
            contentEditableRefs[row][col] = el as HTMLDivElement;
          }
            " />
        </div>
      </section>
    </main>
    <div class="btn-container">
      <button class="save-btn" @click="onImageSaveClick">
        이미지 저장하기
      </button>
      <button class="del-btn" @click="onDelete">삭제</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { z } from "zod";

const LOCAL_STORAGE_KEY = "MANDATRA";
const MandatraValueSchema = z.array(z.array(z.string()));

const mainRef = ref<HTMLDivElement>();

const nineNine: Array<Array<{ row: number; col: number }>> = Array.from(
  { length: 9 },
  (_, row) =>
    Array.from({ length: 9 }, (_, col) => ({
      row,
      col,
    })),
);

const isCenter = (row: number, col: number) => row === 4 && col === 4;

const contentEditableRefs = ref<Array<Array<HTMLDivElement | null>>>(
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null)),
);

const onImageSaveClick = async () => {
  if (!mainRef.value) return;
  const html2canvas = await import("html2canvas").then((mod) => mod.default);
  const canvas = await html2canvas(mainRef.value);

  const el = document.createElement("a");
  el.href = canvas.toDataURL("image/png");
  el.download = "만다라트.png";
  el.click();
};

const onDelete = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  for (let i = 0; i < 9; i += 1) {
    for (let j = 0; j < 9; j += 1) {
      contentEditableRefs.value[i][j]!.innerHTML = "";
    }
  }
};

const onKeyUp = (
  row: number,
  col: number,
  // @ts-ignore
  e: KeyboardEvent<HTMLDivElement>,
) => {
  const subTitleTarget = contentEditableRefs.value[col][row];
  const center = isCenter(row, col);

  if (!subTitleTarget || center) return;

  subTitleTarget.innerHTML = e.currentTarget.innerHTML;

  const stringValues = contentEditableRefs.value.map((row) =>
    row.map((col) => col?.innerHTML ?? ""),
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stringValues));
};

onMounted(() => {

  const val = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!val) return;

  const result = MandatraValueSchema.safeParse(JSON.parse(val));
  if (!result.success) return;

  for (let i = 0; i < 9; i += 1) {
    for (let j = 0; j < 9; j += 1) {
      contentEditableRefs.value[i][j]!.innerHTML = result.data[i][j];
    }
  }

});
</script>

<style lang="scss" scoped>
$color-primary1: #83828b;
$color-primary2: #282d40;
$color-primary3: #0a162c;
$font-color: #f8f4f8;
$deep-color: #24224b;
$border-color: #868594;

header {
  padding: 0.5rem 0;
  color: $deep-color;
  display: flex;
  justify-content: center;

  h1 {
    font-size: 4rem;
  }
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.main-container {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid $border-color;
  margin-bottom: 10px;
}

.cell-container {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);

  &:nth-of-type(5) {
    background-color: $color-primary2;
    font-weight: 600;
    color: $font-color;
  }

  background-color: $font-color;
}

.cell {
  width: 90px;
  height: 90px;
  border: 0.5px solid $border-color;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  font-size: 0.9rem;

  div[contenteditable] {
    outline: none;
    text-align: center;
    width: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  div[contenteditable]:empty::before {
    content: attr(data-placeholder);
  }

  &:nth-of-type(5) {
    background-color: $color-primary1;
    color: $font-color;
    font-weight: 600;
  }
}

.btn-container {
  padding: 4px 0;
  display: flex;
  justify-content: space-between;
}

.save-btn {
  background-color: $color-primary1;
  border: none;
  padding: 10px;
  color: $font-color;
  border-radius: 10px;
  width: 140px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: $color-primary2;
  }

  &:active {
    background-color: $color-primary3;
  }
}

.del-btn {
  border: none;
  padding: 10px;
  color: $color-primary3;
  border-radius: 10px;
  width: 140px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid $color-primary3;

  &:hover {
    background-color: #e4e9ef;
  }
}

#main-goal {
  background-color: $color-primary3;
  font-size: 1.1rem;
  color: $font-color;
}
</style>
