
var LogType = {
  INFO: 1,
  BATTLE: 2,
  DIALOG: 3
}
var log = [];
var logId = 0;
var maxMessage = 20;

function addLog(type, message) {
  var newLog = {
    type:type,
    message:message,
    id:logId
  };
  logId++;
  log.push(newLog);
  var logBox = document.getElementById("game-log");
  var element = document.createElement("span");
  element.classList.add("log");
  element.id = "log-"+newLog.id;
  logBox.appendChild(element);

  switch (type) {
    case LogType.INFO :
      element.innerHTML = "ℹ️ " + message;
      element.classList.add("log-info");
      break;
    case LogType.BATTLE :
      element.innerHTML = "⚔️ " + message;
      element.classList.add("log-battle");
      break;
    case LogType.DIALOG :
      element.innerHTML = "💬 " + message;
      element.classList.add("log-dialog");
      break;
    default:
      break;
  }

  if (log.length > maxMessage) {
    var oldLog = document.getElementById("log-"+log[0].id);
    logBox.removeChild(oldLog);
    log.splice(0,1);
  }


}
