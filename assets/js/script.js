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
    description: "Fix the function to reverse a string.",
    code: `function reverseString(str) {
  return str.split("").reverse;
}
console.log(reverseString("hello"));`,
    solution: "olleh",
    hint: "Make sure to properly call join() after reverse()."
  },
  {
    description: "Fix the function to find the sum of an array.",
    code: `function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i <= arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
console.log(sumArray([1, 2, 3, 4, 5]));`,
    solution: 15,
    hint: "Check the loop condition (i < arr.length)."
  },
  {
    description: "Fix the function to count unique numbers in an array.",
    code: `function countUniques(arr) {
    const uniques = arr;
    return uniques.size;
  }
  console.log(countUniques([1, 2, 2, 3, 4, 4, 5]));`,
    solution: 5,
    hint: "Replace 'uniques = arr' with 'uniques = new Set(arr)'."
  },
  {
    description: "Fix the function to validate email addresses.",
    code: `function isValidEmail(email) {
  return email.includes("@") && email.includes(".");
}
console.log(isValidEmail("test@example.com"));
console.log(isValidEmail("testexamplecom")); `,
    solution: true,
    hint: "Ensure '@' appears before '.'."
  },
  {
    description: "Fix the logic to find the maximum number.",
    code: `function findMax(numbers) {
    let max = null;
    numbers.forEach((num) => {
      if (num >= max) {
        Max = num;
      }
    });
    return max;
  }
  console.log(findMax([3, 7, 2, 8, 5]));`,
    solution: 8,
    hint: "Check the initialization of max, the comparison operator, and the capitalization of variables."
  },
  
  {
    description: "Fix the function to sort words by length in descending order.",
    code: `function sortWords(words) {
    words.sort((a, b) => b.length > a.length);
    words = words.reverse();
    return words.join();
  }
  console.log(sortWords(["apple", "banana", "pear", "fig"]));`,
    solution: ["banana", "apple", "pear", "fig"],
    hint: "Fix the comparison logic in sort() and ensure the return value is a properly sorted array."
  },
  {
    description: "Fix the function to merge and sort two arrays. Ensure the result removes duplicates, maintains sorting order, and handles edge cases.",
    code: `function mergeSorted(arr1, arr2) {
    return arr1.concat(arr2).sort();
  }
  console.log(mergeSorted([3, 1, 4], [2, 5]));
  console.log(mergeSorted([3, 3, 4], [4, 4, 5]));
  console.log(mergeSorted([], []));`,
    solution: [1, 2, 3, 4, 5],
    hint: "Check for duplicate elements and ensure the sort handles numbers correctly."
  },
  
  {
    description: "Fix the function to check if two strings are anagrams of each other.",
    code: `function areAnagrams(str1, str2) {
      let cleanStr1 = str1.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      let cleanStr2 = str2.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      return cleanStr1.split("").sort() === cleanStr2.split("").sort();
    }
    console.log(areAnagrams("listen", "silent")); // true
    console.log(areAnagrams("hello", "world")); // false`,
    solution: true,
    hint: "Clean the strings by removing non-alphanumeric characters, convert to lowercase, and sort the characters before comparison."
  },
  
  
  
  
  {
    description: "Fix the function to calculate the factorial of a number. Ensure it handles negative inputs and large numbers correctly.",
    code: `function factorial(n) {
    if (n === 0) return 1; // Doesn't handle negative inputs
    return n * factorial(n - 1; // Missing closing parenthesis
  }
  console.log(factorial(5)); // Should return 120
  console.log(factorial(-1)); // Should return "Invalid input"
  console.log(factorial(21)); // Should handle large numbers without crashing`,
    solution: 120,
    hint: "Handle negative numbers, fix the syntax error, and prevent stack overflow for large numbers."
  },
  
  {
    description: "Fix the function to find the intersection of two arrays. Ensure it handles nested arrays, large inputs efficiently, and duplicate items.",
    code: `function findIntersection(arr1, arr2) {
    return arr1.filter((item) => arr2.includes(item));
  }
  console.log(findIntersection([1, 2, [3, 4]], [[3, 4], 5]));
  console.log(findIntersection([1, 2, 2, 3], [2, 3, 3, 4]));
  console.log(findIntersection(new Array(1e5).fill(1), new Array(1e5).fill(1)));`,
    solution: [[3, 4], 2, 3],
    hint: "Consider deep equality for nested arrays, eliminate duplicates, and optimize for large inputs."
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









