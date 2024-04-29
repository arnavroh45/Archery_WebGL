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

        StartGame_Helper();
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
        var autoMove = false; //board moving
    
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

        //this can be replaced by gun 
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

        // till here
    
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
            this.radius = 10; // Radius of the ball
            this.x = arc.x - 25; // Initial x-coordinate
            this.y = arc.y; // Initial y-coordinate
            this.dx = 20; // Horizontal speed
            this.dy = 0; // Initial vertical speed
            this.status = true; // Flag to indicate if the ball is in motion
            this.vis = true; // Flag to indicate if the ball is visible
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
                    ctx.fillRect(gun.x,arc.y-3,10,6);
                    ctx.fillRect(gun.x,arc.y-1,this.w,2);
                    ctx.beginPath();
                    ctx.moveTo(gun.x+this.w,arc.y-4);
                    ctx.lineTo(gun.x+this.w+12,arc.y);
                    ctx.lineTo(gun.x+this.w,arc.y+4);
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
        const bullets = [];

        const bulletProps = {
            radius: 5, // Radius of the bullet
            speed: 10, // Speed of the bullet
            color: 'red', // Color of the bullet
          };

          const gun = {
            x: 250, // x-coordinate of the gun
            y: h / 2, // y-coordinate of the gun
            width: 30, // width of the gun
            height: 10, // height of the gun
            angle: 0, // angle of the gun (in radians)
            color: 'white', // color of the gun
            lineWidth: 5, // line width of the gun
            dy: 4
          };

          const gunnob = {
            x: gun.x, // x-coordinate of the gun
            y: gun.y+10, // y-coordinate of the gun
            width: 15, // width of the gun
            height: 5, // height of the gun
            angle: 0, // angle of the gun (in radians)
            color: 'white', // color of the gun
            lineWidth: 5, // line width of the gun
            dy: 4
          };


    
        //Functions for Drawing Items :
        //  1) Draw Board
        //  2) Draw Arc
        //  3) Draw Rope

        function createShootingRange() {
            // Create the background
            ctx.fillStyle = '#000000'; // Sky blue color
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          
            // Create the ground
            ctx.fillStyle = '#8b4513'; // Brown color
            ctx.fillRect(0, canvas.height-100, canvas.width, 100);
            // Create the shooting line
            ctx.beginPath();
            ctx.moveTo(50, canvas.height - 200);
            ctx.lineTo(50, canvas.height - 150);
            ctx.strokeStyle = 'black';
            ctx.stroke();
          
            // Draw the sun
            drawSun(canvas.width - 100, 100);

            drawLampPost(120, canvas.height);
          }

          function drawLampPost(x, y) {
            // Draw the stand
            ctx.fillRect(x-20, y-250, 20, 250);
          
            // Draw the bulb
            ctx.beginPath();
            ctx.arc(x-12, y - 280, 30, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
          }
          
          function drawSun(x, y) {
            ctx.beginPath();
            ctx.arc(x, y, 50, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
          }

        function drawBullets() {
            bullets.forEach((bullet, index) => {
              // Move the bullet
              bullet.x += bullet.dx;
              bullet.y += bullet.dy;
          
              // Draw the bullet
              ctx.beginPath();
              ctx.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
              ctx.fillStyle = bullet.color;
              ctx.fill();
              ctx.closePath();
          
              // Remove bullets that go off-screen
              if (
                bullet.x < 0 ||
                bullet.x > w ||
                bullet.y < 0 ||
                bullet.y > h
              ) {
                bullets.splice(index, 1);
              }
            });
          }

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

        function drawGun() {
            ctx.beginPath();
            ctx.save(); // Save the current canvas state
            ctx.translate(gun.x + gun.width / 2, gun.y); // Translate to the center of the gun
            ctx.rotate(gun.angle); // Rotate the gun
            ctx.rect(-gun.width / 2, -gun.height / 2, gun.width, gun.height); // Draw the gun
            ctx.strokeStyle = gun.color;
            ctx.lineWidth = gun.lineWidth;
            ctx.stroke();
            ctx.restore(); // Restore the canvas state
            ctx.closePath();
          }

          function drawGunnob() {
            ctx.beginPath();
            ctx.save(); // Save the current canvas state
            ctx.translate(gunnob.x + gunnob.width / 2, gunnob.y); // Translate to the center of the gun
            ctx.rotate(gunnob.angle); // Rotate the gun
            ctx.rect(-gunnob.width / 2, -gunnob.height / 2, gunnob.width, gunnob.height); // Draw the gun
            ctx.strokeStyle = gunnob.color;
            ctx.lineWidth = gunnob.lineWidth;
            ctx.stroke();
            ctx.restore(); // Restore the canvas state
            ctx.closePath();
          }

        //Arrow Moving function...
        function move (){
            ctx.clearRect(0,0,w,h);
            if (board.y > h - 50 || board.y < 50) {
                board.dy *= -1; // Reverse the vertical direction
              }
              board.y += board.dy; // Update the gun's vertical position
            //   gunnob.y += gun.dy; // Update the gun's vertical position
        }
      
        //Arrow Shooting Function
        function shoot(){
            const bullet = {
                x: gun.x + gun.width / 2, // Start x-coordinate of the bullet
                y: gun.y, // Start y-coordinate of the bullet
                dx: Math.cos(gun.angle) * bulletProps.speed, // Horizontal speed of the bullet
                dy: Math.sin(gun.angle) * bulletProps.speed, // Vertical speed of the bullet
                radius: bulletProps.radius, // Radius of the bullet
                color: bulletProps.color, // Color of the bullet
              };
            
              // Add the new bullet to the bullets array
              bullets.push(bullet);
        }
        
        //On any key stroke, call the shoot arrow function
        document.getElementById("animCanvas").addEventListener("click", shoot);
        document.body.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            shoot();
        }
        });
        
        //Call the functions for drawing various objects and load the game
        var intv = setInterval(function(){
            move();
            createShootingRange();
            //   drawArc();
            // drawRope();
            drawGun();
            drawGunnob();
            drawBullets();
            arrow1.drawArrow();
            arrow2.drawArrow();
            drawBoard();
        },15)
    }
}
    