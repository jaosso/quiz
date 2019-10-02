var s, Quiz = {

  "settings": {
    // gui screens
    start_screen: $(".quiz_start"),
    question_screen: $(".quiz_question"),
    end_screen: $(".quiz_end"),
    // gui objects
    start_btn: $(".start"),
    answer_btns: $("#answer"),
    answer_a_btn: $("#answer_a"),
    answer_b_btn: $("#answer_b"),
    answer_c_btn: $("#answer_c"),
    answer_d_btn: $("#answer_d"),
    commit_btn: $("#commit_button"),
    continue_btn: $("#continue_button"),
    question_nbr_text: $("#question_nbr"),
    question_text: $("#question_text"),
    endpoints_text: $("#endpoints"),
    possiblepoints_text: $("#possiblepoints"),
    endmessage_text: $("#endmessage"),
    // variables
    questions: fetch("/questions/questions.json").then(function (resp) {
      return resp.json();
    }),
    isAnswerCommited = false,
    selectedAnswer = null,
    numCurrentQuestion: 0,
    numCorrectGivenAnswers: 0,
    currentQuestion: {
      "id": "",
      "question": "",
      "answers": {
        "A": "",
        "B": "",
        "C": "",
        "D": ""
      },
      "right": ""
    }
  },

  init: function () {
    s = this.settings;
    this.bindUIanctions();
  },

  bindUIanctions: function () {
    s.start_btn.on("click", function () {
      $s.start_screen.fadeOut(function () {
        startQuiz();
      });
    });

    s.answer_btns.on("click", function () {
      if (!s.isAnswerCommited) {
        if (s.selectedAnswer == null) {
          selectAnswer("#" + this.id);
          s.selectedAnswer = this.id;
          activate("#commit_button");
        } else {
          deselectAnswer("#" + s.selectedAnswer);
          selectAnswer("#" + this.id);
          s.selectedAnswer = this.id;
        }
      }
    });

    s.commit_btn.on("click", function () {
      if (selectedAnswer != null) {
        isAnswerCommited = true;
        deactivate("#commit_button");
        activate("#continue_button");
        checkAnswer();
        deactivate("commit_button");
        activate("#continue_button");
      }
    });

    s.continue_btn.on("click", function () {
      incrementCurrentQuestionNumber();
      setupQuestionScreen();
      if (!showNextQuestion()) {
        setupEndScreen();
        s.question_screen.fadeOut(function () {
          s.end_screen.fadeIn();
        });
      }
    });
  },

  showNextQuestion: function () {
    if (currentQuestionNumber < questions.length) {
      s.currentQuestion = s.questions[currentQuestionNumber];

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

};

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