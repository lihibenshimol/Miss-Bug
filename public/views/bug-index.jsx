import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'

const { useState, useEffect } = React
const { useNavigate, useParams, Link } = ReactRouterDOM


export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [maxPages, setMaxPages] = useState(0)

    useEffect(() => {
        loadBugs()
    }, [filterBy])


    function loadBugs() {
        bugService.query(filterBy).then((bugsData) => {
            setBugs(bugsData.bugs)
            setMaxPages(bugsData.totalPages)
        })
    }

    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
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

    return <div className="bug-index main-layout full">
        <BugFilter maxPages={maxPages} onSetFilter={onSetFilter} />
        <section className='add-links'>
            <button>  <Link to={`/bug/edit`}>Add Bug ⛐</Link></button>
        </section>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} />

    </div>



}
