
var quiz = null;
$.ajax({
    url: "js/quiz.json",
    dataType: "text",
    success: function(data) {
        quiz = $.parseJSON(data);
        console.log(quiz);
    }
});

var tracker = -1; //keeps track of the question you're on. starts at -1 because front page
var username = ""; //self explanatory
var soundOn = true; //keeps track of sound toggle
var imageOn = true; //keeps track of image gif toggle
var currentAnswers = []; //array for answers


$(document).ready(function(){ //when the document is ready, start the process
    if (tracker = -1){  //when you're on the front page ... ,
    animateBits(); //animates first PhaseOne:Quiz
    animateBits2(); //animates second PhaseOne:Quiz
}

var audioElement = document.createElement('audio');
audioElement.setAttribute('src','./assets/spacemusic.mp3');
audioElement.setAttribute('autoplay','autoplay');
audioElement.addEventListener("load", function() {
    audioElement.play();
}, true); //sets up audioelement, the local sound (spacemusic.mp3) to play on load

$("#soundtoggle").click(function() {
    if(soundOn == true) {
        audioElement.pause();
        soundOn = false;
        $("#soundtoggle").css("color","red"); // toggle info; if clicked while sound is on, the toggle will turn off sound and make the icon red
    }
    else if(soundOn == false) {
        audioElement.play();
        soundOn = true;
        $("#soundtoggle").css("color","gray"); // toggle info; if clicked while sound is off, the toggle will turn on sound and make icon gray
    }
});

$("#imagetoggle").click(function() {
    if(imageOn == true) {
        $("html").css("background-image","url('./assets/images/stillbackground.jpg')");
        imageOn = false;
        $("#imagetoggle").css("color","red"); //gif toggle off
    }
    else if(imageOn == false) {
        $("html").css("background-image","url('./assets/images/background.gif')");
        imageOn = true;
        $("#imagetoggle").css("color","gray"); //gif toggle on
    }
});

    $("#continue").click(function() { //This function is for the Begin button on the 1st page. The reason this needs its own seperate function is because the 1st question doesn't have a back button (also a thing with the plain, html button not having dynamic abilites)
        if (validateForm() == false) { //data validation of input text (name). if not filled, do this...
            $("#interface").addClass("has-error");
            $(".control-label").remove();
            $("<label for=\"NameProtocol\" class=\"control-label\">You must name yourself, human.</label>").hide().prependTo("#interface").fadeIn(1000); //warning message if there is no name
        }
        else if (validateForm() == true){ //data validation; if its OK, do this...
            console.log($('NameProtocol').val());
            tracker++;
            $("#container").empty(); //clears the container HTML div so i can make new stuff in it
            $("#container").append("<h2>Hi " + username + "! " + quiz.questions[0].text + "</h2>").hide().fadeIn(1000); //fadeIn all new HTML
            $("#container").append("<div class=\"col-md-6 col-md-offset-3 choices radio\" id=\"interface\">"); //making a dynamic div
            for(i = 0; i < quiz.questions[0].answers.length; i++){
                $("#interface").append("<input type=\"radio\" name=\"answer\"> " + quiz.questions[0].answers[i] + "<br>"); //create answer choices based upon json lengths
            }
            $("#interface").append("<br>");
            $("#interface").append("<input id=\"continue\" class=\"btn btn-success btn-lg\" type=\"button\" value=\"Next\"></input>"); // all of this code creates dynamically new elements that we can use for questions
        }
    });

    $(document).keypress(function(e) { // This function allows it so that you can press enter to continue! same content as the series of code above.
        if (e.which == 13 && tracker == -1){
            if (validateForm() == false) {
                $("#interface").addClass("has-error");
                $(".control-label").remove();
                $("<label for=\"NameProtocol\" class=\"control-label\">You must name yourself, human.</label>").hide().prependTo("#interface").fadeIn(1000);
            }
            else if (validateForm() == true){
                tracker++;
                $("#container").empty();
                $("#container").append("<h2>Hi " + username + "! " + quiz.questions[0].text + "</h2>").hide().fadeIn(1000);
                $("#container").append("<div class=\"col-md-6 col-md-offset-3 radio choices\" id=\"interface\">");
                for(i = 0; i < quiz.questions[0].answers.length; i++){
                    $("#interface").append("<input type=\"radio\" name=\"answer\">" + quiz.questions[0].answers[i] + "<br>");
                    console.log("fire");
                }
                $("#interface").append("<br>");
                $("#interface").append("<input id=\"continue\" class=\"btn btn-success btn-lg\" type=\"button\" value=\"Next\"></input>");
            }
        }
    });

    $("#container").on("click", "#continue", function(){ //when you click the next button (this particular part of the code is for dynamically generated next buttons)
        if (tracker >= 0) {
            if (validateAnswer() == false){ //data validation; checks if you answered/chosen a radio button; if you haven't filled in a radio button...
                $("#interface").addClass("has-error");
                $(".control-label").remove();
                $(".temp").remove();
                $("<center><label for=\"NameProtocol\" class=\"control-label\"><strong>You must pick an answer, human.</strong></label></center><br class=\"temp\">").hide().prependTo("#interface").fadeIn(1000); //warning message
            }
            else if (validateAnswer() == true) { //data validation; checks if you answered/chosen a radio button; if you HAVE filled in a radio button...
                saveAnswer(); //saves your answer to the currentAnswers array
                tracker++;
                $("#container").empty();
                $("#container").append("<h2>Hi " + username + "! " + quiz.questions[tracker].text + "</h2>").hide().fadeIn(1000);
                $("#container").append("<div class=\"col-md-6 col-md-offset-3 radio choices\" id=\"interface\">");
                for(i = 0; i < quiz.questions[tracker].answers.length; i++){
                    if (currentAnswers[tracker] == i) {
                        $("#interface").append("<input type=\"radio\" name=\"answer\" checked=\"checked\">" + quiz.questions[tracker].answers[i] + "<br>"); //lists answer choices
                    }
                    else {
                        $("#interface").append("<input type=\"radio\" name=\"answer\">" + quiz.questions[tracker].answers[i] + "<br>"); //creating some dynamic html up in here
                    }
                }
                $("#interface").append("<br>");
        if(tracker > 0){
            $("#interface").append("<input id=\"back\" class=\"btn btn-warning btn-lg\"type=\"button\" value=\"Back\"></input>"); //if we're on a certain # question, then display different types of buttons (submit on the last question, next on others, etc...)
        }
        if(tracker == (quiz.questions.length - 1)) {
            $("#interface").append("<input id=\"grade\" type=\"button\" class=\"btn btn-primary btn-lg\" value=\"Submit\"></input>");
        }
        else {
            $("#interface").append("<input id=\"continue\" class=\"btn btn-success btn-lg\" type=\"button\" value=\"Next\"></input>");
        }
    }
}
});

    $("#container").on("click", "#back", function(){ //when you click the back button; literally the same thing as code above, just for back button. Tracker-- instead of tracker++.
        saveAnswer();
        tracker--;
        $("#container").empty();
        $("#container").append("<h2>Hi " + username + "! " + quiz.questions[tracker].text + "</h2>").hide().fadeIn(1000);
        $("#container").append("<div class=\"col-md-6 col-md-offset-3 radio choices\" id=\"interface\">");
        for(i = 0; i < quiz.questions[tracker].answers.length; i++){
            if (currentAnswers[tracker] == i) {
                $("#interface").append("<input type=\"radio\" name=\"answer\" checked=\"checked\">" + quiz.questions[tracker].answers[i] + "<br>"); 
            }
            else {
                $("#interface").append("<input type=\"radio\" name=\"answer\">" + quiz.questions[tracker].answers[i] + "<br>");
            }
        }
        $("#interface").append("<br>");
        if(tracker > 0){
            $("#interface").append("<input id=\"back\" type=\"button\" class=\"btn btn-warning btn-lg\"value=\"Back\"></input>");  
        }
        if(tracker == (quiz.questions.length - 1)) {
            $("#interface").append("<input id=\"grade\" type=\"button\" class=\"btn btn-primary btn-lg\" value=\"Submit\"></input>");
        }
        else {
            $("#interface").append("<input id=\"continue\" class=\"btn btn-success btn-lg\" type=\"button\" value=\"Next\"></input>");
        }
    });

    $("#container").on("click", "#grade", function(){ //grading function (occurs when submit is pressed in the last question)
        saveAnswer(); 
        var grade = gradeQuiz(); //calls gradeQuiz function
        var gradeArray = gradeQuizArrayReturned(); //call gradeQuizArrayReturned
        var myJsonString = JSON.stringify(quiz);
        console.log(myJsonString);
        var myRealJsonString = JSON.parse(myJsonString);
        console.log(myRealJsonString);

        //sends a post request to the server
        $.ajax({
          method: "POST",
          url: "/quiz",
          data: myRealJsonString
        })
          .done(function(msg) {
            console.log( "Data Saved: " + msg );
          });

        $("#container").empty();
        $("#container").append("<h2>Hi " + username + "! Congratulations on completing that quiz. You scored " + grade + " out of " + (quiz.questions.length) + " correct.</h2>").hide().fadeIn(1000);
        //making HTML

        // pie graph making ... rough. made with extensive research on w3schools and dervied from http://wickedlysmart.com/how-to-make-a-pie-chart-with-html5s-canvas/
        var data = [((grade)/(quiz.questions.length))*360, ((quiz.questions.length - grade)/(quiz.questions.length))*360];
        var labels = ["correct","wrong"];
        var colors = ["#33CC33","#CC0000"];
        $("#container").append("<br><br><br><center><canvas id=\"piechart\" width=\"250\" height=\"250\"> This text is displayed if your browser does not support HTML5 Canvas.</canvas><center>");
        canvas = document.getElementById("piechart");
        var context = canvas.getContext("2d");
        for (var i = 0; i < data.length; i++) {
        drawSegment(canvas, context, i, data, colors, labels);
        }
    });
});




// =========== FUNCTIONS BELOW

function animateBits() { //animates the BITS exchange into PhaseOne:Quiz on the 1st page
    const BITS_ID = 'bits';
    const BITS_TEXT = 'PhaseTwo:Quiz';
    const BITS_ANIMATE_INTERVAL = 75.0;
    const BITS_ANIMATE_DURATION = 1750.0;
    var bitsTextTicks = 0;
    var animateBITS_ID = window.setInterval(function() {
        var len = Math.floor(bitsTextTicks / (BITS_ANIMATE_DURATION / BITS_ANIMATE_INTERVAL) * 15);
        var text = BITS_TEXT;
        for (i = len; i < 13; i++) {
            text = text.substr(0, i) + (Math.random() > 0.5 ? '1' : '0') + text.substr(i + 1);
        }
        document.getElementById(BITS_ID).innerHTML = text;
        bitsTextTicks++;
    }, BITS_ANIMATE_INTERVAL);
    window.setTimeout(function() {
        window.clearInterval(animateBITS_ID);
        document.getElementById(BITS_ID).innerHTML = BITS_TEXT;
    }, BITS_ANIMATE_DURATION);
}

function animateBits2() { //same thing, but for another entity
    const BITS_ID = 'bits2';
    const BITS_TEXT = 'PhaseTwo:Quiz';
    const BITS_ANIMATE_INTERVAL = 75.0;
    const BITS_ANIMATE_DURATION = 1750.0;
    var bitsTextTicks = 0;
    var animateBITS_ID = window.setInterval(function() {
        var len = Math.floor(bitsTextTicks / (BITS_ANIMATE_DURATION / BITS_ANIMATE_INTERVAL) * 15);
        var text = BITS_TEXT;
        for (i = len; i < 13; i++) {
            text = text.substr(0, i) + (Math.random() > 0.5 ? '1' : '0') + text.substr(i + 1);
        }
        document.getElementById(BITS_ID).innerHTML = text;
        bitsTextTicks++;
    }, BITS_ANIMATE_INTERVAL);
    window.setTimeout(function() {
        window.clearInterval(animateBITS_ID);
        document.getElementById(BITS_ID).innerHTML = BITS_TEXT;
    }, BITS_ANIMATE_DURATION);
}

function validateForm() { //validates text input; makes sure you put something in
    var usernameElement = document.getElementById('NameProtocol');
    username = $("#NameProtocol").val();
    if (usernameElement.value == null | usernameElement.value == "") {
        return false;
    }
    else {
        return true;
    }
}

function validateAnswer() { //validates radio button selection
    if ($("input[name='answer']").is(':checked')){
        return true;
    }
    else {
        return false;
    }
}

function saveAnswer() { //when you click next, answer choices saved to an array that is used for grading later on
    var TempArray = $("input[name='answer']").toArray();
    for(var j = 0; j < $("input[name='answer']").length; j++) {
        if (TempArray[j].checked == true) {
            currentAnswers[tracker] = j;
        }
    }
}

function gradeQuiz() { //compares the answer array to json's correct answers.
    var questionsRight = 0;
    for (var x = 0; x < currentAnswers.length; x++) {
        if (currentAnswers[x] == quiz.questions[x]["correct_answer"]){
            questionsRight++;
            console.log("Water" + currentAnswers[x]);
        }
    }
    return questionsRight;
}


function gradeQuizArrayReturned() {
    var questionsRightArray = [];
    for (var x = 0; x < currentAnswers.length; x++) {
        if (currentAnswers[x] == quiz.questions[x]["correct_answer"]){
            questionsRightArray[x] == '1';
            quiz.questions[x]["global_correct"]++;
            console.log("water2" + questionsRightArray);
        }
        else {
            questionsRightArray[x] == '0';
            console.log("water3" + questionsRightArray);
        }
    quiz.questions[x]["global_total"]++;
    console.log(quiz);
    }
    return questionsRightArray;
}

function drawSegment(canvas, context, i, data, colors, labels) { //pie chart stuff
    context.save();
    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    radius = Math.floor(canvas.width / 2);

    var startingAngle = degreesToRadians(sumTo(data, i));
    var arcSize = degreesToRadians(data[i]);
    var endingAngle = startingAngle + arcSize;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, 
                startingAngle, endingAngle, false);
    context.closePath();

    context.fillStyle = colors[i];
    context.fill();

    context.restore();

    drawSegmentLabel(canvas, context, i, labels, data);
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI)/180;
}

function sumTo(a, i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
      sum += a[j];
    }
    return sum;
}

function drawSegmentLabel(canvas, context, i, labels, data) {
   context.save();
   var x = Math.floor(canvas.width / 2);
   var y = Math.floor(canvas.height / 2);
   var angle = degreesToRadians(sumTo(data, i));

   context.translate(x, y);
   context.rotate(angle);
   var dx = Math.floor(canvas.width * 0.5) - 10;
   var dy = Math.floor(canvas.height * 0.05);

   context.textAlign = "right";
   var fontSize = Math.floor(canvas.height / 25);
   context.font = fontSize + "pt Helvetica";

   context.fillText(labels[i], dx, dy);

   context.restore();
}
