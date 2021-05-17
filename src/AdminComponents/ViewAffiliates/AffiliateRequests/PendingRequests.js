import React, {useState, useEffect} from 'react'
import HttpService from '../../../shared/http.service'
const Bio = () => {

  const [userPendingRequest, setPendingRequest] = useState([]);

  useEffect(() => {
    get();
}, []);

const get = async () => {
  await HttpService.get('affiliates/pending-requests').then((res) => {
    setPendingRequest(res.data);
  }).catch((err) => {
    console.log(err);
  });
}

  return (
    <>
      <div className='card custom-card'>
        <div className='card-header d-flex justify-content-between mb-3'>
          <h5 className='card-title align-self-center'>My Requests</h5>
          <div className='header-button align-self-center'>
            {/* <label>
              Add new request
              <button
                type='button'
                className='btn p-1 ms-1'
                data-bs-toggle='modal'
                data-bs-target='#AppModal'
              >
                <img src={PlusCircle} alt='PlusCircle' />
              </button>
            </label> */}
          </div>
        </div>
        <div className='card-body'>
          <div className='table-responsive'>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Request Type</th>
                  <th scope="col">Name</th>
                  <th scope="colgroup" colSpan="2">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
              {userPendingRequest.map((result) => {
                  return (
                <tr>
                  <th scope="row">{result.RequestType}</th>
                  <td>{result.Name}</td>
                  <td>
                    <button className="btn btn-warning btn-rounded">
                      {result.Status}
                    </button>
                  </td>
                  <td>
                    <button className="btn">
                      <i className="fas fa-ellipsis-v" />
                    </button>
                  </td>
                </tr>
                  )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <Model /> */}
    </>
  )
}

export default Bio
