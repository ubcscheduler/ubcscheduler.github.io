const express = require('express')
const router = express.Router()

const controller = require('./controller')


router.get('/course/:course', controller.getCourse)
router.get('/courselist', controller.getCourseList)

module.exports = router