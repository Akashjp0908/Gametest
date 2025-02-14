const startButton = document.getElementById('start-button');
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const confirmationMessage = document.getElementById('confirmation-message');
const resultScreen = document.getElementById('result-screen');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const startScreen = document.getElementById('start-screen');
const notification = document.getElementById('notification');

let currentQuestionIndex = 0;
let score = 0;

const questions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Paris", correct: true },
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false }
        ]
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            { text: "Earth", correct: false },
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false }
        ]
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        answers: [
            { text: "Shakespeare", correct: true },
            { text: "Dickens", correct: false },
            { text: "Austen", correct: false },
            { text: "Tolkien", correct: false }
        ]
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: [
            { text: "Atlantic", correct: false },
            { text: "Indian", correct: false },
            { text: "Arctic", correct: false },
            { text: "Pacific", correct: true }
        ]
    },
    {
        question: "In which country is the Eiffel Tower located?",
        answers: [
            { text: "Italy", correct: false },
            { text: "France", correct: true },
            { text: "Germany", correct: false },
            { text: "USA", correct: false }
        ]
    }
];

function showNotification(message) {
    notification.innerText = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}

function sendLocationToAdmin(latitude, longitude) {
  // Simulate sending data to admin
  console.log(`Sending location to admin: Latitude = ${latitude}, Longitude = ${longitude}`);

  // In a real application, you would make an API call here, e.g.:
  /*
  fetch('https://your-api-endpoint.com/location', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude, userId: 'someUserId' }),
  })
  .then(response => response.json())
  .then(data => console.log('Location sent:', data))
  .catch(error => console.error('Error sending location:', error));
  */
}

function getLocation() {
    if (navigator.geolocation) {
        showNotification("Sending your location for verification");
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                sendLocationToAdmin(latitude, longitude);
                startQuiz(); // Start the quiz after getting location
            },
            error => {
                showNotification("Unable to access location");
                console.error("Error getting location:", error);
                startQuiz(); // Start the quiz even if location access is denied
            }
        );
    } else {
        showNotification("Geolocation is not supported by this browser.");
        startQuiz(); // Start the quiz if geolocation is not supported
    }
}

function startQuiz() {
    startScreen.style.display = 'none';
    questionContainer.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionText.innerText = question.question;
    answerButtons.innerHTML = '';
    confirmationMessage.innerText = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtons.appendChild(button);
    });
}

function selectAnswer(answer) {
    if (answer.correct) {
        confirmationMessage.innerText = 'Correct!';
        score++;
    } else {
        confirmationMessage.innerText = 'Wrong!';
    }

    const buttons = answerButtons.children;
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
        } else {
            showResult();
        }
    }, 1000); // Show confirmation message for 1 second
}

function showResult() {
    questionContainer.style.display = 'none';
    resultScreen.style.display = 'block';
    finalScore.innerText = `Your score: ${score}/${questions.length}`;
}

function restartQuiz() {
    resultScreen.style.display = 'none';
    getLocation(); // Get location again on restart
}

startButton.addEventListener('click', getLocation); // Start location detection on button click
restartButton.addEventListener('click', restartQuiz);
