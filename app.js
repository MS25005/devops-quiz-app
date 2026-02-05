let questions = [];
let currentIndex = 0;
let currentTopic = "";
let answered = false;

const topicSelect = document.getElementById("topicSelect");
const quizDiv = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

fetch("data/questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadTopics();
  })
  .catch(err => console.error("Failed to load questions:", err));

function loadTopics() {
  const topics = [...new Set(questions.map(q => q.topic))];
  topics.forEach(topic => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicSelect.appendChild(option);
  });
}

topicSelect.addEventListener("change", () => {
  currentTopic = topicSelect.value;
  currentIndex = 0;
  answered = false;

  if (!currentTopic) {
    quizDiv.classList.add("hidden");
    return;
  }

  quizDiv.classList.remove("hidden");
  showQuestion();
});

function showQuestion() {
  const topicQuestions = questions.filter(q => q.topic === currentTopic);
  const q = topicQuestions[currentIndex];

  answered = false;
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "";
  nextBtn.classList.add("hidden");

  q.options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.addEventListener("click", () => checkAnswer(index, q, li));
    optionsEl.appendChild(li);
  });
}

function checkAnswer(selectedIndex, question, selectedEl) {
  if (answered) return;
  answered = true;

  const options = optionsEl.querySelectorAll("li");

  options.forEach((li, index) => {
    li.classList.add("disabled");
    if (index === question.answerIndex) {
      li.classList.add("correct");
    }
  });

  if (selectedIndex === question.answerIndex) {
    feedbackEl.textContent = "Correct! " + question.explanation;
    feedbackEl.className = "correct";
  } else {
    selectedEl.classList.add("incorrect");
    feedbackEl.textContent = "Incorrect. " + question.explanation;
    feedbackEl.className = "incorrect";
  }

  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  const topicQuestions = questions.filter(q => q.topic === currentTopic);
  currentIndex++;

  if (currentIndex < topicQuestions.length) {
    showQuestion();
  } else {
    questionEl.textContent = "🎉 Quiz complete!";
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";
    nextBtn.classList.add("hidden");
  }
});
