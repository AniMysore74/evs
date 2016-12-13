(function () {

    var module, allQuestions, questions;

    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", "assets/json/modall.json", true);
    oReq.send();

    function reqListener(e) {
        module = JSON.parse(this.responseText);
        allQuestions = module[0].concat(module[1], module[2], module[3], module[4]);
    }
    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quiz = $('#quiz'); //Quiz div object
    var qnos = []; // Array containing randomly generated numbers corresponding to question numbers in  var questions
    var started = false;

    // Display quiz settings
    quizSettings();

    // Click handler for the 'next' button
    $('#next').on('click', function (e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if (quiz.is(':animated')) {
            return false;
        }
        questionCounter++;
        displayNext();
    });

    // Click handler for the 'submit' button
    $('#submit').on('click', function (e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if (quiz.is(':animated')) {
            return false;
        }
        choose();

        // If no user selection, progress is stopped
        if (isNaN(selections[questionCounter])) {
            alert('Please make a selection!');
        } else {
            displayAnswer();
        }
    });

    // Click handler for the 'Start Over' button
    $('#start').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        if (!started) {
            started = true;
            quizSettings();
        } else {
            qnos = [];
            questionCounter = 0;
            selections = [];
            if ($('input[name="module"]').is(":checked")) {
                questions = module[$('input[name="module"]:checked').val()];
                for (var i = 0; i < questions.length; i++) {
                    qnos.push(i);
                }
                displayNext();
                $('#start').hide();
            } else {
                var noQs = $('input[name="qnos"]').val();
                if (noQs < 1 || noQs > 4480) {
                    alert('Please enter a number between 1 and 447');
                } else {
                    for (var i = 0; i < noQs; i++) {
                        qnos.push(Math.floor(Math.random() * 448));
                    }
                    questions = allQuestions;
                    displayNext();
                    $('#start').hide();
                }
            }
        }
    });
    // Set the number of questions
    function quizSettings() {
        started = true;
        $('#question').remove();
        quiz.fadeOut(function () {
            var newElement = $('<div>', {
                id: 'question'
            });
            newElement.append('<p class="blue-grey-text">Go Full! Answer all questions from any module: </p>');
            for (var i = 0; i < 5; i++) {
                var item = ('<input class="with-gap" style="display: inline-block"type="radio" name="module" id="mod' + (i + 1) + '" value=' + (i) + ' />');
                item += '<label class="black-text" style="padding-right:15px;display:inline-block" for="mod' + (i + 1) + '" > Module ' + (i + 1) + '</label>';
                newElement.append(item);
            }
            newElement.append('<br /><br /><p class="blue-grey-text" >Or exam style: All random! Select how many questions you want: </p>')
            newElement.append('<p><input type="number" max="447" min="1" id="qnos" name="qnos" placeholder="Upto 447 questions"/><label for="qnos" ></label></p>');
            quiz.append(newElement).fadeIn();
            $('#next').hide();
            $('#submit').hide();
            $('#start').show();
            $('#question .btn').show();
        });
    }
    // Creates and returns the div that contains the questions and
    // the answer selections
    // params used only to show correct/incorrect answer
    function createQuestionElement(index, params) {
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<h4>Question ' + (questionCounter + 1) + '/ ' + qnos.length + ':</h4>');
        qElement.append(header);

        var question = $('<p>').append(questions[index].question);
        qElement.append(question);

        var radioButtons = createRadios(index, params);
        qElement.append(radioButtons);

        return qElement;
    }
    // Creates a list of the answer choices as radio inputs
    // params is used for highlighting correct and wrong choices after question is answered
    function createRadios(index, params) {
        var radioList = $('<ul>');
        var item;
        var input = '';
        for (var i = 0; i < questions[index].choices.length; i++) {
            item = $('<li>');

            input = '<input class="with-gap" type="radio" name="answer" id="test' + i + '" value=' + i + ' ' + formatRadio(params, i) + ' />';

            input += '<label ' + formatRadioLabel(params, i) + ' for="test' + i + '" >'

            input += questions[index].choices[i];
            input += '</label>'

            item.append(input);
            radioList.append(item);
        }
        return radioList;
    }
    // Change foramatting of radio buttons
    function formatRadio(params, i) {
        if (params === false)
            return ' ';
        else if (params.qlist[i] == "correct-selection")
            return 'checked';
        else if (params.qlist[i] == "wrong-selection")
            return 'checked disabled="disabled"';
        else if (params.qlist[i] == "blank" || params.qlist[i] == "rightanswer")
            return 'disabled="disabled"';
    }
    // Change foramatting of labels to radio buttons
    function formatRadioLabel(params, i) {
        if (params === false)
            return 'class="black-text"';
        else if (params.qlist[i] == "correct-selection" || params.qlist[i] == "rightanswer")
            return 'class="teal-text"';
        else if (params.qlist[i] == "wrong-selection")
            return 'class="red-text"';
        else if (params.qlist[i] == "blank")
            return ' ';
    }
    // Reads the user selection and pushes the value to an array
    function choose() {
        selections[questionCounter] = +$('input[name="answer"]:checked').val();
    }
    // Displays next requested element
    function displayNext() {
        quiz.fadeOut(function () {
            $('#question').remove();
            if (questionCounter < qnos.length) {
                var nextQuestion = createQuestionElement(qnos[questionCounter], false);
                quiz.append(nextQuestion).fadeIn();
                if (!(isNaN(selections[questionCounter]))) {
                    $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
                }
                $('#next').hide();
                $('#submit').show();
                $('#start').hide();

            } else {
                var scoreElem = displayScore();
                quiz.append(scoreElem).fadeIn();
                $('#next').hide();
                $('#submit').hide();
                $('#start').show();
            }
        });
    }

    function displayAnswer() {
        quiz.fadeOut(function () {
            $('#question').remove();
            var answerParams = checkAnswer();

            var nextQuestion = createQuestionElement(qnos[questionCounter], answerParams);
            quiz.append(nextQuestion).fadeIn();

            $('#next').show();
            $('#submit').hide();
            $('#start').hide();
        });
    }

    function checkAnswer() {
        var params = {
            qlist: [],
        };
        for (var i = 0; i < questions[qnos[questionCounter]].choices.length; i++) {
            if (i === selections[questionCounter] && selections[questionCounter] === questions[qnos[questionCounter]].correctAnswer) {
                params.qlist.push("correct-selection");
            } else if (i === selections[questionCounter]) {
                params.qlist.push("wrong-selection");
            } else if (i === questions[qnos[questionCounter]].correctAnswer) {
                params.qlist.push("rightanswer");
            } else {
                params.qlist.push("blank");
            }
        }
        return params;
    }
    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
        started = false;
        var score = $('<p>', {
            id: 'question'
        });

        var numCorrect = 0;
        for (var i = 0; i < selections.length; i++) {
            if (selections[i] === questions[qnos[i]].correctAnswer) {
                numCorrect++;
            }
        }

        score.append('<h4> You got <strong class="teal-text">' + numCorrect + '</strong> questions out of <strong class="teal-text">' +
            qnos.length + '</strong> right!</h4>');
        return score;
    }
})();
