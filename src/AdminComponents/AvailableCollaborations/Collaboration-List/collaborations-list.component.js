import React, { useEffect, useState, lazy } from "react"
import { differenceInDays, differenceInWeeks } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { useToasts } from "react-toast-notifications";
import { get, deleteCollaboration } from './collaboration-list.reducer'
import { store } from '../../../App'
import { Link } from 'react-router-dom'

const CollaborationsRequestDetail = lazy(() =>
  import('../Review-Request/request-view.module').then(module => {
    store.injectReducer('collaborationViewRequest', module.default.reducer);
    store.injectSaga('collaborationViewRequest', module.default.saga);
    return import("../Review-Request/collaboration-request-view-modal.component");
  })
);
const CollaborationRequestModal = lazy(() =>
  import('../../Collaboration-Request/Collaboration-Request.module').then(module => {
    store.injectReducer('colab_request', module.default.reducer);
    store.injectSaga('colab_request', module.default.saga);
    return import('../../Collaboration-Request/Collaboration-Request.component');
  })
);

const CollaborationsComponent = (props) => {
  const { addToast } = useToasts();
  const [selectedcollab, setSelectedcollab] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [collabid, setcollabid] = useState(null)
  const [openCollaborationRequestModelView, setOpenCollaborationRequestModelView] = useState(false);
  const serverData = useSelector(state => state.collaborationlist.data);
  const funcType = useSelector(state => state.collaborationlist.type);
  const errorMessage = useSelector(state => state.collaborationlist.errorMessage);
  const [dataLoaded, setDataLoaded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    props.setPageTitle();
    switch (funcType) {
      case 'collaborationlist/getSuccess':
        setDataLoaded(true);
        break;
      case 'collaborationlist/deleteSuccess':
        addToast("Collaboration Request is successfully deleted", {
          appearance: "error",
        });
        dispatch(get());
        break;
      case 'collaborationlist/error':
        addToast(errorMessage, {
          appearance: 'error',
        });
        break;
      default:
        break;
    }
    if (!dataLoaded) {
      dispatch(get());
    }
  }, [funcType]);

  const editRequest = (id) => {
    setSelectedcollab(id);
    setOpenModal(true);
  }

  const deleteRequest = (CollaborationRequestId) => {
    dispatch(deleteCollaboration({
      CollaborationRequestId: CollaborationRequestId
    }));
  }

  const handleModelOpen = (event, CollaborationRequestId) => {
    event.preventDefault()
    setcollabid(CollaborationRequestId)
    setOpenCollaborationRequestModelView(true)
  }

  const onClose = () => {
    setOpenModal(false);
    dispatch(get());
  }

  return (
    <>
      <div className='list-container'>
        <div className='row g-0 justify-content-between mb-3'>
          <div className='col'>
            <h2 className='custom-heading'>Available Collaborations</h2>
          </div>
          <div className='col-auto'>
            <ul className='nav'>
              <li className='nav-item'>
                <div className='d-grid'>

                </div>
              </li>
              <li className='nav-item ps-3'>
                <div className='input-group search-group'>
                  <button className='btn btn-outline-secondary' type='submit'>
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
              {/* <th  /> */}
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

            {serverData.map((collab) => {
              return (
                <tr>
                  <td>
                    <span>
                      {collab.StartedByUser
                        ? collab.StartedByUser.CompanyName
                        : ""}
                    </span>
                  </td>
                  <td>{collab.ProjectDetails}</td>
                  <td>
                    {differenceInDays(
                      new Date(collab.EndDate),
                      new Date(collab.StartDate)
                    )}
                  </td>
                  <td>
                    <div className="checkbox-group">
                      {collab.RequestSkills &&
                        collab.RequestSkills.map((skill, index) => {
                          return (
                            <span key={index} className="btn btn-primary">
                              {skill.SkillName &&
                                skill.SkillName +
                                  (collab.RequestSkills.length - 1 > index
                                    ? " "
                                    : "")}
                            </span>
                          );
                        })}
                    </div>
                  </td>
                  <td>
                    {collab.IsApproved == null
                      ? "Pending"
                      : collab.IsApproved
                      ? "Approved"
                      : "Cancelled"}
                  </td>
                  <td>
                    <button
                      className="d-grid btn btn-secondary"
                      onClick={(e) =>
                        handleModelOpen(e, collab.CollaborationRequestId)
                      }
                    >
                      Details
                    </button>
                  </td>
                  <td>
                    <div className="text-end">
                      <button
                        className="btn"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        {collab.IsApproved === null && (
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/colabReviewRequest/${collab.CollaborationRequestId}`}
                          >
                            Review Request
                          </Link>
                        </li>
                         )} 
                        {(collab.IsApproved === null || collab.IsApproved) && (
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                editRequest(collab.CollaborationRequestId)
                              }
                            >
                              Edit Request
                            </button>
                          </li>
                        )}
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              deleteRequest(collab.CollaborationRequestId)
                            }
                          >
                            Delete Request
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {openCollaborationRequestModelView &&
        <CollaborationsRequestDetail
          show={openCollaborationRequestModelView}
          collabid={collabid}
          onHide={() => { setOpenCollaborationRequestModelView(false); }}
        />
      }
      {(openModal && selectedcollab) ? <CollaborationRequestModal
        selectedCollaborationId={selectedcollab}
        show={openModal}
        onHide={onClose}
      /> : null}
    </>
  )
}
export default CollaborationsComponent
