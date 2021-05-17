import React, {useState,useEffect} from 'react';
import HttpService from '../../../../src/shared/http.service';
import { Link } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import Swal from 'sweetalert2';
import { formatDistance } from 'date-fns';
import PostModel from '../../AdminDashboard/post/AdminPost/post-modal'
import { useToasts } from 'react-toast-notifications'
import SinglePost from './SinglePostView'

const AffiliatePostsData = (props) => {
  const { addToast } = useToasts()
  const [error, seterror] = useState(null);
  const [Posts, setPosts] = useState([]);
  const [loading, setloading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openPostModel, setOpenPostModel] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postTags, setPostTags] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [openViewModal, setopenViewModal] = useState(false);
  const [postReview, setPostReview] = useState(false);
  

  useEffect(() => {
    get()
  }, [openViewModal, openPostModel])

  const get = async () => {
    await HttpService.get("posts/all-affiliate-posts")
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
    event.preventDefault();
    setOpenPostModel(true);
    setSelectedPostId(idvalue);
    setPostTags(postTags);
  };
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
  const deletePost = async(idvalue) => {
    await HttpService.delete("posts/"+idvalue)
    .then(() => {
      get();
    })
    .catch((err) => {
      seterror(err)
      setloading(false)
    })
  }
  const ViewSinglePost = (event,idvalue,reviewPostbit) => {
    event.preventDefault();
    setopenViewModal(true);
    setViewId(idvalue);
    setPostReview(reviewPostbit);
  };
  return (

    Posts.length > 0 ? (
      <>
        {Posts.map((result) => {
          return (
            <tr key={result.Post.PostId} >
              <td><p>{result.Post.PostTitle}</p>
              {formatDistance(new Date(result.Post.CreatedDate), new Date())}
              </td>
              <td>{result.Post.PostContent}</td>
              <td>
             {result.Post.PostAttachments.map((attachment)=>{
              return ( <span>{attachment.FileName} </span>) 
              })}
              </td>
              <td>{result.Post.IsApproved == true?<span>Approved</span>:result.Post.IsApproved == false?<span>Rejected</span>: <span>Pending</span>}</td>
              <td>
                <button
                  className='d-grid btn btn-secondary'
                   
                  onClick={(e) =>
                    ViewSinglePost(e,result.Post.PostId,false)
                   }
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
                    ViewSinglePost(e,result.Post.PostId,true)
                   }
                  >
                    Review Post
                  </button>
               
                    </li>
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
                    onClick={() =>
                      deleteConfirmation(result.Post.PostId)
                    }
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
            onHide={() =>{setOpenPostModel(false);get()} }
          />
          <SinglePost show={openViewModal} postReview={postReview} selectedViewPostId={viewId} onHide={() =>{setopenViewModal(false);
            get()}}/>
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
  )
}

export default AffiliatePostsData
