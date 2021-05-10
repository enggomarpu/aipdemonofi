import React, { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import TeamModel from './TeamModal'
import PlusCircle from '../../../img/plus-circle.png'
import { format } from 'date-fns';
import moment from 'moment';


const MyTeam = ({data}) => {

  const [allTeamMembers, setAllTeamMembers] = useState([]);
 const [openModel, setOpenModel] = useState(false);
  const [modalType, setmodalType] = useState(1);
  const [teamId, setTeamId] = useState(1);
 

  useEffect(() => {
      get();
  }, [openModel]);

    const get = async () => {
        await HttpService.get('affiliate-team').then((res) => {
          setAllTeamMembers(res.data);
        }).catch((err) => {
          console.log(err);
        });
  }
 const createAccount = () => {
  setmodalType(1);
  setOpenModel(true);
}

const setValues = (idvalue) => {
  setOpenModel(true);  
  setTeamId(idvalue);
}
const updateAccount = (valueId) => {
  setmodalType(2);
  setValues(valueId);
}
 
 const deleteTeamMember = (valuId) => {
  setmodalType(3);
  setValues(valuId);
    
 }
 const setDate = (date) => {
  return moment.parseZone(date).format('MM-DD-yyyy');
 }

  return (
    <>
      <div className='card custom-card'>
        <div className='card-header d-flex justify-content-between mb-3'>
          <h5 className='card-title align-self-center'>My Team</h5>
          <div className='header-button align-self-center'>
            <label>
              Add Team Member
              <button
                type='button'
                className='btn p-1 ms-1'
                data-bs-toggle='modal'
                data-bs-target='#TeamModal'
              >
                <img src={PlusCircle} alt='PlusCircle' onClick={createAccount} />
              </button>
            </label>
          </div>
        </div>

        {(allTeamMembers && allTeamMembers.length) ? 
        <div className='card-body'>
          <div className='table-responsive'>
            
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Role</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col" colSpan="2">Linkedin</th>
                </tr>
              </thead>
      
              {allTeamMembers.map((result) => {
                console.log('my team whole object', result);
                  return (
              <tbody>
                <tr>
                  <th scope="row">{result.Name}</th>
                  <td>{result.Role}</td>
                  
                  <td >{setDate(result.WorkSince)}</td>
                  <td >{setDate(result.EndDate)}</td>
                  <td > {result.LinkedInUrl}</td>
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
                        <button type="button" className='dropdown-item' href='#' onClick ={() => deleteTeamMember(result.AffiliateTeamMemberId)}>
                          Delete Team Member
                        </button>
                      </li>
                      <li>
                        <button className='dropdown-item' href='#' onClick={() => updateAccount(result.AffiliateTeamMemberId)}>
                          Update Team Member
                        </button>
                      </li>
                    </ul>
                    
                  </div>
                  </td>
                </tr>
              </tbody>
              
      )})}
            </table>
          </div>
         
        </div>
        : null}
        <TeamModel
            idofteam = {teamId}
            show={openModel}
            onHide={() => setOpenModel(false)}
            modalType = {modalType}
          />
      </div>

      {/* <TeamModel /> */}
    </>
  )
}

export default MyTeam
