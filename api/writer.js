const Model = require('./model')
const Course = Model.Course
const Courselist = Model.Courselist

module.exports.writeCourse = function (course) {
    return new Promise((resolve, reject) => {
        Course.update({code: course.code},
            {
                $currentDate: {
                    lastModified: true
                },
                $set: course
            },
            { upsert : true },
            (err, newCourse) => {
            if (err) reject(err);
            resolve(course)
            })
    });
}

module.exports.writeCourselist = function (courselist) {
    return new Promise((resolve, reject) => {
        Courselist.update({uni: 'ubc'}, 
        {   
            $currentDate: {
                lastModified: true
            },
            $set: courselist
        }
        ,{ upsert : true },
        (err, newCourselist) => {
            if (err) reject(err);
            console.log("Writing courselist success")
            resolve(courselist)
        })
    });
}

