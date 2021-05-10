import React, { Fragment, useState } from "react";
import { Modal, Button, Form, } from 'react-bootstrap';
import HttpService from '../../../shared/http.service';
import { format } from 'date-fns';
import Select from 'react-select';
import { useToasts } from "react-toast-notifications";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";
import moment from 'moment';

const CertificationModal = (props) => {

  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  const [showDateEnd, setShowDateEnd] = useState(false);
  let modelType = props.modelType;
  
  const apiRoute = 'affiliate-certification';
  const { addToast } = useToasts();
  const [certificationId, setCertificationId] = useState(props.certificationId);
  const [teamMembers, setTeamMembers] = useState([]);
  const [options, setOptions] = useState([]);
  //const [showDateCompleted, setShowDateCompleted] = useState(false);
  const { register, handleSubmit, errors, formState, reset, setValue, control, getValues } = useForm({
    mode: 'all'
  });

 const modalLoaded = () => {
    
    getLookup();
    if(props.modelType !== 1){
      setCertificationId(props.certificationId);
      get(props.certificationId);
    }
  };

  const get = async (certId) => {
    await HttpService.get(`affiliate-certification/${certId}`).then(async(res) => {
      if (res && res.data) {
        res.data.IssueDate = res.data.IssueDate ? moment.parseZone(res.data.IssueDate).format('yyyy-MM-DD') : '';
        res.data.DateCompleted = res.data.DateCompleted ? moment.parseZone(res.data.DateCompleted).format('yyyy-MM-DD') : '';
        //reset(res.data);
        setValue('Title', res.data.Title)
        setValue('Provider', res.data.Provider)
        
        setValue('IssueDate', moment.parseZone(res.data.IssueDate).format('yyyy-MM-DD'))
        setValue('DateCompleted', moment.parseZone(res.data.DateCompleted).format('yyyy-MM-DD'))
        setValue('CertificationUrl', res.data.CertificationUrl)
              
        let teamMem = res.data.TeamMembers ? res.data.TeamMembers.map(item =>
          { return { value: item.AffiliateTeamMemberId, label: item.Name, isDisabled: item.IsApproved } }) : [];
        setTeamMembers(teamMem);
        setValue('TeamMemberIds', teamMem )
        console.log('teammmmmmmmmm mem', teamMem);
        
      }
    }).catch((err) => {
      console.log(err);
    });
  }
     const getLookup = async () => {
        await HttpService.get('affiliate-team').then((res) => {
          if (res && res.data) {
            let data = res.data.map((item) => { return { value: item.AffiliateTeamMemberId, label: item.Name, isDisabled: item.IsApproved } });
            setOptions(data);
          }
        }).catch((err) => {
          console.log(err);
        });
      }


  const createCertification = async (modalObj, e) => {

    // if (teamMembers && teamMembers.length > 0) {
    //   modalObj.TeamMemberIds = teamMembers.map(item => item.value)
    // }
    modalObj.TeamMemberIds = modalObj.TeamMemberIds !== null ? modalObj.TeamMemberIds.length > 0 ? modalObj.TeamMemberIds.map(item => item.value): null : null;
    
    console.log('certifcatio create called', modalObj)
    await HttpService.post(apiRoute, modalObj).then((response) => {
      if (response !== undefined) {
        e.target.reset();
        props.onHide()
      }
      addToast("Certification Created Successfully", {
        appearance: "success",
      });
    }).catch(() => {

    })
  }

  const saveCertification = (projecObj, e) => {   

      projecObj.TeamMemberIds = projecObj.TeamMemberIds !== null ? projecObj.TeamMemberIds.length > 0 ? projecObj.TeamMemberIds.map(item => item.value) : null : null;

   console.log('save certification', projecObj);
    HttpService.put(`${apiRoute}/${certificationId}`, projecObj).then((response) => {
      if (response !== undefined) {
          e.target.reset();
          props.onHide();
      }
      addToast("Certification Updated Successfully", {
        appearance: "success",
      });
    }).catch(() => {
    })
  }
  
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
  //       deleteCertification().then(() => {
  //         Swal.fire({
  //           position: "center",
  //           icon: "success",
  //           title: "project Deleted Successfully",
  //           showConfirmButton: false,
  //           timer: 2000,
  //         });
  //       });
  //     }
  //   });
  // };

  const changeHandler = (option) => {
    setTeamMembers(option);
    console.log('change input', option);
  
  };


  const deleteCertification = async () => {
   return await HttpService.delete(`${apiRoute}/${certificationId}`).then((response) => {
      if (response !== undefined) {
        props.onHide();
      }
    }).catch(() => {
    })
  }

  
  const onSubmit = (formData, e) => {

    console.log('on submit dataaaaaaaaaaaaaaaaaaaaa', formData);
    props.modelType === 1 && createCertification(formData, e);
    props.modelType === 2 && saveCertification(formData, e); 
  }
  
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
      onEntered={modalLoaded}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.modelType === 1
            ? "Create"
            : props.modelType === 2
            ? "Update"
            : "Delete"}{" "}
          Certification
        </Modal.Title>
      </Modal.Header>
      {props.modelType !== 3 && (
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="Title"
                  placeholder="Title Name"
                  ref={register({ required: true })}
                />
                <ErrorMessage type={errors.Title && errors.Title.type} />
              </div>

              <div className="form-group">
                <label> Provider </label>
                <input
                  type="text"
                  className="form-control"
                  name="Provider"
                  placeholder="Udemey"
                  ref={register({ required: true })}
                />
                <ErrorMessage type={errors.Provider && errors.Provider.type} />
              </div>

              <div className="form-group">
                <label>Issue Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="IssueDate"
                  placeholder="Issue Date"
                  ref={register({ required: false, validate: value => setShowDateEnd(true)})}
                />
                <ErrorMessage
                  type={errors.IssueDate && errors.IssueDate.type}
                />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="DateCompleted"
                  readOnly= {modelType === 1 ? !showDateEnd : false}
                  placeholder="Expiry Completed"
                  ref={register({ required: false,
                    validate: value => (new Date(value) > new Date(getValues('IssueDate')) ) })}
                />
                 {errors.DateCompleted &&
                        errors.DateCompleted.type === "validate" &&
                  <div className="text-dengar">Completed date should be greater than Issue date</div> }
                <ErrorMessage type={errors.DateCompleted && errors.DateCompleted.type}
                />
              </div>

              <div className="form-group">
                <label>Certification URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="CertificationUrl"
                  placeholder="Certification Url"
                  ref={register({ required: false, pattern: urlRegex })}
                />
                <ErrorMessage
                  type={errors.CertificationUrl && errors.CertificationUrl.type}
                  patternType={'url'}
                />
              </div>

              {/* <Form.Group controlId="teamMember">
            <Form.Label>Team Member</Form.Label>
            <Select
              isMulti
              name="TeamMemberIds"
              value={teamMembers}
              onChange={changeHandler}
              options={options}
            ></Select>
          </Form.Group> */}

              <Form.Group controlId="teamMember">
                <Form.Label>Team Member</Form.Label>
                <Controller
                  name="TeamMemberIds"
                  control={control}
                  as={
                    <Select
                      isMulti
                      options={options}
                      name="TeamMemberIds"
                      //value={teamMembers}
                      //onChange={changeHandler}
                    />
                  }
                  rules={{ required: false }}
                  defaultValue={null}
                />
                <ErrorMessage
                  type={errors.teamMember && errors.teamMember.type}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              {props.modelType === 1 && <Button type="submit">Create</Button>}
              {props.modelType === 2 && (
                <Button type="submit">Save Changes</Button>
              )}
            </Modal.Footer>
          </Form>
        </Modal.Body>
      )}

      {props.modelType === 3 && (
        <Fragment>
          <Modal.Body>
            <Form.Label>
              Are you sure want to delete this record? you will not be able to
              retrieve it later.
            </Form.Label>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={deleteCertification} variant="danger">
              Delete
            </Button>
            <Button onClick={() => props.onHide()}>Cancel</Button>
          </Modal.Footer>
        </Fragment>
      )}
    </Modal>
  );
}
export default CertificationModal;


