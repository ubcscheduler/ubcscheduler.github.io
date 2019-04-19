function mergeWaitingList(section) {
    if (section.activity == "Waiting List") {
        section.activity = "Lecture"
    }
    return section
}



function isWaitingList(section) {
    return section.activity == "Waiting List"
}
function isDistanceEducation(section) {
    return section.activity == "Distance Education"
}
function isSTT(section) {
    return section.status == "STT"
}
function isUnreleased(section) {
    return section.status == "Unreleased"
}
function noTimes(section) {
    return section.schedule.every(daySchedule => daySchedule === 0)
}

function isInvalid(section) {
    return isDistanceEducation(section) || isSTT(section) || isUnreleased(section) || noTimes(section)
}
module.exports = {
    isInvalid: isInvalid
}