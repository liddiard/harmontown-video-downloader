const fs = require('fs'),
  request = require('request'),
  progress = require('request-progress')


const basePath = 'videos' // folder to save videos, exclude trailing slash

// default to date of the first video episode
// https://www.harmontown.com/2015/01/video-episode-132-you-make-my-shadow-run/
const startDate = new Date(process.argv[2] || '2015-01-25')

// date of the last episode (post date is 2 days after air date)
// https://www.harmontown.com/2019/12/video-episode-360-cliffhanger/
const endDate = new Date('2019-12-02')


const addOneDay = (date) =>
  date.setDate(date.getDate() + 1)


const isoDateString = (date) =>
  date.toISOString().substring(0, 10)


const generateLink = (date) =>
  `https://download.harmontown.com/video/harmontown-${isoDateString(date)}-final.mp4`


const generateFilename = (date) =>
  `harmontown-${isoDateString(date)}.mp4`


const renderProgress = ({ percent, speed, time }) => {
  if (!percent) {
    return // no progress has been made yet so don't show anything
  }
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${Number(percent * 100).toFixed(1)}%  ${Number(speed / 1024 / 1024).toFixed(1)} MB/s  ${Number(time.elapsed).toFixed()}s elapsed  ${Number(time.remaining).toFixed()}s remaining`);
}


const downloadEpisode = (date) => {
  if (date > endDate) {
    return console.log('Done.')
  }

  const dateString = isoDateString(date),
    filename = generateFilename(date),
    filePath = [basePath, filename].join('/'),
    fileAlreadyExists = fs.existsSync(filePath)

  if (fileAlreadyExists) {
    console.log(`Skipping download for ${filename}; file already exists.`)
    addOneDay(date)
    downloadEpisode(date)
  }

  console.log(`Downloading episode: ${filename}`)

  progress(request(generateLink(date)))
  .on('progress', renderProgress)
  .on('data', data => {}) // this line MUST be here or no data is saved in the file. no idea why 🙃
  .on('response', (res) => {
    if (res.statusCode === 404) {
      console.log(`No episode found on date: ${dateString}`)
      // delete the file that was created, which will now just contain HTML for a 404 page
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filename}: ${err}`)
        }
      })
    }
  })
  .on('error', (err) => {
    console.error(`Error downloading episode for date: ${dateString}. Error: ${err}`)
  })
  .on('end', () => {
    process.stdout.write('\n'); // end the progress indicator line
    addOneDay(date)
    downloadEpisode(date)
  })
  .pipe(fs.createWriteStream(filePath))
}


downloadEpisode(startDate)