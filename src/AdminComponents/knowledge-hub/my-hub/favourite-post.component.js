import React, { useEffect, useState } from 'react'
import StarFill from '../../../img/star-fill.png'
import AwsLogo from '../../../img/aws-logo.png'
import httpService from '../../../shared/http.service'
import { formatDistance } from 'date-fns'
import SinglePost from '../../../shared/SinglePost/SinglePost'

const FavouritePosts = () => {
  const [favouritePosts, setFavouritePosts] = useState([])
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    get()
  }, [])

  const getTime = (date) => {
    return date.toLocaleTimeString('en-US')
  }

  const get = async () => {
    await httpService.get('post-favourite').then(async (response) => {
      setFavouritePosts(response.data)
    })
  }

  return (
    <>
      <div className='card c-pointer' >
        <div className='card-body'>
          <div className='row row-cols-1 row-cols-md-2 g-4'>
            {favouritePosts &&
              favouritePosts.map((post) => {
                return (
                  <>
                    {post.Post && (
                      <div className='col cursor-pointer'>
                        <div className='card'>
                          <div className='card-body'>
                            <div className='row'>
                              <div className='col-auto d-flex align-items-center'>
                                <img src={StarFill} alt='...' />
                              </div>

                              <div className='col-auto d-flex align-items-center' onClick={() => setOpenModal(true)}>
                                <img src={AwsLogo} alt='' />
                              </div>

                              <div className='col'>
                                <h5 className='card-title mb-0'>
                                  {post.Post.PostTitle}
                                </h5>
                                <p className='card-text mb-1'>
                                  <small className='text-muted'>
                                    {getTime(
                                      new Date(post.Post.CreatedDate)
                                    ).padStart(3, '0')}{' '}
                                    |{' '}
                                    {formatDistance(
                                      new Date(post.Post.CreatedDate),
                                      new Date()
                                    )}
                                  </small>
                                </p>
                                <p className='card-text'>
                                  {post.Post.PostContent}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )
              })}
          </div>
        </div>
      </div>
      <SinglePost  show={openModal}
      onHide={() => setOpenModal(false)} />
    </>
  )
}

export default FavouritePosts
