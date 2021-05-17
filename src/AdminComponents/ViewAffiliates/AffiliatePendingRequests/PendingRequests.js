import React, {useState, useEffect} from 'react'
import HttpService from '../../../shared/http.service'
import { useToasts } from 'react-toast-notifications';
import RequestCommentsModal from './request-comment-modal.componenet';
import CollaborationRequestModal from './collaboration-request-modal.component';


const PendingRequest = (props) => {

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
  await HttpService.get(`user/profile/${props.userId}`).then((res) => {
    console.log('use profilerr', res.data)
    setPendingRequest(res.data.CollaborationRequests);
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
            {/* <label>
              Add new request
              <button
                type='button'
                className='btn p-1 ms-1'
                data-bs-toggle='modal'
                data-bs-target='#AppModal'
              >
                <img src={PlusCircle} alt='PlusCircle' />
              </button>
            </label> */}
          </div>
        </div>
        <div className='card-body'>
          <div className='table-responsive'>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Request Type</th>
                  <th scope="col">Name</th>
                  <th scope="colgroup" colSpan="2">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
              {userPendingRequest.map((result) => {
                  return (
                <tr>
                  <th scope="row">{result.ProjectName}</th>
                  <td>{result.ProjectName}</td>
                  <td>
                   
                    {result.IsApproved === null ? (
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
                </tr>
                  )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <RequestCommentsModal
        show={openModal}
        requestId={requestId}
        isApproved={isApproved}
        comment={comment}
        onHide={onClose}
      />
      {/* {openCollabrationModal && 
      <CollaborationRequestModal
        show={openCollabrationModal}
        requestId={requestId}
        onHide={() => { setOpenCollabrationModal(false); get() }}
      />} */}
    </>
  )
}

export default PendingRequest
