import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HttpService from '../../../shared/http.service'
import Vector from '../../../../src/img/vector1.png'
import { formatDistance } from 'date-fns'
import PlusCircle from '../../../../src/img/plus-circle.png'
import EventFormModal from './event-form-modal.component'

const UpcomingEvents = () => {
  const [Events, setEvents] = useState([])
    const [openModel, setOpenModel] = useState(false);
    
    useEffect(() => {
    get()
  }, [])

  const get = async () => {
    await HttpService.get('events/up-comming-events')
      .then((res) => {
        if (res) {
          setEvents(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className='upcoming-events'>
      <div className='header-card d-flex justify-content-between'>
        <h5 className='card-title align-self-center'>
          Upcoming Events
        </h5>
        <button type='button' className='btn p-1 ms-auto align-self-center' onClick={() => setOpenModel(true)}>
          <img src={PlusCircle} alt='PlusCircle' />
        </button>
      </div>

      <EventFormModal
                show={openModel}
                onHide={() => setOpenModel(false)}
            />
      {Events.map((result) => {
        return (
          <>
            <div className='event-details'>
              <p>{formatDistance(new Date(result.EventDate), new Date())}</p>
              <strong>{result.EventName}</strong>
            </div>
          </>
        )
      })}
      <Link to='/admindashboard/admincalendar'>
        View All <img src={Vector} alt='Vector' />
      </Link>
    </div>
  )
}

export default UpcomingEvents
