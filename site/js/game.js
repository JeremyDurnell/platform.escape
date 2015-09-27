(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("theCanvas"),
    ctx = canvas.getContext("2d"),
    width = 600,
    height = 300,
    contestant = {x: (width - 100) / 2, y: height - 15, width: 5, height: 5, speed: 3, velocityX: 0, velocityY: 0, jumping: false, grounded: false },
    keys = [],
    friction = 0.8,
    gravity = 0.3,
    score = 0;

var boxes = [];
var winBoxes = [];

winBoxes.push({x: width - 100, y: height - 2, width: 100, height: 50}); // invisible floor
winBoxes.push({x: width - 1, y: 0, width: 1, height: height});// invisible right bound

// platforms
boxes.push({x: 0, y: 100, width: 10, height: height-100}); // left bound
boxes.push({x: 0, y: height - 2, width: width - 100, height: 50}); // floor
boxes.push({x: width - 110, y: 100, width: 10, height: height - 100}); //right bound
boxes.push({x: 25, y: 220, width: 80, height: 10});
boxes.push({x: 100, y: 250, width: 80, height: 10});
boxes.push({x: 125, y: 165, width: 80, height: 10});
boxes.push({x: 289, y: 125, width: 80, height: 10});
boxes.push({x: 386, y: 157, width: 38, height: 10});

canvas.width = width;
canvas.height = height;

function update() {
    if (keys[38] || keys[32] || keys[87]) {
        // holding space or up
        if (!contestant.jumping && contestant.grounded) {
            contestant.jumping = true;
            contestant.grounded = false;
            contestant.velocityY = -contestant.speed * 2;
        }
    }
    if (keys[39] || keys[68]) {
        // holding right
        if (contestant.velocityX < contestant.speed) {
            contestant.velocityX++;
        }
    }
    if (keys[37] || keys[65]) {
        // holding left
        if (contestant.velocityX > -contestant.speed) {
            contestant.velocityX--;
        }
    }

    contestant.velocityX *= friction;
    contestant.velocityY += gravity;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgb(107,25,25)";
    ctx.beginPath();
    contestant.grounded = false;

    for (var i = 0; i < boxes.length; i++) {
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        var direction = collisionCheck(contestant, boxes[i]);

        if (direction === "l" || direction === "r") {
            contestant.velocityX = 0;
            contestant.jumping = false;
        } else if (direction === "b") {
            contestant.grounded = true;
            contestant.jumping = false;
        } else if (direction === "t") {
            contestant.velocityY *= -1;
        }
    }

    for (var k = 0; k < winBoxes.length; k++) {
        if (collisionCheck(contestant, winBoxes[k])) {
            score++;
            contestant.x = (width - 100) / 2;
            contestant.y = height - 15;
        }
    }

    renderScore(score);

    if (contestant.grounded) {
        contestant.velocityY = 0;
    }

    contestant.x += contestant.velocityX;
    contestant.y += contestant.velocityY;
    ctx.fill();
    ctx.fillStyle = "rgb(64,31,232)";
    ctx.beginPath();
    ctx.arc(contestant.x, contestant.y, contestant.width, contestant.height, 0, 2 * Math.PI, false);
    ctx.fill();
    requestAnimationFrame(update);
}

function renderScore(score) {
    if (score > 0) {
        ctx.font = "bold 24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText("Winning: " + score, 50, 50);
    }
}

function collisionCheck(rect1, rect2) {
    // calculate vectors to check
    var vectX = (rect1.x + (rect1.width / 2)) - (rect2.x + (rect2.width / 2)),
        vectY = (rect1.y + (rect1.height / 2)) - (rect2.y + (rect2.height / 2)),
        // add half of the width and half of the height of each object
        halfWidths = (rect1.width / 2) + (rect2.width / 2),
        halfHeights = (rect1.height / 2) + (rect2.height / 2),
        collisionDir = null;
    
    // if true, x and y vector are inside object (collision)
    if (Math.abs(vectX) < halfWidths && Math.abs(vectY) < halfHeights) {
        // determines if collision is on top, bottom, right, or left
        var offsetX = halfWidths - Math.abs(vectX),
            offsetY = halfHeights - Math.abs(vectY);
        if (offsetX >= offsetY) {
            if (vectY > 0) {
                collisionDir = "t";
                rect1.y += offsetY;
            } else {
                collisionDir = "b";
                rect1.y -= offsetY;
            }
        } else {
            if (vectX > 0) {
                collisionDir = "l";
                rect1.x += offsetX;
            } else {
                collisionDir = "r";
                rect1.x -= offsetX;
            }
        }
    }
    return collisionDir;
}

document.body.addEventListener("keydown", function (e) {keys[e.keyCode] = true;});
document.body.addEventListener("keyup", function (e) {keys[e.keyCode] = false;});
window.addEventListener("load", function () {update();});