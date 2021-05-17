import { Button, Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import httpService from '../../../shared/http.service'
import format from 'date-fns/format'
import { useToasts } from 'react-toast-notifications'
import Swal from 'sweetalert2'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import dummyIMG from '../../../img/dummy-img.jpg'
import EventFormModal from './event-form-modal.component'

const EventModal = (props) => {
  const { addToast } = useToasts()
  const apiRoute = 'events/'
  const [eventId, setEventId] = useState()
  const [event, setEvent] = useState()
  const [openModel, setOpenModel] = useState(false)

  useEffect(() => {
    if (props.eventId) {
      setEventId(props.eventId)
      get(props.eventId)
    }
  }, [props, openModel]);


  const onDelete = () => {
    if (eventId) {
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
          deleteRecord(eventId)
        }
      })
    }
  }

  const deleteRecord = () => {
    return httpService.delete(apiRoute + eventId)
      .then((response) => {
        if (response) {
          addToast('Event Deleted Successfully', {
            appearance: 'success',
          })
          props.onHide()
        }
      })
      .catch(() => {
        //add alert here!
        console.log('something weired happened')
      })
  }

  const get = async (eventId) => {
    await httpService
      .get(`${apiRoute}${eventId}`)
      .then((res) => {
        if (res && res.data) {
          res.data.EventDate = new Date(res.data.EventDate)
          setEvent(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      {event && (
        <Modal
          {...props}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >

          <Modal.Body>
            <div className='col post-info d-flex align-self-center mb-3 justify-content-between'>
              <div className='d-flex'>
                <div className='userprofile align-self-center '>
                  <img src={
                    event.Attachment ?
                      filePickerService.getSmallImage(event.Attachment.FileHandler) : dummyIMG} />
                </div>
                <h3 className='align-self-center mb-0 ms-3'>
                  {event.EventType
                    ? event.EventType.EventTypeName
                    : ''}
                  <small className='ml-3'>
                    {event.SubscribedUser && event.SubscribedUser.length > 0
                      ? ' ' + event.SubscribedUser.length + ' ' + 'Subscribed'
                      : ''}
                  </small>
                </h3>
              </div>
              <div className='align-self-center'>
                <button
                  className='btn text-danger btn-sm'
                  onClick={onDelete}
                >
                  <i className='fa fa-trash'></i>
                </button>
                <button
                  className='btn text-primary btn-sm'
                  onClick={() => setOpenModel(true)}
                >
                  <i className='fas fa-pen'></i>
                </button>

              </div>
            </div>
            <ul className='custom-list'>
              <li>
                <div className='row'>
                  <div className='col-3'>Date and Time:</div>
                  <div className='col'>
                    {format(new Date(event.EventDate), 'PPPppp')}
                  </div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div className='col-3'>Description:</div>
                  <div className='col'>{event.EventDescription}</div>
                </div>
              </li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className='btn-outline-primary btn-width'
              onClick={props.onHide}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <EventFormModal
        show={openModel}
        eventId={eventId}
        onHide={() => setOpenModel(false)}
      />
    </>
  )
}

export default EventModal
