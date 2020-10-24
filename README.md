# Harmontown Video Downloader

Batch download video episodes of the podcast [Harmontown](http://harmontown.com/).

## Installation & Usage

1. [Install Node.js](https://nodejs.org/en/download/) version 10 or above.
2. Clone the repo to your computer.
3. Run `npm install`.
4. Run `npm start`.

Upon running `npm start`, the script will begin downloading video episodes to the `videos` folder, sequentially, starting with the first video episode from 2015. 

You can also specify an [ISO-formatted date](https://en.wikipedia.org/wiki/ISO_8601) with the `npm start` command to begin downloading from that date. For example, `npm start 2017-05-03` would only download episodes recorded or after May 3, 2017.
