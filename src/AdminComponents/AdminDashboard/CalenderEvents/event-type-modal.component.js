import React, { useState } from 'react';
import { Modal, Button, Form, } from 'react-bootstrap';
import { useToasts } from "react-toast-notifications";
import httpService from '../../../shared/http.service';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '../../sharedError/error.messages';

const EventTypeModal = (props) => {

    const { addToast } = useToasts();
    const { register, handleSubmit, errors } = useForm()

    const saveEventType = async data => {
        await httpService.post('event-type', data).then((response) => {
            if (response) {
                addToast("EventType Created Successfully", {
                    appearance: "success",
                });
                props.onHide(true)
            }
        }).catch(() => {
        })
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create EventType
          </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit(saveEventType)}>
                <Modal.Body>
                    <Form.Group controlId="EventTypeName">
                        <Form.Control as="textarea" name="EventTypeName" placeholder="Enter Event Type Name"
                            ref={register({ required: true })}
                        />
                        <ErrorMessage type={errors.EventTypeName && errors.EventTypeName.type} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Create</Button>
                </Modal.Footer>
            </form>

        </Modal>
    );
}

export default EventTypeModal;