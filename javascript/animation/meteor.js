/** Meteor animation */

var stars = [];
var explosions = [];
var isDisplayingMeteor = false;

function initAnimateMeteor(targetPos) {
  stars.push(new Star(targetPos.x,targetPos.y));
  if (!isDisplayingMeteor) {
    isDisplayingMeteor = true;
    animateMeteor();
  }
}

function animateMeteor() {
	for (var i = stars.length-1; 0 <= i; i--) {
      stars[i].update();
	    if (!stars[i].isAlive()) {
	    	stars.splice(i, 1);
	    }
	}
	for (var i = explosions.length-1; 0 <= i; i--) {
      explosions[i].update();
	    if (!explosions[i].isAlive()) {
  		  explosions[i].particles.splice(0, explosions[i].particles.length);
	    	explosions.splice(i, 1);
	    }
	}

  if (stars.length > 0 || explosions.length > 0) {
    window.requestAnimationFrame(animateMeteor);
  } else {
    isDisplayingMeteor = false;
  }
}

function Star(x,y) {
  var coord = getCoordfromXY(x,y)
	this.radius = 10;
	this.x = coord.x + Grid.tilesize/1.5;
	this.y = coord.y - Grid.tilesize*3;
  this.groundHeight = coord.y;
	this.dx = -3;
	this.dy = 5;
  this.timeToLive = 30;
	this.gravity = .5;
	this.friction = .54;

	this.update = function() {
    // Check if still visible
    if (this.radius > 0) {
  		// Explodes at floor level
  		if (this.y + this.radius + this.dy >= this.groundHeight) {
        console.log("Hit ground");
  			this.radius = 0;
        explosions.push(new Explosion(this));
  		} else {
  			this.dy += this.gravity;
        explosions.push(new Explosion(this));
  		}

  		// Move particles by velocity
  		this.x += this.dx;
  		this.y += this.dy;

  		this.draw();
    }

		// Draw particles from explosion
		/*for (var i = 0; i < explosions.length; i++) {
		    explosions[i].update();
		}*/

    this.timeToLive--;
	}

	this.draw = function() {
		Grid.ctx.save();
		Grid.ctx.beginPath();
		Grid.ctx.arc(this.x, this.y, Math.abs(this.radius), 0, Math.PI * 2, false);

		Grid.ctx.shadowColor = '#E3EAEF';
		Grid.ctx.shadowBlur = 20;
		Grid.ctx.shadowOffsetX = 0;
		Grid.ctx.shadowOffsetY = 0;

		Grid.ctx.fillStyle = "#F1F4F7";
		Grid.ctx.fill();
		Grid.ctx.closePath();
		Grid.ctx.restore();
	}

  this.isAlive = function() {
		return 0 <= this.timeToLive;
  }
}

function Particle(x, y, dx, dy, groundHeight, timeToLive) {
	this.x = x;
	this.y = y;
	this.size = {
		width: 2,
		height: 2
	};
	this.dx = dx;
	this.dy = dy;
  this.groundHeight = groundHeight;
	this.gravity = .09;
	this.friction = 0.88;
	this.timeToLive = timeToLive;
	this.opacity = 1;

	this.update = function() {
		if (this.y + this.size.height + this.dy >= Grid.canvas.height - this.groundHeight) {
			this.dy = -this.dy * this.friction;
			this.dx *= this.friction;
		} else {
			this.dy += this.gravity;
		}

		this.x += this.dx;
		this.y += this.dy;

		this.draw();

		this.timeToLive --;
		this.opacity -= 1 / (this.timeToLive / 0.01);
	}

	this.draw = function() {
		Grid.ctx.save();
		Grid.ctx.fillStyle = "rgba(227, 234, 239," + this.opacity + ")";
		Grid.ctx.shadowColor = '#E3EAEF';
		Grid.ctx.shadowBlur = 20;
		Grid.ctx.shadowOffsetX = 0;
		Grid.ctx.shadowOffsetY = 0;
		Grid.ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
		Grid.ctx.restore();
	}

	this.isAlive = function() {
		return 0 <= this.timeToLive;
	}
}

function Explosion(star) {
	this.particles = [];
  this.timeToLive;

	this.init = function(parentStar) {
    this.timeToLive = parentStar.timeToLive;
		for (var i = 0; i < 8; i++) {
			var velocity = {
				x: (Math.random() - 0.5) * 5,
				y: (Math.random() - 0.5) * 15,
			}
		  this.particles.push(new Particle(parentStar.x, parentStar.y, velocity.x, velocity.y, parentStar.groundHeight, parentStar.timeToLive));
		}
	}

	this.init(star);

	this.update = function() {
		for (var i = this.particles.length-1; 0 <= i; i--) {
		    this.particles[i].update();
		    if (!this.particles[i].isAlive()) {
		    	this.particles.splice(i, 1);
		    }
		}
    this.timeToLive--;
	}

  this.isAlive = function() {
    return 0 <= this.timeToLive;
  }
}
