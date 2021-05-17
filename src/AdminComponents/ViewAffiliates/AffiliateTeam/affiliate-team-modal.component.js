import React, {Fragment, useState } from "react";
import { format } from "date-fns";
import { Modal, Button, Form } from "react-bootstrap";
import HttpService from "../../../shared/http.service";
import { useToasts } from "react-toast-notifications";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";
import moment from "moment";


const TeamModel = (props) => {
  
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  const { addToast } = useToasts();
  const [teamId, setTeamId] = useState(1);
  const APIURL = 'affiliate-team'
  const { register, handleSubmit, errors, formState, reset, setValue, getValues } = useForm({
    mode: 'all'
  });

  const [showDateEnd, setShowDateEnd] = useState(false);
  let modalType = props.modalType;
  
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
        setValue('WorkSince', moment.parseZone(res.data.WorkSince).format('yyyy-MM-DD'));
        setValue('EndDate',  moment.parseZone(res.data.EndDate).format('yyyy-MM-DD'));
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
  //       deleteTeamAccount().then(() => {
  //         Swal.fire({
  //           position: "center",
  //           icon: "success",
  //           title: "Team Member Deleted Successfully",
  //           showConfirmButton: false,
  //           timer: 2000,
  //         });
  //       });
  //     }
  //   });
  // };

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
            ? "Add"
            : props.modalType === 2
            ? "Update"
            : "Delete"}{" "}
          Team Member
        </Modal.Title>
      </Modal.Header>
      {modalType !== 3 && (
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  name="Name"
                  placeholder="Member Name"
                  ref={register({ required: true })}
                />
                <ErrorMessage type={errors.Name && errors.Name.type} />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label> Role </Form.Label>
                <Form.Control
                  type="text"
                  name="Role"
                  placeholder="Role"
                  ref={register({ required: true })}
                />
                <ErrorMessage type={errors.Role && errors.Role.type} />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>Working Since</Form.Label>
                <Form.Control
                  type="date"
                  name="WorkSince"
                  placeholder="Work Since"
                  ref={register({ required: false, validate: value => setShowDateEnd(true) })}
                />
                <ErrorMessage
                  type={errors.WorkSince && errors.WorkSince.type}
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="EndDate"
                  placeholder="End Date"
                  readOnly={ modalType === 1 ? !showDateEnd: false}
                  ref={register({ required: false,
                    validate: value => (new Date(value) > new Date(getValues('WorkSince')) ) })}
                />
                 {errors.EndDate &&
                        errors.EndDate.type === "validate" &&
                       <div className="text-danger">End date should be greater than WorkSince date</div> }
                <ErrorMessage type={errors.EndDate && errors.EndDate.type} />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>LinkedIn URL</Form.Label>
                <Form.Control
                  type="text"
                  name="LinkedInUrl"
                  placeholder="LinkedIn Url"
                  ref={register({ required: false, pattern: urlRegex  })}
                />
                <ErrorMessage
                  type={errors.LinkedInUrl && errors.LinkedInUrl.type} patternType={'url'}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              {props.modalType === 1 && <Button type="submit">Create</Button>}
              {props.modalType === 2 && (
                <Button type="submit">Save Changes</Button>
              )}
            </Modal.Footer>
          </Form>
        </Modal.Body>
      )}

      {props.modalType === 3 && (
        <Fragment>
          <Modal.Body>
            <Form.Label>
              Are you sure want to delete this record? you will not be able to
              retrieve it later.
            </Form.Label>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={deleteTeamAccount} variant="danger">
              Delete
            </Button>
            <Button onClick={() => props.onHide()}>Cancel</Button>
          </Modal.Footer>
        </Fragment>
      )}
    </Modal>
  );
};
export default TeamModel;
