const fs = require('fs');
var bugs = require('../data/bugs.json');

module.exports = {
    query,
    getById,
    remove,
    save
}

// function query() {
//     return Promise.resolve(bugs)
// }
function query(filterBy) {
    console.log('filterBy = ', filterBy)
    let filteredBugs = bugs
    // Filtering
    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        filteredBugs = filteredBugs.filter(bug => regex.test(bug.title))
    }
    // if (filterBy.labels) {
    //     const labels = filterBy.labels.split(',')
    //     // console.log(labels);
    //     filteredBugs = filteredBugs.filter(bug => labels.every(i => bug.labels.includes(i)))
    // }
    if (filterBy.severity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= +filterBy.severity)
    }
    if (filterBy.creator) {
        console.log('immmmm');
        filteredBugs = filteredBugs.filter(bug => bug.creator._id === filterBy.creator)
        console.log('filteredBugs = ', filteredBugs)
    }

    // Paging
    const totalPages = Math.ceil(filteredBugs.length / +filterBy.pageSize)
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * +filterBy.pageSize
        filteredBugs = filteredBugs.slice(startIdx, +filterBy.pageSize + startIdx)
    }
    return Promise.resolve({ totalPages, bugs: filteredBugs })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

// function remove(bugId) {
//     bugs = bugs.filter(bug => bug._id !== bugId)
//     return _writeBugsToFile()
// }

function remove(bugId, loggedinUser) {

    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No Such bug')
    const bug = bugs[idx]
    if (bug.creator._id !== loggedinUser._id && !loggedinUser.isAdmin) return Promise.reject('Not your bug')
    bugs.splice(idx, 1)
    return _writeBugsToFile()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        console.log('loggedinUser._id = ', loggedinUser)
        if (!bugToUpdate) return Promise.reject('No such Bug')
        if (bugToUpdate.creator._id !== loggedinUser._id) return Promise.reject('Not your Bug')
        bugToUpdate.severity = bug.severity
        bugToUpdate.description = bug.description
    } else {
        bug._id = _makeId()
        bug.createdAt = new Date().getTime()
        bug.creator = loggedinUser
        bugs.push(bug)
    }
    return _writeBugsToFile().then(() => bug)
}


function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


function _writeBugsToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return rej(err)
            res()
        });
    })
}