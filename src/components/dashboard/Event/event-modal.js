import { Button, Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import httpService from '../../../shared/http.service'
import format from 'date-fns/format'
import { useToasts } from 'react-toast-notifications'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import dummyIMG from '../../../img/dummy-img.jpg'

const EventModal = (props) => {
    const { addToast } = useToasts()
    const apiRoute = 'events/'
    const [eventId, setEventId] = useState()
    const [event, setEvent] = useState()
    const [isUserSubcribed, setIsUserSubcribed] = useState(false)
    var userId = JSON.parse(localStorage.getItem('user-info')).userId

    useEffect(() => {
        if (props.eventId) {
            setEventId(props.eventId)
            get(props.eventId)
        }
    }, [props]);




    const get = async (eventId) => {
        await httpService
            .get(`${apiRoute}${eventId}`)
            .then((res) => {
                if (res && res.data) {
                    res.data.EventDate = new Date(res.data.EventDate)
                    setEvent(res.data)
                    let user = res.data.SubscribedUser.find(
                        (user) => user.UserId == userId
                    )
                    if (user) {
                        setIsUserSubcribed(true)
                    } else {
                        setIsUserSubcribed(false)
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const save = async () => {
        if (isUserSubcribed) {
            await httpService
                .get(`${apiRoute}un-subscribe/${eventId}`)
                .then((res) => {
                    if (res) {
                        addToast('Event Un-Subscribed Successfully', {
                            appearance: 'success',
                        })
                        props.onHide()
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            await httpService
                .get(`${apiRoute}subscribe/${eventId}`)
                .then((res) => {
                    if (res) {
                        addToast('Event Subscribed Successfully', {
                            appearance: 'success',
                        })
                        props.onHide()
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
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
                        <div className='col post-info d-flex align-self-center mb-3'>
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
                        {isUserSubcribed ? (
                            <Button className='btn-outline-primary btn-width' onClick={save}>
                                Un-Subscribe
                            </Button>
                        ) : (
                            <Button className='btn-width' onClick={save}>
                                Subscribe
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            )}
        </>
    )
}

export default EventModal
