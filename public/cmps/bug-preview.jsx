

export function BugPreview({ bug }) {

    return <article>
        <h1>🐛</h1>
        <h4>{bug.title}</h4>
        <p>{bug.description}</p>
        <p>Severity: <span className={bug.severity > 5 ? 'urgent' : 'light'}>{bug.severity}</span></p>
    </article>

}