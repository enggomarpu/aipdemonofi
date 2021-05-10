import React, {useState} from 'react';
import { Modal, Button, Form,} from 'react-bootstrap';
import HttpService from '../../../shared/http.service';
import { useToasts } from "react-toast-notifications";

const BioModel =  (props) => {

    const [userBio, setUserBio] = useState();
    const [isSub, setIsSub] = useState(false);
     const { addToast } = useToasts();

   const modalLoaded = () => {
        setUserBio(props.bioValue);
    };

  const handleBio = (e) => {
    const {value} = e.target;
    setUserBio(value);
  }

  const saveBio = async () => {

    // {isSub ? (
    const userLocal = JSON.parse(localStorage.getItem('user-info'));

    const userBioObject = {
      Email: props.mail,
      Bio: userBio
      
    }
    await HttpService.put(`user/profile`, userBioObject).then((response) => {
      if(response !== undefined){
         props.onHide();
      }
      addToast("Bio Updated Successfully", {
        appearance: "success",
      });
    }).catch(()=>{
    })

    // ) : (

    //  const localStorage.getItem('user-info', JSON.stringify(userInfo));
    //  const userSubBio = {
    //   UserId: localStorage.userId,
    // } 
    // await HttpService.put(`user/update-sub-account-profile`, userSubBio).then((response) => {
    //   if(response !== undefined){
    //      props.onHide();
    //   }
    //   addToast("Bio Updated Successfully", {
    //     appearance: "success",
    //   });
    // }).catch(()=>{
    // })
    // )}
   }
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        onEntered={modalLoaded}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Bio
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group controlId="dob">
              <Form.Control as="textarea" name="bio" placeholder="Enter Bio" onChange={handleBio} 
                value = {userBio}/>
              </Form.Group>         
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={saveBio}>Save Changes</Button>
          <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  export default BioModel;