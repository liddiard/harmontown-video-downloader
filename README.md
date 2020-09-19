# Harmontown Video Downloader

Batch download video episodes of the podcast [Harmontown](http://harmontown.com/).

## Installation & Usage

1. [Install Node.js](https://nodejs.org/en/download/) version 10 or above.
2. Clone the repo to your computer.
3. Run `npm install`.
4. Run `npm start`.

Upon running `npm start`, the script will begin downloading video episodes to the `videos` folder, sequentially, starting with the first video episode from 2015. You can also specify a ISO-formatted date with the `npm start` command, like `npm start 2017-05-03`, which would only download episodes airing on or after May 3, 2017.