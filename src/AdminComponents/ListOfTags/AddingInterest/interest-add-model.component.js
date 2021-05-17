import React, {useState} from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import HttpService from '../../../shared/http.service';
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {ErrorMessage} from '../../sharedError/error.messages'




const InterestModel =  (props) => {

    const [interestName, setInterestName] = useState();
    const [idInterest, setInterestId] = useState();
    const { addToast } = useToasts();

    const { register, handleSubmit, errors, formState, reset, setValue } = useForm({
      mode: 'all'
    });

  const allInterests = props.interesttags;

   const modalLoaded = () => {

    const interName = props.modaltype !== 1 ? props.nameofinterest : null 
     setValue('interestName', interName) 

    const interid = props.modaltype !== 1 ? props.idofinterest : null 
    setInterestId(interid);

    };

  
    const checkDuplicate = (intName) => {
      let duplArr = [];
      let result;
      duplArr = allInterests.filter(tag => tag.InterestName.toLowerCase() === intName.toLowerCase())
      result = duplArr.length > 0 ?  false : true
      return result;
    }

    const saveInterest = async (formData) => {

      const userLocal = JSON.parse(localStorage.getItem('user-info'));

      if(formData.interestName){
        const interestObject = {
        InterestName: formData.interestName.charAt(0).toUpperCase() + formData.interestName.slice(1),
      }
      

      if(props.modaltype == 1){
      await HttpService.post(`interest`, interestObject).then((response) => {
        if(response){
          setValue('interestName', "");
          props.onHide()
        }
        addToast("Interest Created Successfully", {
          appearance: "success",
        });
      }).catch(()=>{})
    }
   
      if(props.modaltype == 2){
        await HttpService.put(`interest/${idInterest}`, interestObject).then((response) => {
          if(response){
              setValue('interestName', ""); 
              props.onHide();
          }
          addToast("Interest Updated Successfully", {
            appearance: "success",
          });
        }).catch(()=>{}) 
      }
    }
      //window.location.reload();
     }
  
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
        deleteInterest().then(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Interest Deleted Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
        });
      }
    });
  };

   const deleteInterest = async() => {
    const interestObject = {
        //Email: userLocal.username,
        InterestName: interestName
      }
      await HttpService.delete(`interest/${idInterest}`).then((response) => {
        if(response){
            setInterestName("");
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
        onEntered={modalLoaded}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.modaltype === 1 ? 'Create': props.modaltype === 2  ? 'Update' : 'Delate'} Interest Name 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit(saveInterest)}>
        <Form.Group className="form-group">
             <Form.Control as="textarea" name="interestName" placeholder="Enter Interest Name"
            ref={register({ required: true, validate: value => checkDuplicate(value) })} />
             
             {errors.interestName &&
                        errors.interestName.type === "validate" &&
                       <div className="text-danger">Please choose a different value</div> }

        <ErrorMessage type={errors.interestName && errors.interestName.type} />
        </Form.Group>
        <Modal.Footer>
          {props.modaltype === 1 && <Button type="submit" onClick={saveInterest}>Create</Button>}
          {props.modaltype === 2 && <Button type="submit" onClick={saveInterest}>Save Changes</Button>}
          {props.modaltype === 3 && <Button onClick={deleteConfirmation}>Delete</Button>}
        </Modal.Footer>         
        </Form>
        </Modal.Body>
        
      </Modal>
    );
  }
  export default InterestModel;