const Model = require('./model')
const Scraper = require('./scraper')
const Writer = require('./writer')
/**
 * Grabs a single course from the database, via the course URL param
 * @param  {Object} req - the Express request
 * @param  {Object} res - the Express reponse
 */
module.exports.getCourse = (req, res) => {
    if (!req.params.course) {
        res.status(400)
        res.send({
            error: 'No courses entered'
        })
        return
    }
    //req.params.course = req.params.course.replace("_", " ");
    // console.log("Getting course: " + req.params.course)
    Model.Course
    .findOne({
        code: req.params.course
    },{
        //Don't return mongo ids
        _id: 0
    })
    .exec()
    .then(course => {
        const refreshRate = 60 * 12 
        if (course === null || (timeSinceInMinutes = (new Date() - course.lastModified) / 60e3) > refreshRate) {
            if (course) console.log(`Refreshing stale course ${req.params.course} after ${timeSinceInMinutes} minutes`)
            else console.log("No course found. Scraping..." + req.params.course)
            
            Scraper.scrapeCourse(req.params.course)
            .then(Writer.writeCourse)
            .then(newCourse => {
                // console.log(newCourse)
                res.status(200)
                res.send(newCourse)
            })
        } else {
            // console.log("Course found", course)
            res.status(200)
            res.send(course)
        }        
    })
    .catch(error => {
        res.status(500)
        res.send({
            error: error
        })
    })
  }

/**
 * Grabs the list of all courses
 * @param  {Object} req - the Express request
 * @param  {Object} res - the Express reponse
 */
module.exports.getCourseList = (req, res) => {
    console.log("Getting course list")
    Model.Courselist
    .findOne({
        uni: "ubc"
    }, {
        _id: 0
    })
    .exec()
    .then(courselist => {
        if (courselist === null) {
            // console.log("No courselist found")
            Scraper.scrapeCourselist()
            //.then(newCourselist => console.log(newCourselist))
            .then(Writer.writeCourselist)
            .then(courselist => {
                console.log(courselist)
                res.status(200)
                res.send(courselist)
            })
        } else {
            // console.log("Courselist found")
            res.status(200)
            res.send(courselist) 
        }
    })
    .catch(error => {
        res.status(500)
        res.send({
            error: error
        })
    })
}