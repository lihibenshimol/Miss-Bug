const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                console.log('oooops = ', err)
                showErrorMsg('Cannot load bug')
            })
    }, [])

    if (!bug) return <h1>loadings....</h1>
    return bug && <div className="bug-details">
        <section>

            <h3>Bug Details 🐛</h3>
            <h4>{bug.title}</h4>
        </section>
        <section>
            <p>{bug.description}</p>
            <p>Severity: <span>{bug.severity}</span></p>
        </section>
        <Link to="/bug">Back to List</Link>
    </div>

}

