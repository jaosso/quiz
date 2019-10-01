$(function () {
  // main function
});

// variables
var rightAnswer;
var selectedAnswer;
var isAnswerCommited = false;
var idOfRightAnswerButton;

// button click functions
$(".start").click(function () {
  console.log("Start");
  $(".quiz_start").fadeOut(function () {
    startQuiz();
  });
});

$(".answer").click(function () {
  console.log("Answer " + this.id);
  if (!isAnswerCommited) {
    if (selectedAnswer == null) {
      selectAnswer("#" + this.id);
      selectedAnswer = this.id;
      activate("#commit_button");
    } else {
      deselectAnswer("#" + selectedAnswer);
      selectAnswer("#" + this.id);
      selectedAnswer = this.id;
    }
  }
});

$("#commit_button").click(function () {
  console.log("commit");
  if (selectedAnswer != null) {
    $("#continue_button").show();
    deactivate("#commit_button");
    activate("#continue_button");
    isAnswerCommited = true;
    checkAnswer();
    deactivate("commit_button");
    activate("#continue_button");
  }
});

$("#continue_button").click(function () {
  console.log("continue");
  incrementCurrentQuestionNumber();
  setupQuestionScreen();
  if (showNextQuestion()) {
    console.log("show next question");
  } else {
    console.log("show end screen");
    setupEndScreen();
    $(".quiz_question").fadeOut(function () {
      $(".quiz_end").fadeIn();
    });
  }
});

// help functions
function startQuiz() {
  showNextQuestion();
  $(".quiz_question").fadeIn();
}

function selectAnswer(id) {
  $(id).addClass("btn-primary");
  $(id).removeClass("btn-secondary");
}

function deselectAnswer(id) {
  $(id).addClass("btn-secondary");
  $(id).removeClass("btn-primary");
}

function highlightRightAnwser(id) {
  $(id).addClass("btn-success");
  $(id).removeClass("btn-secondary");
}

function hideRightAnswer(id) {
  $(id).addClass("btn-secondary");
  $(id).removeClass("btn-success");
}

function highlightWrongAnswer(id) {
  $(id).addClass("btn-danger");
  $(id).removeClass("btn-secondary");
}

function hideWrongAnswer(id) {
  $(id).addClass("btn-secondary");
  $(id).removeClass("btn-danger");
}

function activate(id) {
  $(id).removeClass("disabled");
  $(id).addClass("enabled");
}

function deactivate(id) {
  $(id).removeClass("enabled");
  $(id).addClass("disabled");
}

function resetQuestionScreen() {
  deselectAnswer("#" + selectedAnswer);
  selectedAnswer = null;
}

function checkAnswer() {
  var rightAnswer = getRightAnswer();
  idOfRightAnswerButton;

  if (rightAnswer == "A") {
    console.log("A is the right answer");
    idOfRightAnswerButton = "answer_a_button";
    deselectAnswer("#answer_a_button");
    highlightRightAnwser("#answer_a_button");
  } else if (rightAnswer == "B") {
    console.log("B is the right answer");
    idOfRightAnswerButton = "answer_b_button";
    deselectAnswer("#answer_b_button");
    highlightRightAnwser("#answer_b_button");
  } else if (rightAnswer == "C") {
    console.log("C is the right answer");
    idOfRightAnswerButton = "answer_c_button";
    deselectAnswer("#answer_c_button");
    highlightRightAnwser("#answer_c_button");
  } else if (rightAnswer == "D") {
    console.log("D is the right answer");
    idOfRightAnswerButton = "answer_d_button";
    deselectAnswer("#answer_d_button");
    highlightRightAnwser("#answer_d_button");
  } else {
    console.log("no correct right answer");
  }

  if (idOfRightAnswerButton != selectedAnswer) {
    console.log("wrong answer");
    deselectAnswer("#" + selectedAnswer);
    highlightWrongAnswer("#" + selectedAnswer);
  } else {
    console.log("right answer");
    incrementRightAnswers();
  }
}

function setupQuestionScreen() {
  hideRightAnswer("#" + idOfRightAnswerButton);
  hideWrongAnswer("#" + selectedAnswer);
  deactivate("#continue_button");
  selectedAnswer = null;
  rightAnswer = null;
  isAnswerCommited = false;
}

function setupEndScreen() {
  $("#endpoints").text(rightAnswers);
  $("#possiblepoints").text(questions.length);
  $("#end_message").text(calculateEndMessage(questions.length, rightAnswers));
}

function calculateEndMessage(totalQuestions = 0, rightAnswers = 0) {
  var hitRate = 0;

  if (totalQuestions != 0) {
    hitRate = rightAnswers / totalQuestions;
  }

  if (hitRate == 1) {
    return "Perfekt! Du hast es echt drauf!";
  } else if (hitRate < 1 && hitRate >= 0.8) {
    return "Du weißt schon eine ganze Menge! Gut gemacht!";
  } else if (hitRate < 0.8 && hitRate >= 0.5) {
    return "Das war garnicht so schlecht!";
  } else if (hitRate < 0.5 && hitRate >= 0.3) {
    return "Du hast zumindest einige Fragen richtig beantwortet."
  } else if (hitRate < 0.3 && hitRate > 0) {
    return "Das üben wir aber noch mal ;)";
  } else if (hitRate == 0) {
    return "Das war leider garnichts..."
  } else {
    return "default";
  }
}
