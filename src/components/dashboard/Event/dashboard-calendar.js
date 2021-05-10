import React, { useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './eventCalender.scss'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import HttpService from '../../../shared/http.service'
import getDay from 'date-fns/getDay'
import { useHistory } from 'react-router-dom'

const locales = {
  'en-US': require('date-fns/locale/en-US'),
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const DashboardCalendar = () => {
  var eventsData = []

  const [Events, setEvents] = useState([])
  const history = useHistory()

  useEffect(() => {
    get()
  }, [])

  const handleSelect = (event) => {
    history.push({
      pathname: '/dashboard/calendar',
      state: { currentEvent: event },
    })
  }

  const get = async () => {
    await HttpService.get('events')
      .then((res) => {
        if (res) {
          res.data.map((eve) => {
            eventsData.push({
              start: new Date(eve.EventDate),
              end: new Date(eve.EventEndDate),
              title: '.',
            })
          })
          setEvents(eventsData)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className=''>
      <div className='card-header bg-white border-0 d-flex justify-content-between'></div>
      {Events && (
        <div className='card-body'>
          <Calendar
            className='custom-calendar'
            selectable
            defaultView={Views.MONTH}
            onView={() => {}}
            localizer={localizer}
            events={Events}
            startAccessor='start'
            endAccessor='end'
            style={{ height: 500 }}
            onSelectEvent={(event) => {
              handleSelect(event)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default DashboardCalendar
