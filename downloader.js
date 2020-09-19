const fs = require('fs'),
  request = require('request')


const basePath = 'videos' // folder to save videos, exclude trailing slash

// default to date of first video episode
// https://www.harmontown.com/2015/01/video-episode-132-you-make-my-shadow-run/
const startDate = new Date(process.argv[2] || '2015-01-25')


const addOneDay = (date) =>
  date.setDate(date.getDate() + 1)


const isoDateString = (date) =>
  date.toISOString().substring(0, 10)


const generateLink = (date) =>
  `https://download.harmontown.com/video/harmontown-${isoDateString(date)}-final.mp4`


const generateFilename = (date) =>
  `harmontown-${isoDateString(date)}.mp4`


const downloadEpisode = (date) => {
  if (date > new Date()) {
    return console.log('Done.')
  }

  const dateString = isoDateString(date),
    filename = generateFilename(date),
    filePath = [basePath, filename].join('/')

  console.log(`Downloading episode for: ${dateString}`)

  request(generateLink(date))
  .on('data', data => {}) // this line MUST be here or no data is saved in the file. no idea why .-.
  .on('response', (res) => {
    if (res.statusCode === 404) {
      console.log(`No episode found on: ${dateString}`)
      // delete the file that was created
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filename}: ${err}`)
        }
      })
    }
  })
  .on('error', (err) => {
    console.warn(`Error downloading episode for: ${dateString}. Error: ${err}. Retrying...`)
    downloadEpisode(date)
  })
  .on('end', () => {
    addOneDay(date)
    downloadEpisode(date)
  })
  .pipe(fs.createWriteStream(filePath))
}


downloadEpisode(startDate)