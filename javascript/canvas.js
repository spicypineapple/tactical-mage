/*****************/
/* Grid creation */
/*****************/

/**
 * @namespace
 */
var Grid = {
  canvas:null,
  ctx:null,
  tilesize:35,
  tileheight:10,
  sx:9,
  sy:9,
  tilecolor:'#ff8d4b',
  tilemap:[],
  tileselected: -1,
  tileover: -1,
  units:[], // { unit:Unit, pos:{x,y} }
  unitsize:30,
  unitheight:53
}

/**
 * @enum
 */
var DisplayValue = {
  NORMAL: 0,
  HOVER: 1,
  SELECTED: 2,
  ENEMY_TARGET: 3,
  ALLY_TARGET: 4
}

/**************************/
/* Grid & Canvas creation */
/**************************/

/**
 * Creates the grid, puts the units in it, displays canvas content & begins battle
 */
function initGrid() {
  // Set up the canvas
  Grid.canvas = document.getElementById('game-grid');
  updateCanvasSize();
  Grid.ctx = Grid.canvas.getContext('2d');

  // Init Grid table value
  for (var i=0; i<Grid.sx; i++) {
    for (var j=0; j<Grid.sy; j++) {
      Grid.tilemap[i+j*Grid.sx] = {displayValue: DisplayValue.NORMAL};
    }
  }

  // Add the units that will fight during this battle
  for (var i=0; i<Grid.units.length; i++) {
    addUnitToGrid(Grid.units[i].unit, Grid.units[i].pos);
  }

  // display Grid & Unit
  drawGrid();
  drawUnits();

  // Once it's ready, we launch battle
  newTurn();
}

/**
 * Add the Unit to the grid at the specified position
 * @param {Unit} unit - Unit to add on the grid
 * @param {x,y} pos - Specified tile on grid
 */
function addUnitToGrid(unit, pos) {
  Grid.tilemap[pos.x+pos.y*Grid.sx].unit = unit;
  unit.isAlive = true;

  if (unit.type === "monster") {
    unit.isAI = true;
  }
}

/**
 * Set up canvas size
 */
function updateCanvasSize() {
  Grid.canvas.style.width = (Grid.sx + 1)*Grid.tilesize*2;
  Grid.canvas.style.height = (Grid.sy + 1)*Grid.tilesize;
  Grid.canvas.width = (Grid.sx + 1)*Grid.tilesize*2;
  Grid.canvas.height = (Grid.sy + 1)*Grid.tilesize;
}

/**
 * Display the grid in the canvas
 */
function drawGrid(){
  // clear the canvas
  Grid.ctx.clearRect(0, 0, Grid.canvas.width, Grid.canvas.height);

  // draw the tiles
  for (var i=0; i<Grid.sx; i++) {
    for (var j=0; j<Grid.sy; j++) {
      if (Grid.tilemap[i+j*Grid.sx].displayValue == DisplayValue.HOVER) {
        var color = '#fe5d00';
      } else if (Grid.tilemap[i+j*Grid.sx].displayValue == DisplayValue.SELECTED) {
        var color = '#ffe74b';
      } else if (Grid.tilemap[i+j*Grid.sx].displayValue == DisplayValue.ENEMY_TARGET) {
        var color = '#ff4b63';
      } else if (Grid.tilemap[i+j*Grid.sx].displayValue == DisplayValue.ALLY_TARGET) {
        var color = '#63ff4b';
      } else {
        var color = Grid.tilecolor; // #ff8d4b
      }
      var coord = getCoordfromXY(i,j);
      drawTile(
        coord.x, // x
        coord.y, // y
        color
      );
    }
  }

  requestAnimationFrame(drawGrid);
}

/**
 * Display the units in the canvas
 */
function drawUnits(){
  for (var i=0; i<Grid.units.length ; i++) {
    if (Grid.units[i].unit.isAlive) {
      drawUnit(Grid.units[i].pos.x,Grid.units[i].pos.y,Grid.units[i].unit.gridImg);
    }
  }

  requestAnimationFrame(drawUnits);
}

/******************/
/* Data functions */
/******************/

/**
 * Get grid tile pos from mouse coord
 * @param {x,y} coord - mouse coord in canvas
 * @returns {x,y} grid coord in canvas
 */
function getXYfromCoord(coord) {
  var cx = coord.x;
  var cy = coord.y;

  var pos = {};
  pos.y = ((cy - Grid.canvas.height/2 - Grid.tileheight)/(Grid.tilesize/2) + Grid.sy - (cx - Grid.canvas.width/2)/Grid.tilesize - 0.5)*0.5;
  pos.x = (cx - Grid.canvas.width/2)/Grid.tilesize + pos.y;
  pos.y = Math.round(pos.y);
  pos.x = Math.round(pos.x);

  return pos;
}

/**
 * Get mouse coord from grid tile pos
 * @param {x,y} pos - grid coord in canvas
 * @return {x,y} mouse coord in canvas
 */
function getCoordfromXY(x,y) {
  var coord = {};
  coord.x = Grid.canvas.width/2 + (x - y)*Grid.tilesize;
  coord.y = Grid.canvas.height/2 + (x + y - Grid.sy)*Grid.tilesize/2 + Grid.tilesize + Grid.tileheight;

  return coord;
}

/**
 * Get unit from grid tile pos
 * @param {x,y} pos - grid coord in canvas
 * @return {Unit} unit on pos || null if no unit on pos
 */
function getUnitOnPos(x, y) {
  if (Grid.tilemap[x+y*Grid.sx].unit) {
    return Grid.tilemap[x+y*Grid.sx].unit;
  } else {
    return null;
  }
}

/******************/
/* Draw functions */
/******************/

/**
 * Display a grid tile on x,y tile
 * @param {number} x - x pos
 * @param {number} y - y pos
 * @param {string} color - tile color
 */
function drawTile(x, y, color) {
  drawCube(
    x, y, // x,y
    Grid.tilesize, Grid.tilesize, Grid.tileheight, // dimension
    color
  );
}

/**
 * Display Unit on x,y tile
 * @param {number} x - x pos
 * @param {number} y - y pos
 * @param {String} img - img link to the unit's image
 */
function drawUnit(x, y, img){
  var image = new Image();
  image.src = img;

  Grid.ctx.drawImage(image,
    Grid.canvas.width/2 + (x - y)*Grid.tilesize - Grid.tilesize/2,
    Grid.canvas.height/2 + (x + y - Grid.sy)*Grid.tilesize/2 + Grid.tilesize + Grid.tileheight - 75);
}

/**
 * Display a cube on x,y tile
 * @param {number} x - x pos
 * @param {number} y - y pos
 * @param {number} wx - x width
 * @param {number} wy - y width
 * @param {number} h - height
 * @param {string} color - cube color
 */
function drawCube(x, y, wx, wy, h, color) {
  this.x = this.x - wx;
  this.y = this.y - wy;

  Grid.ctx.beginPath();
  Grid.ctx.moveTo(x, y);
  Grid.ctx.lineTo(x - wx, y - wx * 0.5);
  Grid.ctx.lineTo(x - wx, y - h - wx * 0.5);
  Grid.ctx.lineTo(x, y - h * 1);
  Grid.ctx.closePath();
  Grid.ctx.fillStyle = shadeColor(color, -10);
  Grid.ctx.strokeStyle = color;
  Grid.ctx.stroke();
  Grid.ctx.fill();

  Grid.ctx.beginPath();
  Grid.ctx.moveTo(x, y);
  Grid.ctx.lineTo(x + wy, y - wy * 0.5);
  Grid.ctx.lineTo(x + wy, y - h - wy * 0.5);
  Grid.ctx.lineTo(x, y - h * 1);
  Grid.ctx.closePath();
  Grid.ctx.fillStyle = shadeColor(color, 10);
  Grid.ctx.strokeStyle = shadeColor(color, 50);
  Grid.ctx.stroke();
  Grid.ctx.fill();

  Grid.ctx.beginPath();
  Grid.ctx.moveTo(x, y - h);
  Grid.ctx.lineTo(x - wx, y - h - wx * 0.5);
  Grid.ctx.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
  Grid.ctx.lineTo(x + wy, y - h - wy * 0.5);
  Grid.ctx.closePath();
  Grid.ctx.fillStyle = shadeColor(color, 20);
  Grid.ctx.strokeStyle = shadeColor(color, 60);
  Grid.ctx.stroke();
  Grid.ctx.fill();
}

/**
 * Display a circle on x,y tile
 * @param {number} x - x pos
 * @param {number} y - y pos
 * @param {number} wx - x width
 * @param {number} wy - y width
 * @param {number} h - height
 * @param {string} color - circle color
 */
function drawCircle(x, y, wx, wy, h, color) {
    Grid.ctx.beginPath();
    Grid.ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
    Grid.ctx.fillStyle = '#FE0022';
    Grid.ctx.stroke();
    Grid.ctx.fill();
}

/**
 * Colour adjustment function
 * Nicked from http://stackoverflow.com/questions/5560248
 * @param {string} color - base color
 * @param {number} percent - percentage to shade color
 * @return {string} adjusted color
 */
function shadeColor(color, percent) {
  color = color.substr(1);
  var num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

/*****************/
/* Mouse Handler */
/*****************/

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener('mousedown', mouseDownHandler, false);

/** Unused */
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

/**
 * Change the color of the currently hovered tile
 * Display hovered unit in target HUD
 * Remove previously hovered unit from the target HUD
 * @param {EventTarget} e
 */
function mouseMoveHandler(e) {
  var pos = getXYFromMouse(e);

  if (pos) {
    // reset current over
    if (Grid.tileover != -1) {
      if (Grid.tileselected != Grid.tileover) {
        Grid.tilemap[Grid.tileover].displayValue = DisplayValue.NORMAL;
      } else {
        Grid.tilemap[Grid.tileover].displayValue = DisplayValue.SELECTED;
      }
    }

    // select new tile
    Grid.tileover = pos.x+pos.y*Grid.sx;

    var unit = getUnitOnPos(pos.x,pos.y);
    displayTarget(unit);

    if (unit && unit.spirit[0]) {
      Grid.tilemap[Grid.tileover].displayValue = DisplayValue.ALLY_TARGET;
    } else if (unit) {
      Grid.tilemap[Grid.tileover].displayValue = DisplayValue.ENEMY_TARGET;
    } else {
      Grid.tilemap[Grid.tileover].displayValue = DisplayValue.HOVER;
    }
  } else {
    // reset current over
    if (Grid.tileover != -1) {
      if (Grid.tileselected != Grid.tileover) {
        Grid.tilemap[Grid.tileover].displayValue = DisplayValue.NORMAL;
      } else {
        Grid.tilemap[Grid.tileover].displayValue = DisplayValue.SELECTED;
      }
    }
  }
}

/**
 * Change the color of the selected tile
 * Display selected unit in selection HUD
 * Remove previously selected unit from the selection HUD
 * @param {x,y} pos - grid tile pos
 */
var selectedUnit;
var selectedPos;
function selectTile(pos) {
  if (mode === "default") {
    // reset current selection
    if (Grid.tileselected != -1) {
      Grid.tilemap[Grid.tileselected].displayValue = DisplayValue.NORMAL;
    }

    // select new tile
    Grid.tileselected = pos.x+pos.y*Grid.sx;
    Grid.tilemap[Grid.tileselected].displayValue = DisplayValue.SELECTED;

    // display tile unit
    selectedUnit = getUnitOnPos(pos.x,pos.y);
    selectedPos = {x:pos.x,y:pos.y};
    if (selectedUnit) {
      displaySelectedUnit(selectedUnit);
    } else {
      hideSelectedUnit();
    }
  }
}

/**
 * Select tile clicked
 * @param {EventTarget} e
 */
function mouseDownHandler(e) {
  var pos = getXYFromMouse(e);

  if (pos) {
    if (mode === "default") {
      selectTile(pos);
    } else if (mode === "attack") {
      var target = getUnitOnPos(pos.x,pos.y);
      // TODO remove 'meteor' hardcode
      battleAction(selectedUnit,selectedPos,target,pos,"meteor");
    }
  }
}

/**
 * Get grid tile pos from mouse event
 * @param {EventTarget} e
 */
function getXYFromMouse(e) {
  var mx = e.clientX - Grid.canvas.offsetLeft;
  var my = e.clientY - Grid.canvas.offsetTop;
  if (mx < 0 || mx > Grid.canvas.width || my < 0 || my > Grid.canvas.height) {
    return null; // out of canvas
  }

  var coord = {x:mx,y:my};
  var pos = getXYfromCoord(coord);

  if (pos.x < 0 || pos.y < 0 || pos.x >= Grid.sx || pos.y >= Grid.sy) {
    return null; // out of grid
  } else {
    return pos;
  }
}

var mode = "default";
/**
 * Set clicked attack as selected; change the reaction to grid tile click (-> action)
 * @param {number} spiritId - id of the spirit
 * @param {number} attackId - id of the action
 */
function toggleAttack(spiritId, attackId) {
  if (mode != "attack") {
    // TODO change cursor appearance (sword? wand?)
    document.getElementById("selected-unit-spirit-"+spiritId+"-action-"+attackId).classList.add("selected");
    mode = "attack";
  } else {
    document.getElementById("selected-unit-spirit-"+spiritId+"-action-"+attackId).classList.remove("selected");
    mode = "default";
  }
}
