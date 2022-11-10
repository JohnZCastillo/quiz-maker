let file = null;
const output = document.querySelector("#output");
const next = document.querySelector("#next");
const prev = document.querySelector("#previous");
const subjectDisplay = document.querySelector("#subject");

const answer = document.querySelector("#show-answer");
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
let autoStatus = false;

// data from text file || raw data
let data = null;

// data been converted to question and answer
let exam = [];

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

itect85.addEventListener("click", () => {
  changeFile("itec85.txt");
  subject = "itec 85";
});

itect90.addEventListener("click", () => {
  changeFile("itec90.txt");
  subject = "itec 90";
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

// get text from file
const getSentence = (start, condition) => {
  for (let index = start; index < data.length; index++) {
    if (data[index] === condition) {
      // temporary holder for question
      let tempQuestion = "";

      //   get all the letters of the sentence of the question
      while (data[index] !== "\n") {
        // to remove + from the beginning
        index++;

        tempQuestion += data[index];
      }

      return {
        index: ++index,
        sentence: tempQuestion.trim(),
      };
    }
  }
};

// return array of choices
const getChoices = (start, condition) => {
  const questions = [];

  for (let index = start; index < data.length && data[index] !== "+"; index++) {
    if (data[index] === condition) {
      // temporary holder for question
      let tempQuestion = "";

      //   get all the letters of the sentence of the question
      while (data[index] !== "\n") {
        // to remove + from the beginning
        index++;

        tempQuestion += data[index];
      }

      questions.push(tempQuestion.trim());
    }
  }
  return questions;
};

// return question
const showQuestion = () => {
  for (let index = 0; index < data.length; index++) {
    if (data[index] === "+") {
      // get question
      const value = getSentence(index, "+");

      // update index
      index = value.index;

      //full question
      const question = generateQuestion(type.multiple, value.sentence);

      switch (data[index]) {
        case "_":
          //get choices
          question.choice = getChoices(index, "_");
          question.type = type.multiple;
          break;
        case "-":
          //get choices
          question.choice = getChoices(index, "-");
          question.type = type.fill;
          break;
        default:
          console.log("Error", data[index]);
          let value = index;

          console.log(data[value - 10]);
          console.log(data[value - 9]);
          console.log(data[value - 8]);
          console.log(data[value - 7]);
          console.log(data[value - 6]);
          console.log(data[value - 5]);
          console.log(data[value - 4]);
          console.log(data[value - 3]);
          console.log(data[value - 2]);
          console.log(data[value - 1]);
          console.log(value);
          console.log(data[value]);
          console.log(data[value + 1]);
          console.log(data[value + 2]);
          console.log(data[value + 3]);
          console.log(data[value + 4]);
          console.log(data[value + 5]);
          console.log(data[value + 6]);
          console.log(data[value + 7]);
      }

      exam.push(question);
    }
  }
};

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
  answerDisplay.innerHTML = exam[currentIndex].choice[0];
};

const readFile = () => {
  //reset exam
  exam = [];
  data = file.split("");
  // get question and answer
  showQuestion();
  // shuffle index of exam
  shuffleArray();
  // displat the current subect
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
  if (currentIndex === exam.length) return;

  currentIndex++;

  console.log(currentIndex);

  questionNumberDisplay.innerHTML = currentIndex + 1 + "/" + exam.length;

  renderOutput();
});
