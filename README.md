# logger-stream-rotate

[![Build Status](https://travis-ci.com/joseluisq/logger-stream-rotate.svg?branch=master)](https://travis-ci.com/joseluisq/logger-stream-rotate) [![npm](https://img.shields.io/npm/v/logger-stream-rotate.svg)](https://www.npmjs.com/package/logger-stream-rotate) [![npm](https://img.shields.io/npm/dt/logger-stream-rotate.svg)](https://www.npmjs.com/package/logger-stream-rotate) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Write log files and rotate them using gzip.

## Features

- Output logs to time-rotated log files.
- Optionally gzip logs once they are no longer current.
- Stream pipe functionality coming soon.

## Install

[Yarn](https://github.com/yarnpkg/)

```sh
yarn add logger-stream-rotate --dev
```

[NPM](https://www.npmjs.com/)

```sh
npm install logger-stream-rotate --save-dev
```

## Usage

```ts
import { Logger } from "logger-stream-rotate"

// Logger supports log a file name format like "YYYY-MM-DD hh:mm:ss" with an optional separator
const logger = Logger("./app-%YYYY-%MM-%DD.log", " | ")

logger.write(
    // string or array of strings are supported which will be concatenated by ` | ` in one line
    ["Log entry part 1", "another log entry part 2", "etc..."],
    () => console.log("callback when current log entry was finished!")
)
```

An example file is located at [sample/sample.ts](./sample/sample.ts)

## Contributions

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in current work by you, as defined in the Apache-2.0 license, shall be dual licensed as described below, without any additional terms or conditions.

Feel free to send some [Pull request](https://github.com/joseluisq/logger-stream-rotate/pulls) or [issue](https://github.com/joseluisq/logger-stream-rotate/issues).

## License

This work is primarily distributed under the terms of both the [MIT license](LICENSE-MIT) and the [Apache License (Version 2.0)](LICENSE-APACHE).

© 2019 [Jose Quintana](https://git.io/joseluisq)
