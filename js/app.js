//enemy class
var enemy = function(x, y, speed) {
    //randomize x coordinate
    spawnPointX = [-50, -83, -102, -117];
    spawnChoiceX = spawnPointX[Math.floor(Math.random() * spawnPointX.length)];
    this.x = spawnChoiceX;

    //randomize y coordinate
    spawnPointY = [50, 140, 225];
    spawnChoiceY = spawnPointY[Math.floor(Math.random() * spawnPointY.length)];
    this.y = spawnChoiceY;

    //set enemy speed
    speed = [1, 2, 3, 4, 5, 6, 7, 8];
    speedChoice = speed[Math.floor(Math.random() * speed.length)];
    this.speed = speedChoice * 8;

    this.sprite = 'images/enemy-bug.png';
};

enemy.prototype.update = function(dt) {

    for (var i = 0, len = allEnemies.length; i < len; i++) {
        this.x = this.x + this.speed * dt;
    }

    //collision detection
    for (var i = 0, len = allEnemies.length; i < len; i++) {
        if (player.x < this.x + 35 && player.x + 50 > this.x && player.y < this.y + 0 && player.y + 20 > this.y) {
            player.x = 200;
            player.y = 400;
            lives = lives - 1;
        }
    }

    //resets enemies to spawn points if they reach canvas width (505) + width of image (101)
    var enemyRun = 505 + 101;
    if (this.x > enemyRun) {
        this.x = -100;
    }
};

enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//player class
var player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            this.x = this.x - 100;
            break;
        case 'right':
            this.x = this.x + 100;
            break;
        case 'up':
            this.y = this.y - 90;
            break;
        case 'down':
            this.y = this.y + 90;
            break;
    }
};

player.prototype.update = function(dt) {
    //preventing movement off the edge of the canvas
    if (this.x < 0) {
        this.x = 0;
    } else if (this.x > 400) {
        this.x = 400;
    } else if (this.y > 400) {
        this.y = 400;
    } else if (this.y < 0 && allItems.length > 0) {
        this.y = 40;
    }

    //requires that player reaches the water and all gems have been picked up before new round starts
    if (this.y < 0 && allItems.length === 0) {
        score = score + 5;
        this.x = 200;
        this.y = 400;

        //remove all gems and hearts at end of round
        allItems.splice(0, allItems.length);

        //respawn enemies on round or game over
        allEnemies.splice(0, allEnemies.length);

        for (var i = 0; i < 5; i++) {
            if (allEnemies.length < 5) {
                allEnemies.push(new enemy(i));
            }
        }

        //reset gem and heart spawns on new round
        if (allItems.length < 1) {
            allItems.push(new item(i));
        }
    }

    //displays lives and score at top of canvas
    livesDisplay = "Lives: " + lives;
    ctx.clearRect(0, 0, 200, 50);
    ctx.font = "26px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText(livesDisplay, 0, 30);

    var scoreDisplay = "Score: " + score;
    ctx.clearRect(400, 0, 200, 50);
    ctx.font = "26px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText(scoreDisplay, 380, 30);
};

player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//item class
var item = function(x, y) {

    var xLocation = [0, 101, 303, 404];
    var xChoice = xLocation[Math.floor(Math.random() * xLocation.length)];
    var yLocation = [122, 206, 287, 387];
    var yChoice = yLocation[Math.floor(Math.random() * yLocation.length)];

    this.x = xChoice;
    this.y = yChoice;

    //determine randomly which item will spawn
    var sprites = ['images/gemBlue.png', 'images/Heart.png'];
    var spriteChoice = sprites[Math.floor(Math.random() * sprites.length)];
    this.sprite = spriteChoice;
};

item.prototype.update = function() {
    //add to score upon collision with gem
    for (var i = 0, len = allItems.length; i < len; i++) {
        if (player.x < this.x + 75 && player.x + 75 > this.x && player.y < this.y + 75 && player.y + 50 > this.y && this.sprite === 'images/gemBlue.png') {
            score = score + 1;
            allItems.splice(this, 1);
        }
    }

    //all to lives upon collision with heart
    for (var i = 0, len = allItems.length; i < len; i++) {
        if (player.x < this.x + 75 && player.x + 75 > this.x && player.y < this.y + 75 && player.y + 50 > this.y && this.sprite === 'images/Heart.png') {
            lives = lives + 1;
            allItems.splice(this, 1);
        }
    }

    //resets stats and clears enemies upon game over
    if (lives === 0) {
        lives = 3;
        score = 0;

        player.x = 200;
        player.y = 400;

        //remove all gems and hearts
        allItems.splice(0, allItems.length);

        //respawn enemies on round
        allEnemies.splice(0, allEnemies.length);

        for (var i = 0; i < 5; i++) {
            if (allEnemies.length < 5) {
                allEnemies.push(new enemy(i));
            }
        }

        //reset gem and heart spawns
        if (allItems.length < 1) {
            allItems.push(new item(i));
        }
    }
};

item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// //initializing stats
var score = 0;
var lives = 3;

//instantiating player and enemies
var player = new player(200, 400);

var allEnemies = [];
for (var i = 0; i < 5; i++) {
    allEnemies.push(new enemy());
}

//instantiating items
var allItems = [];
for (var i = 0; i < 1; i++) {
    allItems.push(new item(i));
}

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});