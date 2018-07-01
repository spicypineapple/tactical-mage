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
    Log.addLog(LogType.INFO, "initCombatTest");

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

    const Rei = new Unit(listUnitPattern[0]);
    Rei.giveSpirit(listSpiritPattern[0]);
    const Shadow = new Unit(listUnitPattern[1]);

    const allyUnits = [Rei];
    const foeUnits = [Shadow];
    const availableAllyPos = [{x:4,y:2}];
    const availableFoePos = [{x:4,y:6}];

    generateGridPlacement(allyUnits,availableAllyPos,foeUnits,availableFoePos);
    initTurnOrder();
}
