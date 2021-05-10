import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HttpService from '../../../shared/http.service'
import Vector from '../../../../src/img/vector1.png'
import { formatDistance } from 'date-fns'

const UpcomingEvents = () => {
  const [Events, setEvents] = useState([])
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
      </div>

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
      <Link to='/dashboard/calendar'>
        View All <img src={Vector} alt='Vector' />
      </Link>
    </div>
  )
}

export default UpcomingEvents
