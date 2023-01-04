const { useState, useEffect, useRef } = React

import { bugService } from '../services/bug.service.js'
import { Pagination } from './pagination.jsx'


export function BugFilter({ onSetFilter, maxPages }) {

    const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter())
    const elInputRef = useRef(null)


    useEffect(() => {
        elInputRef.current.focus()
    }, [])

    useEffect(() => {
        // update father cmp that filters change very type
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = (type === 'number') ? +value : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function handlePageChange(number) {
        if (
          filterByToEdit.pageIdx + number < 0 ||
          filterByToEdit.pageIdx + number > maxPages - 1
        )
          return
        setFilterByToEdit((prevFilter) => ({
          ...prevFilter,
          pageIdx: prevFilter.pageIdx + number,
        }))
      }
    

    function onSubmitFilter(ev) {
        // update father cmp that filters change on submit
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }
    return <section className="bug-filter full main-layout">
        <h2>Filter bugs</h2>
        <form onSubmit={onSubmitFilter}>

            <input type="text"
                id="title"
                name="title"
                placeholder="By title"
                value={filterByToEdit.txt}
                onChange={handleChange}
                ref={elInputRef}
            />

            <input type="number"
                id="severity"
                name="severity"
                placeholder="By severity"
                value={filterByToEdit.severity}
                onChange={handleChange}
            />

        </form>

        <Pagination
          currentPage={filterByToEdit.pageIdx}
          handlePageChange={handlePageChange}
        />

    </section>
}