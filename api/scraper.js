const rp = require('request-promise')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const cheerio = require('cheerio')

const Rules = require('./rules')

function intToTime(timeIdx) {
    timeIdx = timeIdx * 50 + 800
    if (timeIdx % 100) timeIdx -= 30
    timeString = timeIdx.toString()
    const colonIdx = timeString.length - 2
    return timeString.substr(0, colonIdx) + ":" + timeString.substr(colonIdx)
}

//Converts from format HH:MM to ith 30 minute block from 8:00
function timeToInt(time) {
    time = time.replace(":", "");
    intTime = parseInt(time) - 800;
    if ((intTime % 50) !== 0) {
      intTime += 20;
    }
    return intTime/50;
}

/**
 * Returns an integer representing the schedule by 1-bits in 30-minute intervals
 * @param {int} currSchedule - accumulator
 * @param {String} startTime -12:30
 * @param {String} endTime - 2:00
 */
function scheduleToInt(currSchedule, startTime, endTime) {
    for (var i = timeToInt(startTime); i < timeToInt(endTime); i++) {
        currSchedule |= (1 << i)
    }
    return currSchedule
}

/*
Helper that takes xml2js sectionObj and returns parsed json section
*/
//TODO:: Instructors
function parseSection(sectionObj) {
    var section = {
        "section": sectionObj.$.key,
        "activity": sectionObj.$.activity,
        "status": sectionObj.$.status,
        "term": "",
        "schedule": [0,0,0,0,0],
        "instructors": [] 
    }
    let teachingunit = sectionObj.teachingunits[0].teachingunit[0]
    section.term = teachingunit.$.termcd
   
    if (!teachingunit.meetings) throw "No meetings found"
    let meetings = teachingunit.meetings[0].meeting
    const Days = {"Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4}
    meetings.forEach(meeting => {
        dayIdx = Days[meeting.$.day]
        section.schedule[dayIdx] = scheduleToInt(section.schedule[dayIdx], meeting.$.starttime, meeting.$.endtime)
    });
    return section
}

function getActivityIdx(courseObj, section, termString) {
    let sectionActivity = section.activity
    if (sectionActivity == "Waiting List") {
        sectionActivity = "Lecture"
    }
    let activityIdx = courseObj.activity_types[termString].indexOf(sectionActivity)

    if (activityIdx === -1) {
        activityIdx = courseObj.activity_types[termString].length
        courseObj.activity_types[termString].push(sectionActivity)
        courseObj[termString].push([])
    }
    return activityIdx 
}

/*
Scrapes course from UBC
Writes to database
resolve scraped course
*/
module.exports.scrapeCourse = function (course) {
    return new Promise((resolve, reject) => {
     
        let dept = course.split("_")[0]
        let courseCode = course.split("_")[1]
        const XML_URL = `https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?sessyr=2019&sesscd=W&output=5&req=4&dept=${dept}&course=${courseCode}`

        var courseObj = {
            "code": course,
            "t1": [],
            "t2": [],
            "activity_types": { t1: [], t2: []}
        }

        console.log(XML_URL)
        rp(XML_URL)
        .then(xml => {
            parser.parseString(xml, (err, result) => {
                try {
                result.sections.section.forEach(sectionObj => {
                    try {
                        section = parseSection(sectionObj);
                    } catch (e) {
                        return;
                    }
                    
                    section.course = course.replace("_", " ")
                    if (Rules.isInvalid(section)) return;

                    let activityIdx1, activityIdx2;
                    if (section.term === "1") {
                        activityIdx1 = getActivityIdx(courseObj, section, "t1")
                        courseObj.t1[activityIdx1].push(section)
                    } else if (section.term === "2") {
                        activityIdx2 = getActivityIdx(courseObj, section, "t2")
                        courseObj.t2[activityIdx2].push(section)
                    } else if (section.term === "1-2") {
                        activityIdx1 = getActivityIdx(courseObj, section, "t1")
                        activityIdx2 = getActivityIdx(courseObj, section, "t2")
                        courseObj.t1[activityIdx1].push(section)
                        courseObj.t2[activityIdx2].push(section)
                    } else {
                        console.log("Term invalid! Section not added", section.section)
                    }
                })

            } catch (e) {
                console.log(xml)
            }

            })

            resolve(courseObj)
        })

    });
    
}


module.exports.scrapeCourselist = function () {
    return new Promise((resolve, reject) => {
        console.log("Scraping courselist")
        var courselist = {
            uni: "ubc",
            list: []
        }
        var subjects = []
        // const SUBJ_URL = "https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&sessyr=2018&sesscd=W"
        const SESS_URL = "&sessyr=2019&sesscd=W"
        const SUBJ_URL = "https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-all-departments" + SESS_URL
        const BASE_URL = "https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-department" + SESS_URL
        rp(SUBJ_URL)
        .then(html => {
            //Collect all subjects
            let $ = cheerio.load(html)
            $("table#mainTable").find('tbody > tr').each((i, row) => {
                subj = $($(row).find('td')[0]).text().trim();
                if (!subj.includes('*')) subjects.push(subj)
            });
            console.log(subjects)
            //Collect all courses
            var count = subjects.length
            subjects.forEach(dept => {
                let DEPT_URL = BASE_URL + `&dept=${dept}&req=1`
                rp(DEPT_URL)
                .then(html => {
                    let $ = cheerio.load(html)
                    $("table#mainTable").find('tbody > tr').each((i, row) => {
                        tds = $(row).find('td')
                        code = $(tds[0]).text().trim()
                        title = $(tds[1]).text().trim()
                        //console.log(code + title)
                        courselist.list.push([code, title]);
                    });
                    count--
                    if (count === 0) resolve(courselist)
                })
            });
        })
        
        //resolve(courselist)
    });
}