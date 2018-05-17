/**
 * @file First script executed once the DOM is loaded.
 *
 * 1. We read the JSON and populate our objects;
 * TODO 2. We get previous cache data if available and set the game at this
 * point, otherwise we create a new game.
 *
 * At the moment, we can only make the combat module available to the player,
 * with set allies and enemies.
 */


window.onload = function() {
  loadUnitFromJSON(initCombatTest);
}

/**
 * Testing of the combat module
 */
function initCombatTest() {
  addLog(LogType.INFO, "initCombatTest");

  initCombatTestUnit();
  initGrid();
}

/**
 * Testing of the combat module (hardcoded unit setup)
 * ally: level 1 Rei
 * enemy: level 1 Shadow
 */
function initCombatTestUnit() {
  Grid.units = [];

  var Rei = new Unit(listUnitPattern[0]);
  Rei.giveSpirit(listSpiritPattern[0]);
  var Shadow = new Unit(listUnitPattern[1]);

  var allyUnits = [Rei];
  var foeUnits = [Shadow];
  var availableAllyPos = [{x:4,y:1}];
  var availableFoePos = [{x:4,y:6}];

  generateGridPlacement(allyUnits,availableAllyPos,foeUnits,availableFoePos);
  initTurnOrder();
}
