import React, {Fragment, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import HttpService from "../../../shared/http.service";
import { useToasts } from "react-toast-notifications";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";

const SubAccountModal = (props) => {
  const { addToast } = useToasts();

  const [affId, setAffId] = useState();
  const [userId, setUserId] = useState();
  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  let modalType = props.modalType;

  const { register, handleSubmit, errors, setValue } = useForm();
  const modalLoaded = () => {
    let usrAffId = props.useraffid ? props.useraffid : 0;
    setAffId(usrAffId);

    let usrId = props.userID ? props.userID : 0;
    setUserId(usrId);

    if (modalType !== 1) {
      setValue("Name", props.subname);
      setValue("LastName", props.sublastname);
      setValue("UserRoleId", `${props.userroleid}`);
      setValue("Email", props.subemail);
    }
  };

  const createSubAccount = (formData) => {
    const subAccountDetails = {
      AffiliateUserId: userId,
    };

    let allFormData = { ...formData, ...subAccountDetails };
    HttpService.post("user/admin-create-affiliate-sub-account", allFormData)
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
  // const deleteConfirmation = () => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       deleteSubAccount().then(() => {
  //         Swal.fire({
  //           position: "center",
  //           icon: "success",
  //           title: "Sub Account Deleted Successfully",
  //           showConfirmButton: false,
  //           timer: 2000,
  //         });
  //       });
  //     }
  //   });
  // };
  const deleteSubAccount = () => {
    return HttpService.delete(`user/admin-delete-sub-account/${affId}`)
      .then((response) => {
        if (response) {
          props.onHide();
        }
      })
      .catch(() => {});
  };
  const onSubmit = (formData) => {
    modalType === 1 && createSubAccount(formData);
    modalType !== 1 && saveSubAccount(formData);
  };

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
      {modalType !== 4 && (
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
                readOnly={modalType !== 1}
                placeholder="Enter Email"
                //disabled = { modalType !== 1 }
                ref={register({ required: true, pattern: emailRegex })}
              />
              <ErrorMessage type={errors.Email && errors.Email.type} />
            </Form.Group>

            <Form.Check type="radio" id={`check-api`}>
              <Form.Check.Input
                type="radio"
                value={2}
                name="UserRoleId"
                ref={register({ required: true })}
              />
              <Form.Check.Label>
                Admin{" "}
                <small>Has full access to portal and team information</small>
              </Form.Check.Label>
            </Form.Check>

            <Form.Check type="radio" id={`check-apig`}>
              <Form.Check.Input
                type="radio"
                name="UserRoleId"
                ref={register({ required: true })}
                value={3}
              />
              <Form.Check.Label>
                User{" "}
                <small>
                  Has limited access to portal but can view all information and
                  make changes.
                </small>
              </Form.Check.Label>
            </Form.Check>
            <ErrorMessage type={errors.UserRoleId && errors.UserRoleId.type} />
            <Modal.Footer>
              {modalType === 1 && (
                <>
                  <Button onClick={() => props.onHide()}>Cancel</Button>{" "}
                  <Button type="submit">Create</Button>
                </>
              )}
              {modalType === 2 && <Button type="submit">Save Changes</Button>}
              {modalType === 3 && (
                <>
                  {" "}
                  <Button onClick={deleteSubAccount} variant="danger">
                    Delete
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </>
              )}
            </Modal.Footer>
          </Form>
        </Modal.Body>
      )}
      {modalType === 4 && (
        <Fragment>
          <Modal.Body>
            <Form.Label>
              Are you sure want to delete this record? you will not be able to
              retrieve it later.
            </Form.Label>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={deleteSubAccount} variant="danger">
              Delete
            </Button>
            <Button onClick={() => props.onHide()}>Cancel</Button>
          </Modal.Footer>
        </Fragment>
      )}
    </Modal>
  );
};
export default SubAccountModal;
