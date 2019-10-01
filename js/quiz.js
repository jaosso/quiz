$(function () {
  // main function
});

var currentQuestionNumber = 0;
var rightAnswers = 0;
var currentQuestion;

function showNextQuestion() {
  if (currentQuestionNumber < questions.length) {
    console.log("Loading question: " + currentQuestionNumber);
    currentQuestion = questions[currentQuestionNumber];

    $("#question_nbr").text(currentQuestionNumber + 1);
    $("#question_text").text(currentQuestion.question);
    $("#answer_a").text(currentQuestion.answers.A);
    $("#answer_b").text(currentQuestion.answers.B);
    $("#answer_c").text(currentQuestion.answers.C);
    $("#answer_d").text(currentQuestion.answers.D);

    return true;
  } else {
    console.log("no more questions");
    return false;
  }
}

function getRightAnswer() {
  return currentQuestion.right;
}

function incrementCurrentQuestionNumber() {
  currentQuestionNumber = currentQuestionNumber + 1;
}

function incrementRightAnswers() {
  rightAnswers = rightAnswers + 1;
}