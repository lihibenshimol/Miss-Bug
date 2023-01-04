import { userService } from "../services/user.service.js"
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'


const { useState, useEffect } = React

export function UserDetails() {
    const [loggedUser, setLoggedUser] = useState(userService.getLoggedinUser())
    // const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter())
    const [bugs, setBugs] = useState([])

    useEffect(() => {
        // setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
        loadBugs()
    }, [])

    console.log('loggedUser = ', loggedUser)

    function loadBugs() {
        bugService.query({title:'', severity: '', creator: loggedUser._id })
        .then((bugs) => {
            console.log('bugs in cmp after = ', bugs)
            setBugs(bugs)
        })
    }
    

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    console.log('bugs = ', bugs)

    return loggedUser && <div className="user-details">
        <h1>{loggedUser.isAdmin ? `Welcome Admin ${loggedUser.fullname.toUpperCase()}!` : `Welcome ${loggedUser.fullname}!`}</h1>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} />

    </div>
}