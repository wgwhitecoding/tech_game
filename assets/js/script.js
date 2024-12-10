// === DOM Element Selection ===
const runCodeButton = document.getElementById("run-code");
const hintButton = document.getElementById("get-hint");
const nextButton = document.getElementById("next-puzzle");
const feedback = document.getElementById("feedback");
const levelTitle = document.getElementById("level-title");
const celebration = document.getElementById("celebration");
const rank = document.getElementById("rank");
const resultOutput = document.getElementById("result-output");
const timer = document.getElementById("timer");
const toggleMode = document.getElementById("toggle-mode");
const achievementList = document.getElementById("achievement-list");

// === Game Levels and Ranks ===
const levels = [
  {
    description: "Fix the loop condition to sum numbers.",
    code: `let numbers = [1, 2, 3, 4, 5];\nlet sum = 0;\nfor (let i = 0; i <= numbers.length; i++) {\n  sum += numbers[i];\n}\nconsole.log(Sum);`,
    solution: 15,
    hint: "Check the loop condition and variable names."
  },
  {
    description: "Correct the function to return the correct greeting.",
    code: `function greet(name) {\n  return "Hello " + Name;\n}\nconsole.log(greet("Alice"));`,
    solution: "Hello Alice",
    hint: "Check capitalization of variables."
  },
  {
    description: "Fix the logic to find the maximum number in the array.",
    code: `let numbers = [3, 7, 2, 8, 5];\nlet max = 0;\nnumbers.forEach((num) => {\n  if (num > max) {\n    max = num;\n  }\n});\nconsole.log(Max);`,
    solution: 8,
    hint: "Check the initial value of max and capitalization."
  },
  {
    description: "Correct the code to reverse a string.",
    code: `function reverseString(str) {\n  return str.split("").reverse().join("");\n}\nconsole.log(reverseString("hello"));`,
    solution: "olleh",
    hint: "Check the join() method."
  },
  {
    description: "Fix the logic to count the vowels in a string.",
    code: `function countVowels(str) {\n  const vowels = "aeiou";\n  let count = 0;\n  for (let char of str) {\n    if (vowels.includes(char)) {\n      count += 1;\n    }\n  }\n  return count;\n}\nconsole.log(countVowels("hello"));`,
    solution: 2,
    hint: "Ensure includes() works properly for each character."
  },
  {
    description: "Correct the code to filter even numbers from the array.",
    code: `let numbers = [1, 2, 3, 4, 5, 6];\nlet evens = numbers.filter((n) => n % 2 === 0);\nconsole.log(Evens);`,
    solution: [2, 4, 6],
    hint: "Check the variable capitalization."
  },
  {
    description: "Fix the function to calculate the factorial of a number.",
    code: `function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(5));`,
    solution: 120,
    hint: "Check the base case for recursion."
  },
  {
    description: "Correct the logic to check if a string is a palindrome.",
    code: `function isPalindrome(str) {\n  return str === str.split("").reverse().join("");\n}\nconsole.log(isPalindrome("radar"));`,
    solution: true,
    hint: "Ensure join() works correctly."
  },
  {
    description: "Fix the function to find the sum of an array using reduce().",
    code: `function arraySum(arr) {\n  return arr.reduce((acc, num) => acc + num, 0);\n}\nconsole.log(arraySum([1, 2, 3, 4]));`,
    solution: 10,
    hint: "Check parentheses in reduce()."
  },
  {
    description: "Fix the code to merge and sort two arrays.",
    code: `let arr1 = [3, 1, 4];\nlet arr2 = [2, 5];\nlet merged = arr1.concat(arr2).sort((a, b) => a - b);\nconsole.log(merged);`,
    solution: [1, 2, 3, 4, 5],
    hint: "Check the usage of the sort() method."
  }
];

const ranks = [
  "Code Novice",
  "Syntax Apprentice",
  "Bug Fixer",
  "Logic Solver",
  "Function Wizard",
  "Array Master",
  "Loop Guru",
  "Algorithm Ace",
  "Code Champion",
  "Coding Legend"
];

let currentLevel = 0;
let timerInterval;

// === Initialize CodeMirror Editor ===
const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
  lineNumbers: true,
  mode: "javascript",
  theme: "dracula",
  indentUnit: 2,
  tabSize: 2,
  lineWrapping: true,
});

// === Utility Functions ===

// Start the timer
function startTimer() {
  let seconds = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    timer.textContent = `⏳ ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }, 1000);
}

// Load a level
function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  levelTitle.textContent = `Level ${levelIndex + 1} of ${levels.length}`;
  document.getElementById("challenge-description").textContent = level.description;
  editor.setValue(level.code);
  feedback.textContent = "";
  resultOutput.textContent = "Run the code to see the results!";
  celebration.classList.add("hidden");
  nextButton.style.display = "none";
  startTimer();
}

// Run the user's code
runCodeButton.addEventListener("click", () => {
  const userCode = editor.getValue();
  try {
    const userFunction = new Function(userCode);

    let output;
    console.log = (result) => (output = result);
    userFunction();

    const isArrayEqual = Array.isArray(output) && JSON.stringify(output) === JSON.stringify(levels[currentLevel].solution);
    if (output === levels[currentLevel].solution || isArrayEqual) {
      feedback.textContent = "✅ Correct! Well done!";
      feedback.className = "feedback success";
      celebration.classList.remove("hidden");
      nextButton.style.display = "inline-block";
      rank.textContent = ranks[currentLevel];
      resultOutput.textContent = `Output: ${JSON.stringify(output)}`;
    } else {
      feedback.textContent = "❌ Incorrect. Try again.";
      feedback.className = "feedback error";
      resultOutput.textContent = "😞 Incorrect!";
      nextButton.style.display = "none";
    }
  } catch (error) {
    feedback.textContent = `❌ Error: ${error.message}`;
    feedback.className = "feedback error";
    resultOutput.textContent = "😞 Incorrect!";
    nextButton.style.display = "none";
  }
});

// Show a hint
hintButton.addEventListener("click", () => {
  feedback.textContent = `💡 Hint: ${levels[currentLevel].hint}`;
  feedback.className = "feedback hint";
});

// Proceed to the next level
nextButton.addEventListener("click", () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    loadLevel(currentLevel);
  } else {
    feedback.textContent = "🎉 You completed all levels! You're a Coding Legend!";
    nextButton.style.display = "none";
  }
});

// Toggle Light/Dark Mode
toggleMode.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLightMode = document.body.classList.contains("light-mode");

  // Update the editor theme dynamically
  editor.setOption("theme", isLightMode ? "default" : "dracula");
  toggleMode.textContent = isLightMode ? "🌙 Dark Mode" : "☀️ Light Mode";
});

// === Game Initialization ===
loadLevel(currentLevel);








