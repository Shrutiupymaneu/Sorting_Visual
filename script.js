const arrayContainer = document.getElementById("arrayContainer");

const generateArrayBtn = document.getElementById("generateArrayBtn");
const arraySizeSlider = document.getElementById("arraySize");
const speedSlider = document.getElementById("speed");

const arraySizeValue = document.getElementById("arraySizeValue");
const speedValue = document.getElementById("speedValue");

const statusText = document.getElementById("statusText");
const comparisonCount = document.getElementById("comparisonCount");

const bubbleSortBtn = document.getElementById("bubbleSortBtn");
const selectionSortBtn = document.getElementById("selectionSortBtn");
const insertionSortBtn = document.getElementById("insertionSortBtn");
const mergeSortBtn = document.getElementById("mergeSortBtn");
const quickSortBtn = document.getElementById("quickSortBtn");
const resetBtn = document.getElementById("resetBtn");

const sortButtons = [
  bubbleSortBtn,
  selectionSortBtn,
  insertionSortBtn,
  mergeSortBtn,
  quickSortBtn
];

let array = [];
let isSorting = false;
let stopSorting = false;
let comparisons = 0;

window.addEventListener("DOMContentLoaded", generateNewArray);

generateArrayBtn.addEventListener("click", generateNewArray);

arraySizeSlider.addEventListener("input", () => {
  arraySizeValue.textContent = arraySizeSlider.value;
  if (!isSorting) generateNewArray();
});

speedSlider.addEventListener("input", () => {
  speedValue.textContent = speedSlider.value;
});

resetBtn.addEventListener("click", () => {
  stopSorting = true;
  isSorting = false;
  enableControls();
  generateNewArray();
});

bubbleSortBtn.addEventListener("click", () => startSorting(bubbleSort, "Bubble Sort"));
selectionSortBtn.addEventListener("click", () => startSorting(selectionSort, "Selection Sort"));
insertionSortBtn.addEventListener("click", () => startSorting(insertionSort, "Insertion Sort"));
mergeSortBtn.addEventListener("click", () => startSorting(mergeSort, "Merge Sort"));
quickSortBtn.addEventListener("click", () => startSorting(quickSort, "Quick Sort"));

function generateNewArray() {
  if (isSorting) return;

  array = [];
  comparisons = 0;
  comparisonCount.textContent = comparisons;
  statusText.textContent = "Ready";
  arrayContainer.innerHTML = "";

  const size = Number(arraySizeSlider.value);

  for (let i = 0; i < size; i++) {
    const value = randomNumber(1, 99);
    array.push(value);
    arrayContainer.appendChild(createBlock(value));
  }
}

function createBlock(value) {
  const block = document.createElement("div");
  block.className = "block";
  block.textContent = value;
  return block;
}

function updateBlock(index, value) {
  const blocks = getBlocks();
  blocks[index].textContent = value;
}

function getBlocks() {
  return document.querySelectorAll(".block");
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDelay() {
  const speed = Number(speedSlider.value);
  return 350 - speed * 3;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkStop() {
  if (stopSorting) {
    throw new Error("Stopped");
  }
}

function increaseComparison() {
  comparisons++;
  comparisonCount.textContent = comparisons;
}

async function startSorting(sortFunction, name) {
  if (isSorting) return;

  isSorting = true;
  stopSorting = false;
  comparisons = 0;
  comparisonCount.textContent = comparisons;
  statusText.textContent = `Running ${name}`;

  disableControls();

  try {
    await sortFunction();

    if (!stopSorting) {
      await markAllSorted();
      statusText.textContent = "Completed";
    }
  } catch {
    statusText.textContent = "Stopped";
  }

  isSorting = false;
  enableControls();
}

function disableControls() {
  generateArrayBtn.disabled = true;
  arraySizeSlider.disabled = true;
  sortButtons.forEach(btn => btn.disabled = true);
}

function enableControls() {
  generateArrayBtn.disabled = false;
  arraySizeSlider.disabled = false;
  sortButtons.forEach(btn => btn.disabled = false);
}

async function highlightCompare(i, j) {
  checkStop();

  const blocks = getBlocks();

  blocks[i].classList.add("compare");
  blocks[j].classList.add("compare");

  increaseComparison();
  await sleep(getDelay());

  blocks[i].classList.remove("compare");
  blocks[j].classList.remove("compare");
}

async function swap(i, j) {
  checkStop();

  if (i === j) return;

  const blocks = getBlocks();

  blocks[i].classList.add("swap");
  blocks[j].classList.add("swap");

  await sleep(getDelay());

  [array[i], array[j]] = [array[j], array[i]];

  updateBlock(i, array[i]);
  updateBlock(j, array[j]);

  await sleep(getDelay());

  blocks[i].classList.remove("swap");
  blocks[j].classList.remove("swap");
}

async function markAllSorted() {
  const blocks = getBlocks();

  for (let i = 0; i < blocks.length; i++) {
    checkStop();
    blocks[i].classList.remove("compare", "swap", "pivot");
    blocks[i].classList.add("sorted");
    await sleep(10);
  }
}

async function bubbleSort() {
  const n = array.length;
  const blocks = getBlocks();

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      checkStop();

      await highlightCompare(j, j + 1);

      if (array[j] > array[j + 1]) {
        await swap(j, j + 1);
      }
    }

    blocks[n - i - 1].classList.add("sorted");
  }

  blocks[0].classList.add("sorted");
}

async function selectionSort() {
  const n = array.length;
  const blocks = getBlocks();

  for (let i = 0; i < n; i++) {
    let minIndex = i;
    blocks[minIndex].classList.add("compare");

    for (let j = i + 1; j < n; j++) {
      checkStop();

      blocks[j].classList.add("compare");
      increaseComparison();
      await sleep(getDelay());

      if (array[j] < array[minIndex]) {
        blocks[minIndex].classList.remove("compare");
        minIndex = j;
        blocks[minIndex].classList.add("compare");
      } else {
        blocks[j].classList.remove("compare");
      }
    }

    if (minIndex !== i) {
      await swap(i, minIndex);
    }

    blocks[minIndex].classList.remove("compare");
    blocks[i].classList.add("sorted");
  }
}

async function insertionSort() {
  const n = array.length;
  const blocks = getBlocks();

  blocks[0].classList.add("sorted");

  for (let i = 1; i < n; i++) {
    checkStop();

    let key = array[i];
    let j = i - 1;

    blocks[i].classList.add("compare");
    await sleep(getDelay());

    while (j >= 0 && array[j] > key) {
      checkStop();
      increaseComparison();

      blocks[j].classList.add("swap");

      array[j + 1] = array[j];
      updateBlock(j + 1, array[j + 1]);

      await sleep(getDelay());

      blocks[j].classList.remove("swap");
      j--;
    }

    array[j + 1] = key;
    updateBlock(j + 1, key);

    blocks[i].classList.remove("compare");

    for (let k = 0; k <= i; k++) {
      blocks[k].classList.add("sorted");
    }

    await sleep(getDelay());
  }
}

async function mergeSort() {
  await mergeSortHelper(0, array.length - 1);
}

async function mergeSortHelper(left, right) {
  checkStop();

  if (left >= right) return;

  const middle = Math.floor((left + right) / 2);

  await mergeSortHelper(left, middle);
  await mergeSortHelper(middle + 1, right);
  await merge(left, middle, right);
}

async function merge(left, middle, right) {
  const blocks = getBlocks();

  const leftArray = array.slice(left, middle + 1);
  const rightArray = array.slice(middle + 1, right + 1);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftArray.length && j < rightArray.length) {
    checkStop();

    blocks[k].classList.add("compare");
    increaseComparison();
    await sleep(getDelay());

    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      i++;
    } else {
      array[k] = rightArray[j];
      j++;
    }

    updateBlock(k, array[k]);

    blocks[k].classList.remove("compare");
    blocks[k].classList.add("swap");

    await sleep(getDelay());

    blocks[k].classList.remove("swap");
    k++;
  }

  while (i < leftArray.length) {
    checkStop();

    array[k] = leftArray[i];
    updateBlock(k, array[k]);

    blocks[k].classList.add("swap");
    await sleep(getDelay());
    blocks[k].classList.remove("swap");

    i++;
    k++;
  }

  while (j < rightArray.length) {
    checkStop();

    array[k] = rightArray[j];
    updateBlock(k, array[k]);

    blocks[k].classList.add("swap");
    await sleep(getDelay());
    blocks[k].classList.remove("swap");

    j++;
    k++;
  }
}

async function quickSort() {
  await quickSortHelper(0, array.length - 1);
}

async function quickSortHelper(low, high) {
  checkStop();

  const blocks = getBlocks();

  if (low < high) {
    const pivotIndex = await partition(low, high);

    blocks[pivotIndex].classList.add("sorted");

    await quickSortHelper(low, pivotIndex - 1);
    await quickSortHelper(pivotIndex + 1, high);
  } else if (low === high) {
    blocks[low].classList.add("sorted");
  }
}

async function partition(low, high) {
  const blocks = getBlocks();

  const pivot = array[high];
  let i = low - 1;

  blocks[high].classList.add("pivot");

  for (let j = low; j < high; j++) {
    checkStop();

    blocks[j].classList.add("compare");
    increaseComparison();
    await sleep(getDelay());

    if (array[j] < pivot) {
      i++;
      await swap(i, j);
    }

    blocks[j].classList.remove("compare");
  }

  await swap(i + 1, high);

  blocks[high].classList.remove("pivot");

  return i + 1;
}