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
    questions: null,
    isAnswerCommited: false,
    selectedAnswer: null,
    numCurrentQuestion: 0,
    numCorrectGivenAnswers: 0,
    rightAnswerButton: null,
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

  // --- this is the only function that should be executed by an script ---
  init: function () {
    s = this.settings;
    this.bindUIanctions();

    // fetch json file, with the questions
    fetch("/questions/questions.json").then(resp => {
      if (!resp.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return resp.json();
    }).then(json => {
      s.questions = json;
    });
  },

  // --- functions for intern use ---

  bindUIanctions: function () {
    s.start_btn.on("click", function () {
      s.start_screen.fadeOut(function () {
        Quiz.startQuiz();
      });
    });

    s.answer_btns.on("click", function () {
      console.log("hi");
      if (!s.isAnswerCommited) {
        if (s.selectedAnswer == null) {
          this.selectAnswer(this);
          s.selectedAnswer = this;
          this.activate(s.commit_btn);
        } else {
          console.log("hi");
          Quiz.deselectAnswer(s.selectedAnswer);
          Quiz.selectAnswer(this);
          s.selectedAnswer = this;
        }
      }
    });

    s.commit_btn.on("click", function () {
      if (selectedAnswer != null) {
        isAnswerCommited = true;
        this.deactivate(s.commit_btn);
        this.activate(s.continue_btn);
        this.checkAnswer();
        this.deactivate(s.commit_btn);
        this.activate(s.continue_btn);
      }
    });

    s.continue_btn.on("click", function () {
      this.incrementCurrentQuestionNumber();
      this.setupQuestionScreen();
      if (!showNextQuestion()) {
        this.setupEndScreen();
        s.question_screen.fadeOut(function () {
          s.end_screen.fadeIn();
        });
      }
    });
  },

  showNextQuestion: function () {
    if (s.numCurrentQuestion < s.questions.length) {
      s.currentQuestion = s.questions[s.numCurrentQuestion];

      s.question_nbr_text.text(s.numCurrentQuestion + 1);
      s.question_text.text(s.currentQuestion.question);
      s.answer_a_btn.text(s.currentQuestion.answers.A);
      s.answer_b_btn.text(s.currentQuestion.answers.B);
      s.answer_c_btn.text(s.currentQuestion.answers.C);
      s.answer_d_btn.text(s.currentQuestion.answers.D);

      return true;
    } else {
      return false;
    }
  },

  getRightAnswer: function () {
    return s.currentQuestion.right;
  },

  incrementCurrentQuestionNumber: function () {
    s.numCurrentQuestion++;
  },

  incrementCorrectGivenAnswers: function () {
    s.numCorrectGivenAnswers++
  },

  startQuiz: function () {
    this.showNextQuestion();
    s.question_screen.fadeIn();
  },

  selectedAnswer: function (btn) {
    btn.addClass("btn-primary");
    btn.removeClass("btn-secondary");
  },

  deselectAnswer: function (btn) {
    btn.addClass("btn-secondary");
    btn.removeClass("btn-primary");
  },

  highlightRightAnwser: function (btn) {
    btn.addClass("btn-success");
    btn.removeClass("btn-secondary");
  },

  hideRightAnswer: function (btn) {
    btn.addClass("btn-secondary");
    btn.removeClass("btn-success");
  },

  highlightWrongAnswer: function (btn) {
    btn.addClass("btn-danger");
    btn.removeClass("btn-secondary");
  },

  hideWrongAnswer: function (btn) {
    btn.addClass("btn-secondary");
    btn.removeClass("btn-danger");
  },

  activate: function (btn) {
    btn.addClass("enabled");
    btn.removeClass("disabled");
  },

  deactivate: function (btn) {
    btn.addClass("disabled");
    btn.removeClass("enabled");
  },

  resetQuestionScreen: function () {
    this.deselectAnswer(s.selectAnswer);
    s.selectAnswer = null;
  },

  checkAnswer: function () {
    var rightAnswer = this.getRightAnswer();

    if (rightAnswer == "A") {
      s.rightAnswerButton = s.answer_a_btn;
      this.deselectAnswer(s.answer_a_btn);
    } else if (rightAnswer == "B") {
      s.rightAnswerButton = s.answer_b_btn;
      this.deselectAnswer(s.answer_b_btn);
    } else if (rightAnswer == "C") {
      s.rightAnswerButton = s.answer_c_btn;
      this.deselectAnswer(s.answer_c_btn);
    } else if (rightAnswer == "D") {
      s.rightAnswerButton = s.answer_d_btn;
      this.deselectAnswer(s.answer_d_btn);
    } else {
      console.log("no correct right answer");
    }
    this.hideRightAnswer(s.rightAnswerButton);

    if (s.rightAnswerButton.id != s.selectAnswer) {
      this.deselectAnswer(s.selectedAnswer);
      this.highlightWrongAnswer(s.selectedAnswer);
    } else {
      this.incrementRightAnswers();
    }
  },

  setupQuestionScreen: function () {
    this.hideRightAnswer(s.rightAnswerButton);
    this.hideWrongAnswer(this.selectedAnswer);
    this.deactivate(s.continue_btn);
    s.selectAnswer = null;
    s.rightAnswer = null;
    s.isAnswerCommited = false;
  },

  setupEndScreen: function () {
    s.endpoints_text.text(s.rightAnswers);
    s.possiblepoints_text.text(s.questions.length);
    s.endmessage_text.text(this.calculateEndMessage(s.qeustions.length, s.rightAnswers))
  },

  calculateEndMessage: function (totalQuestions, rightAnswers) {
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
};