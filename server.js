const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')


const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// List
app.get('/api/bug', (req, res) => {
    const { title, severity, lables, pageIdx, pageSize, creator } = req.query
    const filterBy = {
        title, severity, lables, creator, pageIdx, pageSize
    }
    bugService.query(filterBy).then((bugs) => {
        res.send(bugs)
    })
})

// Create
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const bug = req.body

    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot create bug')
        })
})

// Update
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    const bug = req.body
    bugService.save(bug, loggedinUser)
    .then((savedBug) => {
        res.send(savedBug)
    })
    .catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot update bug')
    })
})


// Read - GetById
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    var visitedBugs = req.cookies.visitedBugs || []
    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length > 3) {
            return res.status(401).send('Wait for a bit')
        }
        visitedBugs.push(bugId)
    }
    bugService.getById(bugId)
        .then((bug) => {
            res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
            res.send(bug)
        })
        .catch(err => {
            res.status(404).send(err.message)
        })
})

// Remove
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => {
            res.send({ msg: 'bug removed successfully', bugId })
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot delete bug')
        })
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// User API:
// List
app.get('/api/user', (req, res) => {
    const filterBy = req.query
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.get(userId)
        .then((user) => {
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get user')
        })
})

app.put('/api/user/:userId', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add bug')
    const user = req.body
    userService.save(user)
    .then((savedUser) => {
        res.send(savedUser)
    })
    .catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot update bug')
    })
})

app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.delete('/api/user/:userId', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update user')

    const { userId } = req.params
    userService.remove(userId)
        .then(() => {
            res.send({ msg: 'user removed successfully', userId })
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot delete user')
        })
})


// Listen will always be the last line in our server!
app.listen(3030, () => console.log(`Server running at http://127.0.0.1:3030/`))
