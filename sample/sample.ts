import { Logger } from "../src"

const LOG_DIR_PATH = process.env["LOG_DIR_PATH"] || "./logs"

// Usage
const logger = Logger(LOG_DIR_PATH + "/app-%YYYY-%MM-%DD.log", " | ")

function logData (data: string | string []) {
    logger.write(
        data,
        () => console.log("LOG:", data, "completed!")
    )
}

setInterval(() => {
    logData([ "Log entry example", "Timestamp: " + Date.now(), new Date().toISOString() ])
}, 1000)
