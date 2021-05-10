import React, { useRef, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import httpService from '../../shared/http.service'
import { useToasts } from "react-toast-notifications";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '../sharedError/error.messages';

const ChangePasswordComponent = (props) => {

  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const { register, errors, handleSubmit, watch } = useForm();
  const NewPassword = useRef({});
  NewPassword.current = watch("NewPassword", "");

  const modalLoaded = () => {
  }

  const savePassword = async data => {
    setLoading(true);
    httpService
      .post('user/change-password', data)
      .then((response) => {
        if (response !== undefined) {
          setErrorMessage('')
          console.log('Password changed successfuly')
          props.onHide()
          setLoading(false)
        }
        addToast("password Changed Successfully", {
          appearance: "success",
        });
      })
      .catch((err) => {
        setLoading(false)
        setErrorMessage(err.response.data.message)
      })
  }

  return (
    <Modal
      {...props}
      size='md'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      onEntered={modalLoaded}
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          Change Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={e => e.preventDefault()}>
          <div className='form-group'>
            <label>Old Password</label>
            <input type='password'
              className='form-control' name="OldPassword" placeholder="Old Password" ref={register({ required: true })} />
            <ErrorMessage type={errors.OldPassword && errors.OldPassword.type} />
          </div>
          <div className='form-group'>
            <label>New Password</label>
            <input type='password'
              className='form-control' name="NewPassword" placeholder="New Password" ref={register({ required: true })} />
            <ErrorMessage type={errors.NewPassword && errors.NewPassword.type} />
          </div>
          <div className='form-group'>
            <label>Confirm Password</label>
            <input type='password'
              className='form-control' name="ConfirmPassword" placeholder="Confirm Password"
              ref={register({ required: true, validate: value => value === NewPassword.current })} />
            <ErrorMessage type={errors.ConfirmPassword && errors.ConfirmPassword.type} validationType="confirmPassword" />
          </div>
          {errorMessage &&
            <div className='errorMessage alert alert-danger'>
              {errorMessage}
            </div>}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" type="submit" onClick={handleSubmit(savePassword)}>
          {' '}
          {loading && (
            <span className='spinner-border spinner-border-sm'></span>
          )}{' '}
          Save Changes
        </button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ChangePasswordComponent
