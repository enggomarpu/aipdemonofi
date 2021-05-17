import React, { useState, useEffect } from 'react'
import HttpService from '../../shared/http.service'
import BeatLoader from 'react-spinners/BeatLoader'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import "./AffiliatesList.scss";
import './Affiliates.scss'
import { get } from 'react-hook-form'



const AffiliatesSubAccountsComponent = (props) => {

  const [results, setresults] = useState([])
  const [loading, setloading] = useState("")

  useEffect(() => {
    get()
    props.setPageTitle();
  }, [])


  const get = async () => {
    await HttpService.get('user/admin-all-sub-accounts')
      .then((res) => {
        setresults(res.data)
        setloading(false)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const deactivateAccount = async (UserId) => {
    await HttpService.get(`user/deactivate-sub-account/${UserId}`)
      .then((res) => {
        get()
      })
      .catch((err) => {
        console.log('Something weirred has happened')
      })
   // window.location.reload()
  }

  const ActivateAccount = async (UserId) => {
    await HttpService.get(`user/active-sub-account/${UserId}`)
      .then((res) => {
        get()
      })
      .catch((err) => {
        console.log('Something weirred has happened')
      })
   // window.location.reload()
  }

  const resendInvite = async (UserId) => {
    await HttpService.get(`user/sub-account-invite/${UserId}`)
      .then((res) => {
        get()
      })
      .catch((err) => {
        console.log('Something weirred has happened')
      })
   // window.location.reload()
  }

  const deleteAccount = async (UserId) => {
    
    await HttpService.delete(`user/admin-delete-sub-account/${UserId}`)
      .then((response) => {
        get()
      })
      .catch(() => {
      });
    //  window.location.reload()
  };


  return (
    <>
      <div className="list-container">
        <div className="row g-0 justify-content-between mb-3">
          <div className="col">
            <h2 className="custom-heading">Available</h2>
          </div>
          <div className="col-auto">
            <ul className="nav">
              <li className="nav-item"></li>
              <li className="nav-item ps-3">
                <div className="input-group search-group">
                  <button
                    className="btn btn-outline-secondary"
                    type="submit"
                  >
                    <i className="fas fa-search" />
                  </button>
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search affiliate"
                    aria-label="Search"
                  />
                </div>
              </li>

              <li className="nav-item">
                <a className="navlink" href="/">
                  <i className="fas fa-sort-amount-up" />
                        Sort
                      </a>
              </li>
              <li className="nav-item">
                <a className="navlink" href="/">
                  <i className="fas fa-filter" />
                        Filter
                      </a>
              </li>
            </ul>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Company Name</th>
              <th scope="col">Sub-Account Name</th>
              <th scope="col">Sub-Account Email</th>
              <th scope="col">Role</th>
              <th scope="col" colSpan="2">
                Status
                    </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => {
              return (
                <tr>
                  <td>
                    <span>{result.CompanyName}</span>
                  </td>
                  <td>{result.Name}</td>
                  <td>{result.Email}</td>
                  <td>{result.UserRole.Role}</td>
                  <td>
                  { (result.IsAdminApproved == true && result.IsActive == true) && 'Active' }
                  { (!result.IsAdminApproved == true && !result.IsActive == false) && 'Pending' }
                  { (result.IsAdminApproved == true && !result.IsActive) && 'Approved' }
                  </td>
                  <td className="div-grid dropdown">
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
                    {(!result.IsAdminApproved == true && !result.IsActive == false) && (
                      <button
                        className='dropdown-item'
                        onClick={() => resendInvite(result.UserId)}
                      >
                        Approve Account
                      </button>
                    )}
                  </li>
                      {/* <li>
                      {result.IsActive && result.IsAdminApproved  && (
                      <button
                        className='dropdown-item'
                        href='#'
                        onClick={() => deactivateAccount(result.UserId)}
                      >
                        Deactivate Account
                      </button>
                    )}
                      </li>
                      <li>
                    {!result.IsActive && result.IsAdminApproved  && (
                      <button
                        className='dropdown-item'
                        href='#'
                        onClick={() => deactivateAccount(result.UserId)}
                      >
                        Reject Account
                      </button>
                    )}
                  </li> 
                  <li>
                    {result.IsActive && !result.IsAdminApproved && (
                      <button
                        className='dropdown-item'
                        href='#'
                        onClick={() => ActivateAccount(result.UserId)}
                      >
                        Activate Account
                      </button>
                    )}
                  </li> */}
                  <li>
                   
                      <button
                        className='dropdown-item'
                        href='#'
                        onClick={() => deleteAccount(result.UserId)}
                      >
                        Delete Account
                      </button>
                 
                  </li>
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>

    // <tr>
    //   <td colspan="100%">
    //     <BeatLoader
    //       css={`
    //           text-align: center;
    //           margin-left: 150px;
    //         `}
    //       color={"#2f3272"}
    //       loading={loading}
    //       size={10}
    //       margin={2}
    //     />
    //     {!loading && "No records found!"}
    //   </td>
    // </tr>
  );
}

export default AffiliatesSubAccountsComponent
