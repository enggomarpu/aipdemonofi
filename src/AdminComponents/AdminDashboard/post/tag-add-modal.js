import React, {useState} from 'react';
import { Modal, Button, Form,} from 'react-bootstrap';
import { useToasts } from "react-toast-notifications";
import httpService from '../../../shared/http.service';



const TagAddModel =  (props) => {

    const { addToast } = useToasts();
    const [tag, setTag] = useState({});

   const modalLoaded = () => {
    };

  const handleTag = (e) => {
    setTag({...tag, [e.target.name] : e.target.value});
  }

  const saveTag = async () => {
    const tagObject = {
      TagName: tag.tagName
    }
    await httpService.post('tag', tagObject).then((response) => {
      if(response){
        addToast("Tag Created Successfully", {
          appearance: "success",
        });
        props.onHide(true)
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
            Create Tag 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group controlId="tagName">
              <Form.Control as="textarea" name="tagName" placeholder="Enter Tag Name" onChange={handleTag} 
                value = {tag.tagName}/>
              </Form.Group>         
        </Form>
        </Modal.Body>
        <Modal.Footer>
        {props.modaltype === 1 && <Button onClick={saveTag}>Create</Button>}
        </Modal.Footer>
      </Modal>
    );
  }
  export default TagAddModel;