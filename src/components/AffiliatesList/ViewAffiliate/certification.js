import React, { useState, useEffect } from "react";
import HttpService from "../../../shared/http.service";
import { format } from "date-fns";
import moment from "moment";

const MyCertifications = (props) => {
  const [certification, setcertification] = useState([]);
  const [teamMembers, setTeamMembers] = useState();


  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    await HttpService.get(`user/profile/${props.userId}`)
      .then((res) => {
        setcertification(res.data.MyCertifications);
        setTeamMembers(res.data.TeamMembers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setDate = (date) => {
    return moment.parseZone(date).format('MM-DD-yyyy');
   }

  return (
    <>
      <div className="card custom-card">
        <div className="card-header d-flex justify-content-between mb-3">
          <h5 className="card-title align-self-center">{props.heading5}</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Provider</th>
                  <th scope="col">Issue Date</th>
                  <th scope="col"> Expiry Date</th>
                  <th scope="col"> Certification URL</th>
                  <th scope="col" colSpan="2">
                    {" "}
                    Team Member
                  </th>
                </tr>
              </thead>
              <tbody>
                {certification.map((result) => {
                  console.log("all certficatinos in table", result);
                  return (
                    <tr>
                      <th scope="row">{result.Title}</th>
                      <td>{result.Provider}</td>
                      <td> {setDate(result.IssueDate)}</td>
                      <td> {setDate(result.DateCompleted)}</td>
                      <td>{result.CertificationUrl}</td>
                      <td>
                        {result.TeamMembers &&
                          result.TeamMembers.map((member) => {
                            return member.Name + ",";
                          })}
                      </td>
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
};

export default MyCertifications;
