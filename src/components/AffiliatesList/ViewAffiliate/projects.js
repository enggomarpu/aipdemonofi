import React, { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import {format} from 'date-fns';
import moment from 'moment';

const AffiliateProjetcs = (props) => {

  const [allProjects, setAllProjects] = useState([]);

  
  const [allAffliatesPartners, setAllAffliliatesPartners] = useState();

  useEffect(() => {
      get();
  }, []);

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
  }

  const setDate = (date) => {
    return moment.parseZone(date).format('MM-DD-yyyy');
   }
  
    return (
      <>
        <div className="card custom-card">
          <div className="card-header d-flex justify-content-between mb-3">
            <h5 className="card-title align-self-center">{props.headin5}</h5>
          </div>

          <div className="card-body">
            <div class="table-responsive">
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
                  {allProjects.map((result) => {
                    console.log("alll projects admin side", result);
                    return (
                      <tr>
                        <th scope="row">{result.ClientName}</th>
                        <td>
                          {/* <img src={Icon} alt='Icon' /> Tinted Labs */}
                          {result.PartneredAffiliate &&
                            result.PartneredAffiliate.Name}
                        </td>
                        <td> {setDate(result.StartDate)}
                        </td>
                        <td> {setDate(result.EndDate)}
                        </td>
                        <td>
                          <button className="btn btn-success btn-rounded">
                            {result.ProjectStatus === 1
                              ? "Ongoing"
                              : result.ProjectStatus === 2
                              ? "Completed"
                              : result.ProjectStatus === 3
                              ? "Rejected"
                              : null}
                          </button>
                        </td>
                        <td>{result.Description}</td>
                      
                      </tr>
                    );
                  })}
                
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
}

export default AffiliateProjetcs
