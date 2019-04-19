const Scraper = require('./scraper')
var fs = require('fs');

async function getCourselist() {
    let courselist = await Scraper.scrapeCourselist()
    // console.log(courselist)
    // let courselist = [[ 'ANTH 471', 'Anthropology of Law' ]]
    fs.writeFileSync('courselist.json', JSON.stringify(courselist.list), 'utf8');
}

getCourselist()