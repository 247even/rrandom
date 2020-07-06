function windowReload(){
    window.location.reload(true); 
};

function randomresult(){
    var rr = Math.floor((Math.random() * 2) + 1);
    console.log("randomResult: "+rr);
    return rr;
};

function getResult(){
    console.log("getResult, s: "+s);
    setTimeout( function() {
        tone2.play();
        $("#buttonwrapper").addClass('display_none');
        $("#resultwrapper").removeClass('display_none');
        if (s == 1){
            $("#resultno").addClass('display_none');
            $("#resultyes").removeClass('display_none');
        } else if (s == 2){
            $("#resultyes").addClass('display_none');
            $("#resultno").removeClass('display_none');        
        }
    }, 500);
};

function setResult(sr){
    if( sr = 0 || typeof sr == "undefined"){
        s = randomresult();
        console.log("setResult s: "+s);
        return false;
    };
    if ( sr == 1 || sr == 2) {
        s = sr;
        return false;   
    };
};

/////////////////////////////////////////////////////////////////////////////////

$('#start')
    .on("mousedown", function(e){
        console.log("start mousedown fired");
    
        var t = 500;
        var to = setTimeout(function () {
            tone1.play();
        }, t);
    
        ms = e.pageY;
        $(document).unbind("mouseup");
    
        $(document).bind("mouseup", function(e){
            console.log("start mouseup fired");
            me = e.pageY;
            moff = ms - me;
            console.log(moff);
            // Tolleranzwert
            tol = 50;
            tolm = tol * -1;
            if (ms > me && moff > tol){
                s = 1;
            } else if (ms < me && moff < tolm ){
                s = 2;
            } else {
                setResult();  
            };
            
            getResult();
    })
});

$('#cheatyes').on("mouseup", function(){
        setResult(1);
        getResult();
    })
    .dblclick(function(){
        console.log("cheatyes doubleklicked"); 
});

$('#cheatno').on("mouseup", function(){
        setResult(2);
        getResult();
    })
    .dblclick(function(){
        console.log("cheatno doubleclicked");
});


$('#resultwrapper').on("click", function(){
    console.log("resultwrapper clicked");
    reset();
});

//////////////////////////////////////////////////////////////////////////////////

var tone1 = new Audio();
tone1.src = 'audio/Tone1-04.mp3';
var tone2 = new Audio();
tone2.src = 'audio/Tone1-01.mp3';
var tone3 = new Audio();
tone3.src = 'audio/Tone1-11.mp3';
var tone4 = new Audio();
tone4.src = 'audio/Tone1-13.mp3';

var s;

function reset(){
    console.log("reset fired");
    
    $("#buttonwrapper, #resultwrapper").addClass('display_none');
    
    var t = 500;
    setTimeout(function () {
        $("#buttonwrapper").removeClass("display_none").addClass("show");
    }, t);    
};

function initRRandom(){
    console.log("initRRANdom started");
    reset();
};


$(function(){
	initRRandom();
});