import React, { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { Modal, Button, Image } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '../sharedError/error.messages'
import { useDispatch ,useSelector} from 'react-redux'
import {rejectCollaborationRequest} from './Review-Request/request-view.reducer'
const RejectCollabRequestModal = (props) => {
  const CollaborationState = useSelector(state => state.collaborationViewRequest);
  const dispatch = useDispatch();
  const { addToast } = useToasts()
  const [isRefresh, setIsRefresh] = useState(false)
  const postId = props.postselectid
  const { register, handleSubmit, errors } = useForm();

    const rejectPost = (data) => {
      dispatch(rejectCollaborationRequest({CollaborationRequestId : postId, data: data}))
      props.onHide(true);
    }
  return (
    <>
      <Modal
        {...props}
        size='md'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header>
          <Modal.Title id='contained-modal-title-vcenter'>
            Pod cast request rejection
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(rejectPost)}>
          <Modal.Body>
            <div className='form-group'>
              <label htmlFor='collabRejectionComment'>Reason for Rejection</label>
              <textarea
                className='form-control'
                type='text'
                name='RejectionComment'
                id='RejectionComment'
                cols='30'
                rows='10'
                placeholder='short reason outlining reason for rejection'
                ref={register({
                  required: true,
                })}
              ></textarea>
              <ErrorMessage
                type={
                  errors.RejectionComment &&
                  errors.RejectionComment.type
                }
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className='btn btn-outline-primary btn-width' type='submit'>
              Send
            </Button>
            <Button
              className='btn btn-primary btn-width'
              onClick={() => props.onHide(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
export default RejectCollabRequestModal
