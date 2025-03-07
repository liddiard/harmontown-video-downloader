const axios = require('axios')

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

const main = async () => {
  const date = startDate
  while (date <= endDate) {
    const dateString = isoDateString(date)
    try {
      const res = await axios.head(generateLink(date))
      console.log('Found:', dateString)
    } catch (err) {
      if (err.response.status === 404) {
        console.log('Not found:', dateString)
      } else {
        console.error(err)
      }
    } finally {
      addOneDay(date)
    }
  }
}

main()