import React, { Fragment, useState } from "react";
import { format } from "date-fns";
import { Modal, Button, Form } from "react-bootstrap";
import HttpService from "../../../shared/http.service";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "./../../sharedError/error.messages";
import moment from "moment";

const ProjectsModal = (props) => {
  
  const [showDateEnd, setShowDateEnd] = useState(false);

  const { addToast } = useToasts();
  const [projectId, setProjectId] = useState(1);
  const [affliateParnters, setAffliateParnters] = useState();
  const APIURL = "affiliate-projects";
  let modalType = props.modalType;
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    setValue,
    getValues
  } = useForm({
    mode: 'all'
  });

  const modalLoaded = () => {
    getAffliatePartners();
    if (props.modalType !== 1) {
      setProjectId(props.idofproject);
      get(props.idofproject);
    }
  };

  const get = async (projId) => {
    await HttpService.get(`affiliate-projects/${projId}`)
      .then(async (res) => {
        if (res && res.data) {
          console.log("data in model for projects", res.data);
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
            res.data.PartneredAffiliate.UserId
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

  const createProject = async (modalObj) => {
    await HttpService.post(APIURL, modalObj)
      .then((response) => {
        if (response !== undefined) {
          props.onHide();
        }
        addToast("Project Created Successfully", {
          appearance: "success",
        });
      })
      .catch(() => {});
  };

  const saveProject = (projecObj) => {
    HttpService.put(`${APIURL}/${projectId}`, projecObj)
      .then((response) => {
        if (response !== undefined) {
          props.onHide();
        }
        addToast("Project Updated Successfully", {
          appearance: "success",
        });
      })
      .catch(() => {});
  };


  const deleteProject = async () => {
    return await HttpService.delete(`${APIURL}/${projectId}`)
      .then((response) => {
        if (response !== undefined) {
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
          Project
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
                <option value="">Select Affliate Partner</option>
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
                ref={register({ required: false, validate: value => setShowDateEnd(true)})}
              />
              <ErrorMessage type={errors.StartDate && errors.StartDate.type} />
            </Form.Group>

            <Form.Group className="form-group">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="EndDate"
                  readOnly= {modalType === 1 ? !showDateEnd: false}
                  placeholder="End Date"
                  ref={register({ required: false,
                    validate: value => (new Date(value) > new Date(getValues('StartDate')) ) })}
                />
                 {errors.EndDate &&
                        errors.EndDate.type === "validate" &&
                       <div className="text-dengar">End date should be greater than Start date</div> }
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
