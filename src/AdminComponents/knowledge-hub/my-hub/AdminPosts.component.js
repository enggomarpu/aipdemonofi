import React, { useRef, useState } from 'react'
import PostModel from '../../AdminDashboard/post/AdminPost/post-modal';
import AdminPostsData from './AdminPostsData'

const AdminPosts = () => {

  const [openModal, setOpenModal] = useState(false);
  const childRef = useRef();

  const onModalClose = () => {
    setOpenModal(false);
    childRef.current.callGet()
  }


  return (
    <>
      <div className='list-container'>
        <div className='row g-0 justify-content-end mb-3'>
          <div className='col-auto'>
            <ul className='nav w-auto'>
              <li className='nav-item m-2'>
                <button className='d-grid btn btn-primary' onClick={() => setOpenModal(true)}>
                  Add a Post
                </button>
                </li>
              <li className='nav-item'>
                <div className='input-group search-group'>
                  <button className='btn btn-outline-secondary' type='submit'>
                    <i className='fas fa-search' />
                  </button>
                  <input
                    className='form-control'
                    type='search'
                    placeholder='Search'
                    aria-label='Search'
                  />
                </div>
              </li>

              <li className='nav-item'>
                <a className='navlink' href='/'>
                  <i className='fas fa-sort-amount-up' />
                  Sort
                </a>
              </li>
              <li className='nav-item'>
                <a className='navlink' href='/'>
                  <i className='fas fa-filter' />
                  Filter
                </a>
              </li>

              <li className='nav-item'>
                <button
                  className='btn'
                  type='button'
                  id='dropdownMenuButton1'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <i className='fas fa-ellipsis-v'></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <table className='table'>
          <thead className='border-bottom-1'>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Attachment</th>
              <th> </th>
              <th> </th>
            </tr>
          </thead>

          <tbody>
            <AdminPostsData  ref={childRef} />
          </tbody>
        </table>
      </div>
        <PostModel 
        show={openModal}
        onHide={onModalClose} 
        /> 
    </>
  )
}

export default AdminPosts
