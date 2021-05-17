import React, { useState, useEffect } from 'react'
import HttpService from '../../shared/http.service'
import { Link } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import Modal from './create-affiliate-modal.component'
import Swal from 'sweetalert2'
import './AffiliatesList.scss'
import './Affiliates.scss'

const AffiliatesData = (props) => {

  const [results, setresults] = useState([])
  const [openModel, setOpenModel] = useState(false);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    get()
    props.setPageTitle();
  }, [openModel])

  const get = async () => {
    await HttpService.get('user/all-affiliates')
      .then((res) => {
        console.log('result' , res);
        setresults(res.data)
        
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const renderSkillColumn = (skills) => {
    return skills.map((skill, index) => {
      return <td>{skill}</td>
    })
  }

  const deActivateConfirmation = async (userId, isAdminApproved) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isAdminApproved
        ? "Yes, Deactivate it!"
        : "Yes, Activate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HttpService.get(`user/active-deactivate-affilliate/${userId}`)
          .then((res) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: isAdminApproved
                ? "Affiliate Deactivated Successfully"
                : "Affiliate Activated Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            get();
          })
          .catch((err) => {
            console.log("Something weirred has happened");
          });
      }
    });
  };

  const resendInvite = async (UserId) => {
    await HttpService.get(`user/resend-invite/${UserId}`)
      .then((res) => {
        this.get()
      })
      .catch((err) => {
        console.log('Something weirred has happened')
      })
  }

  const deleteAccount = async (UserId) => {
    return await HttpService.delete(`user/admin-delete-sub-account/${UserId}`)
      .then((response) => {
        if (response) {
        }
      })
      .catch(() => {});
  };
  const deleteAccountConfirmation = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
       deleteAccount(userId)
          .then((res) => {
            Swal.fire({
              position: "center",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            get();
          })
          .catch((err) => {
            console.log("Something weirred has happened");
          });
      }
    });
  };



  return (
    <>
      <div className='list-container'>
        <div className='row g-0 justify-content-between mb-3'>
          <div className='col'>
            <h2 className='custom-heading'>Affiliates List</h2>
          </div>
          <div className='col-auto'>
            <ul className='nav'>
              <li className='nav-item'>
                <div className='d-grid'>
                  <button className='d-grid btn btn-primary' onClick={() =>setOpenModel(true)}>
                  Create Affiliate
                  </button>
                 
                </div>
              </li>
              <li className='nav-item ps-3'>
                <div className='input-group search-group'>
                  <button className='btn btn-outline-secondary' type='submit'>
                    <i className='fas fa-search' />
                  </button>
                  <input
                    className='form-control'
                    type='search'
                    placeholder='Search affiliate'
                    aria-label='Search'
                  />
                </div>
              </li>

              <li className='nav-item'>
                <a className='navlink' href='/'>
                  <i className='fas fa-sort-amount-up' />
                  Sort
                </a>
              </li>
              <li className='nav-item'>
                <a className='navlink' href='/'>
                  <i className='fas fa-filter' />
                  Filter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <table className='table'>
          <thead>
            <tr>
              {/* <th  /> */}
              <th>Affiliate Name</th>
              <th>Interests</th>
              <th>Location</th>
              <th>Skills</th>
              <th>Status</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {results.map((result) => {
              console.log('Result', result);
              return (
                <tr key={result.UserId}>
                  <td>
                    <span>{result.CompanyName}</span>
                  </td>
                  <td>
                    {" "}
                    <div className="checkbox-group">
                      {result.Interests.map((interest, index) => {
                        return (
                          <span key={index} className="btn btn-primary">
                            {interest.InterestName &&
                              interest.InterestName +
                                (result.Interests.length - 1 > index ? ", " : "")}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td>{result.Address}</td>
                  <td>
                    <div className="checkbox-group">
                      {result.Skills.map((skill, index) => {
                        return (
                          <span key={index} className="btn btn-primary">
                            {skill.SkillName &&
                              skill.SkillName +
                                (result.Skills.length - 1 > index ? ", " : "")}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    {result.IsAdminApproved
                      ? result.IsActive
                        ? "Activated"
                        : "Invite Sent"
                      : "Deactivated"}
                  </td>
                  <td>
                    <Link
                      className="d-grid btn btn-secondary"
                      to={`/affiliatesprofile/${result.UserId}`}
                    >
                      View
                    </Link>
                  </td>
                  <td>
                    <div className="text-end">
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
                          {!result.IsActive && result.IsAdminApproved && (
                            <button
                              className="dropdown-item"
                              onClick={() => resendInvite(result.UserId)}
                            >
                              Resend Invite
                            </button>
                          )}
                        </li>
                        <li>
                          {result.IsActive && result.IsAdminApproved && (
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                deActivateConfirmation(
                                  result.UserId,
                                  result.IsAdminApproved
                                )
                              }
                            >
                              Deactivate Account
                            </button>
                          )}
                          {result.IsActive && !result.IsAdminApproved && (
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                deActivateConfirmation(
                                  result.UserId,
                                  result.IsAdminApproved
                                )
                              }
                            >
                              Activate Account
                            </button>
                          )}
                        </li>
                        <li>
                          {(!result.IsAdminApproved ||
                            !result.IsActive ||
                            result.IsAdminApproved) && (
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                deleteAccountConfirmation(result.UserId)
                              }
                            >
                              Delete Account
                            </button>
                          )}
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
      <Modal 
       show={openModel}
      onHide={() => setOpenModel(false)}
        />
    </>
  
    // <tr>
    //   <td colspan='100%'>
    //     <BeatLoader
    //       css={`
    //           text-align: center;
    //           margin-left: 150px;
    //         `}
    //       color={'#2f3272'}
    //       loading={loading}
    //       size={10}
    //       margin={2}
    //     />
    //     {!loading && 'No records found!'}
    //   </td>
    // </tr>
  )
}

export default AffiliatesData
