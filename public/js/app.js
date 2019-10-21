const searchForm = document.querySelector('form')
const search = document.querySelector('input')

const asteroidsDiv = document.getElementById("asteroidsDiv")
const asteroidsList = document.getElementById("asteroidsList")
const asteroidDiv = document.getElementById("asteroidDiv")
const marsDiv = document.getElementById("marsDiv")

const APODTitle = document.getElementById("APODTitle")
const APODImage = document.getElementById("APODImage")
const APODCopyright = document.getElementById("APODCopyright")
const APODSummary = document.getElementById("APODSummary")
const getAPODSummary = document.getElementById("getAPODSummary")
const APODButtons = document.getElementById("APODButtons")
const videoSource = document.getElementById("videoSource")
const iframe = document.getElementById("iframe")
const iframeDiv = document.getElementById("iframeDiv")

const displayDate = document.getElementById("date")

const photo1 = document.getElementById("photo-1")
const photo2 = document.getElementById("photo-2")
const photo3 = document.getElementById("photo-3")
const getNextMarsPhoto = document.getElementById("getNextMarsPhoto")
const getPrevMarsPhoto = document.getElementById("getPrevMarsPhoto")
const marsMessage = document.getElementById("marsMessage")
const marsHeadline = document.getElementById("marsHeadline")
const asteroidMessage = document.getElementById("asteroidMessage")

const getNextDay = document.getElementById("getNextDay")
const getPrevDay = document.getElementById("getPrevDay")
const getCurrentDay = document.getElementById("getCurrentDay")
const submitButtons = document.querySelectorAll("button.submitButton")
const marsButtons = document.getElementById("marsButtons")
const pageCounter = document.getElementById("pageCounter")
const hdAPODLink = document.getElementById("hdAPODLink")

let theMarsPhotos
let date
let currentIndex
let prevIndex
let firstIndex
let finalIndex
let currentPage
let fullPages
let photoNumber

submitButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault()
        
        if(e.target.textContent === 'Get Info') {
            date = search.value
            APODButtons.className = 'display'
        } else if(e.target.textContent === 'Next Day') {
            let nextDay = new Date(date)
            nextDay.setDate(nextDay.getDate() + 2)
            let searchMonth = (nextDay.getMonth() + 1).toString()
            
            if(searchMonth.length === 1) {
                searchMonth = '0' + searchMonth
            }
            let searchYear = nextDay.getFullYear()
            let searchDay = (nextDay.getDate()).toString()
            if(searchDay.length === 1) {
                searchDay = '0' + searchDay
            }
            
            date = `${searchYear}-${searchMonth}-${searchDay}`
        } else if(e.target.textContent === 'Previous Day') {
            let prevDay = new Date(date)
            let searchMonth = (prevDay.getMonth() + 1).toString()
            
            if(searchMonth.length === 1) {
                searchMonth = '0' + searchMonth
            }
            let searchYear = prevDay.getFullYear()
            let searchDay = (prevDay.getDate()).toString()
            if(searchDay.length === 1) {
                searchDay = '0' + searchDay
            }
    
            date = `${searchYear}-${searchMonth}-${searchDay}`
        } else if(e.target.textContent === 'Today') {
            let currentDay = new Date()
            let searchMonth = (currentDay.getMonth() + 1).toString()
            
            if(searchMonth.length === 1) {
                searchMonth = '0' + searchMonth
            }
            let searchYear = currentDay.getFullYear()
            let searchDay = (currentDay.getDate()).toString()
            if(searchDay.length === 1) {
                searchDay = '0' + searchDay
            }
            date = `${searchYear}-${searchMonth}-${searchDay}`
            APODButtons.className = 'display' // Check this
        }
        APODTitle.innerHTML = '<h2 style="color:#FFF;">Loading...</h2>'
        
        fetch(`/space-info?date=${date}`).then((response) => {
            response.json().then((data) => {
                if(data.error) {
                    search.value = ''
                    APODTitle.innerHTML = `<h3>${data.error}</h3>`
                    APODImage.src = ''
                    iframe.src = ''
                    APODSummary.className = 'hide'
                    APODCopyright.className = 'hide'
                    asteroidDiv.className = 'hide'
                    photo1.className = 'hide'
                    photo2.className = 'hide'
                    photo3.className = 'hide'
                    getPrevMarsPhoto.className = 'hide'
                    getNextMarsPhoto.className = 'hide'
                    pageCounter.className = 'hide'
                    getAPODSummary.className = 'hide'
                    marsMessage.className = 'hide'
                } else {
                    displayDate.innerHTML = data.date
                    displayDate.className = 'feature display center APODContent'
                    if(data.APOD.media_type === 'video') {
                        iframeDiv.className = 'display APODContent'
                        iframe.src = data.APOD.url
    
                        APODImage.src = ''
                        APODTitle.innerHTML = `<h2>Astronomy Video of the Day</h2><h3>${data.APOD.title}</h3>`
                        APODTitle.className = 'feature APODContent'
                        APODSummary.className = 'hide'
                        APODSummary.innerHTML = data.APOD.explanation
                        getAPODSummary.className = 'display APODContent'
                        getAPODSummary.textContent = 'Show Explanation'
                        hdAPODLink.className = 'hide'
                    } else if(data.APOD.media_type === 'image') {
                        iframeDiv.className = 'hide'
                        iframe.src = ''
                        APODImage.src = data.APOD.url
                        APODTitle.innerHTML = `<h3>Astronomy Picture of the Day</h3><h2>${data.APOD.title}</h2>`
                        APODTitle.className = 'feature APODContent'
                        APODSummary.className = 'hide'
                        APODSummary.innerHTML = data.APOD.explanation
                        getAPODSummary.className = 'display APODContent'
                        getAPODSummary.textContent = 'Show Explanation'
                        hdAPODLink.href = data.APOD.hdurl
                        hdAPODLink.className = 'hide'
                    } else {
                        APODTitle.innerHTML = `Sorry, no Astronomy Picture of the Day is available for ${data.date}. NASA launched APOD on June 16, 1995, so try another date between then and now.`
                        APODImage.src = ''
                        APODSummary.className = 'hide'
                        APODSummary.innerHTML = ''
                        hdAPODLink.className = 'hide'
                    }
                    if(data.APOD.copyright) {
                        APODCopyright.innerHTML = `&copy; ${data.APOD.copyright}`
                        APODCopyright.className = 'feature APODContent'
                    } else {
                        APODCopyright.className = 'hide'
                    }
                    if(data.marsPhotos) {
                        marsDiv.className = 'center feature'
                        theMarsPhotos = data.marsPhotos
                        marsMessage.className = 'hide'
                        marsHeadline.className = 'display'
                        photoNumber = data.marsPhotos.length
                        currentIndex = 0
                        firstIndex = 0
                        finalIndex = data.marsPhotos.length - 1
                        currentPage = 1
                        fullPages = Math.floor(photoNumber / 3)
                        photo1.src = data.marsPhotos[0].img_src
                        photo1.className = 'display roverPhoto'
                        if(data.marsPhotos[1]) {
                            photo2.src = data.marsPhotos[1].img_src
                            photo2.className = 'display roverPhoto'
                        } else {
                            photo2.src = ''
                            photo2.className = 'hide'
                        }
                        if(data.marsPhotos[2]) {
                            photo3.src = data.marsPhotos[2].img_src
                            photo3.className = 'display roverPhoto'
                        } else {
                            photo3.src = ''
                            photo3.className = 'hide'
                        }
                       if(!fullPages) {
                           getNextMarsPhoto.className = 'hide'
                           getPrevMarsPhoto.className = 'hide'
                           pageCounter.innerHTML = `Page ${currentPage} of ${fullPages || 1}`
                           pageCounter.className = 'display marsButton'
                       } else {
                           getNextMarsPhoto.className = 'display'
                           getPrevMarsPhoto.className = 'greyOut'
                           if(photoNumber % 3 !== 0) {
                               pageCounter.innerHTML = `Page ${currentPage} of ${fullPages + 1 || 1}`
                               pageCounter.className = 'display marsButton'
                           } else {
                               pageCounter.innerHTML = `Page ${currentPage} of ${fullPages || 1}`
                               pageCounter.className = 'display marsButton'
                           }
                       }
                        
                    } else {
                        photo1.className = 'hide'
                        photo2.className = 'hide'
                        photo3.className = 'hide'
                        getPrevMarsPhoto.className = 'hide'
                        getNextMarsPhoto.className = 'hide'
                        pageCounter.className = 'hide'
                        marsMessage.textContent = `There are no photos from Curiosity rover for ${data.date}.`
                        marsMessage.className = 'feature display'
                        marsHeadline.className = 'hide'
                    }
                    if(data.asteroids) {
                        asteroidsList.innerHTML = ""
                        asteroidDiv.className = 'feature display'
                        asteroidMessage.className = 'display'
                        asteroidMessage.textContent = `${data.asteroids.length} asteroids on their closest approach to Earth on ${data.date}`
                        asteroidsList.appendChild(makeAsteroidsList(data.asteroids))
                    } else {
                        asteroidDiv.className = 'hide'
                    }
    
                }
            })
        })
    })
})

getAPODSummary.addEventListener('click', () => {
    if(APODSummary.className === 'hide') {
        APODSummary.className = 'display APODSummary'
         
        getAPODSummary.textContent = 'Hide Explanation'
        hdAPODLink.className = 'display feature center'
    } else {
        APODSummary.className = 'hide'
        getAPODSummary.textContent = 'Show Explanation'
        hdAPODLink.className = 'hide'
    }
   
    
})

getNextMarsPhoto.addEventListener('click', () => {
    if(currentPage === fullPages && photoNumber % 3 !== 0) {
        let remainingPhotos = photoNumber - (fullPages * 3)
        if(remainingPhotos === 2) {
            currentIndex += 3
            photo1.src = theMarsPhotos[finalIndex -1].img_src
            photo2.src = theMarsPhotos[finalIndex].img_src
            photo3.src = ''
            photo3.className = 'hide'
        } else {
            currentIndex += 3
            photo1.src = theMarsPhotos[finalIndex].img_src
            photo2.src = ''
            photo2.className = 'hide'
            photo3.src = ''
            photo3.className = 'hide'
        }
        getNextMarsPhoto.className = 'greyOut' 
        getPrevMarsPhoto.className = 'display'
        currentPage += 1
        if(photoNumber % 3 !== 0) {
            pageCounter.innerHTML = `Page ${currentPage} of ${fullPages + 1 || 1}`
        } else {
            pageCounter.innerHTML = `Page ${currentPage} of ${fullPages || 1}`
        }
    } else if(currentPage < fullPages){
        currentIndex += 3
        currentPage += 1
        photo1.src = theMarsPhotos[currentIndex].img_src
        photo2.src = theMarsPhotos[currentIndex + 1].img_src
        photo3.src = theMarsPhotos[currentIndex + 2].img_src
        prevIndex = currentIndex
        getPrevMarsPhoto.className = 'display'
        if(photoNumber % 3 !== 0) {
            pageCounter.innerHTML = `Page ${currentPage} of ${fullPages + 1 || 1}`
        } else {
            pageCounter.innerHTML = `Page ${currentPage} of ${fullPages || 1}`
        }
        if(currentIndex === finalIndex - 2) {
            getNextMarsPhoto.className = 'greyOut'
        }
    } 
})

getPrevMarsPhoto.addEventListener('click', () => {
    if(currentPage > fullPages) {
        let nextStartIndex = (fullPages * 3) - 3
        photo1.src = theMarsPhotos[nextStartIndex].img_src
        photo2.src = theMarsPhotos[nextStartIndex + 1].img_src
        photo2.className = 'display roverPhoto'
        photo3.src = theMarsPhotos[nextStartIndex + 2].img_src
        photo3.className = 'display roverPhoto'
        currentPage -= 1
        if(photoNumber % 3 !== 0) {
            pageCounter.innerHTML = `Page ${currentPage} of ${fullPages + 1 || 1}`
        } else {
            pageCounter.innerHTML = `Page ${currentPage} of ${fullPages || 1}`
        }
        currentIndex = nextStartIndex
        if(currentPage === 1) { // ?
            getNextMarsPhoto.className = 'display'
        }
    } else if(currentPage > 1){
        currentIndex -= 3
        currentPage -= 1
        if(photoNumber % 3 !== 0) {
            pageCounter.innerHTML = `Page ${currentPage} of ${fullPages + 1 || 1}`
        } else {
            pageCounter.innerHTML = `Page ${currentPage} of ${fullPages || 1}`
        }
        photo1.src = theMarsPhotos[currentIndex].img_src
        photo2.src = theMarsPhotos[currentIndex + 1].img_src
        photo3.src = theMarsPhotos[currentIndex + 2].img_src       
    } else {
        getNextMarsPhoto.className = 'display marsButton'
    }
    if(currentIndex === 0) {
        getPrevMarsPhoto.className = 'greyOut'
    } else if(currentIndex <= finalIndex - 1) {
        getNextMarsPhoto.className = 'display'
    }
    getNextMarsPhoto.className = 'display marsButton'
})


const makeAsteroidsList = (asteroids) => {
    const list = document.createElement('ul')
    
    for(let i = 0; i < asteroids.length; i++) {
        let item = document.createElement('li')
        
        item.appendChild(document.createTextNode(`Name: ${asteroids[i].name}`))
        item.appendChild(document.createElement('br'))
        item.appendChild(document.createTextNode(`Missed the earth by: ${asteroids[i].missDistance} miles.`))
        item.appendChild(document.createElement('br'))
        list.appendChild(item)
    }

    return list
}

