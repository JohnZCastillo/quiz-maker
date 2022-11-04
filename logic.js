let file = null;
const output = document.querySelector("#output");
const next = document.querySelector("#next");
const prev = document.querySelector("#previous");
const subjectDisplay = document.querySelector("#subject");

const answer = document.querySelector("#answer");
const itect85 = document.querySelector("#itec85");
const itect90 = document.querySelector("#itec90");
const dcit26 = document.querySelector("#dcit26");
const insy55 = document.querySelector("#insy55");
const questionNumberDisplay = document.querySelector("#question-number");

let subject = null;

let viewedQuestion = [];

let questionNumber = 0;
let currentQuestion = null;
// ignore
let counter = 0;
const tempQuestionDisplay = document.createElement("div");
tempQuestionDisplay.classList.add("h3");
let data = null;
let exam = [];
const type = {
  fill: 0,
  multiple: 1,
};

const changeFile = async (fileName) => {
  try {
    viewedQuestion = [];
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
  if (!counter) {
    output.innerHTML = currentQuestion.choice[0];
    counter = 1;
  } else {
    tempQuestionDisplay.innerHTML = currentQuestion.question;
    output.innerHTML = "";
    output.appendChild(tempQuestionDisplay);
    counter = 0;
  }
});

const shuffle = () => {
  const random = () => Math.floor(Math.random() * exam.length);
};

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

const random = () => Math.floor(Math.random() * exam.length);

// render questions as html
const renderOutput = () => {
  let index = random();

  if (currentIndex < viewedQuestion.length) {
    index = viewedQuestion[currentIndex];
    console.log("backtacking");
  } else {
    while (viewedQuestion.includes(index)) {
      index = random();
    }
    viewedQuestion.push(index);
  }

  output.innerHTML = null;

  const div = document.createElement("div");
  const h3 = document.createElement("h3");

  h3.innerHTML = exam[index].question;

  currentQuestion = exam[index];

  div.appendChild(h3);

  output.appendChild(div);
};

const readFile = () => {
  //reset exam
  exam = [];
  data = file.split("");
  showQuestion();
  subjectDisplay.innerHTML = subject;
};

let currentIndex = 0;

prev.addEventListener("click", () => {
  // return if exam is empty
  if (!exam.length || !currentIndex || currentIndex === 1) return;

  questionNumberDisplay.innerHTML = currentIndex - 1 + "/" + exam.length;

  --currentIndex;

  const render = () => {
    output.innerHTML = null;

    const div = document.createElement("div");
    const h3 = document.createElement("h3");

    let index = viewedQuestion[currentIndex - 1];

    h3.innerHTML = exam[index].question;

    currentQuestion = exam[index];

    div.appendChild(h3);

    output.appendChild(div);
  };

  render();
});

next.addEventListener("click", () => {
  // return if exam is empty
  if (!exam.length) return;

  ++currentIndex;

  questionNumberDisplay.innerHTML = currentIndex + "/" + exam.length;
  renderOutput();
});
