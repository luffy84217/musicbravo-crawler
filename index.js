const fs = require('fs');
const request = require('request');
const DomParser = require('dom-parser');

fs.readFile('songs.html', 'utf8', (err, html) => {
    if (!err) {
        const doc = new DomParser().parseFromString(html);
        const projectIDList = doc.getElementsByClassName('song-item-wrapper ').map(e => {
            return e.firstChild.firstChild.firstChild.getAttribute('href').split('single/')[1]
        });
        projectIDList.forEach(projectID => {
            request.post({
                url: 'https://www.musicbravo.com.tw/API/PCSingle/GetSingleDetail',
                form: {ProjectID: projectID}
            }, (err, response, body) => {
                const res = JSON.parse(body);
                const { SongName, SumPrice } = res.rtnMsg.SingleDetail;
                console.log(`${SongName}: ${SumPrice / 2000}`)
            })
        });
    } else {
        throw err;
    }
});