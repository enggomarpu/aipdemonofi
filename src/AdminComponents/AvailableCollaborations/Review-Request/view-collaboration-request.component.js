import React, { useEffect, useState, lazy } from 'react'
import MedTech from '../../../../src/img/medTech.png'
import DataCorp from '../../../../src/img/dataCorp.png'
import NeutralTech from '../../../../src/img/neutralTech.png'
import BestSoftware from '../../../../src/img/bestSoftware.png'
import AiSolutions from '../../../../src/img/aiSolutions.png'
import DashboardCalendar from '../../AdminDashboard/CalenderEvents/dashboard-calendar'
import UpcomingEvents from '../../AdminDashboard/CalenderEvents/upcoming-events.component'
import Icon from "../../../img/icon.png"
import Download from "../../../img/download.png"
import { useDispatch, useSelector } from 'react-redux'
import { getCollaboration } from '../Collaboration-List/collaboration-list.reducer'
import { approveCollaborationRequest } from './request-view.reducer'
import { store } from '../../../App'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import Moment from 'moment';
import { useToasts } from "react-toast-notifications";
import { useHistory } from 'react-router'

const RejectCollabRequestModal = lazy(() =>
  import('./request-view.module').then(module => {
    store.injectReducer('collaborationViewRequest', module.default.reducer);
    store.injectSaga('collaborationViewRequest', module.default.saga);
    return import('../reject-collab-request-modal');
  })
);

const ViewComments = lazy(() =>
  import('./request-view.module').then(module => {
    store.injectReducer('collaborationViewRequest', module.default.reducer);
    store.injectSaga('collaborationViewRequest', module.default.saga);
    return import('./collaboration-comment.component');
  })
);

const ColabReviewRequestView = (props) => {

  const history = useHistory()
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const serverData = useSelector(state => state.collaborationlist.CollabationRequestData);
  const funcType = useSelector(state => state.collaborationViewRequest.type);
  const errorMessage = useSelector(state => state.collaborationViewRequest.errorMessage);
  const [rejectedPostModel, setRejectedPostModel] = useState(false)
  const [viewComment, setViewComment] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    props.setPageTitle();
    switch (funcType) {
      case 'collaborationViewRequest/getCollaborationSuccess':
        setDataLoaded(true);
        break;
      case 'collaborationViewRequest/approveSuccess':
        addToast("Collaboration Request is successfully approved", {
          appearance: "success",
        });
        history.push('/Affiliates/availablecollboration');
        break;
      case 'collaborationViewRequest/error':
        addToast(errorMessage, {
          appearance: 'error',
        });
        break;
      default:
        break;
    }
    if(!dataLoaded){
      dispatch(getCollaboration({
        CollaborationRequestId: props.match.params.id
      }))
    }
  }, [funcType]);


  const openComments = () => {
    setViewComment(true)
  }

  const rejectRequest = () => {
    setRejectedPostModel(true)
  }

  const approveRequest = () => {
    dispatch(approveCollaborationRequest({
      CollaborationRequestId: props.match.params.id
    }))
  }

  const onModalCloase = (rejected) => {
    setRejectedPostModel(false);
    if(rejected){
      addToast("Collaboration Request is successfully rejected", {
        appearance: "success",
      });
      history.push('/Affiliates/availablecollboration');
    }
  }

  return (
    <>
      <div className="row">
        <div className="col-md-8">
          {/* <div className='card simple-card'>
            <div className='card-header bg-white d-flex justify-content-between'>
              <div className='align-self-center'>
                <h3 className='card-title'>Collaboration Request</h3>
              </div>
            </div>

            <div className='card-body'>
              <h4 className='card-title-primary'>Neutral Tech</h4>
              <h5 className='card-subtitle mb-2'>
                New York, New York | 48 minutes ago
                  </h5>
              <p className='card-text'>
                We are seeking an affliliate who has experience with
                project work in the manifufactoring industry. This project
                is focused on operation optimization EventModal their
                production plants. The lenght of the project is projected
                to be 3-4 months. Please reach out if you are interested
                in collaborating or learning more about the project!
                  </p>
            </div>
          </div> */}

          <div className="card simple-card">
            <div className="row mb-3">
              <div className="col">
                <h1>
                  <img src={Icon} alt="" className="rounded-circle" />{" "}
                  {serverData &&
                    serverData.StartedByUser &&
                    serverData.StartedByUser.CompanyName}
                </h1>
              </div>
            </div>

            <div className="custom-list">
              <div className="checkbox-group">
                {serverData.RequestSkills &&
                  serverData.RequestSkills.map((skill, index) => {
                    return (
                      <span key={index} className="btn btn-primary">
                        {skill.SkillName &&
                          skill.SkillName +
                            (serverData.RequestSkills.length - 1 > index
                              ? " "
                              : "")}
                      </span>
                    );
                  })}
              </div>
              <div className="row mb-3">
                <div className="col-3">
                  <b>Project Name</b>
                </div>
                <div className="col-9">{serverData.ProjectName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-3">
                  <b>Project Timeline</b>
                </div>
                <div className="col-9">
                  {Moment(serverData.StartDate).format("DD-MM-YYYY")} -{" "}
                  {Moment(serverData.EndDate).format("DD-MM-YYYY")}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-3">
                  <b>Related Industry</b>
                </div>
                <div className="col-9">{serverData.RelatedIndustry} </div>
              </div>

              <div className="row mb-3">
                <div className="col-3">
                  <b>Project Details</b>
                </div>
                <div className="col-9">{serverData.ProjectDetails}</div>
              </div>

              <div className="row mb-3">
                <div className="col-3">
                  <b>Priority Level</b>
                </div>
                <div className="col-9">
                  <span className="text-danger">
                    {serverData.PriorityLevel}
                  </span>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-3">
                  <b>Project Files</b>
                </div>
                <div className="col-9">
                  <ul className="accounts-list">
                    {serverData.RequestAttachments &&
                      serverData.RequestAttachments.map((result) => {
                        return (
                          <li>
                            <div className="row" key={result.AttachmentId}>
                              <div className="align-self-center col-sm-10">
                                <a
                                  className="link"
                                  href={filePickerService.getDownloadLink(
                                    result.FileHandler
                                  )}
                                >
                                  <div
                                    className={filePickerService.getFileIcon(
                                      result.FileType
                                    )}
                                  >
                                    <img src={Download} alt="" />
                                  </div>
                                  {result.FileName}
                                </a>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
              {/* {serverData.StartedWithUser == null ? (
                ""
              ) : (
                <div className="row mb-3">
                  <div className="col-3">
                    <b>Priority Level</b>
                  </div>
                  <div className="col-9">
                    <span className="col-9">
                      {serverData.StartedWithUser.PriorityLevel}
                    </span>
                  </div>
                </div>
              )} */}
              <div className="row mb-3">
                <div className="col-5">
                  <button className="link mb-3" onClick={() => openComments()}>
                    View Comments
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-end mb-3 mt-5 ">
            <button
              className="btn btn-width border-primary text-primary"
              onClick={() => rejectRequest()}
            >
              Reject
            </button>
            <button
              className="btn btn-primary btn-width"
              onClick={() => approveRequest()}
            >
              Approve
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card simple-card">
            <div className="card-body">
              <DashboardCalendar />
              <UpcomingEvents />
            </div>
          </div>
          <div className="card simple-card">
            <div className="card-body p-4">
              <h3 className="card-title">Featured Affiliates</h3>
              <div className="featured-affiliates">
                <ul>
                  <li>
                    <div className="logo">
                      <img src={MedTech} alt="" />
                    </div>
                    <div className="text">MedTech</div>
                  </li>
                  <li>
                    <div className="logo">
                      <img src={DataCorp} alt="" />
                    </div>
                    <div className="text">MedTech</div>
                  </li>
                  <li>
                    <div className="logo">
                      <img src={NeutralTech} alt="" />
                    </div>
                    <div className="text">MedTech</div>
                  </li>
                  <li>
                    <div className="logo">
                      <img src={BestSoftware} alt="" />
                    </div>
                    <div className="text">MedTech</div>
                  </li>
                  <li>
                    <div className="logo">
                      <img src={AiSolutions} alt="" />
                    </div>
                    <div className="text">MedTech</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RejectCollabRequestModal
        show={rejectedPostModel}
        postselectid={props.match.params.id}
        onHide={onModalCloase}
      />
      <ViewComments
        show={viewComment}
        postselectid={props.match.params.id}
        onHide={() => {
          setViewComment(false);
        }}
      />
    </>
  );
}

export default ColabReviewRequestView
