/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var collectable;
var clouds;
var mountains;
var canyon;
var canyonMud;

var game_score;
var flagpole;
var lives;

var jumpSound;

var enemies; 

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();

}

function draw()

{
    
	background(100, 155, 255);

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); 
    
    //---------------------------------------------------------------
	// Background scrolling.
    //---------------------------------------------------------------
    push();
    translate(scrollPos, 0);
    
    // -------------------------------------------
	// Draw clouds.
    // -------------------------------------------
    
    drawClouds()
    
    // -------------------------------------------
	// Draw mountains.
    // -------------------------------------------
    
    drawMountains()
    
    // -------------------------------------------
	// Draw trees.
    // -------------------------------------------
    
    drawTrees()
    
     
    // -------------------------------------------
	// Draw collectable items
    // -------------------------------------------
    
    
    for (var i = 0; i < collectable.length; i++) 
    
    {
        if (!collectable[i].isFound)
        
            {
			
            drawCollectable(collectable[i]);
			checkCollectable(collectable[i]);
            
		    }
	}
    
    
    // -------------------------------------------
	// Draw canyons.
    // -------------------------------------------
    
    for (var i = 0; i<canyon.length; i++)
        
        {
         
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    
        } 
    
    
    for (var i = 0; i<canyonMud.length; i++)
        
    
        {
        
        fill(153,76,0)
    
        rect(canyonMud [i].x_pos,canyonMud [i].y_pos+100,canyonMud [i].width,canyonMud [i].height);
        
        }

    // -------------------------------------------
	// Draw Flagpole
    // -------------------------------------------
    
    renderFlagpole (); 
    
    
    // check if the player dies
    
    checkPlayerDie();
    
    pop()
    
    
    
    // -------------------------------------------
	// Draw game character.
	// -------------------------------------------
    
	drawGameChar();
    
    // -------------------------------------------
	// Draw the score 
	// -------------------------------------------
    
    fill (255);
    noStroke ();
    textSize(15);
    text("SCORE:" + game_score, 40,140);
    
    // displays how many lives the player has
    
    for (var i = 0; i < lives; i++)
    
    {
        fill(255);
        noStroke();
        text("REMAINING LIVES: " + lives, 40, 120);
    }

    if (lives < 1)
    
    {
        
        fill(255);
        textSize(15);
        text("GAME OVER. PRESS SPACE TO CONTINUE", 475, 180);
        return;
    }
    
    if (flagpole.isReached == true)
    
    {
        
        fill(255);
        noStroke();
        textSize(15);
        text("LEVEL COMPLETE. PRESS SPACE TO CONTINUE", 400, 180);
        return;
    }
    
    // -------------------------------------------
    // code for falling down the canyon 
    // -------------------------------------------
    
    if(isPlummeting == true) 
     
        { 

        gameChar_y += 60;
  
        }
    
 
    // --------------------------------------------------------------
	// Logic to make the game character move or the background scroll.
    // --------------------------------------------------------------
    
    if(isLeft)
	  
        {
           
        if(gameChar_x > width * 0.2)
           
           {
               gameChar_x -= 5;
           }
           
        else 
           
           {
			   scrollPos += 5;
           }
           
	   }

	
    if(isRight)
	
        {
            
		if(gameChar_x < width * 0.8)
            
		{
			gameChar_x += 5;
            
		}
            
		else
            
		{
			scrollPos -= 5; 
		}
            
	}

    //---------------------------------------------------------------
	// Logic to make the game character rise and fall.
    //---------------------------------------------------------------
    
    if (isPlummeting) 
            
        {
		   gameChar_y -= 3;
        }

    if (isFalling) 
               
        {
		   gameChar_y += 3;
		   isPlummeting = false;
	    }

	if (gameChar_y == floorPos_y) 
        
        {
		   isFalling = false;
	    }

	if (gameChar_y < (floorPos_y - 200)) 
        
        {
		   isFalling = true;
	    }

    if (flagpole.isReached == false)
        
    {
       
        checkFlagpole();
        
    }
    
    //---------------------------------------------------
    // Check contact with Enemy
    //---------------------------------------------------
    
    for(var i=0;i<enemies.length;i++)
        

    {
        translate(scrollPos, -30)
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x,gameChar_y);
        
       
        if(isContact)
            
        {
        
        lives-= 1
            
        }
        
        if(isContact)
            
        {
            
            if(lives>0)
                
            {
                
            startGame();
            break;
                
            }
            
            }
    }
        
        pop();
    

    // --------------------------------------------------------
	// Update real position of gameChar for collision detection.
    // --------------------------------------------------------
    
	gameChar_world_x = gameChar_x - scrollPos;
      
}



 if (flagpole.isReached)
    {
        fill(255,0,0);
        textSize(35);
        text("Level complete. Press space to continue.", width/4, height/4);
        
    }


// -------------------------------------------
// Key control functions
// -------------------------------------------

function keyPressed()

// ------------------------------------------------------------------------------
// if statements to control the animation of the character when keys are pressed.
// ----------------------------------------------------------------------------- 

{
    
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
    
    if(keyCode == 37)
        
        { 
        
        console.log("left arrow")
        isLeft = true;
     
        }
    
    if (keyCode == 39)
        
        { 
        
        console.log("right arrow")
        isRight = true;
        
        }
       
    if(keyCode == '32')
        
    // when keycode 32 `space-bar' is pressed, and if the game character is at floor position, then jumping is true and the game character position goes to gameChar_y - 100 
    
        {
        
    if (gameChar_y == floorPos_y)
        
        
        {
            
    isFalling =true;
            
    gameChar_y = gameChar_y - 180;
    jumpSound.play();
             
        }
        
        
        }

	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);

    
}

function keyReleased()

{
	
    // ------------------------------------------------------------------------------
    // if statements to control the animation of the character when keys are released.
    // ------------------------------------------------------------------------------
    
	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
    
    if(keyCode == 37)
        
        { 

        console.log("left arrow")
        isLeft = false;

        }
    
    if (keyCode == 39)
        
        { 

        console.log("right arrow")
        isRight = false;

        }
    
    else if (keyCode == 32)
        
        { 

        console.log("space-bar")
        isPlummeting = false;
            

        }

    // ------------------------------------------------------------------------------
    // if statements to check Flagpole 
    // ------------------------------------------------------------------------------
    
    if (flagpole.isReached == false)
        
    {
        
    checkFlagpole ();
        
    }

}


// ------------------------------------------------
// Game character render function
// ------------------------------------------------

// ------------------------------------------------
// Function to draw the game character.
// ------------------------------------------------

function drawGameChar()
{

    if(isLeft && isFalling)
	{
        
    // ----------------------------------------------
    // Jumping-left code
    // ----------------------------------------------

    //Character head
    fill(255,204,153);
    ellipse(gameChar_x,gameChar_y-62,12,20);
    rect(gameChar_x-(2),gameChar_y-54,5,5);
    ellipse(gameChar_x-5,gameChar_y-65,10,5);
    
    fill(0,0,0);
    ellipse(gameChar_x-3,gameChar_y-66,3,3);
    
    // Character body
    fill(255,0,0)
    rect(gameChar_x-(8.5),gameChar_y-49,18,26)
        
    //Character legs
    fill(0,0,255)
    quad(
			gameChar_x - 14, gameChar_y-4, //bottom left - left point
			gameChar_x-5, gameChar_y, // bottom left -right point
			gameChar_x+5, gameChar_y -23, // top right -right point
			gameChar_x - 8, gameChar_y - 23, //top left - left point
		);
   
    quad(
			gameChar_x + 14, gameChar_y-4,
			gameChar_x+5, gameChar_y,
			gameChar_x-5, gameChar_y -23, 
			gameChar_x + 8, gameChar_y - 23, 
		);
        
    // Character shoes
    fill(0,0,0)
    quad(
			gameChar_x - 19, gameChar_y-7, //bottom left - left point
			gameChar_x-5, gameChar_y, // bottom left -right point
			gameChar_x - 8, gameChar_y+5, //bottom right point
			gameChar_x-20, gameChar_y, // bottom left -right point
        );
        
    quad(
			gameChar_x + 19, gameChar_y-7,
			gameChar_x+5, gameChar_y,
			gameChar_x + 8, gameChar_y+5, 
			gameChar_x+20, gameChar_y,
        );
    
    // Character arms
    fill(255,0,0)
    rect(gameChar_x-(23),gameChar_y-46,46,5)
        
	}
    
	else if(isRight && isFalling)
        
	{
        
    // ----------------------------------------------------
    // Jumping-right code
    // ----------------------------------------------------
        
    
    //Character head   
    fill(255,204,153);
    ellipse(gameChar_x,gameChar_y-65,12,20);
    rect(gameChar_x-(2),gameChar_y-57,5,5);
    ellipse(gameChar_x+5,gameChar_y-65,10,5);
    
    fill(0,0,0);
    ellipse(gameChar_x+3,gameChar_y-69,3,3);
    
    fill(255,0,0)
    rect(gameChar_x-(6),gameChar_y-52,13,25)

  
    //Character body
    fill(255,0,0)
    rect(gameChar_x-(8.5),gameChar_y-49,18,26)
        
    //Character legs
    fill(0,0,255)
    quad(
			gameChar_x - 14, gameChar_y-4, //bottom left - left point
			gameChar_x-5, gameChar_y,// bottom left -right point
			gameChar_x+5, gameChar_y -23, // top right -right point
			gameChar_x - 8, gameChar_y - 23, //top left - left point
		);
   
    quad(
			gameChar_x + 14, gameChar_y-4, //bottom left - left point
			gameChar_x+5, gameChar_y,// bottom left -right point
			gameChar_x-5, gameChar_y -23, // top right -right point
			gameChar_x + 8, gameChar_y - 23, //top left - left point
		);
   
    //Character shoes 
    fill(0,0,0)
    quad(
			gameChar_x - 19, gameChar_y-7, //bottom left - left point
			gameChar_x-5, gameChar_y,// bottom left -right point
			gameChar_x - 8, gameChar_y+5, //bottom right point
			gameChar_x-20, gameChar_y,// bottom left -right point
        );
        
    quad(
			gameChar_x + 19, gameChar_y-7, //bottom left - left point
			gameChar_x+5, gameChar_y,// bottom left -right point
			gameChar_x + 8, gameChar_y+5, //bottom right point
			gameChar_x+20, gameChar_y,// bottom left -right point
        );
    
    //Character arms
    fill(255,0,0)
    rect(gameChar_x-(22),gameChar_y-49,46,5)
    

	}
    
	else if(isLeft)
        
	{
    
    // ---------------------------------------------------------
    // add your walking left code
    // ---------------------------------------------------------
        
    //Character head 
    noStroke();
    fill(255,204,153);
    ellipse(gameChar_x,gameChar_y-62,12,20);
    rect(gameChar_x-(2),gameChar_y-54,5,5);
    ellipse(gameChar_x-5,gameChar_y-62,10,5);
    fill(0,0,0);
    ellipse(gameChar_x-3,gameChar_y-66,3,3);
    
    //Character legs
    fill(0,0,255)
    quad(
			gameChar_x - 14, gameChar_y-3, //bottom left - left point - leg
			gameChar_x-5, gameChar_y-3,// bottom left -right point - leg
			gameChar_x+5, gameChar_y -20, // top right -right point - leg
			gameChar_x - 8, gameChar_y - 20, //top left - left point - leg
		);
   
    quad(
			gameChar_x + 15, gameChar_y-3, 
			gameChar_x+5, gameChar_y-3,
			gameChar_x-5, gameChar_y -20, 
			gameChar_x + 9, gameChar_y - 20, 
		);
  
    
    //Character shoes 
    fill(0,0,0)
    rect(gameChar_x,gameChar_y-3,15,3) 
    
    fill(0,0,0)
    rect(gameChar_x-20,gameChar_y-3,14,3);
        
        
    //Character body
    fill(255,0,0)
    stroke(0)
    rect(gameChar_x-(8.5),gameChar_y-49,17,30)
    
    fill(255,0,0)
    rect(gameChar_x-(3),gameChar_y-48,5,22);
    
	}
	else if(isRight)
	{
    
    // ----------------------------------------------------
    // add your walking right code
    // ----------------------------------------------------
    
    //Character head
    fill(255,204,153);
    ellipse(gameChar_x,gameChar_y-62,12,20);
    rect(gameChar_x-(2),gameChar_y-54,5,5);
    ellipse(gameChar_x+5,gameChar_y-62,10,5);
    
    fill(0,0,0);
    ellipse(gameChar_x+3,gameChar_y-66,3,3);
    
    //Character body
    fill(255,0,0)
    rect(gameChar_x-(8.5),gameChar_y-49,18,30)
        
    //Character legs
    fill(0,0,255)
    quad(
			gameChar_x - 14, gameChar_y-3, //bottom left - left point
			gameChar_x-5, gameChar_y-3,// bottom left -right point
			gameChar_x+5, gameChar_y -20, // top right -right point
			gameChar_x - 8, gameChar_y - 20, //top left - left point
		);
   
    quad(
			gameChar_x + 15, gameChar_y-3, 
			gameChar_x+5, gameChar_y-3,// 
			gameChar_x-5, gameChar_y -20, 
			gameChar_x + 9, gameChar_y - 20, 
		);
    
    //Character shoes 
    fill(0,0,0)
    rect(gameChar_x-14,gameChar_y-3,15,3) // rect for shoe 1
    
    fill(0,0,0)
    rect(gameChar_x+6,gameChar_y-3,15,3); // rect for shoe 2
    
    //Character arms
    fill(255,0,0)
    stroke(0)
    rect(gameChar_x-(8.5),gameChar_y-49,17,30)
    
    fill(255,0,0)
    rect(gameChar_x-(3),gameChar_y-48,5,22);
    

	}
    
	else if(isFalling || isPlummeting)
        
	{
    
    // ----------------------------------------------------
    // Jumping facing forwards code
    // ----------------------------------------------------
        
    
    //Character head   
    fill(255,204,153);
    ellipse(gameChar_x,gameChar_y-65,20,20);
    rect(gameChar_x-(5),gameChar_y-57,10,5);
    
    fill(0,0,0);
    ellipse(gameChar_x-4,gameChar_y-67,2,2);
    ellipse(gameChar_x+4,gameChar_y-67,2,2);
    
    
    //Character body   
    fill(255,0,0)
    rect(gameChar_x-(13.5),gameChar_y-52,27,25)
    
    fill(255,0,0)
    rect(gameChar_x-(22),gameChar_y-52,45,5)
    
    fill(255,0,0)
    rect(gameChar_x-(22),gameChar_y-68,5,20)
    
    fill(255,0,0)
    rect(gameChar_x+(18),gameChar_y-68,5,20)
    
    //Character shoes 
    fill(0,0,0)
    rect(gameChar_x+3.5,gameChar_y-5,15,5)
    
    fill(0,0,0)
    rect(gameChar_x-18.5,gameChar_y-5,15,5);
    
    //Character legs 
    fill(0,0,255)
    rect(gameChar_x-13.5,gameChar_y-20,10,15)

    fill(0,0,255)
    rect(gameChar_x+3.5,gameChar_y-20,10,15)
    
    fill(0,0,255)
    rect(gameChar_x-13.5,gameChar_y-16,27,-11)
        
	}
	else
	{
        
    // ----------------------------------------------------
    // Character standing front facing code
    // ----------------------------------------------------   
        
    // Character head 
    fill(255,204,153);
    ellipse(gameChar_x,gameChar_y-60,25,25);
    rect(gameChar_x-(22.5/4),gameChar_y-50,25/2,25/4);
    
    fill(0,0,0);
    ellipse(gameChar_x-4,gameChar_y-65,3,3);
    ellipse(gameChar_x+4,gameChar_y-65,3,3);
    
    //Character body
    fill(255,0,0)
    rect(gameChar_x-(22),gameChar_y-46,45,5)
    
    fill(255,0,0)
    rect(gameChar_x-(22),gameChar_y-45,5,20)
    
    fill(255,0,0)
    rect(gameChar_x+(18),gameChar_y-45,5,20)
    
    fill(255,0,0)
    rect(gameChar_x-(15.5),gameChar_y-45,32,25)
    
    // Character legs
    fill(0,0,255)
    rect(gameChar_x-15.5,gameChar_y-20,10,15)

    fill(0,0,255)
    rect(gameChar_x+6.5,gameChar_y-20,10,15)
    
    fill(0,0,255)
    rect(gameChar_x-6,gameChar_y-20,15,5)
    
    // Character shoes
    fill(0,0,0)
    rect(gameChar_x+6.5,gameChar_y-5,15,5)
    
    fill(0,0,0)
    rect(gameChar_x-20.5,gameChar_y-5,15,5);
    
    
	}
}


// -------------------------------------------
// Background render functions
// -------------------------------------------


// -------------------------------------------
// Function to draw cloud objects.
// -------------------------------------------

function drawClouds()

{

for (var i = 0; i < clouds.length ; i++)
        
    {
        
    fill(255,255,255);
    ellipse(clouds[i].x_pos+225,clouds[i].y_pos+50,clouds[i].width,clouds[i].height);
    
    fill(255,255,255);
    ellipse(clouds [i].x_pos+225+25,clouds[i].y_pos+50,clouds[i].width,clouds[i].height-10);
    
    fill(255,255,255);
    ellipse(clouds[i].x_pos+225-25,clouds[i].y_pos+50,clouds[i].width,clouds[i].height-10);
        
    }
}


// --------------------------------------------------
// Function to draw mountains objects.
// --------------------------------------------------

function drawMountains () 

{
    
for (var i = 0 ; i < mountains.length; i++) 
        
    { 
        
    fill(140,140,140);
    
    beginShape(); 
    
    vertex(mountains[i].x_pos+525,mountains[i].y_pos+432);
    vertex(mountains[i].x_pos+555,mountains[i].y_pos+250);
    vertex(mountains[i].x_pos+580,mountains[i].y_pos+260);
    vertex(mountains[i].x_pos+600,mountains[i].y_pos+200);
    vertex(mountains[i].x_pos+610,mountains[i].y_pos+180);
    vertex(mountains[i].x_pos+620,mountains[i].y_pos+200);
    vertex(mountains[i].x_pos+650,mountains[i].y_pos+140);
    vertex(mountains[i].x_pos+700,mountains[i].y_pos+300);
    vertex(mountains[i].x_pos+710,mountains[i].y_pos+280);
    vertex(mountains[i].x_pos+730,mountains[i].y_pos+432);

    endShape();
    
    fill(160,160,160);
    
    beginShape(); 

    vertex(mountains[i].x_pos+525,mountains[i].y_pos+432);
    vertex(mountains[i].x_pos+550+5,mountains[i].y_pos+250+10);
    vertex(mountains[i].x_pos+580+5,mountains[i].y_pos+260+10);
    vertex(mountains[i].x_pos+600+5,mountains[i].y_pos+200+10);
    vertex(mountains[i].x_pos+610+5,mountains[i].y_pos+180+10);
    vertex(mountains[i].x_pos+620+5,mountains[i].y_pos+200+10);
    vertex(mountains[i].x_pos+650+5,mountains[i].y_pos+140+10);
    vertex(mountains[i].x_pos+700+5,mountains[i].y_pos+300+10);
    vertex(mountains[i].x_pos+710+5,mountains[i].y_pos+280+10);
    vertex(mountains[i].x_pos+730,mountains[i].y_pos+432);

    endShape();
    
    fill(192,192,192);
    
    beginShape(); 

    vertex(mountains[i].x_pos+525,mountains[i].y_pos+432);
    vertex(mountains[i].x_pos+550+5,mountains[i].y_pos+250+20);
    vertex(mountains[i].x_pos+580+5,mountains[i].y_pos+260+20);
    vertex(mountains[i].x_pos+600+5,mountains[i].y_pos+200+20);
    vertex(mountains[i].x_pos+610+5,mountains[i].y_pos+180+20);
    vertex(mountains[i].x_pos+620+5,mountains[i].y_pos+200+20);
    vertex(mountains[i].x_pos+650+5,mountains[i].y_pos+140+20);
    vertex(mountains[i].x_pos+700+5,mountains[i].y_pos+300+20);
    vertex(mountains[i].x_pos+710+5,mountains[i].y_pos+280+20);
    vertex(mountains[i].x_pos+730,mountains[i].y_pos+432);
    
    endShape();
    
    fill(128,128,128);
    beginShape(); 

    vertex(mountains[i].x_pos+525,mountains[i].y_pos+432);
    vertex(mountains[i].x_pos+550+5,mountains[i].y_pos+250+70);
    vertex(mountains[i].x_pos+580+5,mountains[i].y_pos+260+70);
    vertex(mountains[i].x_pos+600+5,mountains[i].y_pos+200+70);
    vertex(mountains[i].x_pos+610+5,mountains[i].y_pos+180+70);
    vertex(mountains[i].x_pos+620+5,mountains[i].y_pos+200+70);
    vertex(mountains[i].x_pos+650+5,mountains[i].y_pos+140+70);
    vertex(mountains[i].x_pos+700+5,mountains[i].y_pos+300+70);
    vertex(mountains[i].x_pos+710+5,mountains[i].y_pos+280+70);
    vertex(mountains[i].x_pos+730,mountains[i].y_pos+432);

    endShape();
        
    }
    
}


// -------------------------------------------
// Function to draw trees objects.
// -------------------------------------------


function drawTrees ()

{

for (var i=0; i< trees_x.length; i++)
        
    {
        
    fill(165,42,42);

    rect(trees_x [i],floorPos_y,40,-99.8);
    
    fill(0,128,0);
    
    triangle(trees_x [i]+100,floorPos_y-100,trees_x [i]+20,floorPos_y-130,trees_x [i]-60,floorPos_y-100)
    
    triangle(trees_x [i]+100,floorPos_y-120,trees_x [i]+20,floorPos_y-150,trees_x [i]-60,floorPos_y-120)

    triangle(trees_x [i]+100,floorPos_y-140,trees_x [i]+20,floorPos_y-170,trees_x [i]-60,floorPos_y-140)
        
    }
    
}


// ----------------------------------
// Canyon render and check functions
// ---------------------------------

// -------------------------------------------
// Function to draw canyon objects.
// -------------------------------------------

function drawCanyon(t_canyon)
    
    {

    fill(100,155,255);

    rect(t_canyon.x_pos, t_canyon.y_pos,t_canyon.width,t_canyon.height);

    }


// -------------------------------------------
// Function to check character is over a canyon.
// -------------------------------------------

function checkCanyon(t_canyon)
    
    {
        
    if (gameChar_world_x > (t_canyon.x_pos + 5))
        {
            if (gameChar_world_x < (t_canyon.x_pos + 40))
            {
                if (gameChar_y == floorPos_y)
                    {
                    isPlummeting = true
                    }
            }
        }
        
    
    }


// -------------------------------------------
// Collectable items render and check functions
// -------------------------------------------

// -------------------------------------------
// Function to draw collectable objects.
// -------------------------------------------


function drawCollectable(t_collectable)
        
    { 
        
    fill(255,255,0);
    
    fill(255,190,0);
    ellipse(t_collectable.x_pos, t_collectable.y_pos+47, t_collectable.size);
    strokeWeight(2);
        

    fill(255,300,0)
    stroke(0)
    ellipse(t_collectable.x_pos, t_collectable.y_pos +47, t_collectable.size - 10);
    strokeWeight(1);
            
    fill (0,0,0)
    text('$', t_collectable.x_pos - 6, t_collectable.y_pos+54);
    textSize(t_collectable.size -21);
    noStroke();
        
    }
    
    pop(0);

// ------------------------------------------------  
// Function to check character has collected an item.
// ------------------------------------------------

function checkCollectable(t_collectable)

{
	if (dist(gameChar_world_x, gameChar_y-40, t_collectable.x_pos, t_collectable.y_pos ) < 50)
    
    {
		t_collectable.isFound = true;
        game_score += 10;
    }
    
}

// ------------------------------------------------  
// Function to render the Flagpole 
// ------------------------------------------------

function renderFlagpole ()

{ 

push();

// Pole for the flag
strokeWeight (5);
stroke (50); 
line (flagpole.x_pos,floorPos_y-2,flagpole.x_pos,floorPos_y -310);
    
if(flagpole.isReached) 
    
{
    
//flag initial red and white stripes
strokeWeight(1);
fill(255,0,0);
rect(flagpole.x_pos+2.5,floorPos_y-250,100,5);
    
fill(255,255,255)
rect(flagpole.x_pos+2.5,floorPos_y-250-5,100,5);

fill(255,0,0);
rect(flagpole.x_pos+2.5,floorPos_y-250-10,100,5);
    
fill(255,255,255)
rect(flagpole.x_pos+2.5,floorPos_y-250-15,100,5);

fill(255,0,0);
rect(flagpole.x_pos+2.5,floorPos_y-250-20,100,5);

fill(255,255,255)
rect(flagpole.x_pos+2.5,floorPos_y-250-25,100,5);
    
//flag blue section 
    
fill(0,0,128)
rect(flagpole.x_pos+2.5,floorPos_y-250-60,35,35);
    
// flag red and white stripes top section 
    
fill(255,0,0);
rect(flagpole.x_pos+2.5+35,floorPos_y-250-30,65,5);

fill(255,255,255)
rect(flagpole.x_pos+2.5+35,floorPos_y-250-35,65,5);
    
fill(255,0,0);
rect(flagpole.x_pos+2.5+35,floorPos_y-250-40,65,5);

fill(255,255,255)
rect(flagpole.x_pos+2.5+35,floorPos_y-250-45,65,5);
    
fill(255,0,0);
rect(flagpole.x_pos+2.5+35,floorPos_y-250-50,65,5);
    
fill(255,255,255)
rect(flagpole.x_pos+2.5+35,floorPos_y-250-55,65,5);
    
fill(255,0,0);
rect(flagpole.x_pos+2.5+35,floorPos_y-250-60,65,5);

    
// stars on flag rows 1 to 7 starting at the top

fill(255,255,255);
ellipse(flagpole.x_pos+2.5+4.5,floorPos_y-250-57, 4,4)
ellipse(flagpole.x_pos+2.5+11.5,floorPos_y-250-57, 4,4)
ellipse(flagpole.x_pos+2.5+18.5,floorPos_y-250-57, 4,4)
ellipse(flagpole.x_pos+2.5+25.5,floorPos_y-250-57, 4,4)
ellipse(flagpole.x_pos+2.5+32.5,floorPos_y-250-57, 4,4)

ellipse(flagpole.x_pos+2.5+4.5+3.5,floorPos_y-250-52, 4,4)
ellipse(flagpole.x_pos+2.5+11.5+3.5,floorPos_y-250-52, 4,4)
ellipse(flagpole.x_pos+2.5+18.5+3.5,floorPos_y-250-52, 4,4)
ellipse(flagpole.x_pos+2.5+25.5+3.5,floorPos_y-250-52, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5,floorPos_y-250-47, 4,4)
ellipse(flagpole.x_pos+2.5+11.5,floorPos_y-250-47, 4,4)
ellipse(flagpole.x_pos+2.5+18.5,floorPos_y-250-47, 4,4)
ellipse(flagpole.x_pos+2.5+25.5,floorPos_y-250-47, 4,4)
ellipse(flagpole.x_pos+2.5+32.5,floorPos_y-250-47, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5+3.5,floorPos_y-250-42, 4,4)
ellipse(flagpole.x_pos+2.5+11.5+3.5,floorPos_y-250-42, 4,4)
ellipse(flagpole.x_pos+2.5+18.5+3.5,floorPos_y-250-42, 4,4)
ellipse(flagpole.x_pos+2.5+25.5+3.5,floorPos_y-250-42, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5,floorPos_y-250-37, 4,4)
ellipse(flagpole.x_pos+2.5+11.5,floorPos_y-250-37, 4,4)
ellipse(flagpole.x_pos+2.5+18.5,floorPos_y-250-37, 4,4)
ellipse(flagpole.x_pos+2.5+25.5,floorPos_y-250-37, 4,4)
ellipse(flagpole.x_pos+2.5+32.5,floorPos_y-250-37, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5+3.5,floorPos_y-250-32, 4,4)
ellipse(flagpole.x_pos+2.5+11.5+3.5,floorPos_y-250-32, 4,4)
ellipse(flagpole.x_pos+2.5+18.5+3.5,floorPos_y-250-32, 4,4)
ellipse(flagpole.x_pos+2.5+25.5+3.5,floorPos_y-250-32, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5,floorPos_y-250-27, 4,4)
ellipse(flagpole.x_pos+2.5+11.5,floorPos_y-250-27, 4,4)
ellipse(flagpole.x_pos+2.5+18.5,floorPos_y-250-27, 4,4)
ellipse(flagpole.x_pos+2.5+25.5,floorPos_y-250-27, 4,4)
ellipse(flagpole.x_pos+2.5+32.5,floorPos_y-250-27, 4,4)
    
}
    
else 
    
{
    
//flag initial red and white stripes
strokeWeight(1);
fill(255,0,0);
rect(flagpole.x_pos+2.5,floorPos_y-5,100,5);
    
fill(255,255,255)
rect(flagpole.x_pos+2.5,floorPos_y-5-5,100,5);

fill(255,0,0);
rect(flagpole.x_pos+2.5,floorPos_y-5-10,100,5);
    
fill(255,255,255)
rect(flagpole.x_pos+2.5,floorPos_y-5-15,100,5);

fill(255,0,0);
rect(flagpole.x_pos+2.5,floorPos_y-5-20,100,5);

fill(255,255,255)
rect(flagpole.x_pos+2.5,floorPos_y-5-25,100,5);
    
//flag blue section 
    
fill(0,0,128)
rect(flagpole.x_pos+2.5,floorPos_y-5-60,35,35);
    
// flag red and white stripes top section 
    
fill(255,0,0);
rect(flagpole.x_pos+2.5+35,floorPos_y-5-30,65,5);

fill(255,255,255)
rect(flagpole.x_pos+2.5+35,floorPos_y-5-35,65,5);
    
fill(255,0,0);
rect(flagpole.x_pos+2.5+35,floorPos_y-5-40,65,5);

fill(255,255,255)
rect(flagpole.x_pos+2.5+35,floorPos_y-5-45,65,5);
    
fill(255,0,0);
rect(flagpole.x_pos+2.5+35,floorPos_y-5-50,65,5);
    
fill(255,255,255)
rect(flagpole.x_pos+2.5+35,floorPos_y-5-55,65,5);
    
fill(255,0,0);
rect(flagpole.x_pos+2.5+35,floorPos_y-5-60,65,5);

    
// stars on flag rows 1 to 7 starting at the top

fill(255,255,255);
ellipse(flagpole.x_pos+2.5+4.5,floorPos_y-5-57, 4,4)
ellipse(flagpole.x_pos+2.5+11.5,floorPos_y-5-57, 4,4)
ellipse(flagpole.x_pos+2.5+18.5,floorPos_y-5-57, 4,4)
ellipse(flagpole.x_pos+2.5+25.5,floorPos_y-5-57, 4,4)
ellipse(flagpole.x_pos+2.5+32.5,floorPos_y-5-57, 4,4)

ellipse(flagpole.x_pos+2.5+4.5+3.5,floorPos_y-5-52, 4,4)
ellipse(flagpole.x_pos+2.5+11.5+3.5,floorPos_y-5-52, 4,4)
ellipse(flagpole.x_pos+2.5+18.5+3.5,floorPos_y-5-52, 4,4)
ellipse(flagpole.x_pos+2.5+25.5+3.5,floorPos_y-5-52, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5,floorPos_y-5-47, 4,4)
ellipse(flagpole.x_pos+2.5+11.5,floorPos_y-5-47, 4,4)
ellipse(flagpole.x_pos+2.5+18.5,floorPos_y-5-47, 4,4)
ellipse(flagpole.x_pos+2.5+25.5,floorPos_y-5-47, 4,4)
ellipse(flagpole.x_pos+2.5+32.5,floorPos_y-5-47, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5+3.5,floorPos_y-5-42, 4,4)
ellipse(flagpole.x_pos+2.5+11.5+3.5,floorPos_y-5-42, 4,4)
ellipse(flagpole.x_pos+2.5+18.5+3.5,floorPos_y-5-42, 4,4)
ellipse(flagpole.x_pos+2.5+25.5+3.5,floorPos_y-5-42, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5,floorPos_y-5-37, 4,4)
ellipse(flagpole.x_pos+2.5+11.5,floorPos_y-5-37, 4,4)
ellipse(flagpole.x_pos+2.5+18.5,floorPos_y-5-37, 4,4)
ellipse(flagpole.x_pos+2.5+25.5,floorPos_y-5-37, 4,4)
ellipse(flagpole.x_pos+2.5+32.5,floorPos_y-5-37, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5+3.5,floorPos_y-5-32, 4,4)
ellipse(flagpole.x_pos+2.5+11.5+3.5,floorPos_y-5-32, 4,4)
ellipse(flagpole.x_pos+2.5+18.5+3.5,floorPos_y-5-32, 4,4)
ellipse(flagpole.x_pos+2.5+25.5+3.5,floorPos_y-5-32, 4,4)
    
ellipse(flagpole.x_pos+2.5+4.5,floorPos_y-5-27, 4,4)
ellipse(flagpole.x_pos+2.5+11.5,floorPos_y-5-27, 4,4)
ellipse(flagpole.x_pos+2.5+18.5,floorPos_y-5-27, 4,4)
ellipse(flagpole.x_pos+2.5+25.5,floorPos_y-5-27, 4,4)
ellipse(flagpole.x_pos+2.5+32.5,floorPos_y-5-27, 4,4)

}

    
pop (); 
    
    
}

// Function to check if flagpole reached

function checkFlagpole()

{
    
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if (d < 15)
        {
            flagpole.isReached = true;
        }
    
    
}

// ----------------------------------
// Check if the character dies and reduce life by 1 
// ----------------------------------

function checkPlayerDie()

    {
    
    if(gameChar_y > height && lives != 0)
    
    {
        
        lives -= 1;
        startGame();
    }

    }

function Enemy(x,y,range)

{
    
    this.x=x;
    this.y=y;
    this.range = range;
    
    this.currentX= x;
    this.inc=1;
    
    this.update=function()
    
    {
        
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            
            {
                
                this.inc = -1;
        
            }
        
            else if (this.currentX < this.x)
            
            {
            
                this.inc = 1;
        
            }
        
    }
    
    this.draw = function()
    
    {
    
        this.update();
        // draw bomb
        stroke(50);
        strokeWeight(1)
        fill(0,0,0)
        ellipse(this.currentX,this.y,50,55);
        
   
        //bomb reflection 
        
        fill(255);
 
        quad(
        this.currentX+4 + 5*0.6, this.y - 15*0.6,
        this.currentX+4 + 25*0.6, this.y - 15*0.6,
        this.currentX+4 + 20*0.6, this.y - 0*0.6,
        this.currentX+4 + 10*0.6, this.y - 0*0.6,
    );
        //bomb fuse ]
        
    //draw the fuse
    noFill();
    stroke(200,100,0);
    line(this.currentX-5,this.y - 20,this.currentX -10,this.y - 25 - 10);
        
    //draw the flame 
    fill(255,255,0);
    noStroke();
    beginShape();
        vertex(this.currentX-15, this.y-40);
        vertex(this.currentX -11, this.y - 30);
        vertex(this.currentX - 20, this.y - 30);
        vertex(this.currentX - 5, this.y - 30);
    endShape(CLOSE);
        
    //wobble the bomb
    this.currentX += random(-1,1);
    this.y += random(-1,1);
       
    }
        

 this.checkContact = function(gc_x,gc_y)
    
    {
     
     var d = dist(gc_x,gc_y, this.currentX,this.y)
     
     if(d<40)
         
     {
     
        return true;
         
     }
     
     return false;
        
    }
    
 }
        

function startGame()
        
{
    
gameChar_x = width/2;
gameChar_y = floorPos_y;
    
//---------------------------------------------------------------
// Variable to control the background scrolling.
//---------------------------------------------------------------
    
	scrollPos = 0;

    //-------------------------------------------------------------------------------------------------------
	// Variable to store the real position of the gameChar in the game world. Needed for collision detection.
    //-------------------------------------------------------------------------------------------------------
    
	gameChar_world_x = gameChar_x - scrollPos;
    
    //------------------------------------------------------------------
	// Boolean variables to control the movement of the game character.
    //------------------------------------------------------------------
    
    
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isFound = false;

    //---------------------------------------------------------------
    // Initialisation of Arrays and Object Arrays for scenery objects
    //---------------------------------------------------------------
 
    
    trees_x = [-450,100,300,500,770,1000,1300,1690,1900,2200,2500];
    
    clouds = [{x_pos:40, y_pos:20, size:1, width:70,height:60}, 
              {x_pos:210, y_pos:40, size:1.5, width:70,height:60}, 
              {x_pos:400, y_pos:20, size:1, width:70,height:60},
              {x_pos:1000, y_pos:20, size:1, width:70,height:60}, 
              {x_pos:1250, y_pos:40, size:1.5, width:70,height:60}, 
              {x_pos:1500, y_pos:20, size:1, width:70,height:60},
              {x_pos:-210, y_pos:20, size:1, width:70,height:60}, 
              {x_pos:-400, y_pos:40, size:1.5, width:70,height:60}, 
              {x_pos:-1000, y_pos:20, size:1, width:70,height:60},
              {x_pos:2000, y_pos:20, size:1, width:70,height:60}, 
              {x_pos:2250, y_pos:40, size:1.5, width:70,height:60}, 
              {x_pos:2500, y_pos:20, size:1, width:70,height:60}];
    
    mountains = [{x_pos:-380, y_pos:0, width:100},
                 {x_pos:-210, y_pos:0, width:100},
                 {x_pos:500, y_pos:0, width:100},
                 {x_pos:1000, y_pos:0, width:100},
                 {x_pos:1170, y_pos:0, width:100},
                 {x_pos:-1000, y_pos:0, width:100},
                 {x_pos:-1100, y_pos:0, width:100},
                 {x_pos:200, y_pos:0, width:100},
                 {x_pos:1500, y_pos:0, width:100},
                 {x_pos:2200, y_pos:0, width:100}];
    
    
    collectable = [{x_pos: 4000, y_pos: floorPos_y-70,size:45,isFound: false},
                   {x_pos: 850, y_pos: floorPos_y-70, size:45,isFound: false},
                   {x_pos: 900, y_pos: floorPos_y-70, size:45,isFound: false},
                   {x_pos: 1800, y_pos:floorPos_y-70, size:45,isFound: false},
                   {x_pos: 1850, y_pos:floorPos_y-70, size:45,isFound: false},
                   {x_pos: 1900, y_pos:floorPos_y-70, size:45,isFound: false},
                   {x_pos: 2400, y_pos:floorPos_y-70, size:45,isFound: false},
                   {x_pos: 2450, y_pos:floorPos_y-70, size:45,isFound: false},
                   {x_pos: 2500, y_pos:floorPos_y-70, size:45,isFound: false},
                   {x_pos: 3000, y_pos:floorPos_y-70, size:45,isFound: false},
                   {x_pos: 3100, y_pos:floorPos_y-70, size:45,isFound: false},
                   {x_pos: -240, y_pos:floorPos_y-70, size:45,isFound: false},
                   {x_pos: -190, y_pos:floorPos_y-70, size:45,isFound: false}];
    
    canyon = [{x_pos:600,y_pos:432,width:50,height:145},
              {x_pos:1400,y_pos:432,width:50,height:145},
              {x_pos:0,y_pos:432,width:50,height:145},
              {x_pos:2300,y_pos:432,width:50,height:145}]
             
    
    canyonMud = [{x_pos:600,y_pos:432,width:50,height:50},
                 {x_pos:1400,y_pos:432,width:50,height:50},
                 {x_pos:0,y_pos:432,width:50,height:50},
                 {x_pos:2300,y_pos:432,width:50,height:50}]
    
    flagpole = {isReached:false, x_pos:2650};
    

game_score = 0;
    
enemies = [];
enemies.push(new Enemy(700,floorPos_y-10, 100));

}

//-----------------------------------------------
//-----------------------------------------------

