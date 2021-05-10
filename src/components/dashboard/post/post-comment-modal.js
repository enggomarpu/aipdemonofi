import { Button, Form, Modal } from 'react-bootstrap'
import React, { useState } from 'react'
import httpService from '../../../shared/http.service'
import { useToasts } from 'react-toast-notifications'
import profile_img from '../../../img/profile-image.png'

const PostComments = (props) => {
  const [Comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const { addToast } = useToasts()
  const modalLoaded = () => {
    setComments([])
    setComment('')
    if (props.modalType === 1) {
      get()
    }
  }

  const get = async () => {
    await httpService
      .get('post-comment/all-comments/' + props.idValue)
      .then((res) => {
        if (res) {
          setComments(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleChange = (e) => {
    setComment(e.target.value)
  }

  const AddComment = () => {
    let body = {
      PostCommentContent: comment,
      PostId: props.idValue,
    }
    httpService
      .post('post-comment', body)
      .then((res) => {
        if (res) {
          props.onHide(true)
        }
        addToast('Comment added Successfully', {
          appearance: 'success',
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <Modal
        {...props}
        size='md'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        onEntered={modalLoaded}
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>Commnets</Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-0'>
          {Comments &&
            Comments.map((comment) => {
              return (
                <>
                  <div className='card commnets'>
                    <div className='row g-0'>
                      <div className='col profile-image'>
                        <img src={profile_img} alt='...' />
                      </div>
                      <div className='col'>
                        <div className='card-body'>
                          <h5 className='card-title'>{comment.User.CompanyName}</h5>
                          <p className='card-text'>
                            {comment.PostCommentContent}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            })}
          {props.modalType === 0 && (
            <Form>
              <Form.Group controlId='comment'>
                <Form.Control
                  type='text'
                  name='comment'
                  placeholder='Add Comment...'
                  value={comment}
                  onChange={handleChange}
                />
              </Form.Group>
              <button className= "btn btn-primary btn-width" onClick={AddComment} disabled={!comment} type='button'>
                Add Comment
              </button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PostComments
