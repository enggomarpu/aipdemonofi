import { Modal } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import UserImg from '../../img/user-img.png'
import UserImg2 from '../../img/user-2.png'
import UserProfile from '../../img/dummy-profile-pic.png'
import HttpService from '../http.service'
import './SinglePost.scss'
import { format } from 'date-fns'
import filePickerService from '../file-picker/file-picker.service'
import { useToasts } from 'react-toast-notifications'
import Swal from 'sweetalert2'

const SinglePost = (props) => {
  const { addToast } = useToasts()
  const [selectedPost, setSelectedPost] = useState()
  const [comments, setComments] = useState([])
  const [isFeature, setfeaturePost] = useState(false)

  useEffect(() => {
    if (props.selectedViewPostId) {
      get()
      getComments()
    }
  }, [props])
  const get = async () => {
    await HttpService.get(`posts/${props.selectedViewPostId}`)
      .then((res) => {
        if (res) {
          setSelectedPost(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getComments = async () => {
    await HttpService.get(
      `post-comment/all-comments/${props.selectedViewPostId}`
    )
      .then((res) => {
        if (res) {
          setComments(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const deleteConfirmation = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost().then(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'project Deleted Successfully',
            showConfirmButton: false,
            timer: 2000,
          })
        })
      }
    })
  }
  const deletePost = async () => {
    await HttpService.delete('posts/' + props.selectedViewPostId)
      .then(() => {
        props.onHide()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const modalLoaded = () => {}
  return (
    <>
      {selectedPost && (
        <Modal
          {...props}
          size='xl'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          onEntered={modalLoaded}
        >
          <Modal.Header closeButton className='border-0 pb-0'>
            <div className='col post-info d-flex align-self-center'>
              <div className='userprofile align-self-center'>
                {selectedPost.CreatedUser &&
                selectedPost.CreatedUser.ProfilePicture ? (
                  <img
                    src={filePickerService.getProfileLogo(
                      selectedPost.CreatedUser.ProfilePicture.FileHandler
                    )}
                    alt=''
                  />
                ) : (
                  <img src={UserImg} alt='' />
                )}
              </div>
              <h3 className='align-self-center mb-0 ms-3'>
                {selectedPost.CreatedUser ? selectedPost.CreatedUser.CompanyName : ''}
              </h3>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className='card singlePost'>
              <div className='card-header'>
                <div className='d-flex justify-content-between'>
                  <Modal.Title id='contained-modal-title-vcenter'>
                    {selectedPost.Post.PostTitle}
                  </Modal.Title>
                  <div className='col-auto align-self-center'>
                    <button
                      className='btn text-danger p-0'
                      onClick={() => deleteConfirmation()}
                    >
                      <i className='fas fa-trash-alt'></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className='card-body'>
                <ul className='custom-list'>
                  <li>
                    <div className='row'>
                      <div className='col-2'>Date and Time</div>
                      <div className='col'>
                        {format(
                          new Date(selectedPost.Post.CreatedDate),
                          'PPPP'
                        )}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className='row'>
                      <div className='col-2'>Description</div>
                      <div className='col'>{selectedPost.Post.PostContent}</div>
                    </div>
                  </li>
                </ul>
                <div>
                  <div className='post-body' id='accordionExample'>
                    <div
                      className='post-controls d-flex justify-content-between'
                      id='headingOne'
                    >
                      <button
                        className='btn accordion-button'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#collapseOne'
                        aria-expanded='true'
                        aria-controls='collapseOne'
                      >
                        <i className='far fa-comment-alt'></i> View comments (
                        {comments.length})
                      </button>
                      <button className='btn'>
                        <i className='far fa-eye'></i>{' '}
                        {selectedPost.PostAnalytics.TotalSeen} Seen by
                      </button>
                      <button className='btn'>
                        <i className='far fa-star'></i>{' '}
                        {selectedPost.PostAnalytics.TotalFavourities} Favorites
                      </button>
                      <button className='btn'>
                        <i className='fas fa-share-alt'></i>
                        {selectedPost.PostAnalytics.TotalShare} Share
                      </button>
                      <button className='btn'>
                        <i className='far fa-thumbs-up'></i>{' '}
                        {selectedPost.PostAnalytics.TotalLikes} Likes
                      </button>
                    </div>
                  </div>
                  <div
                    className='post-details show'
                    id='collapseOne'
                    aria-labelledby='headingOne'
                    data-bs-parent='#accordionExample'
                  >
                    {comments &&
                      comments.map((comment) => {
                        return (
                          <>
                            <div className='comments-panel'>
                              <div className='date-time'>
                                <label>
                                  {format(
                                    new Date(comment.CreatedDate),
                                    'MMMM dd, yyyy'
                                  )}
                                </label>
                              </div>
                              <div className='comments'>
                                <div className='user-profile'>
                                  <img
                                    src={
                                      comment.User.ProfilePicture
                                        ? filePickerService.getProfileLogo(
                                            comment.User.ProfilePicture
                                              .FileHandler
                                          )
                                        : UserProfile
                                    }
                                    alt=''
                                  />
                                </div>
                                <div className='user-details'>
                                  <h3>{comment.User.CompanyName}</h3>
                                  <p>{comment.PostCommentContent}</p>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })}
                  </div>
                </div>
                <ul className='custom-list'>
                  <li>
                    <div className='row'>
                      <div className='col-2'>Status</div>
                      <div className='col'>
                        {selectedPost.Post.IsApproved == null ? (
                          <button className='btn btn-warning btn-sm btn-rounded'>
                            pending
                          </button>
                        ) : selectedPost.Post.IsApproved == true ? (
                          <button className='btn btn-success btn-sm btn-rounded'>
                            Accept
                          </button>
                        ) : (
                          <button className='btn btn-danger btn-sm btn-rounded'>
                            Rejected
                          </button>
                        )}
                      </div>
                    </div>
                  </li>

                  {selectedPost.Post.IsApproved == false ? (
                    <li>
                      <div className='row'>
                        <div className='col-2'>Comment from admin</div>
                        <div className='col'>
                          {selectedPost.Post.PostRejectionComment}
                        </div>
                      </div>
                    </li>
                  ) : (
                    <div></div>
                  )}
                </ul>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

export default SinglePost
