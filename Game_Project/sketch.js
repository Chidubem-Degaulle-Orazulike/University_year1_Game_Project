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
var treePos_y;
var trees_x;
var clouds;
var mountains;
var canyons;
var collectables;
var game_score;
var flagpole;
var lives;
var jumpSound;
var walkSound;
var diamond;
var falling;
var complete;
var platforms;
var enemies;
var bite;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    walkSound = loadSound('assets/walkss.wav');
    diamond = loadSound('assets/sonic.mp3');
    symphogear = loadSound('assets/music2.wav');
    falling = loadSound('assets/falling.wav');
    complete = loadSound('assets/level.wav');
    gameover = loadSound('assets/Gameover.mp3');
    bite = loadSound('assets/bite.mp3')
    
    //control of the sound volume
    jumpSound.setVolume(0.1);
    walkSound.setVolume(0.1);
    diamond.setVolume(0.1);
    symphogear.setVolume(0.1);
    falling.setVolume(0.1);
    complete.setVolume(0.1);
    gameover.setVolume(0.1);
    bite.setVolume(0.1);
    
}



function setup()
{
    // creation of the canvas and intial setup required for the game sequence to begin 
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 4;
    startGame();
    
    

}

// everything neeaded to begin the game 
function startGame()
{
    falling.stop();
    symphogear.stop();
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    treePos_y = height/2 + 4;
    game_score = 0
    symphogear.play();
	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    // Each array has properties and values allocated to the properties that help establish the positions of the objects 
    trees_x = [100,400,800,1200,1650];
    
    clouds = [
        {x_pos:30,  y_pos:90, width:100, height:100},
        {x_pos:230, y_pos:190, width:100, height:100},
        {x_pos:530, y_pos:280, width:100, height:100},
        {x_pos:730, y_pos:390, width:100, height:100},
        {x_pos:1030, y_pos:90, width:100, height:100},
        {x_pos:1330, y_pos:190, width:100, height:100},
        {x_pos:1630, y_pos:280, width:100, height:100}
    ];
    
    mountains = [
        {x_pos:52, y_pos:432},
        {x_pos:1022, y_pos:432},
        {x_pos:1952, y_pos:432},
        {x_pos:2552, y_pos:432},
        {x_pos:3152, y_pos:432}
    ];
    
    canyons = [
        {x_pos:200, width:100},
        {x_pos:600, width:100},
        {x_pos:1300, width:100}
    ];
    
    collectables = [
        {x_pos: 390, y_pos: 423, size:50, isFound:false},
        {x_pos: 590, y_pos: 423, size:50, isFound:false},
        {x_pos: 790, y_pos: 423, size:50, isFound:false},
        {x_pos: 990, y_pos: 423, size:50, isFound:false},
        {x_pos: 1190, y_pos: 423, size:50, isFound:false} 
    ];
    //initialisation of flagpole object to signify the endpoint of a level
    flagpole = {x_pos:10172, isReached:false}
   
    //The for loop below allows for more scenery objects to be dislayed by pushing values or objects to the end of the arrays.
    for (var z = 0; z < 20; z++)
        {
            trees_x.push(random(1700,5500)* 2)
            var cloud1 = {x_pos:(1630 + (z*300)), y_pos:90, width:100, height:100}
            clouds.push(cloud1)
            var mountain1 = {x_pos:(3152 + (z*600)), y_pos:432}
            mountains.push(mountain1)
            var canyon1 = {x_pos:(1300 + (200 * z)), width:100}
            canyons.push(canyon1)
            var collectable1 = {x_pos:(1190 + (z*160)), y_pos:423, size:50, isFound:false}
            collectables.push(collectable1)         
        }
    //decrementation of lives variable everytime startGame is called 
    lives -= 1;
    // initialisation of platform and enemies array.
    platforms = [];
    enemies = [];
    
    // adding three unique enemy data to the enemies array
    enemies.push(new Enemy(0,floorPos_y,100));
    enemies.push(new Enemy(0,floorPos_y - 200,100));
    enemies.push(new Enemy(gameChar_world_x - 250,gameChar_y,9000));
    
    // for loop continously push new objects for enemies and platforms provided condition  is met
    for (var s = 1; s < 20; s++)
    {
        platforms.push(createPlatform(340 + (s * 500),floorPos_y - 50,100));
        noStroke();
        enemies.push(new Enemy(340 + (s * 500),floorPos_y,100));
        enemies.push(new Enemy(340 + (s * 500),floorPos_y - 200,100));
    }
    // conditional to stop all music in the background when lives are finished 
    if (lives == 0)
    {
        symphogear.stop();
        falling.stop();
        gameover.play();
    }
    
    
    
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    push();// This saves the current drawing styles settings 
    translate(scrollPos, 0)// this displaces the game character position from left to right making the illusion of the character moving away from the scenery
    renderFlagpole()
    if (flagpole.isReached == false){
        checkFlagpole()
    }
    
    if (gameChar_y > 700 && lives > 0){
        symphogear.stop();
        startGame()
    }
    
    
    


	// Draw clouds.
    drawClouds();// function call to draw the clouds 
    
	// Draw mountains.
    drawMountains();// function call to draw the mountains 
   
    

	// Draw trees.
    drawTrees();//function call to draw the trees 
    
    
    

	// Draw canyons.
    for (var l = 0; l < canyons.length; l++)
    {
        drawCanyon(canyons[l]);// function call to draw the canyon 
        checkCanyon(canyons[l]);// function call to call the canyon interaction
        
    }


	// Draw collectable items.
    for (var m = 0; m < collectables.length; m++)
    {
        if (!collectables[m].isFound)
        {
            drawCollectable(collectables[m]);//function call to draw the collectable
            checkCollectable(collectables[m]);// function call to call the collectable interaction i.e making the colectable dissapear 
        }
    }
    
    for (var x = 0; x < platforms.length; x++)
    {
        platforms[x].draw();
    }
    
    for (var u = 0; u < enemies.length; u++)
    {
        enemies[u].update();
        enemies[u].draw();
        if (enemies[u].isContact(gameChar_world_x, gameChar_y))
        {
            startGame();
            break;
        }
    }
    
    pop();// this restores the drawing settings 

	// Draw game character.
    textSize(100)
    fill(105)
    text("score;" + game_score,100,100)
    
    for (f = 1; f < lives+1 ; f++)
        {
            stroke('red')
            strokeWeight(9)
            point(100 * f,100,20,20)
            noStroke()
    
        }

	drawGameChar();
    
    //conditions that specify if Game level failed or the level is  completed
    if (lives < 1)
    {
        if (keyCode==32)
        {
            lives = 4
            startGame();
        }
        textSize(35)
        fill('orange')
        text("Game over, press space to continue;",100,100)
        symphogear.stop();
        falling.stop();
        walkSound.stop();
        jumpSound.stop();
        return 
    }
    
    if (flagpole.isReached == true)
    {
        if (keyCode==32)
        {
            lives = 4
            startGame();
        }
        textSize(35)
        fill('green')
        text("Level Complete",40,100)
        text("press space to continue;",40,400)
        return 
        
    }
    

	// Logic to make the game character move or the background scroll.
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
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if (gameChar_y < floorPos_y)
    {
        var isContact = false;
        
        for (var a = 0; a < platforms.length; a++)
        {
            if(platforms[a].checkContact(gameChar_world_x, gameChar_y))
            {
                isContact = true;
                break;
            }
            
        } 
        
        if (isContact == false)
        {
            gameChar_y += 2
            isFalling = true;
        }
        else
        {
            isFalling = false;
        }
        
        
        
    } else 
    {
        isFalling = false
    }
    
    if (isPlummeting)
    {
        gameChar_y +=15
        falling.play();
    }
    
    
    
    
    
    
    

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

    

        
}


// ---------------------
// Key control functions
// ---------------------
// when WASD keys are pressed variable states are changed to make the game character change states and animate correctly
function keyPressed()
{
    //when certain keys are pressed the corresponding music is supposed to play alongside the executed animation
    if (keyCode == 65)
    {
        isLeft = true;
        walkSound.play();
    }
    
    if (keyCode == 68)
    {
        isRight = true
        walkSound.play();
    }
    

    
    if (keyCode == 87 && gameChar_y == floorPos_y)
    {
        gameChar_y -= 130;
        jumpSound.play(); 
    }
     
    if (keyCode == 32)
    {
        gameChar_y = floorPos_y;
    }


	console.log("press" + keyCode);
	console.log("press" + key);
    
}
// When the AD keys are released the characters should stop moving 
function keyReleased()
{
    if (keyCode == 65)
    {
        isLeft = false
    }
    
    if (keyCode == 68)
    {
        isRight = false
    }

	console.log("release" + keyCode);
	console.log("release" + key);
    
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
    // draw game character
    if(isLeft && isFalling)
    {
        // add your jumping-left code
        fill('black')
        rect(gameChar_x - 17, gameChar_y - 72,25, 25, 20);
        rect(gameChar_x - 17, gameChar_y - 67, 25, 25);
        rect(gameChar_x - 12, gameChar_y - 41, 15, 15);
        fill('red')
        rect(gameChar_x - 20, gameChar_y - 27, 10, 15);
        rect(gameChar_x, gameChar_y - 27, 10, 15);
        
        fill('peach puff')
        rect(gameChar_x - 12,gameChar_y - 72,15,15,5);
        stroke('red')
        strokeWeight(9)
        point(gameChar_x - 4, gameChar_y - 52);
    }
	
    else if(isRight && isFalling)
    {
        // add your jumping-right code
        fill('black')
        rect(gameChar_x - 7, gameChar_y - 72, 25, 25, 20);
        rect(gameChar_x - 7, gameChar_y - 67, 25, 25);
        rect(gameChar_x - 2, gameChar_y - 41, 15, 15);
        fill('DeepPink')
        rect(gameChar_x - 10 , gameChar_y - 27, 10, 15);
        rect(gameChar_x + 10 , gameChar_y - 27, 10, 15);

        fill('peach puff')
        rect(gameChar_x - 2, gameChar_y - 72, 15, 15,5);
        stroke('red')
        strokeWeight(9)
        point(gameChar_x + 6,gameChar_y - 52);
	}
	
    else if(isLeft)
    {
        // add your walking left code
        fill('black')
        rect(gameChar_x - 17, gameChar_y - 72, 25, 25,20);
        rect(gameChar_x - 17, gameChar_y - 67, 25, 25);
        rect(gameChar_x - 12, gameChar_y - 41, 15,15);
        fill('red')
        rect(gameChar_x - 20, gameChar_y - 27, 10, 25);
        rect(gameChar_x, gameChar_y - 27, 10, 25);


        fill('peach puff')
        rect(gameChar_x - 12,gameChar_y - 72,15,15,5);
        stroke('red')
        strokeWeight(9)
        point(gameChar_x - 4,gameChar_y - 52);
	}
    
    else if(isRight)
    {
        // add your walking right code
        fill('black')
        rect(gameChar_x - 7,gameChar_y - 72,25,25,25);
        rect(gameChar_x - 7, gameChar_y - 67, 25, 25);
        rect(gameChar_x - 2, gameChar_y - 41, 15, 15);
        fill('DeepPink')
        rect(gameChar_x - 10, gameChar_y - 27, 10, 25);
        rect(gameChar_x + 10, gameChar_y - 27, 10, 25);

        fill('peach puff')
        rect(gameChar_x - 2,gameChar_y - 72,15,15,5);
        stroke('red')
        strokeWeight(9)
        point(gameChar_x + 6,gameChar_y - 52);
	}
	
    else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill('black')
        rect(gameChar_x - 12, gameChar_y - 72, 25, 25, 20);
        rect(gameChar_x - 12, gameChar_y - 67, 25, 25);
        rect(gameChar_x - 7, gameChar_y - 41, 15, 15);
        fill('orange')
        rect(gameChar_x - 15, gameChar_y - 27, 10, 15);
        rect(gameChar_x + 5, gameChar_y - 27, 10, 15);


        fill('peach puff')
        rect(gameChar_x - 7,gameChar_y - 72,15,15,5);
        stroke('red')
        strokeWeight(9)
        point(gameChar_x + 1, gameChar_y - 52);
	}
	
    else
	{
		// add your standing front facing code
        fill('black')
        rect(gameChar_x - 12, gameChar_y - 72, 25, 25, 20);
        rect(gameChar_x - 12, gameChar_y - 67, 25, 25);
        rect(gameChar_x - 7, gameChar_y - 41, 15, 15);
        rect(gameChar_x - 15, gameChar_y - 27,10, 25);
        rect(gameChar_x + 5, gameChar_y - 27, 10, 25);
        fill('peach puff')
        rect(gameChar_x - 7, gameChar_y - 72, 15, 15, 5);
        stroke('red')
        strokeWeight(9)
        point(gameChar_x + 1,gameChar_y - 52)
	}
    
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for (var j = 0; j < clouds.length; j++)
    {
        // for loop draws the clouds depending on the length of the array using the properties in the array required to draw it 
        fill(255)
        ellipse(clouds[j].x_pos - 120,clouds[j].y_pos + 15,clouds[j].width - 10,clouds[j].height - 30)
        noStroke();
        ellipse(clouds[j].x_pos - 40,clouds[j].y_pos + 5,clouds[j].width + 50,clouds[j].height)
        noStroke();
        ellipse(clouds[j].x_pos + 10,clouds[j].y_pos - 5,clouds[j].width + 70,clouds[j].height + 30)
        ellipse(clouds[j].x_pos + 100,clouds[j].y_pos + 15,clouds[j].width - 10,clouds[j].height - 30)

        fill(0)
        ellipse(clouds[j].x_pos- 110,clouds[j].y_pos + 25,clouds[j].width,clouds[j].height - 20)
        noStroke();
        ellipse(clouds[j].x_pos - 30,clouds[j].y_pos + 15,clouds[j].width + 60,clouds[j].height + 10)
        noStroke();
        ellipse(clouds[j].x_pos + 20,clouds[j].y_pos + 5,clouds[j].width + 80,clouds[j].height + 40)
        ellipse(clouds[j].x_pos + 110,clouds[j].y_pos + 25,clouds[j].width,clouds[j].height - 20)

        fill(255)
        ellipse(clouds[j].x_pos - 120,clouds[j].y_pos + 15,clouds[j].width - 10,clouds[j].height - 30)
        noStroke();
        ellipse(clouds[j].x_pos - 40,clouds[j].y_pos + 5,clouds[j].width + 50,clouds[j].height)
        noStroke();
        ellipse(clouds[j].x_pos + 10,clouds[j].y_pos - 5,clouds[j].width + 70,clouds[j].height + 30)
        ellipse(clouds[j].x_pos + 100,clouds[j].y_pos + 15,clouds[j].width - 10,clouds[j].height - 30) 
        
    }
    
}

// Function to draw mountains objects.
function drawMountains()
{
    for (var k = 0; k < mountains.length; k++)
    {
        // for loop draws the mountains depending on the length of the array using the properties in the array required to draw it
        fill(150)
        triangle(mountains[k].x_pos - 2, mountains[k].y_pos - 332,mountains[k].x_pos - 152, mountains[k].y_pos - 2, mountains[k].x_pos + 148, mountains[k].y_pos - 2);
        triangle(mountains[k].x_pos - 2, mountains[k].y_pos - 332,mountains[k].x_pos - 152, mountains[k].y_pos - 2, mountains[k].x_pos + 148, mountains[k].y_pos - 2);
        fill(131)
        triangle(mountains[k].x_pos - 4, mountains[k].y_pos - 332 ,mountains[k].x_pos - 172, mountains[k].y_pos - 2, mountains[k].x_pos + 38, mountains[k].y_pos - 2);
        fill(255);
        triangle(mountains[k].x_pos - 4, mountains[k].y_pos - 332,mountains[k].x_pos - 29,mountains[k].y_pos - 282,mountains[k].x_pos + 21,mountains[k].y_pos - 282)    
    }
}


// Function to draw trees objects.
function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    {
        // for loop draws the trees depending on the length of the array using the properties in the array required to draw it
        fill(165,42,42);
        rect(trees_x[i] - 35,treePos_y + 12,40,130);
        rect(trees_x[i] - 35,treePos_y + 12,40,130);
        fill(165,50,50)
        rect(trees_x[i] + 3,treePos_y + 12,40,130);
        fill(0,128,0);
        triangle(trees_x[i] - 80.5,treePos_y - 38,trees_x[i] + 79.5,treePos_y - 38,trees_x[i] + 0.5,treePos_y - 168);
        triangle(trees_x[i] - 80.5,treePos_y - 38,trees_x[i] + 79.5,treePos_y - 38,trees_x[i] + 0.5,treePos_y - 168);
        fill(0,120,0);
        triangle(trees_x[i] + 0.5,treePos_y - 38,trees_x[i] + 100,treePos_y - 38,trees_x[i] + 0.5,treePos_y - 168);
        fill(0,128,0);
        triangle(trees_x[i] - 80.5,treePos_y + 22,trees_x[i] + 80,treePos_y + 22,trees_x[i] + 0.5,treePos_y - 118);
        triangle(trees_x[i] - 81,treePos_y + 22,trees_x[i] + 80,treePos_y + 22,trees_x[i] + 0.5,treePos_y - 118);
        fill(0,120,0);
        triangle(trees_x[i] + 0.5,treePos_y + 22,trees_x[i] + 100,treePos_y + 22,trees_x[i] + 0.5,treePos_y - 118);
       
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    //function that draws the canyon when called upon 
    fill(100,155,255);
    rect(t_canyon.x_pos - 30,430,t_canyon.width + 100 + (t_canyon.width/4),400);
    fill(255,69,0);
    triangle(t_canyon.x_pos - 30,580,t_canyon.x_pos + 20 + (t_canyon.width/2),580,t_canyon.x_pos + (t_canyon.width/4),500);
    triangle(t_canyon.x_pos - 30,580,t_canyon.x_pos + 20 + (t_canyon.width/2),580,t_canyon.x_pos + (t_canyon.width/4),500);
    fill(255,49,0);
    triangle(t_canyon.x_pos - 10,580,t_canyon.x_pos + 30 + (t_canyon.width/2),580,t_canyon.x_pos + (t_canyon.width/4),500);

    fill(255,69,0);
    triangle(t_canyon.x_pos + 20,580,t_canyon.x_pos + 70 + (t_canyon.width/2),580,t_canyon.x_pos + 40 + (t_canyon.width/4),500);
    triangle(t_canyon.x_pos + 20,580,t_canyon.x_pos + 70 + (t_canyon.width/2),580,t_canyon.x_pos + 40 + (t_canyon.width/4),500);
    fill(255,49,0);
    triangle(t_canyon.x_pos + 50,580,t_canyon.x_pos + 80 + (t_canyon.width/2),580,t_canyon.x_pos + 40 + (t_canyon.width/4),500);

    fill(255,69,0);
    triangle(t_canyon.x_pos + 80,580,t_canyon.x_pos + 130 + (t_canyon.width/2),580,canyons.x + 90 + (t_canyon.width/4),500);
    triangle(t_canyon.x_pos + 80,580,t_canyon.x_pos + 130 + (t_canyon.width/2),580,t_canyon.x_pos + 90 + (t_canyon.width/4),500);
    fill(255,49,0);
    triangle(t_canyon.x_pos + 90,580,t_canyon.x_pos + 140 + (t_canyon.width/2),580,t_canyon.x_pos + 90 + (t_canyon.width/4),500);

    fill(255,69,0);
    triangle(t_canyon.x_pos - 30,580,t_canyon.x_pos - 50,432,t_canyon.x_pos + 20,432);
    rect(t_canyon.x_pos + 115 + (t_canyon.width/2),432,t_canyon.width - 30 + (t_canyon.width/2),170);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    // this function uses a conditional to state when the character falls into the canyon when the function is called upon
    if ((gameChar_world_x >= t_canyon.x_pos + 25 && gameChar_world_x <= t_canyon.x_pos + 157)&&(gameChar_y >= floorPos_y))
    {
        isPlummeting = true
    }

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    //function that draws the collectable when called upon 
    stroke(0);
    strokeWeight(4);
    line(t_collectable.x_pos + 30,t_collectable.y_pos - 57,t_collectable.x_pos + 52,t_collectable.y_pos - 37);
    line(t_collectable.x_pos - 52,t_collectable.y_pos - 37,t_collectable.x_pos - 26,t_collectable.y_pos - 59);
    line(t_collectable.x_pos - 26,t_collectable.y_pos- 59,t_collectable.x_pos + 28,t_collectable.y_pos - 58);

    fill('blue')
    triangle(t_collectable.x_pos,t_collectable.y_pos + 3,t_collectable.x_pos - 50,t_collectable.y_pos - 37,t_collectable.x_pos + 50,t_collectable.y_pos - 37);

    noStroke()
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    //function that removes the collectables when the character touches when called upon by calculating the distance between the game character and the variable and making the collectible disappear if the distance is less than a certain amount.
    var distance = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos);
    //console.log(distance)
    if (distance < 51)
    {
        t_collectable.isFound = true
        diamond.play();
        game_score += 1
        
        
    }
}

function renderFlagpole()
{
    // draws the flag in two different states one for when the character has reached the end of the level and when they haven't
    if (flagpole.isReached == false){
        stroke(0)
        strokeWeight(4)
        line(9185,100,9185,430)
        noStroke()
    }
    
    if (flagpole.isReached == true){
        stroke('red')
        strokeWeight(4)
        line(9192,100,9192,430)
        noStroke()
    }
   
}

function checkFlagpole()
{//checks if the conditions to specify if the game is over 
    if (gameChar_world_x >= 9195 && (game_score >= 18)){
        flagpole.isReached = true
        complete.play();
    }
}

function createPlatform(x,y,length)
{// factory to create the platforms
    var p = {
        x: x,
        y: y,
        length: length , 
        draw: function()
        {
            fill(255,255,0);
            stroke(0);
            rect(this.x, this.y, this.length, 20);
        
        },
        
        checkContact: function(gc_x, gc_y)
        {
            if (gc_x > this.x && gc_x < this.x + this.length)
            {
                var b = this.y - gc_y;
                if (b >= 0 && b < 5)
                {
                    return true;
                    
                }
            
            }
            return false;
        }
        
    }
    
    return p;
    
}

function Enemy(x,y,range)
{// factory for creating enemies 
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {
        fill(0);
        ellipse(this.current_x, this.y-25, 50);
        fill(255);
        ellipse(this.current_x - 10, this.y - 25, 10);
        ellipse(this.current_x + 10, this.y - 25, 10);
        stroke(255);
        line(
            this.current_x - 15,
            this.y - 35,
            this.current_x - 5,
            this.y - 30
        );
        line(
            this.current_x + 15,
            this.y - 35,
            this.current_x + 5,
            this.y - 30
        );
        noStroke();
        
    }
    
    this.update = function()
    {// sets a boundary that acts the range for the enemy movement 
        this.current_x += this.incr;
        
        if (this.current_x < this.x)
        {
            this.incr = 1;
            
        }
        else if(this.current_x > this.x + this.range + 1){
            this.incr = -1;
        }
        
        
    }
    
    this.isContact = function(gc_x, gc_y)
    {// checks for collision detection between the game character and the enemies 
        var d = dist(gc_x, gc_y, this.current_x, this.y);
        if (d < 25)
        {
            bite.play();
            return true;
        }
        
        return false;
    }
}




