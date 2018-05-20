/**
 * A Unit can have powers which are either passive or active.
 * These powers may have:
 *   - a name
 *   - an animation
 *   - a MP cost
 *   - a power formula (e.g. to calculate damage)
 *   - a special effect
 */

/**
* Create a Power
* @constructor
* @param {Object} data - The power model
*/
var Power = function(data) {
  this.name = data.name;
  this.animation = data.animation;

  this.MPcost = data.MPcost;
  this.powerFormula = data.powerFormula;
  this.specialEffect = data.specialEffect;
}
