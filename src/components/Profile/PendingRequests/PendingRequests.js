import React, { useState, useEffect, lazy } from 'react'
import { useToasts } from 'react-toast-notifications';
import { store } from '../../../App';
import HttpService from '../../../shared/http.service'
import RequestCommentsModal from './request-comments-modal.component';

const CollaborationRequestModal = lazy(() =>
  import('../../Collaboration-Request/Collaboration-Request.module').then(module => {
    store.injectReducer('colab_request', module.default.reducer);
    store.injectSaga('colab_request', module.default.saga);
    return import('../../Collaboration-Request/Collaboration-Request.component');
  })
);

const PendingRequest = () => {

  const [userPendingRequest, setPendingRequest] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openCollabrationModal, setOpenCollabrationModal] = useState(false);
  const [requestId, setRequestId] = useState();
  const [isApproved, setIsApproved] = useState(true);
  const [comment, setComment] = useState();
  const { addToast } = useToasts()

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    await HttpService.get('collaboration-request/my-collaboration-requests').then((res) => {
      setPendingRequest(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  const DeleteRequest = async (id) => {
    await HttpService.delete('collaboration-request/' + id)
      .then((res) => {
        if (res) {
          addToast('Request deleted successfully', {
            appearance: 'success',
          });
          get();
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const OpenCommentsModal = (id, isApproved, comment) => {
    setOpenModal(true); 
    setRequestId(id);
    if(isApproved === false){
      setIsApproved(isApproved);
      setComment(comment);
    }
  }

  const onClose = () => {
    setOpenModal(false); 
    get(); 
    setIsApproved(true); 
    setComment();
  }


  return (
    <>
      <div className='card custom-card'>
        <div className='card-header d-flex justify-content-between mb-3'>
          <h5 className='card-title align-self-center'>My Requests</h5>
          <div className='header-button align-self-center'>
          </div>
        </div>
        {(userPendingRequest && userPendingRequest.length) ? 
        <div className='card-body'>
          <div className='table-responsive'>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Request Type</th>
                  <th scope="col">Name</th>
                  <th scope="col" colSpan="2">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {userPendingRequest.map((result) => {
                  return (
                    <tr>
                      <th scope="row">Collaboration request</th>
                      <td>{result.ProjectName}</td>
                      <td>
                        {result.IsApproved == null ? (
                          <button className="btn btn-warning btn-rounded">
                            Pending
                          </button>
                        ) : result.IsApproved ? (
                          <button className="btn btn-success btn-rounded">
                            Approved
                          </button>
                        ) : (
                          <button className="btn btn-danger btn-rounded">
                            Rejected{" "}
                        </button>
                        )}
                      </td>
                      <td>
                        <td>
                          <div className="dropdown d-inline-block">
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
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => {
                                    OpenCommentsModal(
                                      result.CollaborationRequestId,
                                      result.IsApproved,
                                      result.RejectionComment
                                    );
                                  }}
                                >
                                  View Comments
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setOpenCollabrationModal(true);
                                    setRequestId(result.CollaborationRequestId);
                                  }}
                                >
                                  Edit Details
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    DeleteRequest(
                                      result.CollaborationRequestId
                                    );
                                  }}
                                >
                                  Delete Request
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        : null}
      </div>
      <RequestCommentsModal
        show={openModal}
        requestId={requestId}
        isApproved={isApproved}
        comment={comment}
        onHide={onClose}
      />

      {openCollabrationModal && 
      <CollaborationRequestModal
        show={openCollabrationModal}
        requestId={requestId}
        onHide={() => { setOpenCollabrationModal(false); get() }}
      />}
    </>
  )
}

export default PendingRequest
