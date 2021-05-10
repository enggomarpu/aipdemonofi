import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'

//import './SinglePost.scss'


const NotificationModal = (props) => {
  


  useEffect(() => {
    if (props.selectedViewPostId) {

    }
  }, [])
  

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
            <div className='col post-info d-flex align-self-center'>
              <div className='userprofile align-self-center'>
                
              </div>
              <h3 className='align-self-center mb-0 ms-3'>
                      {props.NotiTitle}
              </h3>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className='card singlePost'>
              <div className='card-header'>
                <div className='d-flex justify-content-between'>
                  <Modal.Title id='contained-modal-title-vcenter'>
                 
                  </Modal.Title>
                  <div className='col-auto align-self-center'>
                    
                  </div>
                </div>
              </div>

              <div className='card-body'>
                <ul className='custom-list'>
                  <li>
                    <div className='row'>
                      <div className='col-2'>{props.NotiContent}</div>
                      <div className='col'>
                       
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className='row'>
                      <div className='col-2'>{props.postCon}</div>
                      <div className='col'></div>
                    </div>
                  </li>
                </ul>
                <div>
                  </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
    </>
  )
}

export default NotificationModal
