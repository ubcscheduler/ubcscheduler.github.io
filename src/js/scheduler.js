const MAX_SCHEDULES = 1000

function filterLockedSections (sectionsByActivity, lockedSections) {
    for (let i = 0; i < sectionsByActivity.length; i++) {
        let lockedSection = sectionsByActivity[i].find(section => {
            return lockedSections.includes(section.course + " " + section.section)
        })
        if (lockedSection) sectionsByActivity[i] = [lockedSection]
    }
}

const schedule = function (courses, breaks, lockedSections) {
    const startTime = Date.now()

    // Filter courses if it's not the correct term and course does not span both terms
    
    const t1Courses = courses.filter(course => {
        return course.term === "t1" || course.term === "t1-2"
    })    
    const t2Courses = courses.filter(course => {
        return course.term === "t2" || course.term === "t1-2"
    })

    const t1SectionsByActivity = t1Courses.reduce((acc, course, i, courses) => acc.concat(course.t1), [])
    const t2SectionsByActivity = t2Courses.reduce((acc, course, i, courses) => acc.concat(course.t2), [])


    const numT1Sections = t1SectionsByActivity.length
    const numT2Sections = t2SectionsByActivity.length

    
    

    // Filter out lockedSections
    filterLockedSections (t1SectionsByActivity, lockedSections)
    filterLockedSections (t2SectionsByActivity, lockedSections)

    // Optimization: Sort from least number of sections in course-activity group to largest
    // t1SectionsByActivity.sort((secGroup1, secGroup2) => secGroup1.length - secGroup2.length)
    // t2SectionsByActivity.sort((secGroup1, secGroup2) => secGroup1.length - secGroup2.length)
    // console.log("t1sectionsByActivity: ", t1SectionsByActivity)
    // console.log("t2sectionsByActivity: ", t2SectionsByActivity)

    let t1Schedules = []
    let t2Schedules = []

    function recursiveSchedule (numSections, validSchedules, sectionsByActivity, m, t, w, r, f, count, acc) {
        if (count === numSections) {
            validSchedules.push(acc.slice())
            if (validSchedules.length === MAX_SCHEDULES) return false
            return true
        }
        

        for (let i = sectionsByActivity[count].length; i--;) {
            let time = sectionsByActivity[count][i].schedule
            if (!(time[0]&m || time[1]&t || time[2]&w || time[3]&r || time[4]&f)) {
                // No collision detected
                acc.push(sectionsByActivity[count][i])

                if (!recursiveSchedule(
                    numSections,
                    validSchedules,
                    sectionsByActivity,
                    time[0]|m, time[1]|t, time[2]|w, time[3]|r, time[4]|f,
                    count+1,
                    acc)) return false
                acc.pop()
            } 
        }
        return true
    }
    
    recursiveSchedule(numT1Sections, t1Schedules, t1SectionsByActivity, breaks.t1[0], breaks.t1[1], breaks.t1[2], breaks.t1[3], breaks.t1[4], 0, [])
    recursiveSchedule(numT2Sections, t2Schedules, t2SectionsByActivity, breaks.t2[0], breaks.t2[1], breaks.t2[2], breaks.t2[3], breaks.t2[4], 0, [])
    
    if (t1Schedules.length === 0) t1Schedules.push([])
    if (t2Schedules.length === 0) t2Schedules.push([])

    console.log("It took to schedule ", Date.now() - startTime)
    return {
        "t1" : t1Schedules,
        "t2" : t2Schedules
    }
}

export default schedule;