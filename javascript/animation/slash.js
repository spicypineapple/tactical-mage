/** Slash animation */

var slash = [];
var isDisplayingSlash = false;

function initAnimateSlash(targetPos) {
    slash.push(new Slash(targetPos.x,targetPos.y));
    if (!isDisplayingSlash) {
        isDisplayingSlash = true;
        animateSlash();
    }
}

function animateSlash() {
    for (var i = slash.length-1; 0 <= i; i--) {
        slash[i].update();
        if (!slash[i].isAlive()) {
            slash.splice(i, 1);
        }
    }

    if (slash.length > 0) {
        window.requestAnimationFrame(animateSlash);
    } else {
        isDisplayingSlash = false;
    }
}

function Slash(x,y) {
    var coord = getCoordfromXY(x,y)
    this.radius = Grid.tilesize;
    this.x = coord.x - Grid.tilesize*0.5;
    this.y = coord.y - Grid.tilesize*2;
    this.linesize = 0;
    this.linemargin = 13;

    this.dx = 3;
    this.dy = 3;
    this.timeToLive = 30;
    this.gravity = .5;

    this.update = function() {
        this.dx += this.gravity;
        this.dy += this.gravity;

        // Move line by velocity
        this.linesize += this.dx;
        if (this.linesize > Grid.tilesize/2) {
            this.linesize = Grid.tilesize;
        }

        this.draw();

        this.timeToLive--;
    }

    this.draw = function() {
        Grid.ctx.save();
        Grid.ctx.beginPath();
        Grid.ctx.moveTo(this.x, this.y);
        Grid.ctx.lineTo(this.x + this.linesize, this.y + this.linesize);

        Grid.ctx.moveTo(this.x, this.y + this.linemargin);
        Grid.ctx.lineTo(this.x + this.linesize, this.y + this.linemargin + this.linesize);

        Grid.ctx.moveTo(this.x, this.y + this.linemargin*2);
        Grid.ctx.lineTo(this.x + this.linesize, this.y + this.linemargin*2 + this.linesize);

        Grid.ctx.lineWidth = 3;
        Grid.ctx.shadowColor = "#5a5d5f"; //'#E3EAEF';
        Grid.ctx.shadowBlur = 20;
        Grid.ctx.shadowOffsetX = 0;
        Grid.ctx.shadowOffsetY = 0;

        Grid.ctx.strokeStyle = "#181818"; //"#F1F4F7";
        Grid.ctx.stroke();
        Grid.ctx.closePath();
        Grid.ctx.restore();
    }

    this.isAlive = function() {
        return 0 <= this.timeToLive;
    }
}
