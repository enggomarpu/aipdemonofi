import React from 'react'

const Sorting = ({recentKey, alphaKey, setSort }) => {


  return (
    <>
      <a
          className='navlink'
          type='button'
          id='dropdownMenuButton1'
          data-bs-toggle='dropdown'
          aria-expanded='false'
        >
          <i className="fas fa-sort-amount-up">Sort</i>
        </a>

        <div
          className='dropdown-menu toggle-menu border-0'
          aria-labelledby='dropdownMenuButton1'
        >
          <button class="dropdown-item" onClick={()=> setSort({ field: recentKey, order: "DESC" })}>Most Recent</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" onClick={()=> setSort({ field: alphaKey, order: "ASC" })}>A to Z</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" onClick={()=> setSort({ field: alphaKey, order: "DESC" })}>Z to A</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" onClick={()=> setSort({ field: recentKey, order: "DESC" })}>Newest to Oldest</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" onClick={()=> setSort({ field: recentKey, order: "ASC" })}>Oldest to Newest</button>
        </div>

    </>
  )
}
export default Sorting;