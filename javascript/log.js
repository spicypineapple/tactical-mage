
const LogType = {
    INFO: 1,
    BATTLE: 2,
    DIALOG: 3,
    ERROR: 4
}

const maxLogMessages = 20;

class Log {
    /**
    * Display a log in the log area
    * @param {LogType} type
    * @param {String} message
    */
    static addLog(type, message) {
        this.curLog = (typeof this.curLog !== 'undefined') ? this.curLog : 0;
        this.logs = (typeof this.logs !== 'undefined') ? this.logs : [];

        const logMessage = Log.computeLogText(type, message);

        const newLog = {
            type,
            message : logMessage,
            id: this.curLog
        };

        this.curLog++;
        this.logs.push(newLog);

        Log.displayLogMessage(newLog);
        Log.cleanLogMessageOverLimit();
    }

    /**
    * Compute the message to display as HTML text
    * @param {LogType} type
    * @param {String} message
    * @returns {String} log to display in the HTML element
    */
    static computeLogText(type, message) {
        let text = "";

        switch (type) {
            case LogType.INFO :
                text = "ℹ️ ";
                break;
            case LogType.BATTLE :
                text = "⚔️ ";
                break;
            case LogType.DIALOG :
                text = "💬 ";
                break;
            case LogType.ERROR :
                text = "⚠️ ";
                break;
            default:
                break;
        }

        text += message;

        return text;
    }

    /**
    * Display the message in the log area
    * @param {{type:{LogType}, message:{String}, id:{number}}}
    */
    static displayLogMessage({type, message, id}) {
        let element = document.createElement("span");
        element.id = "log-"+id;
        element.innerHTML = message;
        element.classList.add("log");

        switch (type) {
            case LogType.INFO :
                element.classList.add("log-info");
                break;
            case LogType.BATTLE :
                element.classList.add("log-battle");
                break;
            case LogType.DIALOG :
                element.classList.add("log-dialog");
                break;
            case LogType.ERROR :
                element.classList.add("log-error");
                break;
            default:
                break;
        }

        let logBox = document.getElementById("game-log");
        logBox.appendChild(element);
    }

    /**
    * Remove excess logs to keep the log area clean
    */
    static cleanLogMessageOverLimit() {
        if (this.logs.length > maxLogMessages) {
            let oldLog = document.getElementById("log-"+log[0].id);
            logBox.removeChild(oldLog);
            this.logs.splice(0,1);
        }
    }
}
