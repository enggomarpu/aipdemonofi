import React, { useState, useEffect } from 'react'
import HttpService from '../../shared/http.service'
import BeatLoader from 'react-spinners/BeatLoader';
import AdminSubAcountModal from './admin-sub-accounts-modal.component'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import "./AffiliatesList.scss";
import "./Affiliates.scss"


const AdminSubAccountsComponent = (props) => {

  const [openModel, setOpenModel] = useState(false);
  const [results, setresults] = useState([]);
  const [loading, setloading] = useState(true);
  const [updateId, setupdateId] = useState(0)

  useEffect(() => {
    get()
    props.setPageTitle();
  }, [openModel])
  const get = async () => {
    await HttpService.get('user/admin-view-sub-accounts')
      .then((res) => {
        setresults(res.data);
        setloading(false);

      })
      .catch((err) => {
        console.log(err);
      })
  }
  const deactivateAccount = async (UserId) => {
    await HttpService.get(`user/active-deactivate-sub-account/${UserId}`)
      .then((res) => {
        this.get()
      })
      .catch((err) => {
        console.log('Something weirred has happened')
      })
    window.location.reload()
  }

  const handleClick = () => {
    setOpenModel(true);
  }
  const update = async (UserId) => {
    setOpenModel({ openModel: true });
    setupdateId(UserId);
  }

  const resendInvite = async (UserId) => {
    await HttpService.get(`user/resend-invite/${UserId}`)
      .then((res) => {
        this.get()
      })
      .catch((err) => {
        console.log('Something weirred has happened')
      })
    window.location.reload()
  }

  return (
    <>
      <div className="list-container">
        <div className="row g-0 justify-content-between mb-3">
          <div className="col">
            <h2 className="custom-heading">Available</h2>
          </div>
          <div className="col-auto">
            <ul className="nav">
              <li className="nav-item">
                <div className='d-grid'>
                  <button
                    className='btn btn-secondary'
                    type='button'
                    data-bs-toggle='modal'
                    data-bs-target='#AdminSubAcountModal'
                    onClick={handleClick}
                  >
                    Create Sub-Account
                  </button>
                </div>
              </li>
              <li className="nav-item ps-3">
                <div className="input-group search-group">
                  <button className="btn btn-outline-secondary" type="submit">
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
              <th scope="col">Account Name</th>
              <th scope="col">Account Email</th>
              <th scope="col">Role</th>
              <th scope="col" colSpan="2">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => {
              return (
                <tr key={index}>
                  <td>{result.Name}</td>
                  <td>{result.Email}</td>
                  <td>{result.UserRole.Role}</td>
                  <td>
                    {result.IsAdminApproved
                      ? result.IsActive
                        ? 'Active'
                        : 'In Active'
                      : 'Pending'}
                  </td>
                  <td className='div-grid dropdown'>
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
                        {!result.IsActive && (
                          <button
                            className='dropdown-item'
                            onClick={() => resendInvite(result.UserId)}
                          >
                            Resend Invite
                          </button>
                        )}
                      </li>
                      <li>
                        {result.IsActive && (
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
                        <button
                          className='dropdown-item'
                          onClick={() => update(result.UserId)}
                        >
                          Update
                      </button>

                      </li>
                    </ul>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {openModel && <AdminSubAcountModal
          show={openModel}
          id={updateId}
          onHide={() => setOpenModel(false)}
        />}
        {/* ) : (
      <tr>
        <td colSpan='100%'>
          <BeatLoader
            css={`
              text-align: center;
              margin-left: 150px;
            `}
            color={'#2f3272'}
            loading={loading}
            size={10}
            margin={2}
          />
          {!loading && 'No records found!'}
        </td>
      </tr> */}
      </div>
    </>
  )
}
export default AdminSubAccountsComponent
