
import React, {useState} from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import HttpService from '../../../shared/http.service';
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {ErrorMessage} from '../../sharedError/error.messages'

const TermsCondsModel =  (props) => {


    const { register, handleSubmit, errors, formState, setValue } = useForm({
      mode: 'all'
    });
    const [idTermsConds, setTermsCondsId] = useState();
    const [charCount, setCharCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const { addToast } = useToasts();

    

   const modalLoaded = () => {

    const termsId = props.modaltype !== 1 ? props.idoftermsconds : null 
    setTermsCondsId(termsId);
    
    const termsName = props.modaltype !== 1 ? props.nameoftermsconds : null 
    setValue('name', termsName)

    const termsMessage = props.modaltype !== 1 ? props.messageoftermsconds : null 
    setValue('msg', termsMessage)
    setCharCount(termsMessage.length)


    };

  
  const updateTermsConds = async (formData) => {
     
    const termsCondsObject = {
        Name: formData.name,
        Message: formData.msg
      }
      await HttpService.put(`TermsAndConditions/${idTermsConds}`, termsCondsObject).then((response) => {
        if(response){   
          props.onHide();
            
        }
        //setValue('name', "");
        //setValue('msg', "");
        addToast("Terms & Conditions Updated Successfully", {
          appearance: "success",
        }); 
        
        //props.onHide();
      }).catch((err)=>{
        setErrorMsg(err.response.data.message)
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
            {props.modaltype === 1 ? 'Create': props.modaltype === 2  ? 'Update' : 'Delete'} Terms And Conditons 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit(updateTermsConds)}>
        <Form.Group controlId="termsCondsName">
          <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Terms And Conditons "  ref={register({ required: true })}/>
            <ErrorMessage type={errors.name && errors.name.type} />
        </Form.Group>
        <Form.Label>Message</Form.Label>  

        {/* <Form.Group controlId="termsCondsMsg">
            <Form.Control type="text" name="msg" placeholder="Enter Terms And Conditons Message" ref={register({ required: true })}/>
            <ErrorMessage type={errors.msg && errors.msg.type} />
        </Form.Group> */}

        <Form.Group className="form-group">
            <Form.Control as="textarea" name="msg" placeholder="Enter Terms And Conditons Message"
              ref={register({ required: true, validate: value => setCharCount(value.length) })} 
              maxLength="255" rows={8}/>
            <div className="my-2 text-end">{charCount}/{255}</div>
            <ErrorMessage type={errors.msg && errors.msg.type} /> 
          </Form.Group>

          {errorMsg && (
                    <div className="alert alert-danger">
                      {errorMsg}
                    </div>
                  )}
     
        <Modal.Footer>
        {props.modaltype === 2 && <Button type="submit" onClick={updateTermsConds}>Save Changes</Button>}
        </Modal.Footer>    
        </Form>
        </Modal.Body>
        
      </Modal>
    );
  }
  export default TermsCondsModel;