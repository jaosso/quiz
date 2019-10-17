var s, Quiz = {

  "settings": {
    // end screen messages from best to worst (the only thing you may want to configure)
    end_message_1: "Perfekt! Du hast es echt drauf!",
    end_message_2: "Du weißt schon eine ganze Menge! Gut gemacht!",
    end_message_3: "Das war garnicht so schlecht!",
    end_message_4: "Du hast zumindest einige Fragen richtig beantwortet.",
    end_message_5: "Das üben wir aber noch mal ;)",
    ens_message_6: "Das war leider garnichts...",
    // gui screens
    start_screen: $(".quiz_start"),
    question_screen: $(".quiz_question"),
    end_screen: $(".quiz_end"),
    // gui objects
    start_btn: $(".start"),
    answer_btns: $(".answer"),
    answer_a_btn: $("#answer_a_button"),
    answer_b_btn: $("#answer_b_button"),
    answer_c_btn: $("#answer_c_button"),
    answer_d_btn: $("#answer_d_button"),
    commit_btn: $("#commit_button"),
    continue_btn: $("#continue_button"),
    question_nbr_text: $("#question_nbr"),
    question_text: $("#question_text"),
    endpoints_text: $("#endpoints"),
    possiblepoints_text: $("#possiblepoints"),
    endmessage_text: $("#end_message"),
    // variables
    question_path: "/quiz/questions.json",
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
  init: function (content_frame) {
    s = this.settings;
    this.bindUIanctions();

    // fetch json file, with the questions
    fetch(s.question_path).then(resp => {
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
      var btn;
      if (this.id == "answer_a_button") {
        btn = s.answer_a_btn;
      } else if (this.id == "answer_b_button") {
        btn = s.answer_b_btn;
      } else if (this.id == "answer_c_button") {
        btn = s.answer_c_btn;
      } else if (this.id == "answer_d_button") {
        btn = s.answer_d_btn;
      }

      if (!s.isAnswerCommited) {
        if (s.selectedAnswer == null) {
          s.selectedAnswer = btn;
          Quiz.selectAnswer(btn);
          s.selectedAnswer = btn;
          Quiz.activate(s.commit_btn);
        } else {
          Quiz.deselectAnswer(s.selectedAnswer);
          Quiz.selectAnswer(btn);
          s.selectedAnswer = btn;
        }
      }
    });

    s.commit_btn.on("click", function () {
      if (s.selectedAnswer != null) {
        isAnswerCommited = true;
        Quiz.deactivate(s.commit_btn);
        Quiz.activate(s.continue_btn);
        Quiz.checkAnswer();
        Quiz.deactivate(s.commit_btn);
        Quiz.activate(s.continue_btn);
      }
    });

    s.continue_btn.on("click", function () {
      Quiz.incrementCurrentQuestionNumber();
      Quiz.setupQuestionScreen();
      if (!Quiz.showNextQuestion()) {
        Quiz.setupEndScreen();
        s.question_screen.fadeOut(function () {
          s.end_screen.fadeIn();
        });
      }
    });
  },

  startQuiz: function () {
    this.showNextQuestion();
    s.question_screen.fadeIn();
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
    s.numCorrectGivenAnswers++;
  },

  selectAnswer: function (btn) {
    $("#" + btn.attr("id")).addClass("btn-primary");
    $("#" + btn.attr("id")).removeClass("btn-secondary");
  },

  deselectAnswer: function (btn) {
    $("#" + btn.attr("id")).addClass("btn-secondary");
    $("#" + btn.attr("id")).removeClass("btn-primary");
  },

  highlightRightAnwser: function (btn) {
    $("#" + btn.attr("id")).addClass("btn-success");
    $("#" + btn.attr("id")).removeClass("btn-secondary");
  },

  hideRightAnswer: function (btn) {
    $("#" + btn.attr("id")).addClass("btn-secondary");
    $("#" + btn.attr("id")).removeClass("btn-success");
  },

  highlightWrongAnswer: function (btn) {
    $("#" + btn.attr("id")).addClass("btn-danger");
    $("#" + btn.attr("id")).removeClass("btn-secondary");
  },

  hideWrongAnswer: function (btn) {
    $("#" + btn.attr("id")).addClass("btn-secondary");
    $("#" + btn.attr("id")).removeClass("btn-danger");
  },

  activate: function (btn) {
    $('#' + btn.attr('id')).attr("disabled", false);
  },

  deactivate: function (btn) {
    $('#' + btn.attr('id')).attr("disabled", true);
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
    this.highlightRightAnwser(s.rightAnswerButton);

    if (s.rightAnswerButton != s.selectedAnswer) {
      this.deselectAnswer(s.selectedAnswer);
      this.highlightWrongAnswer(s.selectedAnswer);
    } else {
      this.incrementCorrectGivenAnswers();
    }
  },

  setupQuestionScreen: function () {
    this.hideRightAnswer(s.rightAnswerButton);
    this.hideWrongAnswer(s.selectedAnswer);
    this.deactivate(s.continue_btn);
    s.selectedAnswer = null;
    s.rightAnswer = null;
    s.isAnswerCommited = false;
  },

  setupEndScreen: function () {
    s.endpoints_text.text(s.numCorrectGivenAnswers);
    s.possiblepoints_text.text(s.questions.length);
    s.endmessage_text.text(this.calculateEndMessage(s.questions.length, s.numCorrectGivenAnswers));
  },

  calculateEndMessage: function (totalQuestions, rightAnswers) {
    var hitRate = 0;

    if (totalQuestions != 0) {
      hitRate = rightAnswers / totalQuestions;
    }

    if (hitRate == 1) {
      return s.end_message_1;
    } else if (hitRate < 1 && hitRate >= 0.8) {
      return s.end_message_2;
    } else if (hitRate < 0.8 && hitRate >= 0.5) {
      return s.end_message_3;
    } else if (hitRate < 0.5 && hitRate >= 0.3) {
      return s.end_message_4;
    } else if (hitRate < 0.3 && hitRate > 0) {
      return s.end_message_5;
    } else if (hitRate == 0) {
      return s.end_message_6;
    } else {
      return "default";
    }
  }
};