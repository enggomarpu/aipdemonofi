import React, { useState, useEffect } from 'react'
import httpService from '../../../shared/http.service'
import PostModel from './post-modal'
import { format, formatDistanceToNow } from 'date-fns'
import './post.scss'
import commentIcon from '../../../img/comments-icon.png'
import UserProfile from '../../../img/dummy-profile-pic.png'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import { useToasts } from 'react-toast-notifications'
import InfiniteScroll from 'react-infinite-scroll-component'
import PdfModal from '../PDF-Document-Modal'
import jsPDF from "jspdf"
import NoImg from '../../../img/noimage.png'
import ReactTooltip from 'react-tooltip'
import AttachmentPreviewModal from "../../../shared/attachment-preview-modal/attachment-preview-modal"
const Posts = () => {
  const [Posts, setPosts] = useState([])
  const [newComment, setNewComment] = useState('')
  const [openPostModel, setOpenPostModel] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [Comments, setComments] = useState({})
  const { addToast } = useToasts()
  const [page, setpage] = useState(1)
  const [length, setLength] = useState()
  const [dataLength, setDataLength] = useState(10)
  const [loadData, setLoadData] = useState(true)
  const [limit, setlimit] = useState(10)
  const [openModal, setOpenModal] = useState(false)
  const [openPreviewModel, setopenPreviewModel] = useState(false)
  const [postdata, setpost] = useState({});
  const [filecheck, setfilecheck] = useState("")
  const [filetypecheck, setfiletypecheck] = useState("")

  let userInfo = JSON.parse(localStorage.getItem('user-info'))
  let userId = userInfo.userId;

  useEffect(() => {
    if (page == 1) {
      getDataLength()
    }
  }, [openPostModel])
  const getDataLength = async () => {
    await httpService
      .get('posts/dashboard/total')
      .then((res) => {
        if (res) {
          setLength(res.data)
          get(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const get = async (fisrtLength) => {
    await httpService
      .get('posts/dashboard?page=' + page + '&limit=' + limit)
      .then((res) => {
        if (res) {
          setPosts([...Posts, ...res.data])
          let newPage = page
          newPage++
          setpage(newPage)
          let newLength = dataLength + limit
          setDataLength(newLength)
          if (
            (fisrtLength && newLength >= fisrtLength) ||
            newLength >= length
          ) {
            setLoadData(false)
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const ViewComments = async (id, index) => {
    await httpService
      .get('post-comment/all-comments/' + id)
      .then((res) => {
        if (res) {
          const objectvalue = {
            ...Comments,
            [index]: res.data,
          }
          setComments(objectvalue)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const AddComment = (id, index) => {
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
          ViewComments(id, index)
          setNewComment('')
          let items = [...Posts]
          let item = { ...items[index] }
          item.PostAnalytics.TotalComments =
            item.PostAnalytics.TotalComments + 1
          items[index] = item
          setPosts(items)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const handleModelOpen = (event, idvalue, postTags) => {
    event.preventDefault()
    setOpenPostModel(true)
    setSelectedPostId(idvalue)
  }

  const PreviewModelOpen = (event, file, FileType ) => {
    event.preventDefault()
    setopenPreviewModel(true)
    setfilecheck(file)
   // setfiletypecheck(FileType)

   
  }

  const generatePDF = async (event, idvalue) => {

    event.preventDefault()
    setSelectedPostId(idvalue)
    //  setPostTags(postTags)

    await httpService.get(`posts/${idvalue}`)
      .then((res) => {
        if (res) {
          var doc = new jsPDF('p', 'pt');
          setpost(res.data.Post)
          doc.setFont('helvetica')
          doc.text(20, 20, "Post Title :")
          doc.text(120, 20, res.data.Post.PostTitle)

           doc.setFont('helvetica')
           doc.text(20, 60, "Post Content :")
           doc.text(180, 60, res.data.Post.PostContent)


          doc.save('Post.pdf')
        }
      }).catch((err) => {
        console.log(err);
      });
  }
  const PDFModal = (event, idvalue, postTags) => {
    event.preventDefault()
    setOpenModal(true)
    setSelectedPostId(idvalue)
  }


  const LikePost = async (id, IsUserLiked, index) => {
    const postObject = {
      PostId: id,
    }
    let items = [...Posts]
    let item = { ...items[index] }

    if (IsUserLiked) {
      await httpService
        .delete('post-like/' + id)
        .then(() => {
          item.PostAnalytics.TotalLikes = item.PostAnalytics.TotalLikes - 1
          item.IsUserLiked = !item.IsUserLiked
          items[index] = item
          setPosts(items)
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
            items[index] = item
            setPosts(items)
            console.log('successfully like the post')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const FavouritePost = async (id, IsUserFavourite, index) => {
    const postObject = {
      PostId: id,
    }
    let items = [...Posts]
    let item = { ...items[index] }

    if (IsUserFavourite) {
      await httpService
        .delete('post-favourite/' + id)
        .then(() => {
          item.PostAnalytics.TotalFavourities =
            item.PostAnalytics.TotalFavourities - 1
          item.IsUserFavourite = !item.IsUserFavourite
          items[index] = item
          setPosts(items)
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
            items[index] = item
            setPosts(items)
            console.log('Post is now your favourite')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  return (
    <>
      {length && (
        <InfiniteScroll
          dataLength={dataLength} //{this.state.items.length}//This is important field to render the next data
          next={get}
          hasMore={loadData}
          scrollThreshold={1.0}
          loader={<h4>Loading...</h4>}
          scrollableTarget='scrollableDiv'
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {Posts &&
            Posts.map((post, index) => {
              return (
                <div className='card simple-card'>
                  <div className='row'>
                    <div className='col-md-3'>
                      <img
                        className='card-img'
                        src={post.Post.PostAttachments && post.Post.PostAttachments.find(file => file.FileType.split('/')[0] == 'image') ? filePickerService.getImageLink(
                          post.Post.PostAttachments.find(file => file.FileType.split('/')[0] == 'image').FileHandler
                        ) : NoImg}
                      />
                    </div>
                    <div
                      className='col-md-9'
                    >
                      <div className='card-body'>
                        <div className='d-flex justify-content-between mb-3'>
                          <div className='align-self-center'>
                            <h3 className='card-title'>
                              {post.Post.PostTitle}
                            </h3>
                            <h5 className='card-subtitle'>
                              {formatDistanceToNow(
                                new Date(post.Post.CreatedDate),
                                new Date()
                              ) + ' ago'}
                            </h5>
                          </div>
                          <ReactTooltip />
                          <div className='btn-pane align-self-center'>
                            <a
                              type='button'
                              data-tip="Download"
                              data-iscapture="true"
                              className='card-link'
                              onClick={(e) => generatePDF(
                                e,
                                post.Post.PostId,
                              )}
                              
                            // onClick={(e) => PDFModal(
                            //   e,
                            //         post.Post.PostId,
                            //         post.Post.PostTags
                            // )}
                            >
                              <i className='fas fa-download' />
                            </a>
                            {/* -------------------------
                              Like Post
                        -------------------------*/}
                            <a
                              type='button'
                              data-tip="Like"
                              onClick={() =>
                                LikePost(
                                  post.Post.PostId,
                                  post.IsUserLiked,
                                  index
                                )
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
                                FavouritePost(post.Post.PostId, post.IsUserFavourite, index)
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
                            <a type='button' className='card-link'
                            data-tip="Share It">
                              <i className='fa fa-share-alt'></i>
                            </a>

                            {/* -------------------------
                            comment Post
                       -------------------------*/}
                            <span
                              className='px-3'
                              data-tip="Comment"
                              id={'accordionExample' + post.Post.PostId}
                            >
                              <span
                                className='accordion-header'
                                id={'headingOne' + post.Post.PostId}
                              >
                                <button
                                  className='collapsed p-0 btn'
                                  type='button'
                                  data-bs-toggle='collapse'
                                  data-bs-target={
                                    '#collapseOne' + post.Post.PostId
                                  }
                                  aria-expanded='false'
                                  aria-controls={
                                    'collapseOne' + post.Post.PostId
                                  }
                                  onClick={() =>
                                    ViewComments(post.Post.PostId, index)
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
                                  <div className='card-header'>
                                    Post Insights
                                  </div>
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
                                          <div className='fw-bold'>
                                            Comments:
                                          </div>
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
                            {/* -------------------------
                            Edit Post
                       -------------------------*/}
                            {userId == post.Post.CreatedUserId && (
                              <a type='button' className='card-link'>
                                <i
                                  className='fas fa-pen'
                                  aria-hidden='true'
                                  onClick={(e) =>
                                    handleModelOpen(
                                      e,
                                      post.Post.PostId,
                                      post.Post.PostTags
                                    )
                                  }
                                ></i>
                              </a>
                            )}
                          </div>
                        </div>
                        {post.Post.PostAttachments &&
                          post.Post.PostAttachments.find(
                            file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video') &&
                          <a href={filePickerService.getDownloadLink(post.Post.PostAttachments.find(
                            file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video').FileHandler)}>
                            <div className='align-self-center'>
                              <div
                                className={
                                  'fa fa-file-' +
                                  (filePickerService.getFileIcon(post.Post.PostAttachments.find(
                                    file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video').FileType))
                                }
                              ></div>
                              <span className='ms-2'>
                                {post.Post.PostAttachments.find(
                                  file => file.FileType.split('/')[0] != 'image' && file.FileType.split('/')[0] != 'video').FileName}
                              </span>
                            </div>
                          </a>
                        }
                        {post.Post.PostAttachments &&
                        post.Post.PostAttachments.find(
                          file => file.FileType.split('/')[0] == 'video') &&
                          <a href={filePickerService.getDownloadLink(post.Post.PostAttachments.find(
                            file => file.FileType.split('/')[0] == 'video').FileHandler)}
                            onClick={(e) =>
                                      PreviewModelOpen(
                                      e,
                                      post.Post.PostAttachments.find(
                            file => file.FileType.split('/')[0] == 'video').FileHandler,
                            
                                    )
                                  }
                            >
                            <div className='align-self-center'>
                              <div
                                className={filePickerService.getFileIcon(post.Post.PostAttachments.find(
                                    file => file.FileType.split('/')[0] == 'video').FileType)}
                              ></div>
                              <span className='ms-2'>
                                {post.Post.PostAttachments.find(
                                  file => file.FileType.split('/')[0] == 'video').FileName}
                              </span>
                            </div>
                          </a>
                          }
                        <p className='card-text'>{post.Post.PostContent}</p>
                        <div className='checkbox-group'>
                          {post.Post.PostTags &&
                            post.Post.PostTags.map((tag) => {
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
                            id={'accordionExample' + post.Post.PostId}
                          >
                            <div className='accordion-item'>
                              <span
                                className='accordion-header'
                                id={'headingOne' + post.Post.PostId}
                              >
                                <button
                                  className='accordion-button collapsed btn'
                                  type='button'
                                  data-bs-toggle='collapse'
                                  data-bs-target={
                                    '#collapseOne' + post.Post.PostId
                                  }
                                  aria-expanded='false'
                                  aria-controls={
                                    'collapseOne' + post.Post.PostId
                                  }
                                  onClick={() =>
                                    ViewComments(post.Post.PostId, index)
                                  }
                                >
                                  <img
                                    src={commentIcon}
                                    className='mx-2'
                                    alt=''
                                  />{' '}
                                  View comments (
                                  {post.PostAnalytics.TotalComments})
                                </button>
                              </span>
                              <div
                                id={'collapseOne' + post.Post.PostId}
                                className='accordion-collapse collapse'
                                aria-labelledby={
                                  'headingOne' + post.Post.PostId
                                }
                                data-bs-parent={
                                  '#accordionExample' + post.Post.PostId
                                }
                              >
                                <div className='post-details border-0 p-0'>
                                  <div className='accordion-body'>
                                    {Comments[index] &&
                                      Comments[index].map((comment) => {
                                        return (
                                          <>
                                            <div className='comments-panel'>
                                              <div className='date-time'>
                                                <label>
                                                  {format(
                                                    new Date(
                                                      comment.CreatedDate
                                                    ),
                                                    'MMMM dd, yyyy'
                                                  )}
                                                </label>
                                              </div>
                                              <div className='comments'>
                                                <div className='user-profile'>
                                                  <img
                                                    src={
                                                      comment.User
                                                        .ProfilePicture
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

                                <div className='form-group p-3 bg-white pb-0'>
                                  <div className='row'>
                                    <div className='col align-self-center'>
                                      <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Write your Comment'
                                        value={newComment}
                                        onChange={(e) =>
                                          setNewComment(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className='col-auto align-self-center'>
                                      <button
                                        className='btn btn-primary btn-width'
                                        onClick={() =>
                                          AddComment(post.Post.PostId, index)
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
              )
            })}
        </InfiniteScroll>
      )}
      {selectedPostId && (
        <PostModel
          show={openPostModel}
          postselectid={selectedPostId}
          onHide={() => setOpenPostModel(false)}
        />
      )}

      <PdfModal show={openModal}
        postselectid={selectedPostId}
        onHide={() => setOpenModal(false)}
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

export default Posts
