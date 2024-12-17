const countries = [
    { country: "Afghanistan", capital: "Kabul", fact: "Kabul is one of the oldest cities in the world!" },
    { country: "Albania", capital: "Tirana", fact: "Albania has over 750,000 bunkers built during its communist era." },
    { country: "Algeria", capital: "Algiers", fact: "Algeria is the largest country in Africa by area." },
    { country: "Argentina", capital: "Buenos Aires", fact: "Argentina was the first country to broadcast a radio program!" },
    { country: "Australia", capital: "Canberra", fact: "Canberra means 'meeting place' in the local Aboriginal language." },
    { country: "Bangladesh", capital: "Dhaka", fact: "Bangladesh is home to the Sundarbans, the largest mangrove forest in the world." },
    { country: "Brazil", capital: "Brasília", fact: "Brasília was built in just 41 months to replace Rio de Janeiro as Brazil's capital." },
    { country: "Canada", capital: "Ottawa", fact: "Canada has the longest coastline of any country in the world." },
    { country: "China", capital: "Beijing", fact: "The Great Wall of China is over 13,000 miles long!" },
    { country: "Denmark", capital: "Copenhagen", fact: "Copenhagen is known as the 'City of Cyclists' due to its bike-friendly infrastructure." },
    { country: "Egypt", capital: "Cairo", fact: "Cairo is home to the Great Pyramid of Giza, the last surviving ancient wonder." },
    { country: "France", capital: "Paris", fact: "The Eiffel Tower was initially criticized and considered an eyesore by many Parisians." },
    { country: "Germany", capital: "Berlin", fact: "Berlin has more bridges than Venice!" },
    { country: "India", capital: "New Delhi", fact: "India is the world's largest democracy." },
    { country: "Italy", capital: "Rome", fact: "Rome is home to the Vatican City, the smallest country in the world." },
    { country: "Japan", capital: "Tokyo", fact: "Tokyo is the most populous metropolitan area in the world." },
    { country: "Kenya", capital: "Nairobi", fact: "Kenya is known as the 'Cradle of Mankind' due to early human fossils found there." },
    { country: "Mexico", capital: "Mexico City", fact: "Mexico City was built on the site of the ancient Aztec city of Tenochtitlán." },
    { country: "Nepal", capital: "Kathmandu", fact: "Nepal is home to Mount Everest, the highest point on Earth." },
    { country: "Norway", capital: "Oslo", fact: "Norway is known for its stunning fjords and northern lights." },
    { country: "Pakistan", capital: "Islamabad", fact: "Pakistan is home to K2, the second-highest mountain in the world." },
    { country: "Russia", capital: "Moscow", fact: "Russia is the largest country in the world by land area." },
    { country: "South Africa", capital: "Pretoria", fact: "South Africa has three capitals: Pretoria, Cape Town, and Bloemfontein." },
    { country: "Spain", capital: "Madrid", fact: "Madrid is home to the world's oldest operating restaurant, Sobrino de Botín." },
    { country: "United Kingdom", capital: "London", fact: "Big Ben is actually the name of the bell, not the clock tower." },
    { country: "United States", capital: "Washington, D.C.", fact: "The U.S. Capitol has its own subway system." },
    { country: "Zimbabwe", capital: "Harare", fact: "Zimbabwe is home to the famous Victoria Falls." },
    { country: "Bhutan", capital: "Thimphu", fact: "Bhutan is the only carbon-negative country in the world!" },
    { country: "Cuba", capital: "Havana", fact: "Havana is famous for its classic 1950s American cars." },
    { country: "Ethiopia", capital: "Addis Ababa", fact: "Ethiopia is the birthplace of coffee." },
    { country: "Iceland", capital: "Reykjavik", fact: "Iceland runs almost entirely on renewable energy." }
];


let currentQuestion, score, streak, questionIndex;
const maxQuestions = 10;

// DOM Elements
const countryElement = document.getElementById("country");
const options = document.querySelectorAll(".option");
const scoreElement = document.getElementById("score");
const streakElement = document.getElementById("streak");
const timerElement = document.getElementById("time");
const progressBar = document.getElementById("progress-bar");
const questionNumberElement = document.getElementById("current-question");
const factElement = document.getElementById("fact");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-game");
const quizSection = document.getElementById("quiz-section");
const welcomeSection = document.getElementById("welcome-section");

let timer, timeLeft;

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", loadNextQuestion);

function startGame() {
    resetGame();
    loadNextQuestion();
    welcomeSection.style.display = "none";
    quizSection.style.display = "block";
}

function resetGame() {
    score = 0;
    streak = 0;
    questionIndex = 0;
    scoreElement.textContent = score;
    streakElement.textContent = streak;
    progressBar.max = maxQuestions; // Set the max value of progress bar
    progressBar.value = 0; // Reset progress bar
    factElement.style.display = "none";
    nextButton.style.display = "none";
}

function loadNextQuestion() {
    if (questionIndex >= maxQuestions) {
        endGame();
        return;
    }

    resetTimer();
    factElement.style.display = "none"; // Hide the fact section until answered

    // Pick a random question
    currentQuestion = countries[Math.floor(Math.random() * countries.length)];
    countryElement.textContent = currentQuestion.country;

    // Shuffle options and update buttons
    const allOptions = shuffle([currentQuestion.capital, ...getRandomWrongAnswers()]);
    options.forEach((button, index) => {
        button.textContent = allOptions[index];
        button.className = "option"; // Reset button styling
        button.disabled = false;
        button.onclick = () => checkAnswer(button, allOptions[index]);
    });

    // Update question index and progress bar
    questionIndex++;
    questionNumberElement.textContent = questionIndex;
    progressBar.value = questionIndex;
}

function checkAnswer(button, selectedAnswer) {
    clearInterval(timer);
    const isCorrect = selectedAnswer === currentQuestion.capital;

    if (isCorrect) {
        button.classList.add("correct");
        score += 10;
        streak++;
    } else {
        button.classList.add("incorrect");
        streak = 0;

        // Highlight the correct answer
        options.forEach(btn => {
            if (btn.textContent === currentQuestion.capital) btn.classList.add("correct");
        });
    }

    // Update score, streak, and display the fact
    scoreElement.textContent = score;
    streakElement.textContent = streak;
    factElement.textContent = `Fun Fact: ${currentQuestion.fact}`;
    factElement.style.display = "block";

    nextButton.style.display = "inline-block";

    // Disable all buttons after answering
    options.forEach(btn => (btn.disabled = true));
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 10;
    timerElement.textContent = `${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            autoMarkIncorrect();
        }
    }, 1000);
}

function autoMarkIncorrect() {
    options.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === currentQuestion.capital) btn.classList.add("correct");
    });
    nextButton.style.display = "inline-block";
    factElement.textContent = `Fun Fact: ${currentQuestion.fact}`;
    factElement.style.display = "block";
}

function endGame() {
    clearInterval(timer);
    alert(`Game Over! Your final score is ${score}.`);
    quizSection.style.display = "none";
    welcomeSection.style.display = "block";
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function getRandomWrongAnswers() {
    return countries
        .map(item => item.capital)
        .filter(cap => cap !== currentQuestion.capital)
        .slice(0, 3);
}