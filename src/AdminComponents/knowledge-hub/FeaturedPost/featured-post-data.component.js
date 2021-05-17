import React, {useState,useEffect, useImperativeHandle, forwardRef} from 'react';
import HttpService from '../../../../src/shared/http.service';
import { Link } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import Swal from 'sweetalert2';
import { formatDistance } from 'date-fns';
import PostModel from '../../AdminDashboard/post/AdminPost/post-modal'
import { useToasts } from 'react-toast-notifications'
import SinglePost from '../SinglePost/single-post-view.component'
import NoImg from '../../../img/noimage.png'
import filePickerService from '../../../shared/file-picker/file-picker.service'
const FeaturedPostsData = forwardRef((props, ref) => {
  const { addToast } = useToasts()
  const [error, seterror] = useState(null);
  const [Posts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openPostModel, setOpenPostModel] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postTags, setPostTags] = useState(null);
  const [openViewModal, setopenViewModal] = useState(false);
  const [viewId, setViewId] = useState(null)

  useEffect(() => {
    get()
  }, [openPostModel])

  useImperativeHandle(ref, () => ({

    callGet() {
      get()
    }

  }));

  const get = async () => {
    await HttpService.get(`posts/all-promotional-posts/${1}`).then((res) => {
      if (res) {
        setLoading(false);
        setFeaturedPosts(res.data);
      }
    }).catch((err) => {
      console.log('something weired happend', err);
    });
  }

  const ActivateFeaturePost = async (idvalue,IsDefault) => {
    if(IsDefault){
      await HttpService.get('posts/admin-all-promotional/remove-default/' + idvalue)
      .then(() => {
        addToast('Post is inactive now', {
          appearance: 'success',
        })
      })
      .catch((err) => {
        seterror(err)
      })
    }else{
      await HttpService.get('posts/admin-all-promotional/set-default/' + idvalue)
      .then(() => {
        addToast('post is successfully active', {
          appearance: 'success',
        })
      })
      .catch((err) => {
        seterror(err)
      })
    }
    get();

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
    await HttpService.delete("posts/admin-all-promotional/"+idvalue)
    .then(() => {
      get();
    })
    .catch((err) => {
      
    })
    get()
  }
  const ViewSinglePost = (event,idvalue) => {
    event.preventDefault();
    setopenViewModal(true);
    setViewId(idvalue);
  };
  
 
  return (

    Posts.length > 0 ? (
      <>
        {Posts.map((result) => {
          return (
            <tr key={result.Post.PostId} >
            {/* <td><p>{result.Post.PostTitle}</p>
            {formatDistance(new Date(result.Post.CreatedDate), new Date())}
            </td> */}
            <td className='title-width'>
              <div className='d-flex'>
               <div className='image-panel'>
               <img
                            className='card-img'
                            src={result.Post.PostAttachments[0] && result.Post.PostAttachments[0].FileType.split('/')[0] == 'image' ? filePickerService.getImageLink(
                              result.Post.PostAttachments[0].FileHandler
                            ) : NoImg}
                          />
               </div>
                <div className='ms-3'>
                  <p className='mb-4'>{result.Post.PostTitle}</p>
                  {formatDistance(
                    new Date(result.Post.CreatedDate),
                    new Date()
                  )}
                </div>
              </div>
            </td>
              <td  className='description-width'>{result.Post.PostContent}</td>
              <td>
             {result.Post.PostAttachments.map((attachment)=>{
              return ( <span>{attachment.FileName} </span>) 
              })}
              </td>
              <td>{result.Post.IsDefault?<span>Active</span>:<span>Inactive</span>}</td>
              <td>
                <button
                  className='d-grid btn btn-secondary'
                  
                  onClick={(e) =>
                    ViewSinglePost(e,result.Post.PostId)
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
                    onClick={() =>
                     ActivateFeaturePost(result.Post.PostId,result.Post.IsDefault)
                    }
                  >
                  {result.Post.IsDefault?<span>Inactive</span>:<span>Active</span>}
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
            onHide={() => {setOpenPostModel(false);
              get();
            }}
          />
          <SinglePost show={openViewModal} IsfeaturePost={true} selectedViewPostId={viewId} onHide={() =>{setopenViewModal(false);
          get();} }/>
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
})

export default FeaturedPostsData
