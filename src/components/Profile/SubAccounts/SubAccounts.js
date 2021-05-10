import React, { useState, useEffect } from 'react'
import HttpService from './../../../shared/http.service';
import './SubAccounts.scss'
import PlusCircle from '../../../img/plus-circle.png'
import SubAccountModal from './SubAcountModal';

const SubAccounts = ({data}) => {

  const [subAccounts, setSubAccounts] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [modalType, setmodalType] = useState(1);
  const [roleId, setRoleId] = useState(1);
  const [userId, setUserId] = useState(1);
  const [subAccountName, setSubAccountName] = useState();
  const [subAccountEmail, setSubAccountEmail] = useState();
  const [subAccountLastName, setsubAccountLastName] = useState();
  const userInfo= JSON.parse(localStorage.getItem('user-info'))


  useEffect(() => {
      get();
  }, [openModel]);

    const get = async () => {
        await HttpService.get('user/view-sub-account').then((res) => {
          setSubAccounts(res.data);
        }).catch((err) => {
          console.log(err);
        });
  }

  const del = (userid) => { 
    setUserId(userid);
    setmodalType(4);
    setOpenModel(true);

  }
  const handleClick = () => {
    setOpenModel(true);
    setmodalType(1)
  }
  const changePersmission = (name, email, lastN, usrId,subId) => {
    setOpenModel(true);
    setmodalType(2);
    setRoleId(usrId);
    setSubAccountName(name);
    setSubAccountEmail(email);
    setsubAccountLastName(lastN);
    setUserId(subId);
  }
  const viewDetails = (name, email, lastN, usrId,subId) => {
    
    setOpenModel(true);
    setmodalType(3);
    setRoleId(usrId);
    setSubAccountName(name);
    setSubAccountEmail(email);
    setsubAccountLastName(lastN);
    setUserId(subId);
    
  }

  return (
    <>
      <div className='card custom-card'>
        <div className='card-header d-flex justify-content-between'>
          <h5 className='card-title align-self-center'>Sub-accounts</h5>
          <div className='header-button align-self-center'>
            <label>
              Add account
              <button
                type='button'
                className='btn p-1 ms-1'
                onClick = { handleClick }
                //data-toggle="modal" data-target="#exampleModal"
              >
                <img src={PlusCircle} alt='PlusCircle' />
                
              </button>
            </label>
          </div>
        </div>
        
        <div className='card-body p-0'>
        {subAccounts.map((result) => {
          console.log('sub acoount', result.UserId, userInfo.userId)
        return (
          result.UserId !== userInfo.userId && 
          <>
          <ul className="accounts-list">
            <li>
              {/*console.log('sub account aal details', result)*/}
              <div className="d-flex justify-content-between">
                <div className="align-self-center">{result.Name}</div>

                {result.IsAdminApproved
                  ? result.IsActive
                    ? "Active"
                    : "Approved"
                  : "Pending"}

                <div className="align-self-center">
                  {/* <div className='editor'>{result.Email}</div> */}
                  <div className="editor">
                    {result.UserRole.UserRoleId == 2 ? "Admin" : "User"}
                  </div>
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
                        {/* <Link className='dropdown-item' href='#'>
                          Change permissions
                        </Link> */}
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() =>
                            changePersmission(
                              result.Name,
                              result.Email,
                              result.LastName,
                              result.UserRole.UserRoleId,
                              result.UserId
                            )
                          }
                        >
                          Change permissions
                        </button>
                      </li>
                      <li>
                        {/* <Link className='dropdown-item' href='#'>
                          View details
                        </Link> */}
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={(e) =>
                            viewDetails(
                              result.Name,
                              result.Email,
                              result.LastName,
                              result.UserRole.UserRoleId,
                              result.UserId
                            )
                          }
                        >
                          View Details
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          href="#"
                          onClick={() => del(result.UserId)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          </>
        );})}
          <SubAccountModal
            show={openModel}
            subname= {subAccountName}
            subemail={subAccountEmail}
            sublastname = {subAccountLastName}
            userAffId = {userId}
            userroleid = {roleId}
            modalType = {modalType}
            onHide={() => setOpenModel(false)}
            
          />
        </div>
      </div>
              {/* <Model /> */}
    </>
  )
}


export default SubAccounts










