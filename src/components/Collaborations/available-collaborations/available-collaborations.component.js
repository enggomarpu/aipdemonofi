import { differenceInDays, differenceInWeeks } from 'date-fns'
import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { store } from '../../../App'
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
import { getData } from './available-collaborations.redux'

const CollaborationsDetailModal = lazy(() =>
  import('../collaboration-detail/collaboration-detail.module').then(module => {
    store.injectReducer('collaboration_detail', module.default.reducer);
    store.injectSaga('collaboration_detail', module.default.saga);
    return import('../collaboration-detail/collaboration-detail-modal.component');
  })
);

const CollaborationRequestModal = lazy(() =>
  import('../../Collaboration-Request/Collaboration-Request.module').then(module => {
    store.injectReducer('colab_request', module.default.reducer);
    store.injectSaga('colab_request', module.default.saga);
    return import('../../Collaboration-Request/Collaboration-Request.component');
  })
);

const AvailableCollaborationsComponent = (props) => {

  
  const availableCollaborationState = useSelector(state => state.available_collaboration);
  const dispatch = useDispatch();
  const [openModal, setOpenModel] = useState(false)
  const [openCollaborationRequestModel,  setOpenCollaborationRequestModel] = useState(false);
  const [requestId , setRequestId] = useState()

  useEffect(() => {
    dispatch(getData());
  }, [])

 
  return (
    <>
      <Header heading='Collaborations' />

      <div className='main'>
        <div className='siderbar'>
          <Sidebar />
        </div>
        <div className='main-wrapper'>
          <div className='list-container'>
            <div className='row g-0 justify-content-between mb-3'>
              <div className='col'>
                <h2 className='custom-heading'>Available Collaborations</h2>
              </div>
              <div className='col-auto'>
                <ul className='nav'>
                  <li className='nav-item'>
                    <div className='d-grid'>
                    <button className='btn btn-primary'
                      onClick={() => setOpenCollaborationRequestModel(true)}
                    >
                    New Collaboration Request
                  </button>
                    </div>
                  </li>
                  <li className='nav-item ps-3'>
                    <div className='input-group search-group'>
                      <button
                        className='btn btn-outline-secondary'
                        type='submit'
                      >
                        <i className='fas fa-search' />
                      </button>
                      <input
                        className='form-control'
                        type='search'
                        placeholder='Search affiliate'
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
                </ul>
              </div>
            </div>
            <table className='table'>
              <thead>
                <tr>
                  <th>Affiliate Name</th>
                  <th>Project Details</th>
                  <th>Estimiated Project Lenght</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {availableCollaborationState.data && availableCollaborationState.data.map((collab) => {
                  return (<tr>
                  <td>
                    <span>{collab.StartedByUser? collab.StartedByUser.CompanyName: ''}</span>
                  </td>
                  <td>{collab.ProjectDetails}</td>
                  <td>{differenceInDays(new Date(collab.EndDate), new Date(collab.StartDate))}</td>
                  <td>
                    <div className='checkbox-group'>
                  {collab.RequestSkills.map((skill, index) => {
                    return (
                      <span key={index} className='btn btn-primary'>
                        {skill.SkillName &&
                          skill.SkillName +
                            (collab.RequestSkills.length - 1 > index ? ', ' : '')}
                      </span>
                    )
                  })}
                </div>
                  </td>
                  <td>{collab.IsApproved == null? 'Pending': collab.IsApproved? 'Approved' : 'Rejected'}</td>
                  <td>
                    <button
                      className='d-grid btn btn-secondary'
                      onClick={() => {setOpenModel(true); setRequestId(collab.CollaborationRequestId)}}
                    >
                      View
                    </button>
                  </td>
                </tr>)
              
                })}
                </tbody>
            </table>
          </div>
        </div>
      </div>

      {openModal && <CollaborationsDetailModal
        show={openModal}
        requestId = {requestId}
        onHide={() => { setOpenModel(false); }}
      />}

      {openCollaborationRequestModel &&
        <CollaborationRequestModal
        show={openCollaborationRequestModel}
        onHide={() => { setOpenCollaborationRequestModel(false); }}
      />
      }
    </>
  )
}

export default AvailableCollaborationsComponent
