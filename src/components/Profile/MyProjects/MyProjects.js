import React, { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import PlusCircle from '../../../img/plus-circle.png'
import ProjectsModal from './ProjectsModal';
import { format } from 'date-fns';
import moment from 'moment';



const MyProjects = (props) => {

  const [allProjects, setAllProjects] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [modalType, setmodalType] = useState(1);
  const [projectId, setprojectId] = useState(1);

  let userInfo = JSON.parse(localStorage.getItem('user-info'))
  let userId = userInfo.userId;

  useEffect(() => {
    console.log('useEfffeect callec');
    get();
  }, [openModel]);

  const get = async () => {
    await HttpService.get('affiliate-projects').then(async (res) => {
      if (res) {
        setAllProjects(res.data);
      }
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

  const handleClick = () => {
    setOpenModel(true);
    setmodalType(1)
  }
  const setValues = (idvalue) => {
    setOpenModel(true);
    setprojectId(idvalue);
  }

  const updateProjects = (valueId) => {
    setmodalType(2);
    setValues(valueId);
  }

  const deleteProject = (valuId) => {
    setmodalType(3);
    setValues(valuId);

  }

  const markAsCompleted = async (id) => {
    await HttpService.get('affiliate-projects/mark-as-completed/' + id)
      .then(async (res) => {
        if (res) {
          get();
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  const markAsCancelled = async (id) => {
    await HttpService.get('affiliate-projects/mark-as-rejected/' + id)
      .then(async (res) => {
        if (res) {
          get();
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  const setDate = (date) => {
    return moment.parseZone(date).format('MM-DD-yyyy');
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
                onClick={handleClick}
              >
                <img src={PlusCircle} alt='PlusCircle' />
              </button>
            </label>
          </div>
        </div>
        <div className='card-body'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr>
                  <th scope='col'>Client Name</th>
                  <th scope='col'>Partnered Affiliate</th>
                  <th scope='col'>Start Date</th>
                  <th scope='col'> End Date</th>
                  <th scope='col' colSpan="2"> Status</th>
                </tr>
              </thead>
              <tbody>
                {allProjects && allProjects.map((result) => {
                  return (
                    <tr>
                      <th scope='row'>{result.ClientName}</th>
                      <td>
                        {result.CreatedUserId == userId ? (result.PartneredAffiliate ? result.PartneredAffiliate.Name : null) : result.CreatedUser.Name}
                      </td>
                      <td> {setDate(result.StartDate)}</td>
                      <td>{setDate(result.EndDate)}</td>
                      <td>
                        {result.ProjectStatus != 0 ?
                          <button className='btn btn-success btn-rounded'>
                            {result.ProjectStatus == 1 ? 'Ongoing' : result.ProjectStatus == 2 ? 'Completed' : result.ProjectStatus == 3 ? 'Rejected' : null}
                          </button>
                          : null}
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


                          {/* {result.CreatedUserId == userId ? */}
                          <ul
                            className='dropdown-menu'
                            aria-labelledby='dropdownMenuButton1'
                          >

                            <li>
                              {/* {result.ProjectType === "Collaboration Request" ? 
                        <button type="button" className='dropdown-item' onClick ={() => markAsCompleted(result.AffiliateProjectId)}>
                          Mark as completed
                        </button>
                        : */}
                              <button type="button" className='dropdown-item' onClick={() => deleteProject(result.AffiliateProjectId)}>
                                Delete Proejct
                        </button>
                              {/* } */}
                            </li>
                            <li>
                              {/* {result.ProjectType === "Collaboration Request" ?
                        <button className='dropdown-item' onClick={() => markAsCancelled(result.AffiliateProjectId)}>
                          Mark as cancelled
                        </button>
                        : */}
                              <button className='dropdown-item' onClick={() => updateProjects(result.AffiliateProjectId)}>
                                Update Project
                        </button>
                              {/* } */}
                            </li>
                          </ul>
                          {/* : <ul></ul>} */}

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
                        {result.CreatedUserId == userId ? result.StartedByUser.Name : result.CompanyName}
                      </td>
                      <td> {setDate(result.StartDate)}</td>
                      <td>{setDate(result.EndDate)}</td>
                      <td>
                        {result.RequestStatus != 0 ?
                          <button className='btn btn-success btn-rounded'>
                            {result.RequestStatus == 1 ? 'Ongoing' : result.RequestStatus == 2 ? 'Completed' : result.RequestStatus == 3 ? 'Rejected' : null}
                          </button>
                          : null}
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


                          {result.CreatedUserId == userId ?
                            <ul
                              className='dropdown-menu'
                              aria-labelledby='dropdownMenuButton1'
                            >

                              <li>
                               
                                  <button type="button" className='dropdown-item' onClick={() => markAsCompleted(result.AffiliateProjectId)}>
                                    Mark as completed
                        </button>
                                  
                              </li>
                              <li>
                                
                                  <button className='dropdown-item' onClick={() => markAsCancelled(result.AffiliateProjectId)}>
                                    Mark as cancelled
                        </button>
                                  
                              </li>
                            </ul> : <ul></ul>}

                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

          </div>

        </div>
        <ProjectsModal
          show={openModel}
          idofproject={projectId}
          modalType={modalType}
          onHide={() => setOpenModel(false)}
        />
      </div>

      {/* <Model /> */}
    </>
  )
}

export default MyProjects;
