import React, { useState, useEffect, lazy } from 'react'
import HttpService from '../../../shared/http.service'
import PlusCircle from '../../../img/plus-circle.png'
import ProjectModal from './affiliate-projects-modal.component'
import moment from 'moment';
import { store } from '../../../App'
//import CollaborationsRequestViewModal from '../../AvailableCollaborations/Review-Request/collaboration-request-view-modal.component';

const CollaborationsRequestDetail = lazy(() =>
  import('../../AvailableCollaborations/Review-Request/request-view.module').then(module => {
    store.injectReducer('collaborationViewRequestc', module.default.reducer);
    store.injectSaga('collaborationViewRequestc', module.default.saga);
    return import("../../AvailableCollaborations/Review-Request/collaboration-request-view-modal.component");
  })
);
const AffiliateProjetcs = (props) => {

  const [allProjects, setAllProjects] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [modalType, setmodalType] = useState(1);
  const [projectId, setProjectId] = useState(1);
  const [allRequests, setAllRequests] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [openDetailModal, setOpenDetailModal] = useState(false);

  let userInfo = JSON.parse(localStorage.getItem('user-info'))
  let userId = userInfo.userId;
  
  const [allAffliatesPartners, setAllAffliliatesPartners] = useState();

  useEffect(() => {
      get();
  }, [openModel]);

    const get = async () => {
    await HttpService.get(`user/profile/${props.userId}`).then(async(res) => {
      if (res) {
        setAllProjects(res.data.MyProjects);
        setAllRequests(res.data.CollaborationRequests)
      }
        await HttpService.get('affiliate-team/all').then((response)=>{
          if(response && response.data){
            setAllAffliliatesPartners(response.data)
          }
          
        })
    }).catch((err) => {
      console.log(err);
    });

    // await HttpService.get('collaboration-request/my-started-collaboration-requests').then(async (res) => {
    //   if (res) {
    //     setAllRequests(res.data);
    //   }
    // }).catch((err) => {
    //   console.log(err);
    // });


  }

  const markAsCompleted = async (id) => {
    await HttpService.get('collaboration-request/mark-as-completed-collaboration-requests/'+id)
      .then(async (res) => {
        if (res) {
          get();
        }
      }).catch((err) => {
        console.log(err);
      });
  }
  
  const viewRequest = (id) => {
   setSelectedId(id);
   setOpenDetailModal(true);
  }

  const markAsCancelled = async (id) => {
    await HttpService.get('collaboration-request/mark-as-cancelled-collaboration-requests/' + id)
      .then(async (res) => {
        if (res) {
          get();
        }
      }).catch((err) => {
        console.log(err);
      });
  }
  
  const handleClick = () => {
    setOpenModel(true);
    setmodalType(1)
  }
  const setValues = (idvalue) => {
    setOpenModel(true);  
    setProjectId(idvalue);
  }
  const updateProjects = (valueId) => {
    setmodalType(2);
    setValues(valueId);
  }
   
   const deleteProjects = (valuId) => {
    setmodalType(3);
    setValues(valuId);
      
   }

   const setDate = (date) => {
    return moment.parseZone(date).format('MM-DD-yyyy');
   }
  
    return (
      <>
        <div className="card custom-card">
          <div className="card-header d-flex justify-content-between mb-3">
            <h5 className="card-title align-self-center">{props.headin5}</h5>
            <div className="header-button align-self-center">
              <label>
                {props.button}
                <button
                  type="button"
                  className="btn p-1 ms-1"
                  data-bs-toggle="modal"
                  data-bs-target="#ProjectModal"
                  onClick={handleClick}
                >
                  <img src={PlusCircle} alt="PlusCircle" />
                </button>
              </label>
            </div>
          </div>

          {(allProjects && allProjects.length || allRequests.length > 0 ) ? 
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Client Name</th>
                    <th scope="col">Partnered Affiliate</th>
                    <th scope="col">Start Date</th>
                    <th scope="col"> End Date</th>
                    <th scope="col"> Status</th>
                    <th scope="col" colSpan="2">
                      {" "}
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allProjects.map((result, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{result.ClientName}</th>
                        <td>
                        {result.CreatedUserId == props.userId ? (result.PartneredAffiliate ? result.PartneredAffiliate.Name : null) : result.CreatedUser.Name}
                        {/* {result.PartneredAffiliate && result.PartneredAffiliate.Name} */}
                          {/* {result.PartneredAffiliate &&
                            result.PartneredAffiliate.Name} */}
                        </td>
                        <td>
                          {setDate(result.StartDate)}
                        </td>
                        <td>
                          {setDate(result.EndDate)}
                        </td>
                        <td>
                        {result.ProjectStatus != 0 ? 
                          <button className="btn btn-success btn-rounded">
                            {result.ProjectStatus === 1
                              ? "Ongoing"
                              : result.ProjectStatus === 2
                              ? "Completed"
                              : result.ProjectStatus === 3
                              ? "Rejected"
                              : null}
                          </button>
                          : null }
                        </td>
                        <td>{result.Description}</td>
                        <td>
                          <div className="dropdown d-inline-block">
                            <button
                              className="btn"
                              type="button"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                            <ul
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  href="#"
                                  onClick={() =>
                                    deleteProjects(result.AffiliateProjectId)
                                  }
                                >
                                  Delete Project
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  href="#"
                                  onClick={() =>
                                    updateProjects(result.AffiliateProjectId)
                                  }
                                >
                                  Update Project
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                   {allRequests && allRequests.map((result) => {
                  return (
                    <tr>
                      <th scope='row'>{result.ProjectName}</th>
                      <td>
                        {result.CreatedUserId == userId ? result.StartedWithUser.CompanyName : result.StartedByUser.CompanyName}
                      </td>
                      <td> {setDate(result.StartDate)}</td>
                      <td>{setDate(result.EndDate)}</td>
                      <td>
                          <button className='btn btn-success btn-rounded'>
                            {result.RequestStatus == null||result.RequestStatus == 0 ? 'Ongoing' : result.RequestStatus == 1 ? 'Completed' : result.RequestStatus == 2 ? 'Cancelled' : ''}
                          </button>
                      </td>
                      <td>{result.ProjectDetails}</td>
                      <td>
                        <div className='dropdown d-inline-block'>
                          <button
                            className='btn'
                            type='button'
                            id='dropdownMenuButton1'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                          >
                            <i className='fas fa-ellipsis-v'></i>
                          </button>
{/* once completed then dont show this again */}
                            <ul
                              className='dropdown-menu'
                              aria-labelledby='dropdownMenuButton1'
                            >
                            <li>
                              
                              <button className='dropdown-item' onClick={() => viewRequest(result.CollaborationRequestId)} >
                              View 
                              </button>
                              
                              </li>
                            {result.CreatedUserId == userId ?
                              result.RequestStatus==1 || result.RequestStatus==2?
                              <ul></ul>:
                              <ul>
                              <li>
                               
                                  <button type="button" className='dropdown-item' onClick={() => markAsCompleted(result.CollaborationRequestId)}>
                                    Mark as completed
                                  </button>
                                  
                              </li>
                              <li>
                                
                                  <button className='dropdown-item' onClick={() => markAsCancelled(result.CollaborationRequestId)}>
                                    Mark as cancelled
                                 </button>
                                  
                              </li>
                              </ul>
                              : 
                              <ul></ul>
                             }
                              </ul>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
          </div>
          : null}
         
        </div>
        <ProjectModal
                    show={openModel}
                    idofproject={projectId}
                    userID={props.userId}
                    allaffliliate={allAffliatesPartners}
                    modalType={modalType}
                    onHide={() => setOpenModel(false)}
                  />
                  {openDetailModal && <CollaborationsRequestDetail
                    show={openDetailModal}
                    collabid={selectedId}
                    onHide={() => { setOpenDetailModal(false); }}
      />}
      </>
    );
}

export default AffiliateProjetcs
