import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import httpService from "../../../shared/http.service";


const AffiliateContacts = (props) => {

  const [contact, setcontact] = useState([])

  useEffect(() => {
    get()
    
  }, [])

  const get = async () => {
    await httpService.get(`user/profile/${props.userId}`)
      .then((res) => {
          setcontact(res.data.Profile.Contacts)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  console.log("conatct data",contact)

  return (
    <>
      <div className='card custom-card'>
        <div className='card-header d-flex justify-content-between mb-3'>
          <h5 className='card-title align-self-center'>Contacts</h5>
          <div className='header-button align-self-center'>
          </div>
        </div>
        <div className='card-body'>
          <div className='table-responsive'>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Company Name</th>
                  <th scope="col">Contact Name</th>
                  <th scope="colgroup" colSpan="2">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
              {contact.map((result, index) => {
                    return (
                <tr key={index}>
                  <th scope="row">{result.CompanyName}</th>
                  <td>{result.Name}</td>
                  <td>
                  {result.Email}
                  </td>
                  <td>
                    <Link
                      className="d-grid btn btn-secondary"
                      to={`/affiliatesprofile/${result.UserId}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
                    )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AffiliateContacts;
