
window.onload = function() {
  /** Combat module basic test **/
  loadUnitFromJSON(initCombatTest);
}

function initCombatTest() {
  addLog(LogType.INFO, "initCombatTest");

  initCombatTestUnit();
  initGrid();
}

function initCombatTestUnit() {
  Grid.units = [];

  var Rei = new Unit(listUnitPattern[0]);
  Rei.giveSpirit(listSpiritPattern[0]);
  var Shadow = new Unit(listUnitPattern[1]);

  var posRei = {x:4,y:1};
  var posShadow = {x:4,y:6};

  Grid.units[0] = {unit: Rei, pos: posRei};
  Grid.units[1] = {unit: Shadow, pos: posShadow};
}
