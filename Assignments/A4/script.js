/*
  TODO LIST — JAVASCRIPT
  ======================

  CONCEPTS PRACTICED:
  - ES6: arrow functions, template literals, destructuring, const/let
  - DOM manipulation: createElement, appendChild, remove
  - Event listeners: submit, click, keydown, blur, dblclick
  - localStorage: persist tasks across page reloads
  - Array methods: filter, map, find
  - Event delegation: one listener on the list handles all task actions

  -------------------------------------------------------
  DATA MODEL
  -------------------------------------------------------
  Each task is a plain object stored in an array:

    {
      id:        number   — unique timestamp-based ID
      text:      string   — the task label
      completed: boolean  — whether the task is done
    }

  The array is serialized to JSON and saved in localStorage
  under the key "todos" on every change.

  -------------------------------------------------------
  FLOW
  -------------------------------------------------------
  1. On load  → read tasks from localStorage, render all
  2. Add      → push new task object, save, re-render
  3. Toggle   → flip task.completed, save, re-render
  4. Edit     → replace text span with input, save on Enter/blur
  5. Delete   → splice task from array, save, re-render
  6. Filter   → re-render with only matching tasks visible
  7. Clear    → remove all completed tasks, save, re-render
*/

// =============================================
// STATE
// =============================================

// Load saved tasks from localStorage, or start with an empty array
let tasks = JSON.parse(localStorage.getItem("todos")) || [];

// Active filter: "all" | "active" | "completed"
let currentFilter = "all";

// =============================================
// DOM REFERENCES
// =============================================
const todoForm    = document.querySelector("#todoForm");
const todoInput   = document.querySelector("#todoInput");
const todoList    = document.querySelector("#todoList");
const emptyState  = document.querySelector("#emptyState");
const statsCount  = document.querySelector("#statsCount");
const clearBtn    = document.querySelector("#clearBtn");
const filterBtns  = document.querySelectorAll(".filters__btn");

// =============================================
// LOCALSTORAGE HELPERS
// =============================================

// Save the current tasks array to localStorage as a JSON string
const saveTasks = () => {
  localStorage.setItem("todos", JSON.stringify(tasks));
};

// =============================================
// RENDER
// Clears the list and re-builds it from the
// tasks array, applying the active filter.
// =============================================
const render = () => {
  // Clear existing list items
  todoList.innerHTML = "";

  // Apply filter to decide which tasks to show
  const visible = tasks.filter((task) => {
    if (currentFilter === "active")    return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true; // "all"
  });

  // Show empty state if nothing to display
  if (visible.length === 0) {
    emptyState.classList.add("empty-state--visible");
  } else {
    emptyState.classList.remove("empty-state--visible");
  }

  // Build a <li> for each visible task and append to the list
  visible.forEach((task) => {
    todoList.appendChild(createTaskElement(task));
  });

  // Update the "X tasks left" counter (counts only active tasks)
  updateStats();
};

// =============================================
// CREATE TASK ELEMENT
// Builds and returns a single <li> DOM node
// for the given task object.
// =============================================
const createTaskElement = (task) => {
  // <li class="todo-item [todo-item--completed]" data-id="...">
  const li = document.createElement("li");
  li.classList.add("todo-item");
  if (task.completed) li.classList.add("todo-item--completed");
  li.dataset.id = task.id;

  // Checkbox button — click to toggle completed
  const checkbox = document.createElement("button");
  checkbox.classList.add("todo-item__checkbox");
  checkbox.setAttribute("aria-label", "Toggle task");
  checkbox.innerHTML = task.completed ? "&#10003;" : "";

  // Task text span — double-click to edit
  const textSpan = document.createElement("span");
  textSpan.classList.add("todo-item__text");
  textSpan.textContent = task.text;

  // Action buttons wrapper
  const actions = document.createElement("div");
  actions.classList.add("todo-item__actions");

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.classList.add("todo-item__btn", "todo-item__btn--edit");
  editBtn.setAttribute("aria-label", "Edit task");
  editBtn.innerHTML = "&#9998;"; // pencil icon
  editBtn.title = "Edit (or double-click text)";

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("todo-item__btn", "todo-item__btn--delete");
  deleteBtn.setAttribute("aria-label", "Delete task");
  deleteBtn.innerHTML = "&#10005;"; // × icon
  deleteBtn.title = "Delete";

  actions.append(editBtn, deleteBtn);
  li.append(checkbox, textSpan, actions);

  return li;
};

// =============================================
// UPDATE STATS
// Updates the "X tasks left" counter.
// =============================================
const updateStats = () => {
  const activeCount = tasks.filter((t) => !t.completed).length;
  statsCount.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} left`;
};

// =============================================
// ADD TASK
// =============================================
todoForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reload on form submit

  const text = todoInput.value.trim();
  if (!text) return; // ignore empty input

  // Create a new task object using ES6 shorthand and Date.now() as unique ID
  const newTask = {
    id:        Date.now(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  render();

  // Clear and re-focus the input for quick back-to-back entry
  todoInput.value = "";
  todoInput.focus();
});

// =============================================
// TOGGLE / EDIT / DELETE  (Event Delegation)
// One listener on the <ul> handles all three
// actions for every task — including ones added
// dynamically after page load.
// =============================================
todoList.addEventListener("click", (e) => {
  // Walk up from the clicked element to find the parent <li>
  const li = e.target.closest(".todo-item");
  if (!li) return;

  const id   = Number(li.dataset.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  // ------ Toggle completed ------
  if (e.target.closest(".todo-item__checkbox")) {
    task.completed = !task.completed;
    saveTasks();
    render();
    return;
  }

  // ------ Delete ------
  if (e.target.closest(".todo-item__btn--delete")) {
    // Remove the task from the array using filter
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
    return;
  }

  // ------ Edit (pencil button) ------
  if (e.target.closest(".todo-item__btn--edit")) {
    startEditing(li, task);
  }
});

// Double-clicking the text also triggers edit mode
todoList.addEventListener("dblclick", (e) => {
  const textSpan = e.target.closest(".todo-item__text");
  if (!textSpan) return;

  const li   = textSpan.closest(".todo-item");
  const id   = Number(li.dataset.id);
  const task = tasks.find((t) => t.id === id);
  if (task) startEditing(li, task);
});

// =============================================
// START EDITING
// Swaps the text <span> for an <input> so the
// user can type a new value inline.
// =============================================
const startEditing = (li, task) => {
  // Don't open a second edit input if one is already open
  if (li.querySelector(".todo-item__edit")) return;

  const textSpan = li.querySelector(".todo-item__text");

  // Create the inline edit input
  const input = document.createElement("input");
  input.classList.add("todo-item__edit");
  input.type  = "text";
  input.value = task.text;

  // Swap span → input
  textSpan.replaceWith(input);
  input.focus();
  input.select(); // pre-select text for quick replacement

  // ---- Save edit on Enter, cancel on Escape ----
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      commitEdit(input, task, li);
    } else if (e.key === "Escape") {
      render(); // discard changes, re-render original
    }
  });

  // Save edit when the input loses focus (click elsewhere)
  input.addEventListener("blur", () => {
    commitEdit(input, task, li);
  });
};

// =============================================
// COMMIT EDIT
// Validates and saves the edited text.
// =============================================
const commitEdit = (input, task, li) => {
  const newText = input.value.trim();

  if (!newText) {
    // Empty text → delete the task instead
    tasks = tasks.filter((t) => t.id !== task.id);
  } else {
    task.text = newText;
  }

  saveTasks();
  render();
};

// =============================================
// FILTER BUTTONS
// =============================================
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active filter
    currentFilter = btn.dataset.filter;

    // Swap the active class to the clicked button
    filterBtns.forEach((b) => b.classList.remove("filters__btn--active"));
    btn.classList.add("filters__btn--active");

    render();
  });
});

// =============================================
// CLEAR COMPLETED
// =============================================
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
});

// =============================================
// INITIAL RENDER
// Runs once on page load — restores tasks from
// localStorage and paints the UI.
// =============================================
render();
