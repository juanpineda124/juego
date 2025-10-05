let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";

const questions = {
  1: [
    { question: "Which insect is this? 🐝", options: ["Bee", "Mosquito", "Ant"], answer: "Bee" },
    { question: "Which insect is this? 🦋", options: ["Butterfly", "Spider", "Beetle"], answer: "Butterfly" }
  ],
  2: [
    { question: "What is the function of the bee?", options: ["Predator", "Pollinator", "Decomposer"], answer: "Pollinator" },
    { question: "What is the function of the ant?", options: ["Decomposer", "Hunter", "Pollinator"], answer: "Decomposer" }
  ],
  3: [
    { question: "How does the butterfly defend itself?", options: ["Stings the enemy", "Camouflages or looks bigger", "Makes loud noise"], answer: "Camouflages or looks bigger" },
    { question: "How does the ladybug defend itself?", options: ["Releases a liquid", "Flies very fast", "Stings"], answer: "Releases a liquid" }
  ]
};

function startGame() {
  const nameInput = document.getElementById("player-name").value.trim();
  if (nameInput === "") {
    alert("Please enter your name before starting.");
    return;
  }
  playerName = nameInput;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  const currentQuestions = questions[currentLevel];
  const q = currentQuestions[currentQuestionIndex];

  document.getElementById("question").innerText = q.question;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("result").innerText = "";
  document.getElementById("next-btn").style.display = "none";
}

function checkAnswer(selected) {
  const correct = questions[currentLevel][currentQuestionIndex].answer;
  const result = document.getElementById("result");

  if (selected === correct) {
    result.innerText = "✅ Correct!";
    score++;
  } else {
    result.innerText = "❌ Incorrect. The correct answer was: " + correct;
  }

  document.querySelectorAll(".option").forEach(btn => btn.disabled = true);
  document.getElementById("next-btn").style.display = "inline-block";
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions[currentLevel].length) {
    currentQuestionIndex = 0;
    currentLevel++;
    if (currentLevel > 3) {
      showFinalScore();
      return;
    }
    alert(`🎉 Level ${currentLevel} unlocked!`);
  }
  loadQuestion();
}

function showFinalScore() {
  document.getElementById("game-container").innerHTML = `
    <div id="certificate" style="
      width: 7.5in;
      max-width: 10.5in;
      margin: auto;
      padding: 0.7in 0.5in;
      background: white;
      border: 2px solid #4CAF50;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
      text-align: center;
    ">
      <h2 style="font-size: 24px;">🎓 Certificate of Achievement</h2>
      <p style="font-size: 16px;">This certifies that</p>
      <h1 style="font-size: 24px; margin: 10px 0;">${playerName}</h1>
      <p style="font-size: 16px;">has successfully completed the game</p>
      <h3 style="font-size: 20px;">🐞 Insect World Explorers 🦋</h3>
      <p style="font-size: 16px;">With a score of <strong>${score} out of 6</strong></p>
      <p style="margin-top: 20px; font-size: 14px;">🗓️ Date: ${new Date().toLocaleDateString()}</p>

      <!-- Botones visibles solo en pantalla -->
      <div id="certificate-buttons">
        <button onclick="downloadCertificate()" style="margin-top: 30px;">📄 Download Certificate (PDF)</button>
        <br><br>
        <button onclick="restartGame()">🔁 Play Again</button>
      </div>
    </div>
  `;
}




function restartGame() {
  currentLevel = 1;
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("game-container").innerHTML = `
    <div id="question"></div>
    <div id="options"></div>
    <button id="next-btn" onclick="nextQuestion()">Next</button>
    <div id="result"></div>
  `;
  loadQuestion();
}

function downloadCertificate() {
  const certificate = document.getElementById("certificate");
  const buttons = document.getElementById("certificate-buttons");

  // Ocultar botones antes de exportar
  buttons.style.display = "none";

  const opt = {
    margin: [0.25, 0.25, 0.25, 0.25], // top, left, bottom, right
    filename: `certificate-${playerName}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  // Generar y luego volver a mostrar los botones
  html2pdf().set(opt).from(certificate).save().then(() => {
    buttons.style.display = "block";
  });
}

