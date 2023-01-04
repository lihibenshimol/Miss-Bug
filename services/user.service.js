const fs = require('fs')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('secret-puk-1234')

var users = require('../data/user.json')

module.exports = {
    query,
    get,
    remove,
    login,
    signup,
    getLoginToken,
    validateToken,
    save
}
function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function query(filterBy) {
    let fillteredUsers = users
    return Promise.resolve(fillteredUsers)
}

function get(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')
    return Promise.resolve(user)
}

function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    // if (users[idx].bug)
    if (idx === -1) return Promise.reject('No such user')
    users.splice(idx, 1)
    return _writeUsersToFile()
}

function signup({ fullname, username, password }) {
    const userToSave = {
        _id: _makeId(),
        fullname,
        username,
        password
    }
    users.push(userToSave)
    return _writeUsersToFile().then(() => userToSave)
}

function login(credentials) {
    const user = users.find(u => u.username === credentials.username)
    if (!user) return Promise.reject('Login failed')
    return Promise.resolve(user)
}

function save(user) {
        const userToUpdate = users.find(currUser => currUser._id === user._id)
        if (!userToUpdate) return Promise.reject('No such User')
        userToUpdate.isAdmin === true
  
    return _writeUsersToFile().then(() => user)
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


function _writeUsersToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) return rej(err)
            // console.log("File written successfully\n");
            res()
        })
    })
}