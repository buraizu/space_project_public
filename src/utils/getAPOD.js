const rp = require('request-promise')
require('dotenv').config()

const getAPOD = (date, callback) => {
    
    const options = {
        uri: `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${process.env.API_KEY}`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }

    rp(options)
        .then(function(body) {
            let APOD = body
            if(!body) {
                callback('No photos available for this date', undefined)
            }
            callback(undefined, { APOD })
        })
        .catch((error) => {
            console.log(error)
        })

}

module.exports = getAPOD