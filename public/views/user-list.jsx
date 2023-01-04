import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React


export function UserList() {
    // const [loggedUser, setLoggedUser] = useState(userService.getLoggedinUser())
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])


    function loadUsers() {
        userService.query()
            .then((users) => { setUsers(users) })
    }

    function onRemoveUser(userId) {
        if (confirm('Are you sure?'))
            userService.remove(userId)
                .then(() => {
                    console.log('Deleted Succesfully!')
                    const usersToUpdate = users.filter(user => user._id !== userId)
                    setUsers(usersToUpdate)
                    showSuccessMsg('user removed')
                })
                .catch(err => {
                    console.log('Error from onRemoveuser ->', err)
                    showErrorMsg('Cannot remove user')
                })
    }

    function onSetAdmin(user) {
        if (confirm('Are you sure?'))
        userService.save(user)
        .then(() => {
            loadUsers()
        })
    }

    return <div className="user-list">
        <ul className="clean-list flex">
            {
                users.map(user =>
                    <li key={user._id}>
                        Username: {user.username} <br />
                        Fullname: {user.fullname} <br />
                        Admin: {user.isAdmin ? 'true' : 'false'}
                        <button className="user-remove-btn" onClick={() => { onRemoveUser(user._id) }}>x</button>
                        <button className="user-set-admin-btn" onClick={() => { onSetAdmin(user) }}>set Admin</button>
                    </li>

                )
            }
        </ul>
    </div>
}