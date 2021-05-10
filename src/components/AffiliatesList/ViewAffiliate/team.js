import React, { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import { format } from 'date-fns';
import moment from 'moment';

const MyTeam = (props) => {

  const [AffiliateTeam, setTeam] = useState([]);
  
  useEffect(() => {
      get();
  }, []);

    const get = async () => {
        await HttpService.get(`user/profile/${props.userId}`).then((res) => {
          setTeam(res.data.TeamMembers);
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
          <h5 className='card-title align-self-center'>My Team</h5>
        </div>

        <div className='card-body'>
          <div className='table-responsive'>
            
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Role</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col" colSpan="2">LinkedIn</th>
                </tr>
              </thead>
      
              {AffiliateTeam.map((result) => {
                  return (
              <tbody>
                <tr>
                  <th scope="row">{result.Name}</th>
                  <td>{result.Role}</td>
                  <td >{setDate(result.WorkSince)}</td>
                  <td >{setDate(result.EndDate)}</td>
                  <td > {result.LinkedInUrl}</td>
                </tr>
              </tbody>
              
      )})}
            </table>
          </div>
    
        </div>
      </div>

      {/* <TeamModel /> */}
    </>
  )
}

export default MyTeam
