let questions = [];
let currentIndex = 0;
let currentTopic = "";

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
  });

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
  quizDiv.classList.remove("hidden");
  showQuestion();
});

function showQuestion() {
  const topicQuestions = questions.filter(q => q.topic === currentTopic);
  const q = topicQuestions[currentIndex];

  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  nextBtn.classList.add("hidden");

  q.options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.onclick = () => checkAnswer(index, q);
    optionsEl.appendChild(li);
  });
}

function checkAnswer(selectedIndex, question) {
  if (selectedIndex === question.answerIndex) {
    feedbackEl.textContent = "Correct! " + question.explanation;
    feedbackEl.className = "correct";
  } else {
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
    questionEl.textContent = "Quiz complete!";
    optionsEl.innerHTML = "";
    nextBtn.classList.add("hidden");
  }
});
