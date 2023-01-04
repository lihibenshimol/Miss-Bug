import { bugService } from "../services/bug.service.js"
import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useNavigate, useParams, Link } = ReactRouterDOM

export function BugEdit() {
    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const [loggedUser, setLoggedUser] = useState(userService.getLoggedinUser())
    const navigate = useNavigate()
    const { bugId } = useParams()

    useEffect(() => {
        if (!bugId || !loggedUser) return
        loadBug()
    }, [])

    function loadBug() {
        bugService.getById(bugId)
            .then((bug) => setBugToEdit(bug))
            .catch((err) => {
                console.log('Had issues in bug details', err)
                navigate('/bug')
            })
    }

    function handleChange({ target }) {
        let { value, name: field } = target
        setBugToEdit((prevBug) => ({ ...prevBug, [field]: value }))
    }


    function onSaveBug(ev) {
        ev.preventDefault()
        bugService.save(bugToEdit, loggedUser).then((bug) => {
            showSuccessMsg('New bug saved!')
            navigate('/bug')
        })
            .catch((err) => {
                showErrorMsg('Cancled')
            })
    }


    return <section className="bug-edit">

        <form onSubmit={onSaveBug}>
            <label htmlFor="title">Title:</label>
            <input type="text"
                name="title"
                id="title"
                placeholder="Enter title..."
                value={bugToEdit.title}
                onChange={handleChange}
            />

            <label htmlFor="description">description:</label>
            <input type="text"
                name="description"
                id="description"
                placeholder="Enter description..."
                value={bugToEdit.description}
                onChange={handleChange}
            />

            <label htmlFor="severity">severity:</label>
            <input type="number"
                name="severity"
                id="severity"
                placeholder="Enter severity..."
                value={bugToEdit.severity}
                onChange={handleChange}
            />
            <div className="btns">
                <span> <button> {bugToEdit._id ? 'Save' : 'Add'}</button> </span>
                <button> <Link to="/bug">Cancel</Link></button>
            </div>

        </form>
    </section>
}