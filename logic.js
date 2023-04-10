let file = null;
const output = document.querySelector("#output");
const next = document.querySelector("#next");
const prev = document.querySelector("#previous");
const subjectDisplay = document.querySelector("#subject");

const answer = document.querySelector("#show-answer");
const itect80 = document.querySelector("#itec80");
const itect85 = document.querySelector("#itec85");
const itect90 = document.querySelector("#itec90");
const dcit26 = document.querySelector("#dcit26");
const insy55 = document.querySelector("#insy55");
const questionNumberDisplay = document.querySelector("#question-number");

const questionDisplay = document.querySelector("#question");
const answerDisplay = document.querySelector("#answer");

let currentIndex = -1;
let subject = null;
let currentQuestion = null;

// ignore
let showAnswer = true;

// data from text file || raw data
let data = null;

// data been converted to question and answer
let exam = [];

const settings = {
  question: '+',
  answer: "-"
}

const type = {
  fill: 0,
  multiple: 1,
};

const changeFile = async (fileName) => {
  try {
    file = await fetch(fileName);
    file = await file.text();
    readFile();
  } catch (error) {
    console.log(error.message);
  }
};

itect80.addEventListener("click", () => {
  changeFile("itec80.txt");
  subject = "itec 80";
});

itect85.addEventListener("click", () => {
  changeFile("itec85.txt");
  subject = "itec 85";
});

itect90.addEventListener("click", () => {
  changeFile("itec90.txt");
  subject = "itec 90";
});

dcit26.addEventListener("click", () => {
  changeFile("dicit26.txt");
  subject = "dicit 26";
});

insy55.addEventListener("click", () => {
  changeFile("ins55.txt");
  subject = "insy 55";
});

answer.addEventListener("click", () => {
  // return if exam is not loaded
  if (exam.length <= 0) return;

  // show answer
  if (showAnswer) {
    questionDisplay.classList.add("d-none");
    answerDisplay.classList.remove("d-none");
    answer.innerHTML = "Question";
    showAnswer = false;
    return;
  }

  answer.innerHTML = "Answer";
  questionDisplay.classList.remove("d-none");
  answerDisplay.classList.add("d-none");
  showAnswer = true;
});

// Model for question
const generateQuestion = (type, question) => {
  return {
    type: type,
    question: question,
    answer: "",
    choice: [],
  };
};

const processQuestion = (data)=>{

  // remove new line from string
  data = data.replace('\n','');

  //split every question
  let questions = data.split(settings.question);

  //remove the first element from array since the split method creates an empty string 
  // on the beggining of the array
  questions.shift();

  //process separate question and answer for every number
  questions.forEach(question => {

    let answer = question.split(settings.answer);
    let quiz = generateQuestion(type.multiple,[]);
    quiz.question = question.substring(0,question.indexOf(settings.answer));
    quiz.answer = answer[1];

    exam.push(quiz)
  });

}

const shuffleArray = () => {
  const usedIndex = [];
  let index = random();

  while (usedIndex.length < exam.length) {
    while (usedIndex.includes(index)) {
      index = random();
    }

    usedIndex.push(index);
  }

  let temp = null;

  for (let i = 0; i < usedIndex.length; i++) {
    const insertValue = exam[usedIndex[i]];

    temp = exam[i];

    exam[i] = insertValue;

    exam[usedIndex[i]] = temp;
  }
};

const random = () => Math.floor(Math.random() * exam.length);

// render questions as html
const renderOutput = () => {
  questionDisplay.innerHTML = exam[currentIndex].question;

  let questionHolder = "";

  // loop throught the choices
  exam[currentIndex].choice.forEach((tempQuestion) => {
    questionHolder += tempQuestion + "<br>";
  });

  //display choices
  answerDisplay.innerHTML =  exam[currentIndex].answer;
};

const readFile = () => {
  //reset exam
  exam = [];
  // data = file.split("");
  // get question and answer
  // showQuestion();
  // shuffle index of exam || disabled shuffle
  // shuffleArray();
  // displat the current subect

  processQuestion(file.toString());
  // processJson('test.json');
  subjectDisplay.innerHTML = subject;

  currentIndex = -1;
};

prev.addEventListener("click", () => {
  // return if exam is empty
  if (!exam.length || currentIndex === 0) return;

  currentIndex -= 1;

  questionNumberDisplay.innerHTML = currentIndex + 1 + "/" + exam.length;
  renderOutput();
});

next.addEventListener("click", () => {
  // return if exam is empty
  if (!exam.length) return;

  // do not execute if last question is reach
  if (currentIndex === exam.length - 1) return;

  currentIndex++;

  console.log(currentIndex);

  questionNumberDisplay.innerHTML = currentIndex + 1 + "/" + exam.length;

  renderOutput();
});