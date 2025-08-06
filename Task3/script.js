const questions = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language"],
        answer: 0
    },
    {
        question: "Which programming language is used for styling web pages?",
        options: ["HTML", "CSS", "Python"],
        answer: 1
    },
    {
        question: "What does JS stand for?",
        options: ["JavaScript", "JavaSource", "JustScript"],
        answer: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;

function showQuestion() {
    const questionElement = document.getElementById("question");
    const optionsContainer = document.getElementById("options");

    questionElement.textContent = questions[currentQuestionIndex].question;
    optionsContainer.innerHTML = "";

    questions[currentQuestionIndex].options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selected) {
    if (selected === questions[currentQuestionIndex].answer) {
        score++;
    }
    document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
        document.getElementById("next-btn").style.display = "none";
    } else {
        document.getElementById("question-container").innerHTML = "<h2>Quiz Finished!</h2>";
        document.getElementById("score").textContent = `Your Score: ${score}/${questions.length}`;
        document.getElementById("next-btn").style.display = "none";
    }
}

window.onload = () => {
    showQuestion();
    document.getElementById("next-btn").style.display = "none";
};
