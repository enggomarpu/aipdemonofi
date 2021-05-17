import React, { useState, useEffect } from 'react'
import httpService from '../../../../shared/http.service'
import { Spinner } from 'react-bootstrap'
import { format, formatDistanceToNow } from 'date-fns'
import FeaturedPostModal from './featured-post-modal.component'
import commentIcon from '../../../../img/comments-icon.png'
import UserProfile from '../../../../img/dummy-profile-pic.png'
import dummyIMG from '../../../../img/dummy-img.jpg'
import filePickerService from '../../../../shared/file-picker/file-picker.service'
import AttachmentPreviewModal from "../../../../shared/attachment-preview-modal/attachment-preview-modal"
let userInfo = JSON.parse(localStorage.getItem('user-info'))
let userId = userInfo ? userInfo.userId : null

const FeaturedPostComponent = () => {
  const [loading, setLoading] = useState(true)
  const [featuredPosts, setFeaturedPosts] = useState({})
  const [openFeaturedModal, setOpenFeaturedModal] = useState(false)
  const [postId, setPostId] = useState(false)
  const [Comments, setComments] = useState([])
  const [openPreviewModel, setopenPreviewModel] = useState(false)
  const [filecheck, setfilecheck] = useState("")
  const [filetypecheck, setfiletypecheck] = useState("")

  useEffect(() => {
    get()
  }, [])

  const get = async () => {
    await httpService
      .get('posts/dashboard-promotional-post')
      .then((res) => {
        if (res) {
          setLoading(false)
          setFeaturedPosts(res.data)
        }
      })
      .catch((err) => {
        console.log('something weired happend', err)
      })
  }

  const editPost = (id) => {
    setPostId(id)
    setOpenFeaturedModal(true)
  }
  const ViewComments = async (id) => {
    await httpService
      .get('post-comment/all-comments/' + id)
      .then((res) => {
        if (res) {
          setComments(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const PreviewModelOpen = (event, file, FileType ) => {
    event.preventDefault()
    setopenPreviewModel(true)
    setfilecheck(file)
   // setfiletypecheck(FileType)
  }

  return (
    <>
      {loading ? (
        <Spinner animation='border' />
      ) : (
        <>
        {featuredPosts &&
        Object.keys(featuredPosts).length !== 0 &&
        <div className='card simple-card card-border'>
        <div className='row'>
          <div className='col-md-3'>
              <img src={ featuredPosts.PromotionalPost.PostAttachments[0] && featuredPosts.PromotionalPost.PostAttachments[0].FileType.split('/')[0] == 'image'? filePickerService.getImageLink(
                       featuredPosts.PromotionalPost.PostAttachments[0].FileHandler
                    ): dummyIMG} alt='' className='card-img thumbnail-img' />
          </div>
          <div className='col-md-9'>
            <div className='card-body'>
              <div className='d-flex justify-content-between mb-3'>
                <div className='align-self-center'>
                  <h4 className='card-title-primary'>FEATURED TODAY</h4>
                  <h3 className='card-title'>{featuredPosts.PromotionalPost.PostTitle}</h3>
                  <h5 className='card-subtitle'>
                    {formatDistanceToNow(new Date(featuredPosts.PromotionalPost.CreatedDate))}
                  </h5>
                </div>
                <div className='right align-self-center'>
                  {userId === featuredPosts.PromotionalPost.CreatedUserId && (
                    <span
                      className='card-link'
                      onClick={() => editPost(featuredPosts.PromotionalPost.PostId)}
                    >
                      <i className='fas fa-pen'></i>
                    </span>
                  )}

                  {/* -------------------------
                Statistics of Post
           -------------------------*/}

                  <span className='card-link dropdown'>
                    <a
                      className='card-link'
                      type='button'
                      id='dropdownMenuButton1'
                      data-bs-toggle='dropdown'
                      aria-expanded='false'
                    >
                      <i className='fas fa-tachometer-alt'></i>
                    </a>

                    <div
                      className='dropdown-menu toggle-menu border-0'
                      aria-labelledby='dropdownMenuButton1'
                    >
                      <div className='card custom-card'>
                        <div className='card-header'>Post Insights</div>
                        <div className='card-body'>
                          <ol className='list-group list-group-numbered'>
                            <li className='list-group-item d-flex justify-content-between align-items-start'>
                              <div className='ms-2 me-auto'>
                                <div className='fw-bold'>Likes:</div>
                              </div>
                              <span className='text-secondary fs-5'>
                                {featuredPosts.PostAnalytics.TotalLikes}
                              </span>
                            </li>
                            <li className='list-group-item d-flex justify-content-between align-items-start'>
                              <div className='ms-2 me-auto'>
                                <div className='fw-bold'>Comments:</div>
                              </div>
                              <span className='text-secondary fs-5'>
                                {featuredPosts.PostAnalytics.TotalComments}
                              </span>
                            </li>
                            <li className='list-group-item d-flex justify-content-between align-items-start'>
                              <div className='ms-2 me-auto'>
                                <div className='fw-bold'>Shares:</div>
                              </div>
                              <span className='text-secondary fs-5'>
                                {featuredPosts.PostAnalytics.TotalShare}
                              </span>
                            </li>
                                      <li className='list-group-item d-flex justify-content-between align-items-start'>
                                      <div className='ms-2 me-auto'>
                                        <div className='fw-bold'>Favourite:</div>
                                      </div>
                                      <span className='text-secondary fs-5'>
                                        {featuredPosts.PostAnalytics.TotalFavourities}
                                      </span>
                                    </li>
                                    <li className='list-group-item d-flex justify-content-between align-items-start'>
                                      <div className='ms-2 me-auto'>
                                        <div className='fw-bold'>Seen:</div>
                                      </div>
                                      <span className='text-secondary fs-5'>
                                        {featuredPosts.PostAnalytics.TotalSeen}
                                      </span>
                                    </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
              {featuredPosts.PromotionalPost.PostAttachments &&
                          featuredPosts.PromotionalPost.PostAttachments.find(
                            file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video') &&
                          <a href={filePickerService.getDownloadLink(featuredPosts.PromotionalPost.PostAttachments.find(
                            file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video').FileHandler)}>
                            <div className='align-self-center'>
                              <div
                                className={filePickerService.getFileIcon(featuredPosts.PromotionalPost.PostAttachments.find(
                                    file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video').FileType)}
                              ></div>
                              <span className='ms-2'>
                                {featuredPosts.PromotionalPost.PostAttachments.find(
                                  file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video').FileName}
                              </span>
                            </div>
                          </a>
                        }
                        {featuredPosts.PromotionalPost.PostAttachments &&
                        featuredPosts.PromotionalPost.PostAttachments.find(
                          file => file.FileType.split('/')[0] == 'video') &&
                          <a href={filePickerService.getDownloadLink(featuredPosts.PromotionalPost.PostAttachments.find(
                            file => file.FileType.split('/')[0] == 'video').FileHandler)}  onClick={(e) =>
                              PreviewModelOpen(
                              e,
                              featuredPosts.PromotionalPost.PostAttachments.find(
                    file => file.FileType.split('/')[0] == 'video').FileHandler,
                    
                            )
                          }>
                            <div className='align-self-center'>
                              <div
                                className={filePickerService.getFileIcon(featuredPosts.PromotionalPost.PostAttachments.find(
                                    file => file.FileType.split('/')[0] == 'video').FileType)}
                              ></div>
                              <span className='ms-2'>
                                {featuredPosts.PromotionalPost.PostAttachments.find(
                                  file => file.FileType.split('/')[0] == 'video').FileName}
                              </span>
                            </div>

                          </a>
                          }
              <p className='card-text'>{featuredPosts.PromotionalPost.PostContent}</p>
              <div className='checkbox-group'>
                {featuredPosts.PromotionalPost.PostTags &&
                  featuredPosts.PromotionalPost.PostTags.map((tag) => {
                    return (
                      <label className='btn btn-primary'>
                        {tag.TagName}
                      </label>
                    )
                  })}
              </div>
            </div>
            <div className='card-footer'>
              <div className='align-self-center'>
                <div
                  className='custom-accordion accordion'
                  id={'accordionExample' + featuredPosts.PromotionalPost.PostId}
                >
                  <div className='accordion-item'>
                    <span
                      className='accordion-header'
                      id={'headingOne' + featuredPosts.PromotionalPost.PostId}
                    >
                      <button
                        className='accordion-button collapsed btn'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target={'#collapseOne' + featuredPosts.PromotionalPost.PostId}
                        aria-expanded='false'
                        aria-controls={'collapseOne' + featuredPosts.PromotionalPost.PostId}
                        onClick={() =>
                          ViewComments(featuredPosts.PromotionalPost.PostId)
                        }
                      >
                        <img src={commentIcon} className='mx-2' alt='' />{' '}
                        View comments ({featuredPosts.PostAnalytics.TotalComments})
                      </button>
                    </span>
                    <div
                      id={'collapseOne' + featuredPosts.PromotionalPost.PostId}
                      className='accordion-collapse collapse'
                      aria-labelledby={'headingOne' + featuredPosts.PromotionalPost.PostId}
                      data-bs-parent={
                        '#accordionExample' + featuredPosts.PromotionalPost.PostId
                      }
                    >
                      <div className='featuredPosts-details border-0 p-0'>
                        <div className='accordion-body'>
                          {Comments &&
                            Comments.map((comment) => {
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
                                                  comment.User
                                                    .ProfilePicture
                                                    .FileHandler
                                                )
                                              : UserProfile
                                          }
                                          alt=''
                                        />
                                      </div>
                                      <div className='user-details'>
                                        <h3>{comment.User.CompanyName}</h3>
                                        <p>
                                          {comment.PostCommentContent}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
      )}
      <FeaturedPostModal
        show={openFeaturedModal}
        onHide={() => setOpenFeaturedModal(false)}
        postId={postId}
      />
      <AttachmentPreviewModal 
          show={openPreviewModel}
          onHide={() => setopenPreviewModel(false)}
          filehandler={filecheck}
          filetype={filetypecheck}
      />
    </>
  )
}

export default FeaturedPostComponent
