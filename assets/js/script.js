(function () {
    var questions;
    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", "qs.json", true);
    oReq.send();

    function reqListener(e) {
        questions = JSON.parse(this.responseText);
    }

    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quiz = $('#quiz'); //Quiz div object

    // Display initial question
    displayNext();

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
        questionCounter = 0;
        selections = [];
        displayNext();
        $('#start').hide();
    });

    // Animates buttons on hover
    $('.button').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    // Creates and returns the div that contains the questions and
    // the answer selections
    // params used only to show correct/incorrect answer
    function createQuestionElement(index, params) {
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<h4>Question ' + (index + 1) + ':</h4>');
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
            return ' ';
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
            if (questionCounter < questions.length) {
                var nextQuestion = createQuestionElement(questionCounter, false);
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

            var nextQuestion = createQuestionElement(questionCounter, answerParams);
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
        for (var i = 0; i < questions[questionCounter].choices.length; i++) {
            if (i === selections[questionCounter] && selections[questionCounter] === questions[questionCounter].correctAnswer) {
                params.qlist.push("correct-selection");
            } else if (i === selections[questionCounter]) {
                params.qlist.push("wrong-selection");
            } else if (i === questions[questionCounter].correctAnswer) {
                params.qlist.push("rightanswer");
            } else {
                params.qlist.push("blank");
            }
        }
        console.log(params);
        return params;
    }

    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
        var score = $('<p>', {
            id: 'question'
        });

        var numCorrect = 0;
        for (var i = 0; i < selections.length; i++) {
            if (selections[i] === questions[i].correctAnswer) {
                numCorrect++;
            }
        }

        score.append('You got ' + numCorrect + ' questions out of ' +
            questions.length + ' right!!!');
        return score;
    }
})();
