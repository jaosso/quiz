$(function () {
  // main function
});

var currentQuestionNumber = 0;
var rightAnswers = 0;
var currentQuestion;

var questions = [
  {
    "id": "1",
    "question": "Wie sieht ein A aus?",
    "answers": {
      "A": "A",
      "B": "B",
      "C": "c",
      "D": "D"
    },
    "right": "A"
  },
  {
    "id": "2",
    "question": "Wie sieht ein B aus?",
    "answers": {
      "A": "A",
      "B": "B",
      "C": "c",
      "D": "D"
    },
    "right": "B"
  }
]

function showNextQuestion() {
  console.log("Loading question: " + currentQuestionNumber);
  currentQuestion = questions[currentQuestionNumber];

  $("#question_nbr").text(currentQuestionNumber + 1);
  $("#question_text").text(currentQuestion.question);
  $("#answer_a").text(currentQuestion.A);
  $("#answer_b").text(currentQuestion.B);
  $("#answer_c").text(currentQuestion.C);
  $("#answer_d").text(currentQuestion.D);
}

function getRightAnswer() {
  return currentQuestion.right;
}