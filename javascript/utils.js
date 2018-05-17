
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) {
          callback(data);
        }
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

/**
 * Get a random int between two values (max not inclusive)
 * @author MDN web docs - Mozilla
 * @param {number} min
 * @param {Number} max
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/**
 * Get a random int between two values (inclusive)
 * @author MDN web docs - Mozilla
 * @param {number} min
 * @param {Number} max
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
