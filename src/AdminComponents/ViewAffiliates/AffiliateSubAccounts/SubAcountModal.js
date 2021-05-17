import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import HttpService from "../../../shared/http.service";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import { useForm } from 'react-hook-form';
import {ErrorMessage} from '../../sharedError/error.messages';


export function Example(props) {

  const { addToast } = useToasts();

  const [userEmail, setUserEmail] = useState();
  const [affId, setAffId] = useState();
  const [userId, setUserId] = useState();
  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  let modalType = props.modalType;

  const { register, handleSubmit, errors, formState, reset, setValue } = useForm();
  //const APIURL = 'affiliate-projects';

  const modalLoaded = () => {
        
    let usrAffId = props.useraffid ? props.useraffid : 0;
    setAffId(usrAffId);

    let usrId = props.userID ? props.userID : 0
    setUserId(usrId); 


    if(modalType !== 1){
      setValue('Name', props.subname);
      setValue('LastName', props.sublastname);
      setValue('UserRoleId', `${props.userroleid}`);
      setValue('Email', props.subemail )
      // setValue('Name', props.subname);
      //setUserEmail(props.subemail);
    }
};

  const createSubAccount = (formData) => {
    const subAccountDetails = {
      AffiliateUserId: userId
    };
    
    let allFormData = {...formData, ...subAccountDetails}
    HttpService.post("user/create-sub-account", allFormData)
      .then((response) => {
        if (response) {
          props.onHide();
        }
        addToast("Sub-account Created Successfully", {
          appearance: "success",
        });
      })
      .catch(() => {});
    
  };
  const saveSubAccount = (formData) => {
   
    HttpService.put("user/profile", formData)
      .then((response) => {
        if (response) {
          props.onHide();
        }
        addToast("Sub-account Updated Successfully", {
          appearance: "success",
        });
      })
      .catch(() => {});
  };
  const deleteConfirmation = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSubAccount().then(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sub Account Deleted Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
        });
      }
    });
  };
  const deleteSubAccount = () => {
   return HttpService.delete(`user/admin-delete-sub-account/${affId}`)
      .then((response) => {
        if (response) {
          props.onHide();
        }
      })
      .catch(() => {
      });
    
  };
  const onSubmit = (formData) => {
    modalType === 1 && createSubAccount(formData);
    modalType !== 1 && saveSubAccount(formData); 
  }

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onEntered={modalLoaded}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {modalType === 1
            ? "Create"
            : modalType === 2 || modalType === 3
            ? "Update"
            : "Delete"}{" "}
          Sub Account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formBasicName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              name="Name"
              ref={register({ required: true })}
            />
          <ErrorMessage type={errors.Name && errors.Name.type} /> 
            
          </Form.Group>

          <Form.Group controlId="formBasicName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              name="LastName"
              ref={register({ required: true })}
            />
          <ErrorMessage type={errors.LastName && errors.LastName.type} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              readOnly = { modalType !== 1 }
              placeholder="Enter Email"
              //disabled = { modalType !== 1 }
              ref={register({ required: true, pattern: emailRegex })}
            />
          <ErrorMessage type={errors.Email && errors.Email.type} />
          </Form.Group>

          <Form.Check type="radio" id={`check-api`}>
                <Form.Check.Input type="radio" 
                 ref={register} value={2} name="UserRoleId"  />
                <Form.Check.Label>Admin <small>Has Full Access to portal and team members</small></Form.Check.Label>
            </Form.Check>

            <Form.Check type="radio" id={`check-apig`}>
                <Form.Check.Input type="radio" name="UserRoleId"
                 ref={register} value={3}  />
                <Form.Check.Label>User <small>Has limited access to portal but can view all information and make changes.</small></Form.Check.Label>
            </Form.Check> 
            <Modal.Footer>
        {modalType === 1 && (
          <Button type="submit">Create</Button>
        )}
        {(modalType === 2 || modalType === 3) && (
          <>
            <Button type="submit">Save Changes</Button>
            <Button onClick={deleteSubAccount}>Delete Account</Button>
          </>
        )}
        {modalType === 4 && (
          <Button onClick={deleteConfirmation}>Delete</Button>
        )}
      </Modal.Footer>
        </Form>
      </Modal.Body>
      
    </Modal>
  );
}
