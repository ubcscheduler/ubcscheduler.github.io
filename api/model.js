const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/ubcscheduler');

const SectionSchema = mongoose.Schema({
    "course": String,
    "section": String,
    "activity": String,
    "status": String,
    "term": String,
    "schedule": [Number],
    "instructors": [String]
})

const CourseSchema = mongoose.Schema({
    "code": {type: String, index: true},
    "t1": [[SectionSchema]],
    "t2": [[SectionSchema]],
    "activity_types": {t1: [String], t2: [String]},
    "lastModified": Date
})

const CourselistSchema = mongoose.Schema({
    "uni": {type: String, index: true},
    "list": [[String]],
    "lastModified": Date
})

module.exports = {
    Course: mongoose.model('Course', CourseSchema),
    Courselist: mongoose.model('Courselist', CourselistSchema)
}