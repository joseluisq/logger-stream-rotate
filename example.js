const { Logger } = require("./")

const LOG_DIR_PATH = process.env["LOG_DIR_PATH"] || "./logs"

// Usage
const logger = Logger(LOG_DIR_PATH + "/app-%YYYY-%MM-%DD.log", " | ")

function logData(str) {
    logger.write(
        str, () => console.log("LOG:", str, "completed!")
    )
}

setInterval(() => {
    logData(["Log entry example", "Timestamp: " + Date.now(), new Date().toISOString()])
}, 1000)
