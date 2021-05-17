import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import HttpService from '../../../../src/shared/http.service'
import { Link } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import Swal from 'sweetalert2'
import { formatDistance } from 'date-fns'
import NoImg from '../../../img/noimage.png'
import PostModel from '../../AdminDashboard/post/AdminPost/post-modal'
import { useToasts } from 'react-toast-notifications'
import SinglePost from './SinglePostView'

const AdminPostsData = forwardRef((props, ref) => {
  const { addToast } = useToasts()
  const [error, seterror] = useState(null)
  const [Posts, setPosts] = useState([])
  const [loading, setloading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [openPostModel, setOpenPostModel] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [postTags, setPostTags] = useState(null)
  const [viewId, setViewId] = useState(null)
  const [openViewModal, setopenViewModal] = useState(false)
  const [openAdminView, setadminView] = useState(false)

  useEffect(() => {
    get()
  }, [])

  useImperativeHandle(ref, () => ({

    callGet() {
      get()
    }

  }));

  const get = async () => {
    await HttpService.get('posts/admin-all-posts')
      .then((res) => {
        setPosts(res.data)
        setloading(false)
      })
      .catch((err) => {
        seterror(err)
        setloading(false)
      })
  }
  const handleModelOpen = (event, idvalue, postTags) => {
    event.preventDefault()
    setOpenPostModel(true)
    setSelectedPostId(idvalue)
    setPostTags(postTags)
  }
  const ViewSinglePost = (event, idvalue) => {
    event.preventDefault()
    setopenViewModal(true)
    setViewId(idvalue)
    setadminView(true)
  }
  const deleteConfirmation = (idvalue) => {
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
        deletePost(idvalue).then(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Post Deleted Successfully',
            showConfirmButton: false,
            timer: 2000,
          })
        })
      }
    })
  }
  const deletePost = async (idvalue) => {
    await HttpService.delete('posts/' + idvalue)
      .then(() => {
        get();
      })
      .catch((err) => {
        seterror(err)
        setloading(false)
      })
  }

  return Posts.length > 0 ? (
    <>
      {Posts.map((result) => {
        return (
          <tr key={result.Post.PostId}>
            <td className='title-width'>
              <div className='d-flex'>
                <img
                  className='card-img thumbnail-img'
                  src={NoImg}
                  alt='...'
                />
                <div className='ms-3'>
                  <p className='mb-4'>{result.Post.PostTitle}</p>
                  {formatDistance(
                    new Date(result.Post.CreatedDate),
                    new Date()
                  )}
                </div>
              </div>
            </td>

            <td className='description-width'>{result.Post.PostContent}</td>
            <td>
              {result.Post.PostAttachments.map((attachment) => {
                return <span>{attachment.FileName} </span>
              })}
            </td>
            <td>
              <button
                className='d-grid btn btn-secondary'
                onClick={(e) => ViewSinglePost(e, result.Post.PostId)}
              >
                View
              </button>
            </td>
            <td>
              <div className='text-end'>
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
                    <button
                      className='dropdown-item'
                      onClick={(e) =>
                        handleModelOpen(
                          e,
                          result.Post.PostId,
                          result.Post.PostTags
                        )
                      }
                    >
                      Edit Post
                    </button>
                  </li>
                  <li>
                    <button
                      className='dropdown-item text-danger'
                      onClick={() => deleteConfirmation(result.Post.PostId)}
                    >
                      Delete Post
                    </button>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        )
      })}
      <PostModel
        show={openPostModel}
        postselectid={selectedPostId}
        PostTags={postTags}
        onHide={() => {setOpenPostModel(false);get()
        }}
      />
      <SinglePost
        show={openViewModal}
        openAdminView={openAdminView}
        selectedViewPostId={viewId}
        onHide={() => {setopenViewModal(false);get()
        }}
      />
    </>
  ) : (
    <tr>
      <td colspan='100%'>
        <BeatLoader
          css={`
            text-align: center;
            margin-left: 150px;
          `}
          color={'#2f3272'}
          loading={loading}
          size={10}
          margin={2}
        />
        {!loading && 'No records found!'}
      </td>
    </tr>
  )
})

export default AdminPostsData
