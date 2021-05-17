import { Modal,Button} from 'react-bootstrap'
import React,{useState} from 'react'
import UserImg from '../../img/user-img.png'
import UserImg2 from '../../img/user-2.png'
import './SinglePost.scss'

const SinglePost = (props) => {
  const modalLoaded = () => {}
  return (
    <>
      <Modal
        {...props}
        size='xl'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        onEntered={modalLoaded}
      >
        <Modal.Header closeButton className='border-0 pb-0'>
        <Modal.Title id='contained-modal-title-vcenter'>
        </Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <div className='card singlePost'>
            <div className='card-header'>
              <div className='row'>
                <div className='col post-info d-flex align-self-center'>
                  <div className='userprofile align-self-center'>
                    <img src={UserImg} alt='' />
                  </div>
                  <h3 className='align-self-center'>Meditek</h3>
                </div>
                <div className='col-auto align-self-center'>
                  <button className='btn text-danger p-0'>
                    <i className='fas fa-trash-alt'></i>
                  </button>
                  <button className='btn p-0'>
                    <i className='fas fa-pencil-alt'></i>
                  </button>
                </div>
              </div>
            </div>

            <div className='card-body'>
              <ul className='custom-list'>
                <li>
                  <div className='row'>
                    <div className='col-2'>Date and Time</div>
                    <div className='col'>January 21, 2021 1-2PM EST</div>
                  </div>
                </li>
                <li>
                  <div className='row'>
                    <div className='col-2'>Description</div>
                    <div className='col'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Scelerisque adipiscing lectus tellus sem porttitor nec
                      vitae, eu nisl. Sed fringilla dolor faucibus placerat et
                      lorem platea. Convallis quisque consequat tempus amet,
                      venenatis. Tortor, tincidunt enim, sed orci.
                    </div>
                  </div>
                </li>
              </ul>

              <div className='post-body' id='accordionExample'>
                <div
                  className='post-controls d-flex justify-content-between'
                  id='headingOne'
                >
                  <button
                    className='btn accordion-button'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseOne'
                    aria-expanded='true'
                    aria-controls='collapseOne'
                  >
                    <i className='far fa-comment-alt'></i> View comments (10)
                  </button>
                  <button className='btn'>
                    <i className='far fa-eye'></i> 101 Seen by
                  </button>
                  <button className='btn'>
                    <i className='far fa-star'></i> 101 Favorites
                  </button>
                  <button className='btn'>
                    <i className='fas fa-share-alt'></i>101 Share
                  </button>
                  <button className='btn'>
                    <i className='far fa-thumbs-up'></i> 101 Likes
                  </button>
                </div>
                <div
                  className='post-details show'
                  id='collapseOne'
                  aria-labelledby='headingOne'
                  data-bs-parent='#accordionExample'
                >
                  <div className='comments-panel'>
                    <div className='date-time'>
                      <label>march 25, 2020</label>
                    </div>
                    <div className='comments'>
                      <div className='user-profile'>
                        <img src={UserImg2} alt='' />
                      </div>
                      <div className='user-details'>
                        <h3>Diane Flores</h3>
                        <p>
                          Really looking forward to this webinar, lorem ipsum
                          dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='comments-panel'>
                    <div className='date-time'>
                      <label>march 25, 2020</label>
                    </div>
                    <div className='comments'>
                      <div className='user-profile'>
                        <img src={UserImg2} alt='' />
                      </div>
                      <div className='user-details'>
                        <h3>Diane Flores</h3>
                        <p>
                          Really looking forward to this webinar, lorem ipsum
                          dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='comments-panel'>
                    <div className='date-time'>
                      <label>march 25, 2020</label>
                    </div>
                    <div className='comments'>
                      <div className='user-profile'>
                        <img src={UserImg2} alt='' />
                      </div>
                      <div className='user-details'>
                        <h3>Diane Flores</h3>
                        <p>
                          Really looking forward to this webinar, lorem ipsum
                          dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='comments-panel'>
                    <div className='date-time'>
                      <label>march 25, 2020</label>
                    </div>
                    <div className='comments'>
                      <div className='user-profile'>
                        <img src={UserImg2} alt='' />
                      </div>
                      <div className='user-details'>
                        <h3>Diane Flores</h3>
                        <p>
                          Really looking forward to this webinar, lorem ipsum
                          dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ul className='custom-list'>
                <li>
                  <div className='row'>
                    <div className='col-2'>Status</div>
                    <div className='col'>
                      <button className='btn btn-danger btn-sm btn-rounded'>
                        Rejected
                      </button>
                      <button className='btn btn-warning btn-sm btn-rounded'>
                        Rejected
                      </button>
                      <button className='btn btn-success btn-sm btn-rounded'>
                        Rejected
                      </button>
                    </div>
                  </div>
                </li>
                <li>
                  <div className='row'>
                    <div className='col-2'>Comment from admin</div>
                    <div className='col'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Scelerisque adipiscing lectus tellus sem porttitor nec
                      vitae, eu nisl. Sed fringilla dolor fa
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SinglePost
