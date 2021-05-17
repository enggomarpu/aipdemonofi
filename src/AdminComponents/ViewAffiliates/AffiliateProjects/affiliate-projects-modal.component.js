import React, { Fragment, useState } from "react";
import { format, formatISO, parseISO } from "date-fns";
import { Modal, Button, Form } from "react-bootstrap";
import HttpService from "../../../shared/http.service";
import { useToasts } from "react-toast-notifications";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";
import moment from "moment";


const ProjectsModal = (props) => {

  const [projectId, setProjectId] = useState(1);
  const [affliateParnters, setAffliateParnters] = useState();
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    setValue,
    getValues
  } = useForm({mode: 'all'});

  const APIURL = "affiliate-projects";
  const [showDateEnd, setShowDateEnd] = useState(false);
  let modalType = props.modalType;

  const modalLoaded = () => {
    getAffliatePartners();
    if (props.modalType !== 1) {
      setProjectId(props.idofproject);
      get(props.idofproject);
    }
  };

  const get = async (projId) => {
    await HttpService.get(`${APIURL}/${projId}`)
      .then(async (res) => {
        if (res && res.data) {
          setValue("ClientName", res.data.ClientName);
          setValue(
            "StartDate",
            moment.parseZone(res.data.StartDate).format("yyyy-MM-DD")
          );
          setValue(
            "EndDate",
            moment.parseZone(res.data.EndDate).format("yyyy-MM-DD")
          );
          setValue("Description", res.data.Description);
          setValue("ProjectStatus", res.data.ProjectStatus);
          setValue(
            "PartneredAffiliateUserId",
            res.data.PartneredAffiliateUserId
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAffliatePartners = async () => {
    // await HttpService.get("affiliate-team/all")
    await HttpService.get("user/all-partnered-affiliates")

      .then((response) => {
        if (response && response.data) {
          setAffliateParnters(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createProject = async (formdata) => {
    const projectDetails = {
      IsActive: true,
      AffiliateUserId: props.userID ? props.userID : 0,
    };
    let allFormData = { ...formdata, ...projectDetails };

    await HttpService.post("affiliate-projects", allFormData)
      .then((response) => {
        if (response) {
          props.onHide();
        }
      })
      .catch(() => {});
  };

  const saveProject = (formdata) => {
    const projectDetails = {
      IsActive: true,
      AffiliateUserId: props.userID ? props.userID : 0,
    };
    let allFormData = { ...formdata, ...projectDetails };
    HttpService.put(`${APIURL}/${projectId}`, allFormData)
      .then((response) => {
        if (response) {
          props.onHide();
        }
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
  //       deleteProject().then(() => {
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

  const deleteProject = async () => {
    return await HttpService.delete(`${APIURL}/${projectId}`)
      .then((response) => {
        if (response) {
          props.onHide();
        }
      })
      .catch(() => {});
  };

  const onSubmit = (formData) => {
    console.log("on submit data", formData);
    props.modalType === 1 && createProject(formData);
    props.modalType === 2 && saveProject(formData);
  };

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
          {props.modalType === 1
            ? "Create"
            : props.modalType === 2
            ? "Update"
            : "Delete"}{" "}
          Projects
        </Modal.Title>
      </Modal.Header>
      {modalType !== 3 && (
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                name="ClientName"
                ref={register({ required: true })}
              />
              <ErrorMessage
                type={errors.ClientName && errors.ClientName.type}
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Select Affiliate Partner</Form.Label>
              <Form.Control
                as="select"
                custom
                className="form-select"
                name="PartneredAffiliateUserId"
                ref={register({ required: false })}
              >
                <option value="">Select Affiliate Partner</option>
                {affliateParnters &&
                  affliateParnters.map((res) => {
                    return <option value={res.id}>{res.name}</option>;
                  })}
              </Form.Control>
              <ErrorMessage
                type={
                  errors.PartneredAffiliateUserId &&
                  errors.PartneredAffiliateUserId.type
                }
              />
            </Form.Group>
            <Form.Group controlId="dob">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="StartDate"
                ref={register({ required: false, validate: value => setShowDateEnd(true) })}
              />
              <ErrorMessage type={errors.StartDate && errors.StartDate.type} />
            </Form.Group>

            <Form.Group className="form-group">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="EndDate"
                  placeholder="End Date"
                  readOnly = { modalType === 1 ? !showDateEnd : false}
                  ref={register({ required: false,
                    validate: value => (new Date(value) > new Date(getValues('StartDate')) ) })}
                />
                 {errors.EndDate &&
                        errors.EndDate.type === "validate" &&
                       <div className="text-danger">End date should be greater than Start date</div> }
                <ErrorMessage type={errors.EndDate && errors.EndDate.type} />
              </Form.Group>

            <Form.Group controlId="projectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Description"
                name="Description"
                rows={8}
                ref={register({ required: false })}
              />
              <ErrorMessage
                type={errors.Description && errors.Description.type}
              />
            </Form.Group>

            <Form.Group controlId="projectStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                custom
                className="form-select"
                name="ProjectStatus"
                ref={register({ required: false })}
              >
                <option value="0">Select Status</option>
                <option value="1">Ongoing</option>
                <option value="2">Completed</option>
                <option value="3">Rejected</option>
                {/* <option value={props.modalType !== 1 ? statusValue : "1"}>Ongoing</option>
                <option value={props.modalType !== 1 ? statusValue : "2"}>Completed</option> */}
              </Form.Control>
              <ErrorMessage
                type={errors.ProjectStatus && errors.ProjectStatus.type}
              />
            </Form.Group>
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
            <Button onClick={deleteProject} variant="danger">
              Delete
            </Button>
            <Button onClick={() => props.onHide()}>Cancel</Button>
          </Modal.Footer>
        </Fragment>
      )}
    </Modal>
  );
};
export default ProjectsModal;
