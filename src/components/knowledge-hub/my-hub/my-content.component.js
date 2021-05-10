import React, { useState } from 'react'
import AwsLogo from '../../../img/aws-logo.png'
const MyContent = () => {
  return (
    <>
      {/* <div className='card c-pointer'>
        <div className='card-body'>
          <p>My Content</p>
        </div>
      </div> */}
      <div className='card'>
        <div className='card-body'>
          <div className='row row-cols-1 row-cols-md-2 g-4'>
                      <div className="col">
                        <div className="card">
                          <div className="card-body">
                            <a type="button" className="card-link">
                              <i
                                className="fas fa-pen"
                                aria-hidden="true"
                               
                              ></i>
                            </a>
                            <div
                              className="row"
                            >
                              <div className="col-auto d-flex align-items-center">
                                <img src={AwsLogo} alt='' />
                                {/* <img
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
                                /> */}
                              </div>
                              <div className="col">
                                <h5 className="card-title mb-0">
                                  Getting to Know Markitech
                                </h5>
                                <p className="card-text mb-1">
                                  <small className="text-muted">
                                   January 13, 2020
                                  </small>
                                </p>
                                <tr>
                                  <td>
                                    <h5 className="card-title mb-0">Status:</h5>
                                  </td>

                                  {/* {post.Post.IsApproved ? ( */}
                                    <td>
                                      <div className="ms-3">
                                        <button className="btn btn-success btn-sm btn-rounded">
                                          Approved
                                        </button>
                                      </div>
                                    </td>
                                  {/* ) : post.Post.IsApproved == null ? (
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
                                  )} */}
                                </tr>

                                <p className="card-text">
                                  Loreum Get to know About you etc
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyContent
