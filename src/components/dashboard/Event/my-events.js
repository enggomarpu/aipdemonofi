import React from 'react'
import { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import { formatDistance } from 'date-fns'
import dummyIMG from '../../../img/dummy-img.jpg'
import filePickerService from '../../../shared/file-picker/file-picker.service'

const MyEvents = () => {
    const [Events, setEvents] = useState([]);

    useEffect(() => {
        get()
    }, [])

    const get = async () => {
        await HttpService.get('events/my-subscribed-events')
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

    return (
        <div className='upcoming-events'>
            {Events.map((result) => {
                return (
                    <>
                        <div className='card simple-card card-border d-flex justify-content-between'>
                            <div className='row'>
                                <div className='col-auto'>
                                    <img src={ result.Attachment ? 
                                  filePickerService.getSmallImage(result.Attachment.FileHandler) : dummyIMG} alt='' />
                                </div>
                                <div className='col'>
                                    <div className='card-body mb-2'>
                                        <div className='align-self-center'>
                                            <h3 className='card-title'>{result.EventType? result.EventType.EventTypeName: ''}</h3>
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
                            </div>
                        </div>
                    </>
                )
            })}
        </div>
    )
}

export default MyEvents
