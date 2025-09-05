const progress = document.querySelector(".progress-bar");
const progressLabel = document.querySelector('.progress-label');
const progressValue = document.querySelector(".progress-value");
const container = document.querySelector(".goal-container");
const goalContainer = document.querySelector(".all-goals");
const addBtn = document.querySelector(".add");

const allQuotes = [
  'Raise the bar by completing your goals!',
  'Well begun is half done!',
  'Just a step away, keep going!',
  'Woha! You just completed all the goals, time for chill :D'
];

let allGoals = JSON.parse(localStorage.getItem('allGoals')) || {};
let goalIndex = Object.keys(allGoals).length;

// Function to update progress bar
function updateProgress() {
  const total = goalContainer.children.length;
  const completed = Object.values(allGoals).filter(g => g.completed).length;

  progressValue.style.width = `${(completed / total) * 100}%`;
  progressValue.firstElementChild.innerText = `${completed}/${total} Completed`;
  progressLabel.innerText = allQuotes[completed] || allQuotes[allQuotes.length - 1];
}

// Function to bind events to each goal block
function bindGoalEvents(goalDiv, inputId) {
  const input = goalDiv.querySelector('.goal-input');
  const checkbox = goalDiv.querySelector('.custom-checkbox');

  input.id = inputId;

  // Restore values
  if (allGoals[inputId]) {
    input.value = allGoals[inputId].name;
    if (allGoals[inputId].completed) {
      goalDiv.classList.add("completed");
    }
  }

  // Input logic
  input.addEventListener("input", () => {
    if (allGoals[input.id]?.completed) {
      input.value = allGoals[input.id].name;
      return;
    }

    allGoals[input.id] = {
      name: input.value,
      completed: false,
    };
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  });

  input.addEventListener("focus", () => {
    progress.classList.remove("show-error");
  });

  // Checkbox logic
  checkbox.addEventListener("click", () => {
    const allInputs = goalContainer.querySelectorAll('.goal-input');
    const allFilled = [...allInputs].every(inp => inp.value.trim() !== "");

    if (!allFilled) {
      progress.classList.add("show-error");
      return;
    }

    goalDiv.classList.toggle("completed");
    allGoals[input.id].completed = !allGoals[input.id].completed;
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
    updateProgress();
  });
}

// Function to create a new goal block
function createGoal(inputId, name = '', completed = false) {
  const newGoal = container.cloneNode(true);
  const input = newGoal.querySelector('.goal-input');
  input.value = name;
  allGoals[inputId] = { name, completed };
  bindGoalEvents(newGoal, inputId);
  goalContainer.appendChild(newGoal);
}

// Rebuild goals from localStorage
window.addEventListener('DOMContentLoaded', () => {
  if (Object.keys(allGoals).length > 0) {
    goalContainer.innerHTML = ''; // Clear initial static goal block
    Object.entries(allGoals).forEach(([id, { name, completed }]) => {
      createGoal(id, name, completed);
    });
  } else {
    createGoal(`input-${goalIndex++}`);
  }

  updateProgress();
});

// Add new goal
addBtn.addEventListener("click", () => {
  if (goalContainer.children.length < 5) {
    const newId = `input-${goalIndex++}`;
    createGoal(newId);
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
    updateProgress();
  }
});
