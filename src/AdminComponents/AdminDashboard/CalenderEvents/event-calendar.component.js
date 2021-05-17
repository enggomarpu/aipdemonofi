import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay'
import httpService from '../../../shared/http.service';
import EventModal from './event-modal.component';
import AllEvents from './view-all-events.component';


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

const EventAdminCalendar = (props) => {

    var eventsData = [];
    const [Events, setEvents] = useState([]);
    const [StartDate, setStartDate] = useState();
    const [openModel, setOpenModel] = useState(false)
    const [eventId, setEventId] = useState()

    useEffect(() => {
        get()
        props.setPageTitle();
    }, [openModel]);

    const get = async () => {
        await httpService.get('events')
            .then((res) => {
                if (res) {
                    res.data.map((eve) => {
                        eventsData.push({
                            id: eve.EventId,
                            start: new Date(eve.EventDate),
                            end: new Date(eve.EventEndDate),
                            title: (eve.EventName + ' ' + (eve.SubscribedUser && eve.SubscribedUser.length > 0 ? eve.SubscribedUser.length + ' Subscribed' : '')),
                        })
                    })
                    setEvents(eventsData)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (props.location.state) {
            let date = new Date(props.location.state.currentEvent.start);
            setStartDate(date);
        }
        else {
            setStartDate(new Date());
        }
    }, [props.location.state]);

    const handleSelect = (event) => {
        setEventId(event.id)
        setOpenModel(true);
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card simple-card">
                        <div className="card-body">
                            {Events && StartDate &&
                                <div className="card-body">
                                    <Calendar
                                        selectable
                                        defaultView={Views.WEEK}
                                        onView={() => { }}
                                        defaultDate={StartDate}
                                        localizer={localizer}
                                        events={Events}
                                        startAccessor="start"
                                        endAccessor="end"
                                        style={{ height: 500 }}
                                        onSelectEvent={(event) => {
                                            handleSelect(event)
                                        }}
                                    />
                                </div>}
                        </div>
                    </div>
                </div>
                <AllEvents
                    refresh={get}
                />

            </div>


            <EventModal
                show={openModel}
                eventId={eventId}
                onHide={() => setOpenModel(false)}
            />

        </>
    );
}

export default EventAdminCalendar;