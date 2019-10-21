const request = require('request')
const rp = require('request-promise')
require('dotenv').config()

const getAsteroids = (date, callback) => {
    console.log(`process.env.API_KEY from getAsteroids: ${process.env.API_KEY}`)
    const regex = /^\d{4}-{1}\d{2}-{1}\d{2}$/

    const options = {
        uri: `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${process.env.API_KEY}`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }

    if(date.match(regex)) {
        rp(options)
        .then(function(body) {
            let asteroids = body.near_earth_objects[date]
            callback(undefined, {asteroids})
        })
        .catch((error) => {
            console.log(error)
        })
    } else {
        return callback('Please provide a date in YYYY-MM-DD format', undefined)
    }
    
}

module.exports = getAsteroids