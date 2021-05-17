import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PlusCircle from '../../../img/plus-circle.png'
import InterestModel from './interest-add-model.component';
import HttpService from '../../../shared/http.service';
import { Spinner } from 'react-bootstrap';



const InterestsTags = (props) => {

  const [interestsTags, setInterestsTags] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState();
  const [nameOfInterest, setNameOfInterest] = useState();
  const [idOfInterest, setIdOfInterest] = useState();
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    get();
    props.setPageTitle();
  }, [openModal]);

  const get = async () => {
    await HttpService.get('interest').then(async (res) => {
      if (res) {
        setInterestsTags(res.data);
        setLoading(true)
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  const createInterest = () => {
    setOpenModal(true)
    setModalType(1)
  }
  const editInterest = (id, name) => {

    setOpenModal(true)
    setModalType(2);
    setNameOfInterest(name);
    setIdOfInterest(id)

  }

  const deleteInterest = (id, name) => {

    setOpenModal(true)
    setModalType(3)
    setNameOfInterest(name);
    setIdOfInterest(id)


  }

  return (
    <>
      <div className='row'>
        <div className='col-md-8'>

          <div className='card custom-card'>
            <div className='card-header d-flex justify-content-between mb-3'>
              <h5 className='card-title align-self-center'>Interests</h5>
              <div className='header-button align-self-center'>
                <label>
                  Add Interest
                <button
                    type='button'
                    className='btn p-1 ms-1'
                    onClick={createInterest}

                  >
                    <img src={PlusCircle} alt='PlusCircle' />
                  </button>
                </label>
              </div>
            </div>

            <div className='card-body'>
              <div className='table-responsive'>
                <table className='table'>
                  <thead>
                    <tr>

                      <th scope='col'>Interest Name</th>
                      <th scope='col'>Created Date</th>
                      <th scope='col'>Edit/Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? <Spinner animation="border" /> :
                      interestsTags && interestsTags.map((tag) => {


                        return (
                          <tr >
                            <><td style={{ textAlign: "left" }}>{tag.InterestName}</td>

                              <td style={{ textAlign: "left" }}>{format(new Date(tag.CreatedDate), 'yyyy-MM-dd')}</td></>
                            <td>
                              <div className='dropdown d-inline-block'>
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
                                    <button type="button" className='dropdown-item' href='#' onClick={() => deleteInterest(tag.InterestId, tag.InterestName)} >
                                      Delete Interest
                        </button>
                                  </li>
                                  <li>
                                    <button className='dropdown-item' href='#' onClick={() => editInterest(tag.InterestId, tag.InterestName)}>
                                      Update Interest
                        </button>
                                  </li>
                                </ul>

                              </div>
                            </td>
                          </tr>
                        )

                      })}

                    <InterestModel
                      show={openModal}
                      //enDate = {endtDate}
                      //description = {description}
                      //modalType = {modalType}
                      idofinterest={idOfInterest}
                      nameofinterest={nameOfInterest}
                      modaltype={modalType}
                      onHide={() => setOpenModal(false)}
                      interesttags = {interestsTags}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>



          {/* <PendingRequests />
              <MyCertifications/>
              <MyTeam  /> */}
        </div>
        <div className='col-md-4'>
          {/* <ProfileForm  />
              <SubAccounts /> 
              <Documents />
             */}
        </div>
      </div>
    </>

  )
}
export default InterestsTags