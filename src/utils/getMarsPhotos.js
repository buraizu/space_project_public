const rp = require('request-promise')

const getMarsPhotos = (date, callback) => {
   
    const options = {
        uri: `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&camera=NAVCAM&api_key=${process.env.API_KEY}`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }

    rp(options)
        .then(function(body) {
            let marsPhotos  = body.photos
            if(body.photos.length === 0) {
                callback(undefined, '')
            }
            callback(undefined, { marsPhotos })
        })
        .catch((error) => {
            console.log(error)
        })
    
}

module.exports = getMarsPhotos