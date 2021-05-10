import { format, formatDistanceToNow } from 'date-fns'
import React, { useState, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import httpService from '../../../shared/http.service'
import commentIcon from '../../../img/comments-icon.png'
import UserProfile from '../../../img/dummy-profile-pic.png'
import NoImg from '../../../img/noimage.png'
import ReactTooltip from 'react-tooltip'
import AttachmentPreviewModal from "../../../shared/attachment-preview-modal/attachment-preview-modal"

const FeaturedPosts = () => {
  const [post, setPost] = useState()
  const [newComment, setNewComment] = useState('')
  const [Comments, setComments] = useState([])
  const { addToast } = useToasts()
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
          setPost(res.data)
          console.log('promotional post data', res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
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

  const AddComment = (id) => {
    if (newComment) {
      let body = {
        PostCommentContent: newComment,
        PostId: id,
      }
      httpService
        .post('post-comment', body)
        .then((res) => {
          addToast('Comment added Successfully', {
            appearance: 'success',
          })
          ViewComments(id)
          setNewComment('')
          let item = { ...post }
          item.PostAnalytics.TotalComments =
            item.PostAnalytics.TotalComments + 1
          setPost(item)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const LikePost = async (id, IsUserLiked) => {
    const postObject = {
      PostId: id,
    }
    let item = { ...post }

    if (IsUserLiked) {
      await httpService
        .delete('post-like/' + id)
        .then(() => {
          item.PostAnalytics.TotalLikes = item.PostAnalytics.TotalLikes - 1
          item.IsUserLiked = !item.IsUserLiked
          setPost(item)
          console.log('successfully unlike the post')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      await httpService
        .post('post-like', postObject)
        .then((res) => {
          if (res) {
            item.PostAnalytics.TotalLikes = item.PostAnalytics.TotalLikes + 1
            item.IsUserLiked = !item.IsUserLiked
            setPost(item)
            console.log('successfully like the post')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const FavouritePost = async (id, IsUserFavourite) => {
    const postObject = {
      PostId: id,
    }
    let item = { ...post }

    if (IsUserFavourite) {
      await httpService
        .delete('post-favourite/' + id)
        .then(() => {
          item.PostAnalytics.TotalFavourities =
            item.PostAnalytics.TotalFavourities - 1
          item.IsUserFavourite = !item.IsUserFavourite
          setPost(item)
          console.log('successfully unfavourite the post')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      await httpService
        .post('post-favourite', postObject)
        .then((res) => {
          if (res) {
            item.PostAnalytics.TotalFavourities =
              item.PostAnalytics.TotalLikes + 1
            item.IsUserFavourite = !item.IsUserFavourite
            setPost(item)
            console.log('Post is now your favourite')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const PreviewModelOpen = (event, file, FileType ) => {
    event.preventDefault()
    setopenPreviewModel(true)
    setfilecheck(file)
   // setfiletypecheck(FileType)

   
  }

  return (
    <>
      {post && Object.keys(post).length !== 0 && (
        <div className='card simple-card card-border'>
          <div className='row'>
          <div className='col-md-3'>
          <img
                    className='card-img'
                    src={post.PromotionalPost.PostAttachments[0] 
                      && post.PromotionalPost.PostAttachments[0].FileType.split('/')[0] == 'image'? 
                      filePickerService.getImageLink(
                      post.PromotionalPost.PostAttachments[0].FileHandler
                    ): NoImg}
                  />
              </div>
            <div
              className='col-md-9'
            >
              <div className='card-body'>
                <div className='d-flex justify-content-between mb-3'>
                  <div className='align-self-center'>
                    <h4 className='card-title-primary'>FEATURED TODAY</h4>
                    <h3 className='card-title'>
                      {post.PromotionalPost.PostTitle}
                    </h3>
                    <h5 className='card-subtitle'>
                      {formatDistanceToNow(
                        new Date(post.PromotionalPost.CreatedDate),
                        new Date()
                      ) + ' ago'}
                    </h5>
                  </div>
                  <ReactTooltip />
                  <div className='btn-pane align-self-center'>
                    {/* -------------------------
                        Like Post
                  -------------------------*/}
                    <a
                      type='button'
                      data-tip="Like"
                      onClick={() =>
                        LikePost(post.PromotionalPost.PostId, post.IsUserLiked)
                      }
                      className='card-link'
                    >
                      {post.IsUserLiked ? (
                        <i className='fa fa-hand-point-right'></i>
                      ) : (
                        <i className='far fa-hand-point-right'></i>
                      )}
                    </a>

                    {/* -------------------------
                      Favourite Post
                 -------------------------*/}
                    <a
                      type='button'
                      data-tip="Favourite"
                      onClick={() =>
                        FavouritePost(
                          post.PromotionalPost.PostId,
                          post.IsUserFavourite
                        )
                      }
                      className='card-link'
                    >
                      {post.IsUserFavourite ? (
                        <i className='fa fa-star'></i>
                      ) : (
                        <i className='far fa-star'></i>
                      )}
                    </a>
                    {/* -------------------------
                      share Post
                 -------------------------*/}
                    <a type='button' className='card-link' data-tip="Share It">
                      <i className='fa fa-share-alt'></i>
                    </a>

                    {/* -------------------------
                      comment Post
                 -------------------------*/}
                    <span
                      className='px-3'
                      data-tip="Comment"
                      id={'accordionExample' + post.PromotionalPost.PostId}
                    >
                      <span
                        className='accordion-header'
                        id={'headingOne' + post.PromotionalPost.PostId}
                      >
                        <button
                          className='collapsed p-0 btn'
                          type='button'
                          data-bs-toggle='collapse'
                          data-bs-target={
                            '#collapseOne' + post.PromotionalPost.PostId
                          }
                          aria-expanded='false'
                          aria-controls={
                            'collapseOne' + post.PromotionalPost.PostId
                          }
                          onClick={() =>
                            ViewComments(post.PromotionalPost.PostId)
                          }
                        >
                          <img src={commentIcon} alt='' />
                        </button>
                      </span>
                    </span>

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
                        data-tip="Insights"
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
                                  {post.PostAnalytics.TotalLikes}
                                </span>
                              </li>
                              <li className='list-group-item d-flex justify-content-between align-items-start'>
                                <div className='ms-2 me-auto'>
                                  <div className='fw-bold'>Comments:</div>
                                </div>
                                <span className='text-secondary fs-5'>
                                  {post.PostAnalytics.TotalComments}
                                </span>
                              </li>
                              <li className='list-group-item d-flex justify-content-between align-items-start'>
                                <div className='ms-2 me-auto'>
                                  <div className='fw-bold'>Shares:</div>
                                </div>
                                <span className='text-secondary fs-5'>
                                  {post.PostAnalytics.TotalShare}
                                </span>
                              </li>
                                      <li className='list-group-item d-flex justify-content-between align-items-start'>
                                      <div className='ms-2 me-auto'>
                                        <div className='fw-bold'>Favourite:</div>
                                      </div>
                                      <span className='text-secondary fs-5'>
                                        {post.PostAnalytics.TotalFavourities}
                                      </span>
                                    </li>
                                    <li className='list-group-item d-flex justify-content-between align-items-start'>
                                      <div className='ms-2 me-auto'>
                                        <div className='fw-bold'>Seen:</div>
                                      </div>
                                      <span className='text-secondary fs-5'>
                                        {post.PostAnalytics.TotalSeen}
                                      </span>
                                    </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
                {post.PromotionalPost.PostAttachments &&
                          post.PromotionalPost.PostAttachments.find(
                            file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video') &&
                          <a href={filePickerService.getDownloadLink(post.PromotionalPost.PostAttachments.find(
                            file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video').FileHandler)}>
                            <div className='align-self-center'>
                              <div
                                className={
                                  'fa fa-file-' +
                                  (filePickerService.getFileIcon(post.PromotionalPost.PostAttachments.find(
                                    file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video').FileType))
                                }
                              ></div>
                              <span className='ms-2'>
                                {post.PromotionalPost.PostAttachments.find(
                                  file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video').FileName}
                              </span>
                            </div>
                          </a>
                        }
                        {post.PromotionalPost.PostAttachments &&
                        post.PromotionalPost.PostAttachments.find(
                          file => file.FileType.split('/')[0] == 'video') &&
                          <a href={filePickerService.getDownloadLink(post.PromotionalPost.PostAttachments.find(
                            file => file.FileType.split('/')[0] == 'video').FileHandler)}
                            onClick={(e) =>
                              PreviewModelOpen(
                              e,
                              post.PromotionalPost.PostAttachments.find(
                              file => file.FileType.split('/')[0] == 'video').FileHandler,
                    
                            )
                          }>
                            <div className='align-self-center'>
                              <div
                                className={filePickerService.getFileIcon(post.PromotionalPost.PostAttachments.find(
                                    file => file.FileType.split('/')[0] == 'video').FileType)}
                              ></div>
                              <span className='ms-2'>
                                {post.PromotionalPost.PostAttachments.find(
                                  file => file.FileType.split('/')[0] == 'video').FileName}
                              </span>
                            </div>
                          </a>
                          }
                <p className='card-text'>
                  {post.PromotionalPost.PostContent
                  }</p>
                <div className='checkbox-group'>
                  {post.PromotionalPost.PostTags &&
                    post.PromotionalPost.PostTags.map((tag) => {
                      return (
                        <label className='btn btn-primary'>{tag.TagName}</label>
                      )
                    })}
                </div>
              </div>
              <div className='card-footer'>
                <div className='align-self-center'>
                  <div
                    className='custom-accordion accordion'
                    id={'accordionExample' + post.PromotionalPost.PostId}
                  >
                    <div className='accordion-item'>
                      <span
                        className='accordion-header'
                        id={'headingOne' + post.PromotionalPost.PostId}
                      >
                        <button
                          className='accordion-button collapsed btn'
                          type='button'
                          data-bs-toggle='collapse'
                          data-bs-target={
                            '#collapseOne' + post.PromotionalPost.PostId
                          }
                          aria-expanded='false'
                          aria-controls={
                            'collapseOne' + post.PromotionalPost.PostId
                          }
                          onClick={() =>
                            ViewComments(post.PromotionalPost.PostId)
                          }
                        >
                          <img src={commentIcon} className='mx-2' alt='' /> View
                          comments ({post.PostAnalytics.TotalComments})
                        </button>
                      </span>
                      <div
                        id={'collapseOne' + post.PromotionalPost.PostId}
                        className='accordion-collapse collapse'
                        aria-labelledby={
                          'headingOne' + post.PromotionalPost.PostId
                        }
                        data-bs-parent={
                          '#accordionExample' + post.PromotionalPost.PostId
                        }
                      >
                        <div className='post-details border-0 p-0'>
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

                        <div className='form-group p-3 bg-white pb-0'>
                          <div className='row'>
                            <div className='col align-self-center'>
                              <input
                                type='text'
                                className='form-control'
                                placeholder='Write your Comment'
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              />
                            </div>
                            <div className='col-auto align-self-center'>
                              <button
                                className='btn btn-primary btn-width'
                                onClick={() =>
                                  AddComment(post.PromotionalPost.PostId)
                                }
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
          <AttachmentPreviewModal 
          show={openPreviewModel}
          onHide={() => setopenPreviewModel(false)}
          filehandler={filecheck}
          filetype={filetypecheck}

      />
    </>
  )
}

export default FeaturedPosts
