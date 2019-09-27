$(function () {
  // main function
});

$(".start").click(function () {
  console.log("Start")
  $(".quiz_start").fadeOut(function () {
    startQuiz();
  });
});

function startQuiz() {
  showNextQuestion();
  $(".quiz_question").fadeIn();
}