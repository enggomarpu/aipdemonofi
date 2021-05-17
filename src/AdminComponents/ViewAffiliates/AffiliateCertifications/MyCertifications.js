import React, { useState, useEffect } from "react";
import HttpService from "../../../shared/http.service";
import CertificationModel from "./CertificationModal";
import PlusCircle from "../../../img/plus-circle.png";
import { format } from "date-fns";
import moment from "moment";

const MyCertifications = (props) => {
  const [certification, setcertification] = useState([]);

  // const [isEdit, setEdit] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [modalType, setmodalType] = useState(1);
  //const [teamId, setTeamId] = useState(1);
  //const [certificationTitle, setcertificationTitle] = useState();
  //const [certificationProvider, setcertificationProvider] = useState();
  //const [issueDate, setissueDate] = useState();
  //const [certificationUrl, setcertificationUrl] = useState();
  //const [certificationDate, setcertificationDate] = useState();
  const [teamMembers, setTeamMembers] = useState();
  const [certificationId, setCertificationId] = useState();
  const [getEmail, setgetEmail] = useState();

  useEffect(() => {
    get();
  }, [openModel]);

  const get = async () => {
    await HttpService.get(`user/profile/${props.userId}`)
      .then((res) => {
        setcertification(res.data.MyCertifications);
        setgetEmail(res.data.Profile.Email);
        setTeamMembers(res.data.TeamMembers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   const put =  async (id) => {
  //     await HttpService.delete('affiliate-certification/'+ id).then((res) => {
  //       setcertification(id)
  //       setEdit(!isEdit);
  //    }).catch((err) => {
  //      console.log(err);
  //    });
  //  }

  const createAccount = () => {
    setmodalType(1);
    setOpenModel(true);
  };

  const updateAccount = (valueId) => {
    setmodalType(2);
    setOpenModel(true);
    setCertificationId(valueId);
    //setTeamId(valueId);
  };

  const deleteTeamMember = (tId) => {
    setOpenModel(true);
    setmodalType(3);
    setCertificationId(tId);
  };

  const setDate = (date) => {
    return moment.parseZone(date).format('MM-DD-yyyy');
   }
  return (
    <>
      <div className="card custom-card">
        <div className="card-header d-flex justify-content-between mb-3">
          <h5 className="card-title align-self-center">{props.heading5}</h5>
          <div className="header-button align-self-center">
            <label>
              {props.button}
              <button
                type="button"
                className="btn p-1 ms-1"
                data-bs-toggle="modal"
                data-bs-target="#CertificateModal"
              >
                <img
                  src={PlusCircle}
                  alt="PlusCircle"
                  onClick={createAccount}
                />
              </button>
            </label>
          </div>
        </div>

        {(certification && certification.length) ? 
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
                      <td>  {setDate(result.IssueDate)}             
                      </td>
                      <td> {setDate(result.DateCompleted)}
                      </td>
                      <td>{result.CertificationUrl}</td>
                      <td>
                        {result.TeamMembers &&
                          result.TeamMembers.map((member) => {
                            return member.Name + ",";
                          })}
                      </td>
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
                                  deleteTeamMember(
                                    result.AffiliateCertificationId
                                  )
                                }
                              >
                                Delete Certifications
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                href="#"
                                onClick={() =>
                                  updateAccount(result.AffiliateCertificationId)
                                }
                              >
                                Update Certifications
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        : null }
      </div>

      <CertificationModel
        show={openModel}
        onHide={() => setOpenModel(false)}
        teamMembers={teamMembers}
        userid={props.userId}
        affliatecertid={certificationId}
        modalType={modalType}
      />
    </>
  );
};

export default MyCertifications;
