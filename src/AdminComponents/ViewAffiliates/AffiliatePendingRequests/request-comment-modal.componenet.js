import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import filePickerService from '../../../shared/file-picker/file-picker.service';
import HttpService from '../../../shared/http.service'

const RequestCommentsModal = (props) => {

    const [comments, setComments] = useState([]);
    const { addToast } = useToasts()

    useEffect(() => {
        if (props.isApproved !== false && props.requestId) {
            get();
        }
    }, [props]);

    const get = async () => {
        if(comments.length <=0){
            await HttpService.get('collaboration-request/all-comments/' + props.requestId)
            .then((res) => {
                if (res && res.data) {
                    setComments(res.data);
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    const startCollaboration = async (id) => {
        await HttpService.get('collaboration-request/start-collaboration/' + id)
            .then((res) => {
                if (res) {
                    addToast('Collaboration assigned successfully', {
                        appearance: 'success',
                    });
                    props.onHide();
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <Modal
                {...props}
                size='lg'
                aria-labelledby='contained-modal-title-vcenter'
                centered
            >
                <Modal.Header closeButton className='border-0 pb-0'>
                    <div className='card-header d-flex justify-content-between mb-3'>
                        <h5 className='card-title align-self-center'>Comments   </h5>
                        <div className='header-button align-self-center'>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='table-responsive'>
                        <table className="table">
                            <thead>
                                <tr>
                                    {props.isApproved !== false && <th scope="col">Comment From</th>}
                                    <th scope="col">Comment</th>
                                    {props.isApproved !== false && <th scope="colgroup" colSpan="2">Attachments</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {props.isApproved !== false &&  comments.map((result) => {
                                    return (
                                        <tr>
                                            <th scope="row">{result.CommentedByUser ? result.CommentedByUser.Name : ''}</th>
                                            <td>{result.CollaborationRequestComment}</td>
                                            <td>
                                                {result.CollaborationRequestCommentAttachments &&
                                                    result.CollaborationRequestCommentAttachments.map((attachment) => {
                                                        return (<a className='link ms-2' href={filePickerService.getDownloadLink(attachment.FileHandler)}>
                                                            <div
                                                                className={filePickerService.getFileIcon(attachment.FileType)}
                                                            ></div>
                                                            <span className='ms-2'>{attachment.FileName}</span>
                                                        </a>)
                                                    })
                                                }
                                            </td>
                                            <td>
                                                <div className='dropdown d-inline-block'>
                                                    <button
                                                        className='btn'
                                                        type='button'
                                                        id='dropdownMenuButton1'
                                                        data-bs-toggle='dropdown'
                                                        aria-expanded='false'
                                                    >
                                                        <i className='fas fa-ellipsis-v'></i>
                                                    </button>
                                                    <ul
                                                        className='dropdown-menu'
                                                        aria-labelledby='dropdownMenuButton1'
                                                    >
                                                        <li>
                                                            <button type="button"
                                                                className='dropdown-item'
                                                                onClick={() => startCollaboration(result.CollaborationRequestCommentId)}>
                                                                Assign and Start collaboration
                                                            </button>
                                                        </li>
                                                    </ul>

                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}

                                {props.isApproved === false && 
                                <tr>
                                    <td>{props.comment}</td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                </Modal.Body>
            </Modal>

        </>
    )
}

export default RequestCommentsModal
