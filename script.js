//Excute once the window is loaded
window.onload = function(){

    //Hide all other elements except the rules and input
    $('#showPoint').hide();
    $('#score').hide();
    $('#Score').hide();
    $('#best').hide();

    //Get The Entry Page    
    var entrypage = document.getElementById("entrypage");

    //Get the start button and bind the click event
    var start_btn = document.getElementById("startbtn");
    start_btn.addEventListener("click",function(){
        console.log("Clicked")
        startGame()
    });


    //Define the startGame function
    function startGame(){
        //Block the display of entry page once game is started
        entrypage.style.display = "none";

        //Display the other elements now 
        $('#showPoint').show();
        $('#score').show();
        $('#myCanvas').show();
        $('#animCanvas').show();
        
        //Pick the selected theme and select image accordingly
        // let theme = $('#opt').val()
        // if(theme=="Basic"){
        //     document.body.style.backgroundImage = "url('Basic.jpeg')";
        // }
        // else if(theme=="Summer"){
        //     document.body.style.backgroundImage = "url('summer.jpg')";
        // }
        // else if(theme=="Winter"){
        //     document.body.style.backgroundImage = "url('winter.jpg')";
        // }
        
        StartGame_Helper();
        // let name =  $("#username").val();
        // if(name.length == 0){
        //     alert('Please enter your name');
        //     document.location.href = 'index.html';
        // }
        // else{
        //     document.getElementById("playername").innerHTML = "PlayerName : " + name;
        // }
    }
    
    //Variable to keep track of the best score
    var bestScore = 0;
    
    //Define the startGame Helper function
    function StartGame_Helper(){

        //Set the Timer for 6 secs for an arrow
        var countTimeOut;
        function countTime(){
            var container = document.getElementById("timerDiv");
            container.innerHTML = "<div class='timer'></div>";
            countTimeOut = setTimeout(shoot,6000);
        }
        countTime();
        
        //Score Area Display
        var gameScore = document.getElementById("score");
        gameScore.innerHTML = "0";

        //Initially Total Score : 0 & Board isn't moving
        var totalScore = 0;
        var autoMove = false;
    
        //Get the window and height of window
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var updatePointArea = document.getElementById("showPoint");
        updatePointArea.style.height = h+"px";
        updatePointArea.style.width = w+"px";

        //Get the arrows display
        var uScore = document.querySelector("#showPoint .u");
        var arrs = document.getElementById("arrs");
        
        //Function to update the number of arrows
        function updateArrows(number_of_arrows){
            var arr = "&uarr;";
            arr = arr.repeat(number_of_arrows);
            arrs.innerHTML = arr;
        }

        //Function to animate the score 
        function animateScore(scr,arrNum){
            if(scr >= 7) uScore.innerHTML = "&uarr; +"+scr;
            else uScore.innerHTML = "+"+scr;
            updateArrows(arrNum);
            var t = 50, l = 70, o = 1;
            var animIntv = setInterval(function(){
                uScore.style.top = t + "%";
                uScore.style.left = l + "%";
                uScore.style.opacity = o;
                t-=4;
                l-=3;
                o-=0.1;
            },100)
            setTimeout(function(){
                clearInterval(animIntv);
                uScore.style.opacity = 0;
                uScore.style.top = "50%";
                uScore.style.left = "70%";
            },1000);
        }

        //Grab the animCanvas and set width and height
        var c2 = document.getElementById("animCanvas");
        c2.height = h;
        c2.width = w;
        var ctx2 = c2.getContext("2d");

        //Build a prototype for FireWorks Animation
        var fwBuilder = function(n,x,y,speed){
            this.n = n;
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.balls = [];
        }
    
        fwBuilder.prototype.ready = function(){
            for(var i = 0; i < this.n; i++){
                this.balls[i] = {
                    x:this.x,
                    y:this.y,
                    dx:this.speed*Math.sin(i*Math.PI*2/this.n),
                    dy:this.speed*Math.cos(i*Math.PI*2/this.n),
                    u:this.speed*Math.cos(i*Math.PI*2/this.n),
                    t:0
                }
            }
        }

        //Define the draw function for animation of fireworks
        fwBuilder.prototype.draw = function(){
            for(var i = 0; i < this.n; i++){
                ctx2.beginPath();
                ctx2.arc(this.balls[i].x,this.balls[i].y,7,0,Math.PI*2);
                ctx2.fill();
                ctx2.closePath();
                this.balls[i].x += this.balls[i].dx;
                this.balls[i].y += this.balls[i].dy;
            
                this.balls[i].dy += .025;
            }
        
            if(this.balls[Math.round(this.n/2)].y > h){
                clearInterval(intvA);
                running = false;
                ctx2.clearRect(0,0,w,h);
            }
        }
        
        //Set 2 fireworks : 1 at left and other at right
        var fw1 = new fwBuilder(40,w/5,h,3);
        var fw2 = new fwBuilder(40,4*w/5,h,3);
    
        var intvA;
        var running = false;
        
        //Define a function to call fireworks by setting an interval
        function newF(){
            if(!running){
                fw1.ready();
                fw2.ready();
                running = true;
                intvA = setInterval(function(){
                    ctx2.clearRect(0,0,w,h);
                    fw1.draw();
                    fw2.draw();
                },15)
            }
        }
        
        //call the function once at the start of game
        newF();
        
        //Get the Canvas Area
        var c = document.getElementById("myCanvas");
        c.height = h;
        c.width = w;
        var ctx = c.getContext("2d");
        var checkArrowMoveWithBoard1 = false;
        var checkArrowMoveWithBoard2 = false;

        // Objects :   1)  Arc
        //             2)  Rope
        //             3)  Board
        var arc = {
            x:30,
            y:100,
            dy:3,
            r:50,
            color:"#000",
            lw:3,
            start:Math.PI+Math.PI/2,
            end:Math.PI-Math.PI/2
        }
    
        var rope = {
            h:arc.r*2,
              lw:1,
              x:arc.x-25,
              color:"#000",
              status:true
        }
    
        var board = {
            x:w-40,
            y:h/2,
            dy:4,
            height:150,
            width:7
        }
        
        //Define The Maximum Number of Arrows
        var boardY;
        var boardMove = false;
        var totalArr = 5;
        updateArrows(totalArr);

        //Function for drawing the board
        function drawBoard() {
            ctx.beginPath();
            ctx.fillRect(board.x,board.y-5,40,board.width+3);
            ctx.fillRect(board.x,board.y-board.height/2,board.width,board.height);
            ctx.moveTo(board.x,board.y-15);
            ctx.quadraticCurveTo(board.x-10,board.y,board.x,board.y+15);
            //ctx.lineTo(10,6);
            ctx.fillStyle = "#36e";
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = "#000";
        
            if(board.y >= h || board.y <= 0){
                board.dy *= -1;
            }
        
            if(autoMove){
                board.y += board.dy;
                if(checkArrowMoveWithBoard1){
                    arrow1.moveArrowWithBoard(1);
                }
                else if(checkArrowMoveWithBoard2){
                    arrow2.moveArrowWithBoard(1);
                }
            }
            else{
                if(boardMove){
                    if(Math.abs(board.y - boardY) > 5){
                        board.y += board.dy;
                        arrow1.moveArrowWithBoard(1);
                        arrow2.moveArrowWithBoard(1);
                    }
                }
                else{
                    if(Math.abs(board.y - boardY) > 5){
                        board.y -= board.dy;
                        arrow1.moveArrowWithBoard(-1);
                        arrow2.moveArrowWithBoard(-1);
                    }
                }
            }
        }
    
        //Draw Arrow and Define functionality
        function Arrow(){
            this.w = 85;
            this.x = arc.x-25;
            this.dx = 20;
            this.status = false;
            this.vis = true;
            this.fy = arc.y;
        }
    
        Arrow.prototype.drawArrow = function() {
            if(this.vis) {
                if(this.status) {
                    ctx.fillRect(this.x,this.fy-3,10,6);
                    ctx.fillRect(this.x,this.fy-1,this.w,2);
                    ctx.beginPath();
                    ctx.moveTo(this.x+this.w,this.fy-4);
                    ctx.lineTo(this.x+this.w+12,this.fy);
                    ctx.lineTo(this.x+this.w,this.fy+4);
                    ctx.fill();
                
                    if(moveArrowCheck) {
                        if(this.x < w-155){
                            this.x += this.dx;
                        }
                        else {
                            if(!(this.fy <= board.y-board.height/2 || this.fy >= board.y+board.height/2) || this.x > w){
                                if(this.x > w-110){
                                    if(this == arrow1){
                                        arrow2.vis = true;
                                        checkArrowMoveWithBoard1 = true;
                                        checkArrowMoveWithBoard2 = false;
                                    }
                                    else {
                                        arrow1.vis = true;
                                        checkArrowMoveWithBoard1 = false;
                                        checkArrowMoveWithBoard2 = true;
                                    }
                                    moveArrowCheck = false;
                                    score++;
                                    if(score === 4){
                                        arc.dy = 5;
                                    }
                            
                                    if(this.fy >= board.y-board.height/2 && this.fy <= board.y+board.height/2) {
                                        var scores = this.fy - board.y;
                                        var currentScore = Math.round(board.height/20)-Math.round(Math.abs(scores/10));
                                        if(currentScore >= 7){
                                            newF();
                                            totalArr+=2;
                                        }
                                        else if(currentScore>=6){
                                            totalArr+=1;
                                        }
                                
                                        totalScore += currentScore;
                                        gameScore.innerHTML = totalScore;
                                    
                                        animateScore(currentScore,totalArr);
                                    
                                        boardY = board.y + scores;
                                        if(scores>=0){
                                            boardMove = true;
                                        }
                                        else {
                                            boardMove = false;
                                        }
 
                                    }
                                    else{
                                        updateArrows(totalArr);
                                    }

                                    if(totalScore >= 30){
                                        autoMove = true;
                                    }

                                    if(totalArr <= 0){
                                        clearInterval(intv);
                                        // document.body.style.backgroundImage = "url('Img2.jpg')";
                                        document.getElementById("animCanvas").removeEventListener("click",shoot);
                                        document.body.removeEventListener("keydown",shoot);
                                        entrypage.style.display = "block";
                                        $('#myCanvas').hide();
                                        $('#animCanvas').hide();
                                        $('#showPoint').hide();
                                        $('#score').hide();
                                        document.getElementById("title").innerHTML = "Your Score<br>"+totalScore;
                                        if(bestScore < totalScore){
                                            bestScore = totalScore;
                                            console.log(bestScore);
                                        }
                                        $('#best').show()
                                        document.getElementById("score").innerHTML = 0;
                                        document.getElementById("best").innerHTML = "Best Score : " + bestScore;
                                    }
                                }
                                else {
                                    this.x += this.dx;
                                }
                            }
                            else {
                                this.x += this.dx;
                            }
                        }
                    }
                }
                else {
                    ctx.fillRect(rope.x,arc.y-3,10,6);
                    ctx.fillRect(rope.x,arc.y-1,this.w,2);
                    ctx.beginPath();
                    ctx.moveTo(rope.x+this.w,arc.y-4);
                    ctx.lineTo(rope.x+this.w+12,arc.y);
                    ctx.lineTo(rope.x+this.w,arc.y+4);
                    ctx.fill();
                }
            }
        }

        // Arrow Move With Board
        Arrow.prototype.moveArrowWithBoard = function(dir) {
            if(this == arrow1){
                arrow1.fy += board.dy*dir;
            }
            else {
                arrow2.fy += board.dy*dir;
            }
        }

        //Two Arrows would be used :
        //Once an arrow goes to strike the board the other arrow appears in bow
        var arrow1 = new Arrow();
        var arrow2 = new Arrow();
        
        //Count of how many arrows have been used
        var arrows = 0;

        //Is the arrow moving
        var moveArrowCheck = false;

        var score = 0;
    
        //Functions for Drawing Items :
        //  1) Draw Board
        //  2) Draw Arc
        //  3) Draw Rope
        function drawArc() {
            ctx.beginPath();
              ctx.arc(arc.x,arc.y,arc.r,arc.start,arc.end);
              ctx.strokeStyle = arc.color;
              ctx.lineWidth = arc.lw;
              ctx.stroke();
              ctx.closePath();
        }
    
        function drawRope() {
            ctx.beginPath();
              ctx.moveTo(arc.x,arc.y-arc.r);
              if(arrow1.vis && arrow2.vis){
                ctx.lineTo(rope.x,arc.y);
              }
              ctx.lineTo(arc.x,arc.y+arc.r);
              ctx.lineWidth = rope.lw;
              ctx.strokeStyle = rope.color;
              ctx.stroke();
              ctx.closePath();
        }

        //Arrow Moving function...
        function move (){
            ctx.clearRect(0,0,w,h);
            if(arc.y>h-50 || arc.y<50){
              arc.dy*=-1;
            }
            arc.y+=arc.dy;
        }
      
        //Arrow Shooting Function
        function shoot(){
            if(arrow1.vis && arrow2.vis && arrows != -1){
                moveArrowCheck = true;
                clearTimeout(countTimeOut);
                countTime();
                if(arrows%2===0){
                    arrow1.status = true;
                    arrow1.fy = arc.y;
                    arrow2.status = false;
                    arrow2.x = rope.x;
                    arrow2.vis = false;
                }
                else{
                    arrow1.status = false;
                    arrow2.fy = arc.y;
                    arrow2.status = true;
                    arrow1.x = rope.x;
                    arrow1.vis = false;
                }
            totalArr--;
            }
            arrows++;
        }
        
        //On any key stroke, call the shoot arrow function
        document.getElementById("animCanvas").addEventListener("click",shoot);
        document.body.addEventListener("keydown",shoot);
        
        //Call the functions for drawing various objects and load the game
        var intv = setInterval(function(){
              move();
              drawArc();
              drawRope();
              arrow1.drawArrow();
              arrow2.drawArrow();
              drawBoard();
        },15)
    }
}
    