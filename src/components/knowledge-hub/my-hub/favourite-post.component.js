import React, { useEffect, useState } from 'react'
import StarFill from '../../../img/star-fill.png'
import AwsLogo from '../../../img/aws-logo.png'
import httpService from '../../../shared/http.service'
import { formatDistance } from 'date-fns'
import SinglePost from '../../../shared/SinglePost/SinglePost'
import { useToasts } from 'react-toast-notifications'
import NoImg from '../../../img/noimage.png'
import filePickerService from '../../../shared/file-picker/file-picker.service'
const FavouritePosts = () => {

  const { addToast } = useToasts()
  const [favouritePosts, setFavouritePosts] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [viewId, setviewId] = useState();
  useEffect(() => {
    get()
  }, [openModal,viewId])

  const getTime = (date) => {
    return date.toLocaleTimeString('en-US')
  }

  const get = async () => {
    await httpService.get('post-favourite').then(async (response) => {
      setFavouritePosts(response.data)
    })
  }

  const FavouritePost = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await httpService
        .delete('post-favourite/' + id)
        .then(() => {
          addToast('Post removed from favourite Successfully', {
            appearance: 'success',
          })
          get();
        })
        .catch((err) => {
          console.log(err)
        })
  }

  const handleModelOpen = (event, idvalue) => {
    event.preventDefault();
    setOpenModal(true)
    setviewId(idvalue)
  };

  return (
    <>
      <div className='card c-pointer'>
        <div className='card-body'>
          <div className='row row-cols-1 row-cols-md-2 g-4'>
            {favouritePosts &&
              favouritePosts.map((post) => {
                return (
                  <>
                    {post && (
                      <div
                        className="col cursor-pointer"
                        onClick={(e) => handleModelOpen(e, post.Post.PostId)}
                      >
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-auto d-flex align-items-center">
                                <img
                                  src={StarFill}
                                  alt="..."
                                  onClick={(e) =>
                                    FavouritePost(e, post.Post.PostId)
                                  }
                                />
                              </div>

                              <div className="col-auto d-flex align-items-center">
                              
                                <img
                                  style={{ maxHeight :150,maxWidth:150, minWidth:150, minHeight:150 }}
                                  // src={AwsLogo}
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
      <SinglePost show={openModal} 
      selectedViewPostId={viewId} 
      onHide={() =>setOpenModal(false) }/>
    </>
  )
}

export default FavouritePosts
