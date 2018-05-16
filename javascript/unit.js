/*****************/
/* Unit pattern */
/*****************/

var listUnitPattern = [];
var listSpiritPattern = [];

/**
 * Instantiation of listUnitPattern which is used by the Unit constructor to
 * create new Unit
 * @param {function} callback - Function to be called once the list is populated
 */
function loadUnitFromJSON(callback) {
  fetchJSONFile('resources/unitpattern.json', function(data) {
    for (var i=0; i<data.length; i++) {
      listUnitPattern[data[i].id] = data[i];
    }
    loadSpiritFromJSON(callback);
  });
}

/**
 * Instantiation of listSpiritPattern which is used by the Spirit constructor
 * @param {function} callback - Function to be called once the list is populated
 */
function loadSpiritFromJSON(callback) {
  fetchJSONFile('resources/spiritpattern.json', function(data) {
    for (var i=0; i<data.length; i++) {
      listSpiritPattern[data[i].id] = data[i];
    }
    callback();
  });
}

/*****************/
/* Unit creation */
/*****************/

/**
 * Create a Unit
 * @constructor
 * @param {Object} data - The unit model @see listUnitPattern
 */
var Unit = function(data) {
  this.id = data.id;
  this.portraitImg = data.portraitImg;
  this.name = data.name;

  this.type = data.type;

  this.level = 1;
  this.hpmax = 100;
  this.hp = 100;
  this.resistance = "none";

  this.gridImg = data.gridImg;

  this.spirit = [];
}

/**
 * Add a Spirit to the unit
 * @param {Object} data - The spirit model
 */
Unit.prototype.giveSpirit = function(data) {
  this.spirit.push(data);
}

/**********/
/* Battle */
/**********/

/**
 * Change current HP of unit by the given number
 * @param {int} chp - The number of HP to add
 */
Unit.prototype.changeHP = function(chp) {
  if (chp > 0) {
    if (this.hp + chp > this.hpmax) {
      this.hp = this.hpmax;
    } else {
      this.hp += chp;
    }
  } else if (chp < 0) {
    if (this.hp + chp < 0) {
      // TODO dead
      Grid.units[this.battleId].unit.isAlive = false;
    } else {
      this.hp += chp;
    }
  }
}

/****************/
/* Unit Display */
/****************/

/**
 * Display the Unit in the 'selected HUD'
 * @param {Unit} unit - The unit to display
 */
function displaySelectedUnit(unit) {
  document.getElementById("selected-unit-portrait-img").src = unit.portraitImg;
  document.getElementById("selected-unit-name").innerHTML = unit.name;
  document.getElementById("selected-unit-level").innerHTML = unit.level;
  document.getElementById("selected-unit-hp").innerHTML = unit.hp;
  document.getElementById("selected-unit-hp-max").innerHTML = unit.hpmax;

  // display extra info relative to its type
  switch (unit.type) {
    case "character":
      displaySelectedCharacter(unit);
      break;
    case "monster":
      displaySelectedMonster(unit);
      break;
  }

  document.getElementById("selected-unit-tab").style.display = "block";
}

/**
 * Display extra info in the 'selected HUD' relative to a Character
 * @param {Unit} unit - The unit to display
 */
function displaySelectedCharacter(unit) {

  //TODO handle multiple spirit

  document.getElementById("selected-unit-spirit-1-img").src = unit.spirit[0].portraitImg;
  document.getElementById("selected-unit-spirit-1-name").innerHTML = unit.spirit[0].name;
  document.getElementById("selected-unit-spirit-1-element").innerHTML = unit.spirit[0].element;
  document.getElementById("selected-unit-spirit-1-level").innerHTML = unit.spirit[0].level;
  document.getElementById("selected-unit-spirit-1-mp").innerHTML = unit.spirit[0].mp;
  document.getElementById("selected-unit-spirit-1-mp-max").innerHTML = unit.spirit[0].mpmax;

  //TODO get spirit action

  //document.getElementById("selection-spirit1actions").innerHTML = unit.spirit[0].actions[0];

  document.getElementById("selected-unit-spirit-1").style.display = "block";

  document.getElementById("selected-unit-tab").classList.remove("monster");
  document.getElementById("selected-unit-tab").classList.add("character");
}

/**
 * Display extra info in the 'selected HUD' relative to a Monster
 * @param {Unit} unit - The unit to display
 */
function displaySelectedMonster(unit) {
  document.getElementById("selected-unit-spirit-1").style.display = "none";

  document.getElementById("selected-unit-tab").classList.remove("character");
  document.getElementById("selected-unit-tab").classList.add("monster");
}

/**
 * Remove the Unit info from the 'selected HUD'
 */
function hideSelectedUnit() {
  document.getElementById("selected-unit-tab").style.display = "none";
}

/**
 * Display the selected unit in the target HUD
 * @param {Unit} unit - The unit to display
 */
function displayTarget(unit) {
  if (unit) {
    document.getElementById("target-img").src = unit.portraitImg;
    document.getElementById("target-name").innerHTML = unit.name;
    document.getElementById("target-level").innerHTML = unit.level;
    document.getElementById("target-hp").innerHTML = unit.hp;

    document.getElementById("selection-target-content").style.display = "block";

    if (unit.type === "character") {
      document.getElementById("selection-target-content").classList.remove("monster");
      document.getElementById("selection-target-content").classList.add("character");
    } else if (unit.type === "monster") {
      document.getElementById("selection-target-content").classList.remove("character");
      document.getElementById("selection-target-content").classList.add("monster");
    }
  } else {
    document.getElementById("selection-target-content").style.display = "none";
  }
}
