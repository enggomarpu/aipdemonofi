import React, {useState,useEffect} from 'react';
import { Modal, Button, Form,} from 'react-bootstrap';
import { useToasts } from "react-toast-notifications";
import HttpService from '../../shared/http.service';

const AdminSubAcountModal = (props) => {
    const { addToast } = useToasts();
    const [userRoleId, setUserRoleId] = useState(2);
    const [subChangedName, setSubChangedName] = useState("");
    const [subChangedEmail, setSubChangedEmail] = useState("");
    const [subLastName, setLastName] = useState("");

    useEffect(() => {
      if(props.id) {
        get();
      }
  }, []);

  const get = async () => {
      await HttpService.get(`user/profile/${props.id}`).then((res) => {
        setSubChangedName(res.data.Profile.Name);
        setSubChangedEmail(res.data.Profile.Email);
        setLastName(res.data.Profile.LastName);
      }).catch((err) => {
          console.error('Api Call Error', err);
      });
  }

   const modalLoaded = () => {
    };

  const handleChangeEmail = (e) => {
    const {value} = e.target;
    setSubChangedEmail(value);
  }
  const handleChangeName = (e) => {
    const {value} = e.target;
    setSubChangedName(value);
  }

  const handleLastName = (e) => {
    const {value} = e.target;
    setLastName(value);
  }
  const createSubAccount = () => {
    const subAccountDetails = {
      Name: subChangedName,
      Email: subChangedEmail,
      LastName: subLastName,
      UserRoleId: userRoleId, 
    }
    HttpService.post('user/admin-create-sub-account', subAccountDetails).then((response) => {
      if(response){
        props.onHide();
      }
       addToast("Sub-account Created Successfully", {
         appearance: "success",
       });
      
    }).catch(()=>{

    })
  }

  const saveSubAccount = () => {

    const subAccountDetails = {
      Name: subChangedName,
     
      Email: subChangedEmail
    }

    HttpService.put('user/profile', subAccountDetails).then((response) => {
      if(response){
        props.onHide();
      }
      addToast("Sub-account Updated Successfully", {
        appearance: "success",
      });
    }).catch(()=>{

    })
  }
  const deleteSubAccount = () => {
    HttpService.delete(`user/admin-delete-sub-account/${props.id}`).then((response) => {
      if(response){
        props.onHide();
      }
    }).catch(()=>{
    })
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

            {!props.id ? 'Create':  'Update'} Sub Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group controlId="formBasicName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" value= {subChangedName} 
                onChange={handleChangeName}/>
                <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" value= {subLastName} 
                onChange={handleLastName}/>
                <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value= {subChangedEmail} 
                onChange={handleChangeEmail}/>
                <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

        </Form>
        </Modal.Body>
        <Modal.Footer>
        {!props.id ? <Button onClick={createSubAccount}>Create</Button>
          :
          <><Button onClick={saveSubAccount}>Save Changes</Button>
          <Button onClick={deleteSubAccount}>Delete</Button></>
          }
          <Button onClick={props.onHide}>Cancel</Button>  
        </Modal.Footer>
      </Modal>
    );
  }

  export default AdminSubAcountModal