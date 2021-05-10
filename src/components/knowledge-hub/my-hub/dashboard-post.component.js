import React, { useEffect, useState } from 'react'
import AwsLogo from '../../../img/aws-logo.png'
import httpService from '../../../shared/http.service'
import { formatDistance } from 'date-fns'
import PostModel from '../../dashboard/post/post-modal'
import SinglePost from '../../../shared/SinglePost/SinglePost'
import NoImg from '../../../img/noimage.png'
import filePickerService from '../../../shared/file-picker/file-picker.service'
const DashboardPosts = () => {
  const [dashboardPosts, setDashboardPosts] = useState([])
  const [postTags, setPostTags] = useState(null)
  const [openPostModel, setOpenPostModel] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [openModal, setSinglePostOpenModal] = useState(false)

  useEffect(() => {
    get()
  }, [])

  const getTime = (date) => {
    return date.toLocaleTimeString('en-US')
  }

  const get = async () => {
    await httpService.get('posts/current-affiliate').then(async (response) => {
      setDashboardPosts(response.data)
    })
  }
  const handleModelOpen = (event, idvalue, postTags) => {
    event.preventDefault()
    setOpenPostModel(true)
    setSelectedPostId(idvalue)
    setPostTags(postTags)
  }
  const openSinglePostModel = (event, idvalue) => {
    event.preventDefault();
    setSinglePostOpenModal(true)
    setSelectedPostId(idvalue)
  };
  

  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <div className='row row-cols-1 row-cols-md-2 g-4'>
            {dashboardPosts &&
              dashboardPosts.map((post) => {
                return (
                  <>
                    {post.Post && (
                      <div className="col">
                        <div className="card">
                          <div className="card-body">
                            <a type="button" className="card-link">
                              <i
                                className="fas fa-pen"
                                aria-hidden="true"
                                onClick={(e) =>
                                  handleModelOpen(
                                    e,
                                    post.Post.PostId,
                                    post.Post.PostTags
                                  )
                                }
                              ></i>
                            </a>
                            <div
                              className="row"
                              onClick={(e) =>
                                openSinglePostModel(e, post.Post.PostId)
                              }
                            >
                              <div className="col-auto d-flex align-items-center">
                                {/* <img src={AwsLogo} alt='' /> */}
                                <img
                                  style={{
                                    maxHeight: 150,
                                    maxWidth: 150,
                                    minWidth: 150,
                                    minHeight: 150,
                                  }}
                                  className="card-img"
                                  src={
                                    post.Post.PostAttachments[0] &&
                                    post.Post.PostAttachments[0].FileType.split(
                                      "/"
                                    )[0] == "image"
                                      ? filePickerService.getImageLink(
                                          post.Post.PostAttachments[0]
                                            .FileHandler
                                        )
                                      : NoImg
                                  }
                                />
                              </div>
                              <div className="col">
                                <h5 className="card-title mb-0">
                                  {post.Post.PostTitle}
                                </h5>
                                <p className="card-text mb-1">
                                  <small className="text-muted">
                                    {getTime(
                                      new Date(post.Post.CreatedDate)
                                    ).padStart(3, "0")}{" "}
                                    |{" "}
                                    {formatDistance(
                                      new Date(post.Post.CreatedDate),
                                      new Date()
                                    )}
                                  </small>
                                </p>
                                <tr>
                                  <td>
                                    <h5 className="card-title mb-0">Status:</h5>
                                  </td>

                                  {post.Post.IsApproved ? (
                                    <td>
                                      <div className="ms-3">
                                        <button className="btn btn-success btn-sm btn-rounded">
                                          Approved
                                        </button>
                                      </div>
                                    </td>
                                  ) : post.Post.IsApproved == null ? (
                                    <td>
                                      <div className="ms-3">
                                        <button className="btn btn-warning btn-sm btn-rounded">
                                          Pending
                                        </button>
                                      </div>
                                    </td>
                                  ) : (
                                    <td>
                                      <div className="ms-3">
                                        <button className="btn btn-danger btn-sm btn-rounded">
                                          Rejected
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </tr>

                                <p className="card-text">
                                  {post.Post.PostContent}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
          </div>
        </div>
      </div>
      {selectedPostId && (
        <PostModel
          show={openPostModel}
          postselectid={selectedPostId}
          PostTags={postTags}
          onHide={() => {setOpenPostModel(false);get()}}
        />
      )}
      <SinglePost show={openModal} 
      selectedViewPostId={selectedPostId} 
      onHide={() =>{setSinglePostOpenModal(false);
      get() }}/>
    </>
  )
}

export default DashboardPosts
