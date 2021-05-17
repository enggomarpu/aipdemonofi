import React, { useState } from "react";
import { format } from "date-fns";
import { Modal, Button, Form } from "react-bootstrap";
import HttpService from "../../../shared/http.service";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";


const TeamModel = (props) => {
  
  
  const { addToast } = useToasts();
  const [teamId, setTeamId] = useState(1);
  const APIURL = 'affiliate-team'
  const { register, handleSubmit, errors, formState, reset, setValue } = useForm();

  const modalLoaded = () => {
    
   
    if(props.modalType !== 1){
      setTeamId(props.idofteam);
      get(props.idofteam);
    }

  };

  const get = async (teaId) => {
    await HttpService.get(`${APIURL}/${teaId}`).then(async(res) => {
      if (res && res.data) {
        setValue('Name', res.data.Name);
        setValue('WorkSince', format  (new Date(res.data.WorkSince), 'yyyy-MM-dd'));
        setValue('EndDate', format(new Date(res.data.EndDate), 'yyyy-MM-dd'));
        setValue('Role', res.data.Role);
        setValue('LinkedInUrl', res.data.LinkedInUrl);
        //setValue('PartneredAffiliateUserId', res.data.PartneredAffiliateUserId);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  
  const createTeamAccount = (formdata) => {
   
    const teamUser = { 
      AffiliateUserId: props.userID ? props.userID : 0,
    }
    let allFormData = {...formdata, ...teamUser}
    
    HttpService.post(APIURL, allFormData)
      .then((response) => {
        if (response) {
          props.onHide();
        }
        addToast("Team Member Created Successfully", {
          appearance: "success",
        });
      })
      .catch(() => {});
  };
  const saveTeamAccount = (teamdata) => {
    // const subAccountDetails = {
    //   Name: teamMemberName,
    //   Role: teamMemberRole,
    //   WorkSince: dateValue,
    //   EndDate: teamMemberendDate,
    //   LinkedInUrl: linkedURL,
    // };
    HttpService.put(`${APIURL}/${teamId}`, teamdata)
      .then((response) => {
        reset(response.data)
        if (response) {
          props.onHide();
        }
        addToast("Team Member Updated Successfully", {
          appearance: "success",
        });
      })
      .catch(() => {});
  };
  
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
        deleteTeamAccount().then(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Team Member Deleted Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
        });
      }
    });
  };

  const deleteTeamAccount = async () => {
    await HttpService.delete(`${APIURL}/${teamId}`)
      .then((response) => {
        if (response) {
          props.onHide();
        }
      })
      .catch(() => {
        console.log("something weired happened");
      });
  };

  const onSubmit = (formData) => {
    props.modalType === 1 && createTeamAccount(formData);
    props.modalType === 2 && saveTeamAccount(formData); 
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
          {props.modalType === 1
            ? "Create"
            : props.modalType === 2
            ? "Update"
            : "Delate"}{" "}
          Team
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
      <Modal.Body>
      <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text'
                className='form-control' name="Name" placeholder="Member Name" ref={register({ required: true })} />
              <ErrorMessage type={errors.Name && errors.Name.type} />
            </Form.Group>

            <Form.Group className='form-group'>
              <Form.Label> Role </Form.Label>
              <Form.Control type='text'
                 name="Role" placeholder="Role" ref={register({ required: true })} />
              <ErrorMessage type={errors.Role && errors.Role.type} />
            
            </Form.Group>

            <Form.Group className='form-group'>
              <Form.Label>Work Since</Form.Label>
              <Form.Control type='date'
                 name="WorkSince" placeholder="Work Since" ref={register({ required: true })} />
              <ErrorMessage type={errors.WorkSince && errors.WorkSince.type}  />
            </Form.Group>

            <Form.Group className='form-group'>
              <Form.Label>End Date</Form.Label>
              <Form.Control type='date'
                 name="EndDate" placeholder="End Date" ref={register({ required: true })} />
              <ErrorMessage type={errors.EndDate && errors.EndDate.type}  />
            </Form.Group>

            <Form.Group className='form-group'>
              <Form.Label>LinkedIn URL</Form.Label>
              <Form.Control type='text'
                 name="LinkedInUrl" placeholder="Certification Url" ref={register({ required: true })} />
              <ErrorMessage type={errors.LinkedInUrl && errors.LinkedInUrl.type} />
            </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        {props.modalType === 1 && (
          <Button type="submit">Create</Button>
        )}
        {props.modalType === 2 && (
          <Button type="submit">Save Changes</Button>
        )}
        {props.modalType === 3 && (
          <Button onClick={deleteConfirmation}>Delete</Button>
        )}
      </Modal.Footer>
      </Form>
     </Modal>
    
  );
};
export default TeamModel;
