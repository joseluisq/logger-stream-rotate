import * as fs from "fs"
import * as zlib from "zlib"

const DATE_FORMATS: [string, RegExp][] = [
    [ "%YYYY", /\%YYYY/g ],
    [ "%MM", /\%MM/g ],
    [ "%DD", /\%DD/g ],
    [ "%hh", /\%hh/g ],
    [ "%mm", /\%mm/g ],
    [ "%ss", /\%ss/g ]
]

const STREAM_WRITABLE_OPTIONS = { flags: "a", encoding: "utf8" }

function getNow () {
    return new Date()
}

function strfdatetime (str: string, date?: Date) {
    if (!str) {
        return str
    }

    if (!date) {
        date = getNow()
    }

    const dateFormatValues: [string, RegExp, string][] = [
        [ DATE_FORMATS[0][0], DATE_FORMATS[0][1], date.getFullYear().toString() ],
        [ DATE_FORMATS[1][0], DATE_FORMATS[1][1], ("0" + date.getMonth()).slice(-2) ],
        [ DATE_FORMATS[2][0], DATE_FORMATS[2][1], ("0" + date.getDate()).slice(-2) ],
        [ DATE_FORMATS[3][0], DATE_FORMATS[3][1], ("0" + date.getHours()).slice(-2) ],
        [ DATE_FORMATS[4][0], DATE_FORMATS[4][1], ("0" + date.getMinutes()).slice(-2) ],
        [ DATE_FORMATS[5][0], DATE_FORMATS[5][1], ("0" + date.getSeconds()).slice(-2) ]
    ]

    for (let i = 0; i < dateFormatValues.length; i++) {
        const fmt = dateFormatValues[i]

        if (str.indexOf(fmt[0]) !== -1) {
            str = str.replace(fmt[1], fmt[2])
        }
    }

    return str
}

function createWritableStream (filePath: string) {
    return fs.createWriteStream(filePath, STREAM_WRITABLE_OPTIONS)
}

function getCurrentDate () {
    const now = getNow()

    return now.getFullYear() + "-" +
        ("0" + now.getMonth()).slice(-2) + "-" +
        ("0" + now.getDate()).slice(-2)
}

/**
 * Logger stream function that writes log files and rotate them using gzip.
 *
 * @param logFilePath Log file string path which support MySQL format. E.g. my-file-%YYYY-%MM-%DD-%hh:%mm:%ss.log
 * @param separator String separator character for parts of one log entry.
 */
export function Logger (logFilePath: string, separator = "|") {
    let currentLogFilePath = strfdatetime(logFilePath)
    let stream = createWritableStream(currentLogFilePath)
    let lastDate = getCurrentDate()

    /**
     * Writes buffer strings or array of strings into current log stream
     *
     * @param data Writes buffer strings or array of strings into current log stream
     * @param cb Callback function when current write was finished
     */
    function write (data: string | string[], cb?: Function) {
        let str = ""

        if (typeof data === "string") {
            str = data
        } else if (Array.isArray(data)) {
            str = data.join(separator)
        } else {
            str = (data || "").toString()
        }

        const now = getNow()
        const timestamp = Date.now()

        const currentDate = now.getFullYear() + "-" +
            ("0" + now.getMonth()).slice(-2) + "-" +
            ("0" + now.getDate()).slice(-2)

        // If dates are different proceed to perform following actions:
        //  1. Compress current log file
        //  2. Close (end) current writable stream
        //  3. Remove current log file
        //  4. Close (end) current readable stream
        //  5. Create a new log writable stream using the `currentDate` value
        if (lastDate !== currentDate) {
            const input = fs.createReadStream(currentLogFilePath)
            const output = fs.createWriteStream(currentLogFilePath + ".gz")

            input.on("end", () => {
                stream.end()

                fs.unlink(currentLogFilePath, () => void 0)
                input.close()

                currentLogFilePath = strfdatetime(logFilePath)
                stream = createWritableStream(currentLogFilePath)

                const datetime = currentDate + " " +
                    ("0" + now.getHours()).slice(-2) + ":" +
                    ("0" + now.getMinutes()).slice(-2) + ":" +
                    ("0" + now.getSeconds()).slice(-2)

                str = datetime + separator + timestamp + separator + str.trim() + "\n"

                // Note: respect backpressure and avoid memory issues using the 'drain' event
                const isWritted = stream.write(str)

                lastDate = currentDate

                if (!isWritted) {
                    // @ts-ignore
                    if (cb) stream.once("drain", cb)
                } else {
                    if (cb) process.nextTick(cb)
                }
            })

            input.pipe(zlib.createGzip()).pipe(output)
        } else {
            const datetime = currentDate + " " +
                ("0" + now.getHours()).slice(-2) + ":" +
                ("0" + now.getMinutes()).slice(-2) + ":" +
                ("0" + now.getSeconds()).slice(-2)

            str = datetime + separator + timestamp + separator + str.trim() + "\n"

            // Note: respect backpressure and avoid memory issues using the 'drain' event
            const isWritted = stream.write(str)

            lastDate = currentDate

            if (!isWritted) {
                // @ts-ignore
                if (cb) stream.once("drain", cb)
            } else {
                if (cb) process.nextTick(cb)
            }
        }
    }

    return {
        write
    }
}
