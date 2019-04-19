/**
 * Applies obscure rules such as handling SCIE 113
 * @param {*} course 
 */

export const applyRules = (course) => {
    if (course.code === 'SCIE 113') {
        course.activity_types.t1.push("Lecture G")
        course.activity_types.t2.push("Lecture G")

        let t1GIdx = course.t1[0].findIndex(section => section.section[0] === 'G')
        course.t1.push([])
        course.t1[1].push(course.t1[0][t1GIdx])
        course.t1[0].splice(t1GIdx, 1)

        let t2GIdx = course.t2[0].findIndex(section => section.section[0] === 'G')
        course.t2.push([])
        course.t2[1].push(course.t2[0][t2GIdx])
        course.t2[0].splice(t2GIdx, 1)
    }
}