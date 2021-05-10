import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'

const GlobalFilter = ({ setGlobalFilter, columns }) => {

  const [globalValue, setGlobalValue] = useState()

  const onChange = useAsyncDebounce((value) => {
    let or = columns.map((col) => {
      if (col.filter) {
        if (col.globalFilterKey) {
          return ({ [col.globalFilterKey]: { '$cont': value } })
        }
        return ({ [col.accessor]: { '$cont': value } })
      }
      return {}
    })
    let globalfilter = { "$or": or }
    setGlobalFilter(globalfilter);
    // setFilter(value || undefined)
  }, 1000)

  return (
    <>
      <div className='input-group search-group'>
              <span class='btn btn-outline-secondary'>
                <i class='fas fa-search' aria-hidden='true'></i>
              </span>
              <input
                class='form-control'
                value={globalValue}
                onChange={(e) => { setGlobalValue(e.target.value); onChange(e.target.value) }}
              />
            </div>

    </>
  )
}
export default GlobalFilter;