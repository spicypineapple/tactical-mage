/**
 * @file Combat handler (grid placement, turn order, battle action)
 */

/******************************************************************************/
/*                               Grid Placement                               */
/******************************************************************************/

/**
 * Randomly place Units on the available tiles
 * @param {Array.<Unit>} allyUnits - array of allied Units
 * @param {Array.<{x: number, y: number}>} availableAllyPos - array of pos in {x,y} format
 * @param {Array.<Unit>} foeUnits - array of opposing Units
 * @param {Array.<{x: number, y: number}>} availableFoePos - array of pos in {x,y} format
 * @throws {invalidBattleException}
 */
function generateGridPlacement(allyUnits, availableAllyPos, foeUnits, availableFoePos) {
  Grid.units = []; //format: {unit: Unit, pos: {x: number, y: number}}

  if (availableAllyPos.length >= allyUnits.length && availableFoePos.length >= foeUnits.length) {

    for (var i=0; i<allyUnits.length; i++) {
      Grid.units.push({
        unit: allyUnits[i],
        pos: availableAllyPos[getRandomInt(0,availableAllyPos.length)]
      });
    }

    for (var i=0; i<foeUnits.length; i++) {
      Grid.units.push({
        unit: foeUnits[i],
        pos: availableFoePos[getRandomInt(0,availableFoePos.length)]
      });
    }

  } else {
    throw new invalidBattleException("Error: There are more units than available unit tiles");
  }
}

/******************************************************************************/
/*                                 Turn Order                                 */
/******************************************************************************/

/**
 * Grid.turnOrder = {
 *   {{unit: Unit, pos: {x: number, y: number}}} currentUnit,
 *   {number} currentTurnN,
 *   {number} currentUnitTurnN,
 *   {Array} 1,
 *   {Array} 2,
 *   ...
 * }
 * The 1-2-... notation is used as follow:
 * Grid.turnOrder[i] === [battleId1,battleId2,...]
 */

/**
 * Initialize the Turn Order data at the beginning of a battle
 */
function initTurnOrder() {
  for (var i=0; i<Grid.units.length; i++) {
    Grid.units[i].unit.battleId = i;
  }

  Grid.turnOrder = {};

  // We display the Unit order for the following 2 turns
  generateTurnOrder(1);
  generateTurnOrder(2);

  Grid.turnOrder.currentUnit = null;
  Grid.turnOrder.currentTurnN = 1;
  Grid.turnOrder.currentUnitTurnN = 0;
}

/**
 * Calculate turn order for specified turn
 * @param {number} turnNumber - specified turn to calculate turn order of
 */
function generateTurnOrder(turnNumber) {
  var sortUnit = [];

  // generate Units initiative for the current turn
  for (var i=0; i<Grid.units.length; i++) {
    var init = Grid.units[i].unit.calculateInit();
    Grid.units[i].initiative = init;
    sortUnit.push({
      battleId: Grid.units[i].unit.battleId,
      initiative: Grid.units[i].initiative
    });
  }

  // Sort Units by initiative
  sortUnit.sort(function(a,b) {
    if (a.initiative === b.initiative) {
      // if they have the same initiatve, we randomly chose either one
      return getRandomIntInclusive(0,1);
    } else {
      return a.initiative - b.initiative;
    }
  });

  Grid.turnOrder[turnNumber] = [];

  for (var i=0; i<sortUnit.length; i++) {
    Grid.turnOrder[turnNumber].push(sortUnit[i].battleId);
  }
}

/**
 * Begin new turn order
 */
function newTurn() {
  addLog(LogType.INFO, "Turn " + Grid.turnOrder.currentTurnN);
  newUnitTurn();
}

/**
 * Begin new turn for according Unit, which:
 * 1. select unit;
 * 2. may prompt a dialog;
 * 3. execute action if AI
 */
function newUnitTurn() {
  var currentUnitId = Grid.turnOrder[Grid.turnOrder.currentTurnN][Grid.turnOrder.currentUnitTurnN];
  var currentUnit = Grid.units[currentUnitId];
  Grid.turnOrder.currentUnit = currentUnit;

  displayTurnOrder();

  mode = "default";
  selectTile(currentUnit.pos);

  if (currentUnit.unit.isAI) {
    displayUnitDialog(currentUnit.pos, "Agrougrou", "speak");
    addLog(LogType.DIALOG, "<b>" + currentUnit.unit.name + "</b>: Agrougrou");
    var shadowSlash = {
  		"name": "Slash",
  		"animation": "slash",
  		"MPcost": 10,
  		"powerFormula": { "base": -10 },
  		"specialEffect": [] };
    battleAction(currentUnit.unit,
                 currentUnit.pos,
                 Grid.units[0].unit,
                 Grid.units[0].pos,
                 shadowSlash);
  } else {
    displayUnitDialog(currentUnit.pos, "Leave it to me!", "speak");
    addLog(LogType.DIALOG, "<b>" + currentUnit.unit.name + "</b>: Leave it to me!");
  }
}

/**
 * End turn action, update turn order data
 */
function endUnitTurn() {
  if (Grid.turnOrder.currentUnitTurnN < Grid.turnOrder[Grid.turnOrder.currentTurnN].length-1) {
    Grid.turnOrder.currentUnitTurnN++;
    newUnitTurn();
  } else {
    endTurn();
  }
}

/**
 * End turn, which update turn order data
 */
function endTurn() {
  Grid.turnOrder.currentTurnN++;
  Grid.turnOrder.currentUnitTurnN = 0;

  // We keep displaying the Unit order for the following two turns
  generateTurnOrder(Grid.turnOrder.currentTurnN+1);

  newTurn();
}

/**
 * Display Grid.units turn order for the next two turns
 */
function displayTurnOrder() {
  var turnOrderBox = document.getElementById("game-turnorder");
  turnOrderBox.innerHTML = "";

  for (var i=0; i<Grid.turnOrder[Grid.turnOrder.currentTurnN].length; i++) {
    if (i >= Grid.turnOrder.currentUnitTurnN) {
      var newTurnOrder = document.createElement("img");
      newTurnOrder.classList.add("unit-portrait-img");
      newTurnOrder.setAttribute("src", Grid.units[Grid.turnOrder[Grid.turnOrder.currentTurnN][i]].unit.portraitImg);

      turnOrderBox.appendChild(newTurnOrder);
      turnOrderBox.innerHTML += "&thinsp;";
    }
  }

  var newTurnSeparation = document.createElement("span");
  newTurnSeparation.classList.add("game-turnorder-separation");
  newTurnSeparation.innerHTML = "⥤";

  turnOrderBox.appendChild(newTurnSeparation);
  turnOrderBox.innerHTML += "&thinsp;";

  for (var i=0; i<Grid.turnOrder[Grid.turnOrder.currentTurnN+1].length; i++) {
    var newTurnOrder = document.createElement("img");
    newTurnOrder.classList.add("unit-portrait-img");
    newTurnOrder.setAttribute("src", Grid.units[Grid.turnOrder[Grid.turnOrder.currentTurnN+1][i]].unit.portraitImg);

    turnOrderBox.appendChild(newTurnOrder);
    turnOrderBox.innerHTML += "&thinsp;";
  }
}

/******************************************************************************/
/*                               Battle Action                                */
/******************************************************************************/

/**
 * Compute action on the target
 * Display animation
 * @param {Unit} user - user of action
 * @param {{x: number, y: number}} userPos - tile on which is the user
 * @param {Unit} target - target of action
 * @param {{x: number, y: number}} targetPos - tile on which is the target
 * @param {Power} power - Power used
 */
function battleAction(user, userPos, target, targetPos, power) {
  var message = "<b>" + user.name + "</b> uses <b>" + power.name + "</b>";

  if (target) {
    var damage = user.calculatePowerDamage(power, target);
    target.changeHP(damage);
    displayChangeHP(targetPos, damage, "damage");

    if (damage < 0) {
      message += ", <b>" + target.name + "</b> loses " + Math.abs(damage) + " hit point";
    } else {
      message += ", <b>" + target.name + "</b> gains " + Math.abs(damage) + " hit point";
    }
  }

  addLog(LogType.BATTLE, message);

  switch (power.animation) {
    case "meteor":
      initAnimateMeteor(targetPos);
      break;
    case "heal":
      //initAnimateHeal(targetPos);
      break;
    case "slash":
      initAnimateSlash(targetPos);
      break;
  }

  window.setTimeout(endUnitTurn, 1000);
}

var floatingText = [];
var isDisplayingText = false;

/**
 * Animate the HP change on the unit
 * The animation will change according to the type of action (eg attack or heal)
 * @param {x,y} targetPos - tile on which is the unit targeted
 * @param {number} damage - number of HP lost or gained
 * @param {String} type - type of action which will change the display
 */
function displayChangeHP(targetPos, damage, type) {
  var coord = getCoordfromXY(targetPos.x, targetPos.y);
  var newText = {
    coord: coord,
    text: damage,
    type: type,
    time: 30
  }
  floatingText.push(newText);

  if (!isDisplayingText) {
    isDisplayingText = true;
    displayText();
  }
}

/**
 * Animate a dialog on top of the unit
 * @param {x,y} targetPos - tile on which is the unit targeted
 * @param {text} text - dialog said by unit
 * @param {String} type - type of action which will change the display
 */
function displayUnitDialog(targetPos, text, type) {
  var coord = getCoordfromXY(targetPos.x, targetPos.y);
  var newText = {
    coord: coord,
    text: text,
    type: type,
    time: 100
  }
  floatingText.push(newText);

  if (!isDisplayingText) {
    isDisplayingText = true;
    displayText();
  }
}

/**
 * Display text on the canvas on the according tiles
 * @see floatingText
 */
function displayText() {
  for (var i=floatingText.length-1; 0<=i; i--) {
    if (floatingText[i].time > 0) {
      var margin = 5;
      var textHeight = 20;
      var textContent = floatingText[i].text;

      Grid.ctx.font = textHeight+'px serif';
      var metrics = Grid.ctx.measureText(textContent);

      var textX = floatingText[i].coord.x - metrics.width/2 - margin;
      var textY = floatingText[i].coord.y - textHeight*3 - Grid.unitheight;
      var textSX = metrics.width + margin*2;
      var textSY = textHeight + margin*2;

      switch (floatingText[i].type) {
        case "damage":
          Grid.ctx.strokeStyle = 'red';
          Grid.ctx.strokeText(textContent, textX + margin, textY + textHeight);

          Grid.ctx.fillStyle = 'red';
          Grid.ctx.fillText(textContent, textX + margin, textY + textHeight);
          break;

        case "heal":
          Grid.ctx.strokeStyle = 'green';
          Grid.ctx.strokeText(textContent, textX + margin, textY + textHeight);

          Grid.ctx.fillStyle = 'green';
          Grid.ctx.fillText(textContent, textX + margin, textY + textHeight);
          break;

        case "speak":
          Grid.ctx.fillStyle = 'white';
          Grid.ctx.fillRect(textX, textY, textSX, textSY);

          Grid.ctx.strokeStyle = 'black';
          Grid.ctx.strokeRect(textX, textY, textSX, textSY);

          Grid.ctx.fillStyle = 'black';
          Grid.ctx.fillText(textContent, textX + margin, textY + textHeight);
          break;
      }

      floatingText[i].time--;
    } else {
      floatingText.splice(i,1);
    }
  }

  if (floatingText.length > 0) {
    window.requestAnimationFrame(displayText);
  } else {
    isDisplayingText = false;
  }
}
