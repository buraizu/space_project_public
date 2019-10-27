const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const hbs = require('hbs')
const commaNumber = require('comma-number')
const AWSXRay = require('aws-xray-sdk')
const AWS = require('aws-sdk')
const fs = require('fs')
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

require('dotenv').config()

const getMarsPhotos = require('./utils/getMarsPhotos')
const getAsteroids = require('./utils/getAsteroids')
const getAPOD = require('./utils/getAPOD')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// app.set('view engine', 'hbs')
app.use(express.static(__dirname + '../public'));
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Solar System Update',
        name: 'Bryce Eadie'
    })
}) 

app.get('/space-info', async (req, res) => {
    if(!req.query.date) {
        return res.send({
            error: "Must provide a date in YYYY-MM-DD format"
        })
    }
    
    let theAPOD
    let theSortedAsteroids
    let theMarsPhotos
    let theDate

    const isValidDate = (d) => {
        return d instanceof Date && !isNaN(d);
    }

    let dateToCheck = new Date(req.query.date)
    let currentDate = new Date()

  

    if(isValidDate(dateToCheck) && dateToCheck <= currentDate) {
        theDate = new Date(req.query.date).toDateString()
        try {
            await getAsteroids(req.query.date, async (error, { asteroids } = {}) => {
                if(error) {
                    return res.send({ asteroids: '', APOD: '', marsPhotos: '', date: theDate, error })
                } else {
                    let asteroidsArray = []
    
                    for(let i = 0; i < asteroids.length; i++) {
                        asteroidsArray.push({
                            name: asteroids[i].name,
                            missDistance: parseInt(asteroids[i].close_approach_data[0].miss_distance.miles)
                        })
                    }
    
                    sortedAsteroids = asteroidsArray.sort((a, b) => {
                        return a.missDistance - b.missDistance
                    })
                   
                    sortedAsteroids.forEach((asteroid) => {
                        let distance = asteroid.missDistance
                        asteroid.missDistance = commaNumber(distance.toFixed(0))
                    })
    
                    theSortedAsteroids = sortedAsteroids
                    
                    await getAPOD(req.query.date, async (error, { APOD } = {}) => {
                        if(error) {
                            return res.send({ error })
                        } else {
                            APOD.crossOrigin = "anonymous"
                            theAPOD = APOD
                        }
                        
                        await getMarsPhotos(req.query.date,  async (error, { marsPhotos } = {}) => {
                            if(error) {
                                res.send({ error })
                            } else {
                                theMarsPhotos = marsPhotos
                                
                                res.send({ asteroids: theSortedAsteroids, APOD: theAPOD, marsPhotos: theMarsPhotos, date: theDate })
                            }
                        })
                       
                    })
                }
            })
    
        } catch(e) {
            res.status(418).send(e)
        }
    } else {
        return res.send({
            error: "Invalid date"
        })
    }

    async function asyncPromAll() {
        const resultArray = await Promise.all([getAsteroids(), getAPOD(), getMarsPhotos()]);
        for (let i = 0; i<resultArray.length; i++){
          console.log(`cowabunga ${resultArray[i]}`); 
        }
    }
    
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'Bryce Eadie'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Bryce Eadie'
    })
})

app.post('/imageUpload', (req, res) => {
    console.log('in app.post')
    console.log(`req.body in app.post: `, req.body)
    // console.log(`req in app.post: `, req)
})

// router.post('/tasks', auth, async (req, res) => {
    
//     // const task = new Task(req.body)
    
//     const task = new Task({
//         ...req.body,
//         owner: req.user._id
//     })

//     try {
//         await task.save()
//         res.status(201).send(task)
//     } catch(e) {
//         res.status(418).send(e)
//     }

//     // task.save().then(() => {
//     //     res.status(201).send(task)
//     // }).catch((e) => {
//     //     res.status(418).send(e)
//     // })
// })

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})