var top10 = null;
$.ajax({
    url: "/gettopJSON",
    dataType: "text",
    success: function(data) {
        top10 = $.parseJSON(data);
        console.log(top10);
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
        $("html").css("background-image","url('./assets/images/background.gif')");
        imageOn = false;
        $("#imagetoggle").css("color","red"); //gif toggle off
    }
    else if(imageOn == false) {
        $("html").css("background-image","url('./assets/images/background2.jpg')");
        imageOn = true;
        $("#imagetoggle").css("color","gray"); //gif toggle on
    }
});

    $(".continue").click(function() { //This function is for the Begin button on the 1st page. The reason this needs its own seperate function is because the 1st question doesn't have a back button (also a thing with the plain, html button not having dynamic abilites)
        if (validateForm() == false) { //data validation of input text (name). if not filled, do this...
            $("#interface").addClass("has-error");
            $(".control-label").remove();
            $("<label for=\"NameProtocol\" class=\"control-label\">You must name yourself, human.</label>").hide().prependTo("#interface").fadeIn(1000); //warning message if there is no name
        }
        else if (validateForm() == true){ //data validation; if its OK, do this...
            $.ajax({
                url: "/quiz/" + $(this).attr("alt"),
                dataType: "text",
                success: function(data) {
                    quiz = $.parseJSON(data);
                    console.log(quiz);
                },
                async: false
            });
            tracker++;
            document.title = quiz.title;
            $("#container").empty(); //clears the container HTML div so i can make new stuff in it
            $("#container").append("<h2>Hi " + username + "! " + quiz.questions[0].text + "</h2>").hide().fadeIn(1000); //fadeIn all new HTML
            $("#container").append("<div class=\"col-md-6 col-md-offset-3 choices radio\" id=\"interface\">"); //making a dynamic div
            for(i = 0; i < quiz.questions[0].answers.length; i++){
                $("#interface").append("<input type=\"radio\" name=\"answer\"> " + quiz.questions[0].answers[i] + "<br>"); //create answer choices based upon json lengths
            }
            $("#interface").append("<br>");
            $("#interface").append("<input id=\"continue\" class=\"btn btn-success btn-lg\" type=\"button\" value=\"Next\"></input>"); // all of this code creates dynamically new elements that we can use for questions
            $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
                   {
                     tags: String(quiz.questions[tracker].meta_tags),
                     tagmode: "any",
                     format: "json"
                    },
                    function(data) {
                        $.each(data.items, function(i,item){
                        $("<br><img />").attr("src", item.media.m).appendTo("#interface");
                        if ( i == 0 ) return false;
                    });
               })
         }
    });

    $("#delete").click(function() {
        $("#container").empty(); //clears the container HTML div so i can make new stuff in it
    });
    

// --------- --------- --------- --------- THIS IS FOR THE CREATION OF A QUIZ FUNCTIONALITY --------- --------- --------- ---------
    var altholder = 0;
    $("#make").click(function() { //the function used to create a form to make a quiz.
            $("#container").empty(); //clears the container HTML div so i can make new stuff in it
            $("#container").append("<h1>Make your quiz!</h1>").hide().fadeIn(1000); //fadeIn all new HTML
            $("#container").append("<h4>The correct answer text field accepts an array placement number. This means that if the correct answer choice is the first answer choice listed, then the correct answer would be '0'. Thus, the second would be '1', third would be '2', etc.");
            $("#container").append("<div class=\"col-md-8 col-md-offset-2 choices radio\" id=\"interface\">"); //making a dynamic div
            $("#interface").append("<form id='makequiz' class='form-horizontal'>");  
            $(".form-horizontal").append('<div class="form-group"><label for="title" class="col-sm-2 control-label">Title</label><div class="col-sm-10"><input type="text" class="form-control" id="title" name="title" placeholder="Title"></div></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="description" class="col-sm-2 control-label">Description</label><div class="col-sm-10"><textarea rows="2" class="form-control" id="description" name="description" placeholder="Description"></textarea></div></div>');
            $(".form-horizontal").append('<div class="form-group form-group-meta-tags-quiz"><label for="meta_tags" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" placeholder="Meta_tag"></div><a><button id="addmetatagstoquiz" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="difficulty" class="col-sm-2 control-label">Difficulty</label><div class="col-sm-10"><input type="text" class="form-control" id="difficulty" name="difficulty" placeholder="Difficulty, from 1-20"></div></div>');

            for (var y = 0; y < 3; y++){
            $(".form-horizontal").append('<hr>');
            $(".form-horizontal").append('<h4>Question ' + (y+1) + '</h4>');
            $(".form-horizontal").append('<div class="form-group"><label for="question' + (y+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (y+1) + '" name="questions[' + y + '][text]" placeholder="Text"></div></div>');
            $(".form-horizontal").append('<div class="form-group" alt="' + y + '"><label for="answerchoice' + (y+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (y+1) + '" name="questions[' + y + '][answers][]" placeholder="Answer Choice"></div><a><button id="addchoicestoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Choice!</button></a></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (y+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (y+1) + '" name="questions[' + y + '][correct_answer]" placeholder="Correct Answer (# of the array spot; i.e 0,1,2,3...)"></div></div>');
            $(".form-horizontal").append('<div class="form-group" alt="' + y + '"><label for="meta_tags' + (y+1) + '" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (y+1) + '" name="questions[' + y + '][meta_tags][]" placeholder="Meta_tag"></div><a><button id="addmetatagstoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
            altholder = y+1;
        }
            $("#interface").append('<center><a><button id="addquestions" type="button" class="btn btn-info btn-lg"><i class="icon-plus-sign"></i> Add more Questions</button></a></center>')
            $("#interface").append('<br>')
            $("#interface").append('<center><a href="/"><button id="makequizbutton" type="button" class="btn btn-success btn-lg"><i class="icon-upload-alt"></i> Make your quiz!</button></a></center>')
    });

    $("#container").on("click", "#addmetatagstoquiz", function(){ //when the user wants to add more metatags to the quiz during the creation process
        $(".form-group-meta-tags-quiz").append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" placeholder="Meta_tag"></div>');
    });
    $("#container").on("click", "#addmetatagstoquestion", function(){ //when the user wants to add more metatags to questions during the creation process
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][meta_tags][]" placeholder="Meta_tag"></div>');
    });
    $("#container").on("click", "#addchoicestoquestion", function(){ //when the user wants to add more answer choices to questions during the creation process
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][answers][]" placeholder="Answer Choice"></div>');
    });
    $("#container").on("click", "#addquestions", function() {
        $(".form-horizontal").append('<hr>');
        $(".form-horizontal").append('<h4>Question ' + (altholder+1) + '</h4>');
        $(".form-horizontal").append('<div class="form-group"><label for="question' + (altholder+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (altholder+1) + '" name="questions[' + altholder + '][text]" placeholder="Text"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + altholder + '"><label for="answerchoice' + (altholder+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (altholder+1) + '" name="questions[' + altholder + '][answers][]" placeholder="Answer Choice"></div><a><button id="addchoicestoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Choice!</button></a></div>');
        $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (altholder+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (altholder+1) + '" name="questions[' + altholder + '][correct_answer]" placeholder="Correct Answer (# of the array spot; i.e 0,1,2,3...)"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + altholder + '"><label for="meta_tags' + (altholder+1) + '" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (altholder+1) + '" name="questions[' + altholder + '][meta_tags][]" placeholder="Meta_tag"></div><a><button id="addmetatagstoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
        altholder++;
    });
    $("#container").on("click", "#makequizbutton", function() { //the submit button for the quiz creation process.
        var makequizformdata = $("form#makequiz").serializeObject();
        console.log(makequizformdata);
        for (var e = 0; e < makequizformdata.questions.length; e++){ // i do this to fill in the missing parts of the json!
            makequizformdata.questions[e].global_correct = 0;
            makequizformdata.questions[e].global_total = 0;
        }
        $.ajax({
          method: "POST",
          url: "/quiz",
          data: makequizformdata
        })
          .done(function(msg) {
            console.log( "Data Saved: " + msg );
           });
    });
// --------- --------- --------- ^^^^^ THIS IS FOR THE CREATION OF A QUIZ FUNCTIONALITY ^^^^^ --------- --------- ---------



// --------- --------- --------- --------- THIS IS FOR THE EDITING OF A QUIZ FUNCTIONALITY --------- --------- --------- ---------
    var altholderforedit = 0;
    $(".edit").click(function() { //This is the response for the edit drop down menu.
        $.ajax({
                url: "/quiz/" + $(this).attr("alt"),
                dataType: "text",
                success: function(data) {
                    quizedit = $.parseJSON(data);
                    console.log(quizedit);
                },
                async: false
        });
            $("#container").empty(); //clears the container HTML div so i can make new stuff in it
            $("#container").append("<h1>Edit your quiz!</h1>").hide().fadeIn(1000); //fadeIn all new HTML
            $("#container").append("<h4>The correct answer text field accepts an array placement number. This means that if the correct answer choice is the first answer choice listed, then the correct answer would be '0'. Thus, the second would be '1', third would be '2', etc.");
            $("#container").append("<div class=\"col-md-8 col-md-offset-2 choices radio\" id=\"interface\">"); //making a dynamic div
            $("#interface").append("<form id='editquiz' class='form-horizontal'>");  
            $(".form-horizontal").append('<div class="form-group"><label for="title" class="col-sm-2 control-label">Title</label><div class="col-sm-10"><input type="text" class="form-control" id="title" name="title" value="' + quizedit.title + '"placeholder="Title"></div></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="description" class="col-sm-2 control-label">Description</label><div class="col-sm-10"><textarea rows="2" class="form-control" id="description" name="description" placeholder="Description">' + quizedit.description + '</textarea></div></div>');

            $(".form-horizontal").append('<div class="form-group form-group-meta-tags-quiz"><label for="meta_tags" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" value="' + quizedit.meta_tags[0] + '"placeholder="Meta_tag"></div><a><button id="addmetatagstoquizedit" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
            for (var metatagsforquiz = 1; metatagsforquiz < quizedit.meta_tags.length; metatagsforquiz++){
            $(".form-group-meta-tags-quiz").append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" value="' + quizedit.meta_tags[metatagsforquiz] + '" placeholder="Answer Choice"></div>');
            }
            $(".form-horizontal").append('<div class="form-group"><label for="difficulty" class="col-sm-2 control-label">Difficulty</label><div class="col-sm-10"><input type="text" class="form-control" id="difficulty" name="difficulty" value="' + quizedit.difficulty + '" placeholder="Difficulty, from 1-20"></div></div>');

            for (var y = 0; y < quizedit.questions.length; y++){
            $(".form-horizontal").append('<hr>');
            $(".form-horizontal").append('<h4>Question ' + (y+1) + '</h4>');
            $(".form-horizontal").append('<div class="form-group"><label for="question' + (y+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (y+1) + '" name="questions[' + y + '][text]" value="' + quizedit.questions[y].text + '" placeholder="Text"></div></div>');

            $(".form-horizontal").append('<div class="form-group" id="question' + y + '" alt="' + y + '"><label for="answerchoice' + (y+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (y+1) + '" name="questions[' + y + '][answers][]" value="' + quizedit.questions[y].answers[0] + '" placeholder="Answer Choice"></div><a><button id="addchoicestoquestionedit" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Choice!</button></a></div>');
            for (var questionsforquiz = 1; questionsforquiz < quizedit.questions[y].answers.length; questionsforquiz++){
            $("#question" + y).append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $("#question" + y).attr("alt") + '][answers][]" value="' + quizedit.questions[y].answers[questionsforquiz] + '" placeholder="Answer Choice"></div>');
            }

            $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (y+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (y+1) + '" name="questions[' + y + '][correct_answer]" value="' + quizedit.questions[y].correct_answer + '" placeholder="Correct Answer (# of the array spot; i.e 0,1,2,3...)"></div></div>');

            $(".form-horizontal").append('<div class="form-group" id="metatagforquestion' + y + '" alt="' + y + '"><label for="meta_tags' + (y+1) + '" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (y+1) + '" name="questions[' + y + '][meta_tags][]" value="' + quizedit.questions[y].meta_tags[0] + '" placeholder="Meta_tag"></div><a><button id="addmetatagstoquestionedit" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
            for (var metatagsforquestions = 1; metatagsforquestions < quizedit.questions[y].meta_tags.length; metatagsforquestions++){
            $("#metatagforquestion" + y).append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $("#question" + y).attr("alt") + '][meta_tags][]" value="' + quizedit.questions[y].meta_tags[metatagsforquestions] + '" placeholder="Meta_tag"></div>');
            }

            altholderforedit = y+1;
        }
            $("#interface").append('<center><a><button id="addquestionsedit" type="button" class="btn btn-info btn-lg"><i class="icon-plus-sign"></i> Add more Questions</button></a></center>')
            $("#interface").append('<br>')
            $("#interface").append('<center><a href="/"><button id="editquizbutton" type="button" class="btn btn-success btn-lg"><i class="icon-upload-alt"></i> Edit your quiz!</button></a></center>')
    });

    $("#container").on("click", "#addmetatagstoquizedit", function(){ //when the user wants to add more metatags to the quiz during the creation process
        $(".form-group-meta-tags-quiz").append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags[]" name="meta_tags" placeholder="Meta_tag"></div>');
    });
    $("#container").on("click", "#addmetatagstoquestionedit", function(){ //when the user wants to add more metatags to questions during the creation process
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][meta_tags][]" placeholder="Meta_tag"></div>');
    });
    $("#container").on("click", "#addchoicestoquestionedit", function(){ //when the user wants to add more answer choices to questions during the creation process
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][answers][]" placeholder="Answer Choice"></div>');
    });
    $("#container").on("click", "#addquestionsedit", function() {
        $(".form-horizontal").append('<hr>');
        $(".form-horizontal").append('<h4>Question ' + (altholderforedit+1) + '</h4>');
        $(".form-horizontal").append('<div class="form-group"><label for="question' + (altholderforedit+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (altholderforedit+1) + '" name="questions[' + altholderforedit + '][text]" placeholder="Text"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + altholderforedit + '"><label for="answerchoice' + (altholderforedit+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (altholderforedit+1) + '" name="questions[' + altholderforedit + '][answers][]" placeholder="Answer Choice"></div><a><button id="addchoicestoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Choice!</button></a></div>');
        $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (altholderforedit+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (altholderforedit+1) + '" name="questions[' + altholderforedit + '][correct_answer]" placeholder="Correct Answer (# of the array spot; i.e 0,1,2,3...)"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + altholderforedit + '"><label for="meta_tags' + (altholderforedit+1) + '" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (altholderforedit+1) + '" name="questions[' + altholderforedit + '][meta_tags][]" placeholder="Meta_tag"></div><a><button id="addmetatagstoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
        altholderforedit++;
    });
    $("#container").on("click", "#editquizbutton", function() { //the submit button for the quiz creation process.
        var editquizformdata = $("form#editquiz").serializeObject();
        console.log(editquizformdata);
        if (editquizformdata.questions.length <= quizedit.questions.length){
        for (var d = 0; d < editquizformdata.questions.length; d++){ // i do this to fill in the missing parts of the json!
            editquizformdata.questions[d].global_correct = quizedit.questions[d].global_correct;
            editquizformdata.questions[d].global_total = quizedit.questions[d].global_total;
            }
        }
        else {
        for (var g = 0; g < quizedit.questions.length; g++){
            editquizformdata.questions[g].global_correct = quizedit.questions[g].global_correct;
            editquizformdata.questions[g].global_total = quizedit.questions[g].global_total;
            }
        for (var p = quizedit.questions.length; p < editquizformdata.questions.length; p++){
            editquizformdata.questions[p].global_correct = 0;
            editquizformdata.questions[p].global_total = 0;
        }
        }
        editquizformdata.id = quizedit.id;
        $.ajax({
          method: "PUT",
          url: "/quiz",
          data: editquizformdata
        })
          .done(function(msg) {
            console.log( "Data Saved: " + msg );
           });
    });
// --------- --------- --------- ^^^^^ THIS IS FOR THE EDITING OF A QUIZ FUNCTIONALITY ^^^^^ --------- --------- ---------



// --------- --------- --------- --------- THIS IS FOR THE DELETION OF A QUIZ FUNCTIONALITY --------- --------- --------- ---------

    $(".delete").click(function() { //This is the response for the delete drop down menu.
        $.ajax({
            url: "/quiz/" + $(this).attr("alt"),
            type: "DELETE"
        })
            .done(function(msg) {
                console.log("deleted completed" + msg);
            });
    });

// --------- --------- --------- ^^^^^^^^^^^ THIS IS FOR THE DELETION OF A QUIZ FUNCTIONALITY ^^^^^^^^^^ --------- --------- ---------




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
////////////////////////////////////////////////////////////////////////
        $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
          {
            tags: String(quiz.questions[tracker].meta_tags),
            tagmode: "any",
            format: "json"
          },
          function(data) {
            $.each(data.items, function(i,item){
              $("<br><img />").attr("src", item.media.m).appendTo("#interface");
              if ( i == 0 ) return false;
            });
          });
//////////////////////////////////////////////////////////////////////// calls the image from flickr to display onto page
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
////////////////////////////////////////////////////////////////////////
        $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
          {
            tags: String(quiz.questions[tracker].meta_tags),
            tagmode: "any",
            format: "json"
          },
          function(data) {
            $.each(data.items, function(i,item){
              $("<br><img />").attr("src", item.media.m).appendTo("#interface");
              if ( i == 0 ) return false;
            });
          });
//////////////////////////////////////////////////////////////////////// calls the image from flickr to display onto page
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

        //sends a put request to the server
        $.ajax({
          method: "PUT",
          url: "/quiz",
          data: myRealJsonString
        })
          .done(function(msg) {
            console.log( "Data Saved: " + msg );
          });

        //retrieving the quiz again after puting to it
        $.ajax({
            url: "js/quiz.json",
            dataType: "text",
                success: function(data) {
            quiz = $.parseJSON(data);
            console.log(quiz);
            }
        });

        $("#container").empty();
        $("#container").append("<h2>Hi " + username + "! Congratulations on completing that quiz. You scored " + grade + " out of " + (quiz.questions.length) + " correct.</h2>").hide().fadeIn(1000);
        //making HTML

        //making tables
        $("#container").append("<center><table id='tabletobe' border='1' style='width: 90%'>");
        $("#tabletobe").append("<tr><td>Questions</td><td>Total Correct</td><td>Total Answered</td><td>% of other players who answered correctly</td><td>The Correct Choice</td><td>Your Answer Choice</td></tr>");
        for(var f=0; f<quiz.questions.length; f++){
            $("#tabletobe").append("<tr><td>" + quiz.questions[f].text + "</td><td>" + quiz.questions[f].global_correct + "</td><td>" + quiz.questions[f].global_total + "</td><td>" + (100*(quiz.questions[f].global_correct/quiz.questions[f].global_total)) + "% </td><td>" + quiz.questions[f].answers[quiz.questions[f].correct_answer] + "</td><td>" + quiz.questions[f].answers[currentAnswers[f]] + "</td></tr>");
        }

        changetop();
        var myJsonString2 = JSON.stringify(top10);
        var myRealJsonString2 = JSON.parse(myJsonString2);
        //sends a post request to the server for top 10
        $.ajax({
          method: "POST",
          url: "/top",
          data: myRealJsonString2
        })
          .done(function(msg) {
            console.log( "Data Saved: " + msg );
          });

        //retrieving top10 after posting to it
        $.ajax({
            url: "js/top10.json",
            dataType: "text",
                success: function(data) {
            top10 = $.parseJSON(data);
            }
        });

        //making 2nd table for top 10
        $("#container").append("<h2>Top 10 Users</h2>")
        $("#container").append("<center><table id='tabletobe2' border='1' style='width: 90%'>");
        $("#tabletobe2").append("<tr><td>Username</td><td>Score</td></tr>");
        //selection sorting stuff
        var greatesttoleast = [];
        for(var d=0; d<top10.records.length; d++){
            greatesttoleast[d] = d;
        }
        var max;
        for(var b=0; b<greatesttoleast.length-1; b++){
            max=b;
            for (h=b+1; h < greatesttoleast.length; h++){
                if (parseInt(top10.records[greatesttoleast[h]].score) > parseInt(top10.records[greatesttoleast[max]].score)){
                    max = h;
                }
            }
            if (max != b){
              var tmp = greatesttoleast[b];
              greatesttoleast[b] = greatesttoleast[max];
              greatesttoleast[max] = tmp;  
            }
        }
        //back to making tables
        for(var e=0; e<10; e++){
            $("#tabletobe2").append("<tr><td>" + top10.records[greatesttoleast[e]].user + "</td><td>" + top10.records[greatesttoleast[e]].score + "% </tr>");
        }

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
    const BITS_TEXT = 'PhaseThree:Quiz';
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
    const BITS_TEXT = 'PhaseThree:Quiz';
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

function changetop() {
    var grade = gradeQuiz(); //calls gradeQuiz function
    var cactus = top10.records.length;
    var percentagegrade = (100*grade/quiz.questions.length);
    var newelement = {'user':username, 'score':percentagegrade};
    top10.records.push(newelement);
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
