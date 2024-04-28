class Clock extends Domel {
  T
  stepperSeconds
  stepperMinutes
  stepperHours

  constructor(canvasSel, T=-1) {
    super(canvasSel)
    this.T = T

    const ff = 1.0
    this.stepperHours = new Stepper(ff/3600)
    this.stepperMinutes = new Stepper(ff/60)
    this.stepperSeconds = new Stepper(ff)
  }
  

  draw(ms) {
    const canvas = this.el
    const {width: W, height: H} = canvas
    const ctx = canvas.getContext('2d')

    ctx.reset()

    ctx.save();
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, W/2, H/2);
    ctx.transform(2.000000, 0.000000, 0.000000, 2.000000, 0, 0);
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, -128, -128);

    this.drawDial(ms)
    this.drawHands(ms)
    StartGame_Helper();

    ctx.restore();
  }
  StartGame_Helper(){

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

  steppersStartMaybe(ms) {

    if (this.T<0) {
      this.T = new Date()
	- new Date(new Date().toISOString().split('T').shift()).getTime()
	- new Date().getTimezoneOffset() * 60000
    }

    let T = this.T
    // console.log({T})

    if (!this.stepperHours.isActive) {
      this.stepperHours.start()
      this.stepperHours.rotr.phase = ((T/3600000)%12)/12
    }

    T %= 3600000
    if (!this.stepperMinutes.isActive) {
      this.stepperMinutes.start()
      this.stepperMinutes.rotr.phase = ((T/60000)%60)/60
    }

    T %= 60000
    if (!this.stepperSeconds.isActive) {
      this.stepperSeconds.start()
      this.stepperSeconds.rotr.phase = ((T/1000)%60)/60

      console.log({
	rotrs: {
	  hours: this.stepperHours.rotr,
	  minutes: this.stepperMinutes.rotr,
	  seconds: this.stepperSeconds.rotr,
	}
      })
    }

  }

  drawHands(ms) {
    let cost, sint

    this.steppersStartMaybe(ms)

    const {radians: secondsRadians}
	  = this.stepperSeconds.step(ms)
    const {radians: minutesRadians}
	  = this.stepperMinutes.step(ms)
    const {radians: hoursRadians}
	  = this.stepperHours.step(ms)

    const canvas = this.el
    const ctx = canvas.getContext('2d')
    const {width: W, height: H} = canvas

    // #layer2

    
    // #hour-hand
    cost = Math.cos(hoursRadians)
    sint = Math.sin(hoursRadians)

    ctx.save();
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, 128, 128);
    ctx.transform(cost, sint, -sint, cost, 0, 0);
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, -128, -128);

    ctx.beginPath();
    ctx.fillStyle = 'rgb(128, 0, 0)';
    ctx.lineWidth = 0.279296;
    ctx.moveTo(129.412990, 60.188843);
    ctx.lineTo(134.027040, 66.472660);
    ctx.lineTo(138.141510, 127.383510);
    ctx.bezierCurveTo(138.520540, 132.994810, 133.613790, 137.535320, 127.989720, 137.535320);
    ctx.bezierCurveTo(122.365610, 137.535320, 117.837900, 133.007610, 117.837900, 127.383510);
    ctx.lineTo(122.190920, 66.472660);
    ctx.lineTo(126.666670, 60.195839);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    
    // #minute-hand
    cost = Math.cos(minutesRadians)
    sint = Math.sin(minutesRadians)
    ctx.save();
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, 128, 128);
    ctx.transform(cost, sint, -sint, cost, 0, 0);
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, -128, -128);

    ctx.beginPath();
    ctx.fillStyle = 'rgb(0, 128, 0)';
    ctx.lineWidth = 0.282287;
    ctx.moveTo(129.862710, 40.032634);
    ctx.lineTo(132.868020, 45.782080);
    ctx.lineTo(136.191290, 124.695940);
    ctx.bezierCurveTo(136.490170, 131.793090, 132.534250, 135.128950, 127.991690, 135.128950);
    ctx.bezierCurveTo(123.449110, 135.128950, 119.792080, 131.808950, 119.792080, 124.695940);
    ctx.lineTo(123.308010, 45.782080);
    ctx.lineTo(126.125010, 40.035298);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    
    // #seconds-hand
    cost = Math.cos(secondsRadians)
    sint = Math.sin(secondsRadians)
    ctx.save();
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, 128, 128);
    ctx.transform(cost, sint, -sint, cost, 0, 0);
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, -128, -128);

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 204, 0)';
    ctx.lineWidth = 4.189440;
    ctx.moveTo(128.000000, 138.535900);
    ctx.lineTo(128.000000, 31.926484);
    ctx.stroke();
    
    // #seconds-pivot
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 204, 0)';
    ctx.lineWidth = 2.140090;
    ctx.arc(128.000000, 128.000020, 5.571456, 0.000000, 6.28318531, 1);
    ctx.fill();

  }

  drawDial(ms) {
    const canvas = this.el
    const ctx = canvas.getContext('2d')

    // #layer1
    ctx.save();
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, -46.183300, -39.385200);
    
    // #path1
    ctx.beginPath();
    ctx.fillStyle = 'rgb(128, 128, 0)';
    ctx.lineWidth = 0.279296;
    ctx.arc(174.183350, 167.385210, 122.394130, 0.000000, 6.28318531, 1);
    ctx.fill();
    
    // #path9
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 5.585920;
    ctx.moveTo(280.421620, 167.385190);
    ctx.lineTo(294.284510, 167.385190);
    ctx.stroke();
    
    // #path10
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 5.585920;
    ctx.moveTo(67.945071, 167.385190);
    ctx.lineTo(54.082183, 167.385190);
    ctx.stroke();
    
    // #path12
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 5.586370;
    ctx.moveTo(174.183350, 61.146928);
    ctx.lineTo(174.183350, 47.284039);
    ctx.stroke();
    
    // #path13
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 5.585920;
    ctx.moveTo(174.183350, 273.623470);
    ctx.lineTo(174.183350, 287.486360);
    ctx.stroke();
    
    // #path14
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 2.792960;
    ctx.moveTo(227.302480, 75.380160);
    ctx.lineTo(234.233920, 63.374546);
    ctx.stroke();
    
    // #path15
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 2.792960;
    ctx.moveTo(121.064200, 259.390250);
    ctx.lineTo(114.132760, 271.395860);
    ctx.stroke();
    
    // #path16
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 2.792960;
    ctx.moveTo(266.188380, 114.266060);
    ctx.lineTo(278.194000, 107.334610);
    ctx.stroke();
    
    // #path17
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 2.792960;
    ctx.moveTo(82.178301, 220.504330);
    ctx.lineTo(70.172686, 227.435780);
    ctx.stroke();
    
    // #path18
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 2.792960;
    ctx.moveTo(121.064200, 75.380160);
    ctx.lineTo(114.132760, 63.374546);
    ctx.stroke();
    
    // #path19
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 2.792960;
    ctx.moveTo(227.302480, 259.390250);
    ctx.lineTo(234.233920, 271.395860);
    ctx.stroke();
    
    // #path20
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 2.792960;
    ctx.moveTo(82.178314, 114.266060);
    ctx.lineTo(70.172701, 107.334610);
    ctx.stroke();
    
    // #path21
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(221, 255, 85)';
    ctx.lineWidth = 2.792960;
    ctx.moveTo(266.188390, 220.504330);
    ctx.lineTo(278.194010, 227.435780);
    ctx.stroke();
    ctx.restore();
    
  }
}