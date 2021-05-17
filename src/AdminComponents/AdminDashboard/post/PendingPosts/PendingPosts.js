import React, { useState, useEffect } from 'react'
import HttpService from '../../../../shared/http.service'
import { useToasts } from 'react-toast-notifications'

const PendingPosts = (props) => {
  const [postPending, setPostPending] = useState([])
  const [isRefresh, setIsRefresh] = useState(false)
  const { addToast } = useToasts()

  useEffect(() => {
    get()
    props.setPageTitle();
  }, [isRefresh])

  const get = async () => {
    await HttpService.get('posts')
      .then((res) => {
        setPostPending(res.data)
      })
      .catch((err) => {
        console.error('Api Call Error', err)
      })
  }

  const approvePost = (postId) => {
    HttpService.get(`posts/ApproveRejectPost/${postId}`)
      .then((response) => {
        addToast('Post Approved', { appearance: 'success' })
        setIsRefresh(!isRefresh)
      })
      .catch(() => { })
  }

  const rejectPost = (postId) => {
    HttpService.delete(`posts/${postId}`)
      .then((response) => {
        addToast('Post Rejected', { appearance: 'error' })
        setIsRefresh(!isRefresh)
      })
      .catch(() => { })
  }

  return (
    <>
      
          <div className='row'>
            <div className='col-md-12'>
              {postPending &&
                postPending.map((result) => {
                  return (
                    <>
                      {!result.IsApproved && (
                        <div className='card simple-card'>
                          <div className='row'>
                            <div className='col-md-3'>
                              <img
                                className='card-img'
                                src='/static/media/card-img.00ca387e.png'
                                alt='...'
                              />
                            </div>
                            <div className='col-md-9'>
                              <div className='card-body'>
                                <div className='d-flex'>
                                  <div className='align-self-center'>
                                    <h3 className='card-title'>{result.PostTitle}</h3>
                                    <h5 className='card-subtitle'>
                                    </h5>
                                  </div>
                                </div>
                                <p className='card-text'>{result.PostContent}</p>
                                <div className='checkbox-group'>

                                  {result.PostTags && result.PostTags.map((tag) => {
                                    return (
                                      <label className='btn btn-primary'>
                                        {tag.TagName}
                                      </label>
                                    )

                                  })}
                                </div>

                              </div>
                              <div className='card-footer d-flex justify-content-between'>
                                <div className='align-self-center'>
                                  <button
                                    className='btn btn-primary btn-width'
                                    onClick={() => approvePost(result.PostId)}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className='btn btn-primary btn-width'
                                    onClick={() => rejectPost(result.PostId)}
                                  >
                                    Reject
                                  </button>
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
    </>
  )
}

export default PendingPosts
