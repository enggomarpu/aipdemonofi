import React, {useState} from 'react';
import { Modal, Button, Form,} from 'react-bootstrap';
import { useToasts } from "react-toast-notifications";
import httpService from './http.service';



const SkillAddModel =  (props) => {

    const { addToast } = useToasts();
    const [skill, setskill] = useState({});

   const modalLoaded = () => {
    };

  const handleSkill = (e) => {
    setskill({...skill, [e.target.name] : e.target.value});
  }

  const saveSkill = async () => {
    const skillObject = {
        skillName: skill.skillName
    }
    await httpService.post('skill', skillObject).then((response) => {
      if(response){
        addToast("Skill Created Successfully", {
          appearance: "success",
        });
        props.onHide(response.data)
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
            Create skill 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group controlId="skillName">
              <Form.Control as="textarea" name="skillName" placeholder="Enter skill Name" onChange={handleSkill} 
                value = {skill.skillName}/>
              </Form.Group>         
        </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button onClick={saveSkill}>Create</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  export default SkillAddModel;