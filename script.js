const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

// --- Clicks en los botones ---
buttons.forEach(btn => {
  btn.addEventListener("click", () => handleInput(btn));
});

// --- Soporte por teclado ---
document.addEventListener("keydown", e => {
  if (/[0-9+\-*/().]/.test(e.key)) {
    display.value += e.key;
  } else if (e.key === "Enter") {
    calculate();
  } else if (e.key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (e.key === "Escape") {
    display.value = "";
  } else if (e.key.toLowerCase() === "b") {
    clearHistory(); // tecla B limpia historial
  }
});

// --- Botón limpiar historial ---
clearHistoryBtn.addEventListener("click", clearHistory);

function handleInput(btn) {
  const value = btn.dataset.value;
  const action = btn.dataset.action;

  if (action === "clear") {
    display.value = "";
  } else if (action === "delete") {
    display.value = display.value.slice(0, -1);
  } else if (action === "calculate") {
    calculate();
  } else if (value) {
    display.value += value;
  }
}

function calculate() {
  try {
    const result = safeEval(display.value);
    addToHistory(display.value, result);
    display.value = result;
  } catch {
    display.value = "Error";
  }
}

// --- Evaluación segura ---
function safeEval(s) {
  const cleaned = s.replace(/\s+/g, '');
  if (/[*/]{2,}|\.\.|\)\(|\(\)/.test(cleaned)) throw new Error('Invalid');
  const res = Function('return (' + s + ')')();
  return Number(res);
}

// --- Historial ---
function addToHistory(expression, result) {
  const li = document.createElement("li");
  li.textContent = `${expression} = ${result}`;
  historyList.prepend(li);
  saveHistory();
}

function saveHistory() {
  const items = Array.from(historyList.children).map(li => li.textContent);
  localStorage.setItem("calcHistory", JSON.stringify(items));
}

function loadHistory() {
  const saved = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  historyList.innerHTML = "";
  saved.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function clearHistory() {
  historyList.innerHTML = "";
  localStorage.removeItem("calcHistory");
}

// Cargar historial al iniciar
loadHistory();
