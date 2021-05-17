import React, { useState } from 'react';
import { Modal, Button, Form, } from 'react-bootstrap';
import HttpService from '../../../shared/http.service';
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '../../sharedError/error.messages'



const SkillModel = (props) => {

  const { addToast } = useToasts();

  const [skillName, setSkillName] = useState();
  const [idSkill, setSkillId] = useState();
  const { register, handleSubmit, errors, formState, reset, setValue } = useForm({mode: 'all'});


  const allSkills = props.skillstags;
  const modalLoaded = () => {

    const skiName = props.modaltype !== 1 ? props.nameofskill : null
    setValue('skillName', skiName)

    //reset(props.nameofskill)


    const skiid = props.modaltype !== 1 ? props.idofskill : null
    setSkillId(skiid);

  };

  const checkDuplicate = (skiName) => {
    let duplArr = [];
    let result;
    duplArr = allSkills.filter(tag => tag.SkillName.toLowerCase() === skiName.toLowerCase())
    result = duplArr.length > 0 ? false : true
    return result;
  }

  const saveSkill = async (formData) => {

    const userLocal = JSON.parse(localStorage.getItem('user-info'));
    if (formData.skillName) {
      const skillObject = {
        SkillName: formData.skillName.charAt(0).toUpperCase() + formData.skillName.slice(1),
      }
      if (props.modaltype == 1) {
        await HttpService.post(`skill`, skillObject).then((response) => {
          if (response) {
            setValue('skillName', "");
            props.onHide()
          }
          addToast("Skill Created Successfully", {
            appearance: "success",
          });
        }).catch(() => { })
      }
      if (props.modaltype == 2) {
        await HttpService.put(`skill/${idSkill}`, skillObject).then((response) => {
          if (response) {
            setValue('skillName', "");
            props.onHide();
          }
          addToast("Skill Updated Successfully", {
            appearance: "success",
          });
        }).catch(() => { })
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
        deleteSkill().then(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Skill Deleted Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
        });
      }
    });
  };

  const deleteSkill = async () => {
    const skillObject = {
      //Email: userLocal.username,
      SkillName: skillName
    }
    await HttpService.delete(`skill/${idSkill}`).then((response) => {
      if (response) {
        props.onHide();
      }
    }).catch(() => {
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
          {props.modaltype === 1 ? 'Create' : props.modaltype === 2 ? 'Update' : 'Delete'} Skill Name
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(saveSkill)}>
          <Form.Group className="form-group">
            <Form.Control as="textarea" name="skillName" placeholder="Enter Skill Name"
              ref={register({ required: true, validate: value => checkDuplicate(value) })} />

            {errors.skillName &&
              errors.skillName.type === "validate" &&
              <div className="text-danger">Please choose a different value. This value already exists.</div>}

            <ErrorMessage type={errors.skillName && errors.skillName.type} />
          </Form.Group>

          <Modal.Footer>
            {props.modaltype === 1 && <Button type="submit" onClick={saveSkill}>Create</Button>}
            {props.modaltype === 2 && <Button type="submit" onClick={saveSkill}>Save Changes</Button>}
            {props.modaltype === 3 && <Button onClick={deleteConfirmation}>Delete</Button>}
          </Modal.Footer>
        </Form>
      </Modal.Body>


    </Modal>
  );
}
export default SkillModel;