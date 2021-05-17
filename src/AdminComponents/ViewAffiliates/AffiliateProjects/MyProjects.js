import React, { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import Icon from '../../../img/partnered-affiliate.png'
import Model from './ProjectsModal'
import PlusCircle from '../../../img/plus-circle.png'
import ProjectModal from './ProjectsModal'
import {format} from 'date-fns';

const Bio = (props) => {

  const [allProjects, setAllProjects] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [modalType, setmodalType] = useState(1);
  const [projectId, setProjectId] = useState(1);
  const [allRequests, setAllRequests] = useState([]);
  
  const [allAffliatesPartners, setAllAffliliatesPartners] = useState();

  useEffect(() => {
      get();
  }, [openModel]);

    const get = async () => {

    await HttpService.get(`user/profile/${props.userId}`).then(async(res) => {
      if (res) {
        setAllProjects(res.data.MyProjects);
      }
        await HttpService.get('affiliate-team/all').then((response)=>{
          if(response && response.data){
            setAllAffliliatesPartners(response.data)
          }
          
        })
    }).catch((err) => {
      console.log(err);
    });

    await HttpService.get('collaboration-request/my-started-collaboration-requests').then(async (res) => {
      if (res) {
        setAllRequests(res.data);
      }
    }).catch((err) => {
      console.log(err);
    });

    
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
  
    return (
      <>
        <div className='card custom-card'>
          <div className='card-header d-flex justify-content-between mb-3'>
            <h5 className='card-title align-self-center'>{props.headin5}</h5>
            <div className='header-button align-self-center'>
              <label>
                {props.button}
                <button
                  type='button'
                  className='btn p-1 ms-1'
                  data-bs-toggle='modal'
                  data-bs-target='#ProjectModal'
                
                  onClick = { handleClick }
                >
                
                  <img src={PlusCircle} alt='PlusCircle' />
                </button>
              </label>
            </div>
          </div>

          <div className='card-body'>
            <div class='table-responsive'>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'>Clinet Name</th>
                    <th scope='col'>Partnered Affiliate</th>
                    <th scope='col'>Start Date</th>
                    <th scope='col'> End Date</th>
                    <th scope='col'> Status</th>
                    <th scope='col'  colSpan="2"> Description</th>
                  </tr>
                </thead>
                <tbody>
                  {allProjects.map((result) => {
                    return (
                      <tr>
                        <th scope='row'>{result.ClientName}</th>
                        <td>
                          {/* <img src={Icon} alt='Icon' /> Tinted Labs */}
                          {result.PartneredAffiliate && result.PartneredAffiliate.Name}
                        </td>
                        <td>{format(new Date(result.StartDate), 'MM-dd-yyyy')}</td>
                        <td>{format(new Date(result.EndDate), 'MM-dd-yyyy')}</td>
                        <td>
                          <button className='btn btn-success btn-rounded'>
                          {result.ProjectStatus ==  1 ? 'Ongoing' : result.ProjectStatus ==  2 ? 'Completed' : result.ProjectStatus ==  3 ? 'Rejected' : null}
                          </button>
                        </td>
                        <td>{result.Description}</td>
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
                    <ul
                      className='dropdown-menu'
                      aria-labelledby='dropdownMenuButton1'
                    >
                      <li>
                        <button type="button" className='dropdown-item' href='#' onClick ={() => deleteProjects(result.AffiliateProjectId)}>
                          Delete Project
                        </button>
                      </li>
                      <li>
                        <button className='dropdown-item' href='#' onClick={() => updateProjects(result.AffiliateProjectId)}>
                          Update Project
                        </button>
                      </li>
                    </ul>
                    
                  </div>
                  </td>
                      </tr>
                    )
                  })}
                  {allRequests && allRequests.map((result) => {
                  console.log('all requests', allRequests);
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
                  <ProjectModal
                    show={openModel}
                    idofproject={projectId}
                    userID={props.userId}
                    allaffliliate={allAffliatesPartners}
                    modalType={modalType}
                    onHide={() => setOpenModel(false)}
                  />
                  {openDetailModal && <CollaborationsRequestViewModal
                    show={openDetailModal}
                    selectedCollaborationId={selectedId}
                    onHide={() => { setOpenDetailModal(false); }}
      />}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Model />
      </>
    )
}

export default Bio
