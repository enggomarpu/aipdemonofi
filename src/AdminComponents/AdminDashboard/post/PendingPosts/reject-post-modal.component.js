import React, { useState, useEffect } from 'react'
import HttpService from '../../../../shared/http.service'
import { useToasts } from 'react-toast-notifications'
import { Modal, Button, Image } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '../../../sharedError/error.messages'

const RejectPostModal = (props) => {
  const { addToast } = useToasts()
  const [isRefresh, setIsRefresh] = useState(false)
  const postId = props.postselectid
  const { register, handleSubmit, errors } = useForm()
  const rejectPost = async (data) => {
    await HttpService.put(`posts/reject-post/${postId}`, data)
      .then((response) => {
        addToast('Post Rejected', { appearance: 'error' })
        props.onPrevHide()
      })
      .catch(() => {})
    props.onHide()
  }

  return (
    <>
      <Modal
        {...props}
        size='md'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            Pod cast request rejection
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(rejectPost)}>
          <Modal.Body>
            <div className='form-group'>
              <label htmlFor='PostRejectionComment'>Reason for Rejection</label>
              <textarea
                className='form-control'
                type='text'
                name='PostRejectionComment'
                id='PostRejectionComment'
                cols='30'
                rows='10'
                placeholder='short reason outlining reason for rejection'
                ref={register({
                  required: true,
                })}
              ></textarea>
              <ErrorMessage
                type={
                  errors.PostRejectionComment &&
                  errors.PostRejectionComment.type
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
              onClick={props.onHide}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
export default RejectPostModal
