import React, { useState } from 'react';
import { Modal, Button, Form, } from 'react-bootstrap';
import HttpService from '../../../shared/http.service';
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";
import Datepicker from "react-datepicker";
import { format } from 'date-fns';
import ReactSelect from 'react-select'
import EventTypeModal from './event-type-modal.component'
import PlusCircle from '../../../img/plus-circle.png'
import ImagePicker from '../../../shared/image-picker/image-picker.component'
import "react-datepicker/dist/react-datepicker.css";

const EventFormModal = (props) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  const startvalidate="Start date should equal and greater than todays date";
  const endvalidate=" End date should equal and greater than start date";
  const apiRoute = 'events/'
  const { addToast } = useToasts()
  const [eventId, setEventId] = useState(props.eventId)
  const [options, setOptions] = useState([]);
  const [openModal, setOpenModal] = useState(false)
  const [EventType, setEventType] = useState()
  const { register, handleSubmit, errors, reset, control, setValue } = useForm()
  const [imagesUploaded, setImagesUploaded] = useState()

  const get = async (eventId) => {
    await HttpService.get(`${apiRoute}${eventId}`)
      .then((res) => {
        if (res && res.data) {
          res.data.EventType = {
            value: res.data.EventType.EventTypeId,
            label: res.data.EventType.EventTypeName
          };
          reset(res.data);
          setValue('EventDate', format(new Date(res.data.EventDate), 'yyyy-MM-dd'));
          setValue('EventTime', format(new Date(res.data.EventDate), 'HH:mm'));
          setValue('EventEndDate', format(new Date(res.data.EventEndDate), 'yyyy-MM-dd'));
          setValue('EventEndTime', format(new Date(res.data.EventEndDate), 'HH:mm'));
          setEventType(res.data.EventType);
          setImagesUploaded(res.data.Attachment)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const errorMessage = error => {
    return <div><span>{error}</span></div>;
  };
  const onSubmit = (data) => {
    data.EventTypeId = data.EventType.value;
    data.EventDate = new Date(data.EventDate.concat(" ", data.EventTime))
    data.EventEndDate = new Date(data.EventEndDate.concat(" ", data.EventEndTime))
    data.EventAttachment = imagesUploaded;
    eventId && eventId > 0 ? onEdit(data) : onAdd(data)
  }

  const onAdd = (data) => {
    HttpService.post(apiRoute, data)
      .then((response) => {
        if (response) {
          addToast('Event Created Successfully', {
            appearance: 'success',
          })
          props.onHide()
        }
      })
      .catch(() => {
        console.log('error')
      })
  }

  const onEdit = (data) => {
    HttpService.put(`${apiRoute}${eventId}`, data)
      .then((response) => {
        reset(response.data)
        if (response) {
          addToast('Event Updated Successfully', {
            appearance: 'success',
          })
          props.onHide(); 
          reset(); 
          setEventType()
        }
      })
      .catch(() => { })
  }

  const getLookup = async () => {
    await HttpService.get('event-type')
      .then((res) => {
        if (res) {
          let data = res.data.map((item) => {
            return {
              value: item.EventTypeId,
              label: item.EventTypeName,
            }
          })
          setOptions(data);
          if (props.eventId && props.eventId > 0) {
            get(props.eventId);
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onModalClose = (EventTypeAdded) => {
    setOpenModal(false)
    if (EventTypeAdded) {
      getLookup()
    }
  }

  const afterUploaded = (filedata) => {
    setImagesUploaded(filedata)
  }

  return (
    <>
      <Modal
        {...props}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        onShow={() => {
          if (props.eventId && props.eventId > 0) {
            setEventId(props.eventId)
          }
          getLookup()
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            {eventId && eventId > 0 ? 'Update' : 'Create'} Event
        </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className='row justify-content-center'>
              <div className='col-md-8 col-12'>

                <ImagePicker
                  data={imagesUploaded}
                  afterUpload={afterUploaded}
                  option={{ accept: 'image/*' }}
                  label='Add a Photo'
                />
                <div className='row'>
                  <div className="col-6">
                    <div className='form-group'>
                      <label>Event Start Date</label>
                      <input
                      id='startDate'
                        type='date'
                        className='form-control'
                        name='EventDate'
                        ref={register({ required: true,
                          validate: value =>  new Date(value).getDate() >= new Date().getDate() })}
                      />
                      {errors.EventDate &&
                        errors.EventDate.type === "validate" &&
                        errorMessage(startvalidate)}
                      <ErrorMessage type={errors.EventDate && errors.EventDate.type} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className='form-group'>
                      <label>Event Start Time</label>
                      <input
                        type='time'
                        className='form-control'
                        name='EventTime'
                        ref={register({ required: true
                        })}
                      />
                      <ErrorMessage type={errors.EventTime && errors.EventTime.type} />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className='form-group'>
                      <label>Event End Date</label>
                      <input
                        type='date'
                        className='form-control'
                        name='EventEndDate'
                        ref={register({ required: true,
                        validate: value => (new Date(value) >= new Date(document.getElementById("startDate").value) ) })}
                      />
                      {errors.EventEndDate &&
                        errors.EventEndDate.type === "validate" &&
                        errorMessage(endvalidate)}
                      <ErrorMessage type={errors.EventEndDate && errors.EventEndDate.type} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className='form-group'>
                      <label>Event End Time</label>
                      <input
                        type='time'
                        className='form-control'
                        name='EventEndTime'
                        ref={register({ required: true })}
                      />
                      <ErrorMessage type={errors.EventEndTime && errors.EventEndTime.type} />
                    </div>
                  </div>
                </div>

                 <div className='form-group' controlId='EventType'>
                  <div className='justify-content-between d-flex mb-2'>
                    <label className='mb-0 align-self-center'>Event Type</label>
                    <button type='button' className='btn p-0' onClick={() => setOpenModal(true)}>
                      <img src={PlusCircle} alt='PlusCircle' />
                    </button>
                  </div>
                  <Controller
                  as={ReactSelect}
                  options={options}
                  name="EventType"
                  isClearable
                  control={control}
                  ref={register("EventType", { required: true })}
                  />
                  <ErrorMessage type={errors.EventType && errors.EventType.type} />

                </div>

                <div className='form-group'>
                  <label> Event Name </label>
                  <input
                    type='text'
                    className='form-control'
                    name='EventName'
                    ref={register({ required: true })}
                  />
                  <ErrorMessage type={errors.EventName && errors.EventName.type} />
                </div>

                <div className='form-group'>
                  <label>Event Description</label>
                  <input
                    type='text'
                    className='form-control'
                    name='EventDescription'
                    ref={register({ required: true })}
                  />
                  <ErrorMessage
                    type={errors.EventDescription && errors.EventDescription.type}
                  />
                </div>

                <div className='form-group'>
                  <label>Event Registration Link</label>
                  <input
                    type='text'
                    className='form-control'
                    name='EventRegistrationLink'
                    ref={register({ required: true, pattern: urlRegex })}
                  />
                   <ErrorMessage
                    type={errors.EventRegistrationLink && errors.EventRegistrationLink.type}
                    patternType={"url"}
                  />
                </div>

                <div className='form-group'>
                  <label>Online Event Link</label>
                  <input
                    type='text'
                    className='form-control'
                    name='EventURL'
                    ref={register({ required: true, pattern: urlRegex  })}
                  />
                   <ErrorMessage
                    type={errors.EventURL && errors.EventURL.type}
                    patternType={"url"}
                  />
                </div>

              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {eventId && eventId > 0 ? (
              <>
                <Button type='submit'>Save Changes</Button>
                <Button type='button' onClick={() => {props.onHide(); reset(); setEventType()}}>
                  Cancel
              </Button>
              </>
            ) : (
              <Button type='submit'>Create</Button>
            )}
          </Modal.Footer>
        </form>
      </Modal>


      <EventTypeModal
        show={openModal}
        onHide={onModalClose}
      />
    </>
  )
}
export default EventFormModal;