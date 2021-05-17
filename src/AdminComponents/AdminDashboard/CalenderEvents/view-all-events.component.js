import React from 'react'
import { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import { formatDistance } from 'date-fns'
import PlusCircle from '../../../../src/img/plus-circle.png'
import EventFormModal from './event-form-modal.component'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import dummyIMG from '../../../img/dummy-img.jpg'
import Swal from 'sweetalert2'
import httpService from '../../../shared/http.service'
import { useToasts } from 'react-toast-notifications'

const AllEvents = (props) => {

  const { addToast } = useToasts()
  const apiRoute = 'events/'
  const [Events, setEvents] = useState([]);
    const [openModel, setOpenModel] = useState(false)
    const [eventId, setEventId] = useState(false)

    useEffect(() => {
        get()
    }, [openModel])

    const get = async () => {
        await HttpService.get('events')
            .then((res) => {
                if (res) {
                    setEvents(res.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getTime = (date) => {
        return date.toLocaleTimeString('en-US')
    }

    const onDelete = (eventId) => {
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
  
    const deleteRecord = (eventId) => {
      return httpService.delete(apiRoute + eventId)
        .then((response) => {
          if (response) {
            addToast('Event Deleted Successfully', {
              appearance: 'success',
            })
            get();
            props.refresh()
          }
        })
        .catch(() => {
          //add alert here!
          console.log('something weired happened')
        })
    }

    return (
        <div className='upcoming-events'>
            <div className='header-card d-flex justify-content-between'>
                <h5 className='card-title align-self-center'>
                    All Events
        </h5>
                <button type='button' className='btn p-1 ms-auto align-self-center' onClick={() => setOpenModel(true)}>
                    <img src={PlusCircle} alt='PlusCircle' />
                </button>
            </div>

            <EventFormModal
                show={openModel}
                eventId={eventId}
                onHide={() => { setOpenModel(false); props.refresh() }}
            />
            {Events.map((result) => {
                return (
                    <>
                        <div className='card simple-card card-border d-flex justify-content-between'>
                            <div className='row'>
                                <div className='col-auto'>
                                    <img src={
                                        result.Attachment ?
                                            filePickerService.getSmallImage(result.Attachment.FileHandler) : dummyIMG} alt='' />
                                </div>
                                <div className='col'>
                                    <div className='card-body mb-2'>
                                        <div className='align-self-center'>
                                            <h3 className='card-title'>{result.EventType ? result.EventType.EventTypeName : ''}</h3>
                                        </div>
                                        <p className='card-text mb-1'>
                                            {result.EventName + ' |'}
                                            {getTime(new Date(result.EventDate)).padStart(3, "0") + ' |'}

                                            {formatDistance(
                                                new Date(result.CreatedDate),
                                                new Date()
                                            )}
                                        </p>
                                        <p className='card-text mb-1'>
                                            {result.EventDescription}
                                        </p>
                                    </div>
                                </div>
                                <div className='col-auto'>

                                    <div className='align-self-center'>
                                        <button
                                            className='btn text-danger btn-sm'
                                            onClick={() => onDelete(result.EventId)}
                                        >
                                            <i className='fa fa-trash'></i>
                                        </button>
                                        <button
                                            className='btn text-primary btn-sm'
                                            onClick={() => {setOpenModel(true); setEventId(result.EventId)}}
                                        >
                                            <i className='fas fa-pen'></i>
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            })}
        </div>
    )
}

export default AllEvents
