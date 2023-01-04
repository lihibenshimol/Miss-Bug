const { Link } = ReactRouterDOM

import { BugPreview } from "./bug-preview.jsx"

export function BugList({ bugs, onRemoveBug }) {
    return <ul className="bug-list">
        {bugs.map(bug =>
            <li className="bug-preview" key={bug._id}>
                <BugPreview bug={bug} />
                <div className="bug-edit-btns">
                    <button className="remove-btn" onClick={() => { onRemoveBug(bug._id) }}>x</button>
                    <button className="edit-btn"><Link to={`/bug/edit/${bug._id}`}>Edit</Link></button>
                </div>
                <Link to={`/bug/${bug._id}`}>Details</Link>
            </li>)}
    </ul>
}