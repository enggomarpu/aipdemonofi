import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import ShareIcon from '../../img/share-icon.png'
import SaveIcon from '../../img/save.png'
import Icon from '../../img/icon.png'
import Download from '../../img/download.png'

const CollaborationRequestModel = (props) => {
  const modalLoaded = async () => {
    // getLookup()
  }

  return (
    <>
      <Modal
        {...props}
        size='xl'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        onEntered={modalLoaded}
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className='modal-1 d-none'>
            <div className='row mb-3'>
              <div className='col'>
                <h1>
                  <img src={Icon} alt='' className='rounded-circle' /> Tinted
                  Labs
                </h1>
              </div>
              <div className='col-auto align-self-center'>
                <a className='link'>
                  <img src={SaveIcon} alt='' />
                  Save post
                </a>
                <a className='link ms-3'>
                  <img src={ShareIcon} alt='' />
                  Share post
                </a>
              </div>
            </div>

            <div className='checkbox-group mb-3'>
              <label className='btn btn-primary'>UI Design</label>
              <label className='btn btn-primary'>Development</label>
              <label className='btn btn-primary'>UI Design</label>
              <label className='btn btn-primary'>Development</label>
            </div>

            <div className='custom-list'>
              <div className='row mb-3'>
                <div className='col-2'>
                  <b>Project Name</b>
                </div>
                <div className='col-9'>Website Redesign</div>
              </div>

              <div className='row mb-3'>
                <div className='col-2'>
                  <b>Project Timeline</b>
                </div>
                <div className='col-9'>January 16 - March 18, 2021</div>
              </div>

              <div className='row mb-3'>
                <div className='col-2'>
                  <b>Related Industry</b>
                </div>
                <div className='col-9'>Healthcare</div>
              </div>

              <div className='row mb-3'>
                <div className='col-2'>
                  <b>Project Details</b>
                </div>
                <div className='col-9'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Scelerisque adipiscing lectus tellus sem porttitor nec vitae,
                  eu nisl. Sed fringilla dolor faucibus placerat et lorem
                  platea. Convallis quisque consequat tempus amet, venenatis.
                  Tortor, tincidunt enim, sed orci.
                </div>
              </div>

              <div className='row mb-3'>
                <div className='col-2'>
                  <b>Priority Level</b>
                </div>
                <div className='col-9'>
                  <span className='text-danger'>High</span>
                </div>
              </div>

              <div className='row'>
                <div className='col-2'>
                  <b>Project Files</b>
                </div>
                <div className='col-9'>
                  projectscope.zip
                  <a className='link ms-3'>
                    <img src={Download} alt='' />
                    Download File
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h1>Request to Collaborate</h1>
            <p>
              Send a message to the affiliate to let them know you’re interested
              and would like to hear more about the project!
            </p>
            <div className='form-group'>
              <textarea
                name=''
                id=''
                cols='30'
                rows='8'
                className='form-control mb-0'
              >
                Hi there, Came across your collaboration post and would love to
                get some more details about the project! Would you be available
                for a quick call to discuss further? Thanks, Mike
              </textarea>
              <div className='d-block'>
                <input className='form-control' type='file' id='formFile' />
              </div>
            </div>
            <div className='form-group button-linline-list'>
              <button
                type='button'
                className='btn btn-outline-dark mb-2 pdf-btn'
              >
                documentname.pdf
                <i className='fas fa-times' aria-hidden='true'></i>
              </button>
              <button
                type='button'
                className='btn btn-outline-dark mb-2 jpg-btn'
              >
                documentname.jpg
                <i className='fas fa-times' aria-hidden='true'></i>
              </button>
              <button
                type='button'
                className='btn btn-outline-dark mb-2 doc-btn'
              >
                documentname.doc
                <i className='fas fa-times' aria-hidden='true'></i>
              </button>
              <button
                type='button'
                className='btn btn-outline-dark mb-2 ppt-btn'
              >
                documentname.ppt
                <i className='fas fa-times' aria-hidden='true'></i>
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <label className='mb-0'>Step 1 of 2</label>
          <div className='footer-button'>
            <Button>Cancel</Button>
            <Button type='submit'>Next</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default CollaborationRequestModel
