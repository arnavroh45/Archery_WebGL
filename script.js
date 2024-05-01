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
    
    
    //Define the startGame Helper function
    function StartGame_Helper(){

        //Set the Timer for 6 secs for a bullet
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

        //Get the bullets display
        var uScore = document.querySelector("#showPoint .u");
        var arrs = document.getElementById("arrs");
        
        //Function to update the number of bullets
        function updateBullets(number_of_bullets){
            var arr = "&uarr;";
            arr = arr.repeat(number_of_bullets);
            arrs.innerHTML = arr;
        }

        //Function to animate the score(the animation after target is hit)
        function animateScore(scr,arrNum){
            if(scr >= 7) uScore.innerHTML = "&uarr; +"+scr;
            else uScore.innerHTML = "+"+scr;
            updateBullets(arrNum);
            
            var t = 50, l = 70, o = 1;
            var animIntv = setInterval(function(){
                uScore.style.top = t + "%";
                uScore.style.left = l + "%";
                uScore.style.opacity = o;
                uScore.style.color = "white";
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

        //Build a prototype for FireWorks Animation (Fireworks when they hit bullseye)
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
        var checkBulletMoveWithBoard1 = false;
        var checkBulletMoveWithBoard2 = false;

        // target board
        var board = {
            x:w-40,
            y:h/2,
            dy:4,
            height:150,
            width:7
        }
        var boardY;
        var boardMove = false;

        //Is the bullet moving
        var moveBulletCheck = false;
        var score = 0;  

        // GUN
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

        //Gun trigger
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

        //Bullets 
        const bulletProps = {
        radius: 5, // Radius of the bullet
        speed: 10, // Speed of the bullet
        color: 'red', // Color of the bullet
        };

        // Bullet initilizations
        const bullet = {
        x: gun.x + gun.width / 2, // Start x-coordinate of the bullet
        y: gun.y, // Start y-coordinate of the bullet
        dx: Math.cos(gun.angle) * bulletProps.speed, // Horizontal speed of the bullet
        dy: Math.sin(gun.angle) * bulletProps.speed, // Vertical speed of the bullet
        radius: bulletProps.radius, // Radius of the bullet
        color: bulletProps.color, // Color of the bullet
        };


        var bullet1 = new Bullet();
        var bullet2 = new Bullet();

        // initialization of bullets variable to keep count of bullets
        var bullets1 = 0;

        // total bullets
        var totalbullets = 4;
        updateBullets(totalbullets);

        //Function for drawing the board
        function drawBoard() {
            ctx.beginPath();
            ctx.fillStyle='red';
            ctx.fillRect(board.x,board.y-5,40,board.width+3); //rectangle right side to the main rectangle board width, height
            ctx.fillRect(board.x,board.y-board.height/2,board.width,board.height); //main rectangle
            ctx.moveTo(board.x,board.y-15);
            ctx.quadraticCurveTo(board.x-10,board.y,board.x,board.y+15); //blue curve
            ctx.fillStyle = "#36e";
            ctx.fill();
            ctx.closePath();
        
            if(board.y >= h || board.y <= 0){
                board.dy *= -1;
            }
        
            if(autoMove){
                board.y += board.dy;
            }
            else{
                if(boardMove){
                    if(Math.abs(board.y - boardY) > 0){
                        board.y += board.dy;
                    }
                }
                else{
                    if(Math.abs(board.y - boardY) > 0){
                        board.y -= board.dy;
                    }
                }
            }
        }
    
        //Draw Bullets
        function Bullet(){
            this.x= gun.x + gun.width / 2, // Start x-coordinate of the bullet
            this.y= gun.y, // Start y-coordinate of the bullet
            this.dx= Math.cos(gun.angle) * bulletProps.speed, // Horizontal speed of the bullet
            this.dy= Math.sin(gun.angle) * bulletProps.speed, // Vertical speed of the bullet
            this.radius= bulletProps.radius, // Radius of the bullet
            this.color= bulletProps.color, // Color of the bullet
            this.status = false; // Flag to indicate if the ball is in motion
            this.vis = true; // Flag to indicate if the ball is visible
        }
    
        Bullet.prototype.drawBullet = function() {
            if(this.vis) {
                if(this.status) {   
                    ctx.beginPath();
                    ctx.arc(this.x+this.dx, this.y+this.dy, this.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = this.color;
                    ctx.fill();

                    if(moveBulletCheck) {
                        if(this.x < w-155){
                            this.x += this.dx;
                        }
                        else {
                            if(!(this.y <= board.y-board.height/2 || this.y >= board.y+board.height/2) || this.x > w){
                                    if(this.x > w-62){
                                        if(this == bullet1){
                                            bullet2.vis = true;
                                        }
                                        else {
                                            bullet1.vis = true;
                                        }
                                    moveBulletCheck = false;
                                    score++;
                                    if(this.y >= board.y-board.height/2 && this.y <= board.y+board.height/2) {
                                        var scores = Math.abs(this.y - board.y);
                                        var currentScore = Math.round(board.height/15)-Math.round(Math.abs(scores/10));
                                        if(currentScore >= 7){
                                            newF();
                                            totalbullets+=2;
                                        }
                                        else if(currentScore>=6){
                                            totalbullets+=1;
                                        }             
                                        this.color= 'black'
                                        this.y = board.y                 
                                        totalScore += currentScore;
                                        gameScore.innerHTML = totalScore;                                    
                                        animateScore(currentScore,totalbullets);
                                        
                                        boardY = board.y + 1;
                                        
                                        if(scores>=0){
                                            boardMove = true;
                                        }
                                        else {
                                            boardMove = false;
                                        }
 
                                    }
                                    else{
                                        updateBullets(totalbullets);
                                    }

                                    if(totalScore >= 30){
                                        autoMove = true;
                                    }

                                    if(totalbullets <= 0){
                                        clearInterval(intv);
                                        document.getElementById("animCanvas").removeEventListener("click",shoot);
                                        document.body.removeEventListener("keydown",shoot);
                                        entrypage.style.display = "block";
                                        $('#myCanvas').hide();
                                        $('#animCanvas').hide();
                                        $('#showPoint').hide();
                                        $('#score').hide();
                                        document.getElementById("title").innerHTML = "Your Score<br>"+totalScore;
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
                    ctx.beginPath();
                    ctx.arc(gun.x + gun.width / 2, gun.y-3, this.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    this.color='red'
                }
            }
        }

        // Bullet Move With Board
        Bullet.prototype.moveBulletWithBoard = function(dir) {
            if(this == bullet1){
                bullet1.y += board.dy*dir;
            }
            else {
                bullet2.y += board.dy*dir;
            }
        }
    
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

            //Draw Lamppost
            drawLampPost(120, canvas.height);
          }

          // Function to Draw the stand
          function drawLampPost(x, y) {
            ctx.fillRect(x-20, y-250, 20, 250);
          
            // Draw the bulb
            ctx.beginPath();
            ctx.arc(x-12, y - 280, 30, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
          }

          //Function to draw the sun
          function drawSun(x, y) {
            ctx.beginPath();
            ctx.arc(x, y, 50, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
          }

        // Function to Draw the Gun
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

          //Function to draw the trigger
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

        //Board Moving function...
        function move (){
            ctx.clearRect(0,0,w,h);
            if (board.y > h - 50 || board.y < 50) {
                board.dy *= -1; // Reverse the vertical direction
              }
              board.y += board.dy; // Update the board's vertical position
            //   gunnob.y += gun.dy; // Update the board's vertical position
        }
      
        //Bullet Shooting Function
        function shoot(){
            if(bullet1.vis && bullet2.vis && bullets1 != -1){
                moveBulletCheck = true;
                clearTimeout(countTimeOut);
                countTime();
                if(bullets1%2===0){
                    bullet1.status = true;
                    bullet1.y = gun.y;
                    bullet2.status = false;
                    bullet2.x = gun.x;
                    bullet2.vis = false;
                }
                else{
                    bullet1.status = false;
                    bullet2.y = gun.y;
                    bullet2.status = true;
                    bullet1.x = gun.x;
                    bullet1.vis = false;
                }
            totalbullets--;
            }
            bullets1++;
        }
        
        //Use G to play, call the shoot Bullet function
        document.getElementById("animCanvas").addEventListener("click", shoot);
        document.body.addEventListener("keydown", function(event) {
        if (event.key === "g" || event.key === "G") {
            shoot();
        }
        });
        
        //Call the functions for drawing various objects and load the game
        var intv = setInterval(function(){
            move();
            createShootingRange();
            drawGun();
            drawGunnob();
            bullet1.drawBullet();
            bullet2.drawBullet();
            drawBoard();
        },15)
    }
}
    