/**
 * Script to getCourselist and fetch each course
 */
const fs = require('fs')
const Controller = require('./controller')
const Model = require('./model')
const Scraper = require('./scraper')
const Writer = require('./writer')
const invalidCourseFp = 'invalidCourses.txt'

function getCourselist() {
    return new Promise((resolve, reject) => {
        console.log("Fetching courselist")
        Scraper.scrapeCourselist()
        .then(Writer.writeCourselist)
        .then(courselist => {
            console.log("Done fetching courselist", courselist)
            resolve(courselist.list)
        })
        .catch(error => {
            console.log("Error fetching courselist")
            reject(error)
        })
    })
}

function getCourse(courseName) {
    return new Promise((resolve, reject) => {
        console.log("Fetching coures: " + courseName)
        courseName = courseName.replace(" ", "_")

        Scraper.scrapeCourse(courseName)
        .then(Writer.writeCourse)
        .then(course => {
            console.log("Finished fetching course: " + courseName)
            resolve(course)
        })
        .catch(error => {
            console.log("Error fetching course: " + courseName)
            reject(error)
        })
    })
}

async function warmup() {
    var invalidCourses = []
    let courselist = await getCourselist()
    courselist.sort((c1, c2) => {
        return c1[0].localeCompare(c2[0])
    })

    for (let i = 0; i < courselist.length; i++) {
        try {
            console.log("Fetching " + courselist[i][0])
            const course = await getCourse(courselist[i][0])
            if (course.t1.length === 0 && course.t2.length === 0) {
                throw 'Course invalid'
            }
        } catch(e) {
            invalidCourses.push(courselist[i][0])
        }        
    }

    console.log(invalidCourses)
    fs.writeFileSync(invalidCourseFp, JSON.stringify(invalidCourses))
    return invalidCourses
}

async function warmupMain() {
    const course = await getCourse('ASTU 360')
    console.log(course)
}

warmup()
// warmupMain()