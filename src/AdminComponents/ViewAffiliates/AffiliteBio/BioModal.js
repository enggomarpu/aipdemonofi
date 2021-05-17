import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Modal, Button, Form } from "react-bootstrap";
import HttpService from "../../../shared/http.service";

const BioModel = (props) => {
  const { addToast } = useToasts();
  const [userBio, setUserBio] = useState();
  const modalLoaded = () => {
    setUserBio(props.bioValue);
  };

  const handleBio = (e) => {
    const { value } = e.target;
    setUserBio(value);
  };
  const saveBio = async () => {

    const userBioObject = {
      Bio: userBio,
      userID: props.UserID,
      Email: props.email,
    };


    await HttpService.put(`user/profile`, userBioObject)
      .then((response) => {
        if (response) {
          props.onHide();
        }
        addToast("Bio Updated Successfully", {
          appearance: "success",
        
        });
      })
      .catch(() => {
        console.log("something weired happened");
      });
    //window.location.reload();
  };
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      onEntered={modalLoaded}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit Bio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="dob">
            <Form.Control
              as="textarea"
              name="bio"
              placeholder="Enter Bio"
              onChange={handleBio}
              value={userBio}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={saveBio}>Save Changes</Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default BioModel;
