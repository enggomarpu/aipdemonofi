import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PlusCircle from '../../../img/plus-circle.png'
import TermsCondsModel from './terms-and-condition-model.component';
import HttpService from '../../../shared/http.service';
import { Spinner } from 'react-bootstrap';



const TermsAndConditions = (props) => {

  const [termsConditions, setTermsConditons] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState();

  const [nameOfTermsCond, setNameOfTermsCond] = useState();
  const [messageOfTermsConds, setMessageOfTermsConds] = useState();
  const [idOfTermsConds, setIdOfTermsConds] = useState();
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    get();
    props.setPageTitle();
  }, [openModal]);

  const get = async () => {
    await HttpService.get('TermsAndConditions').then(async (res) => {
      if (res) {
        setTermsConditons(res.data);
        setLoading(true)
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  const setValues = (id, name, msg) => {
    setIdOfTermsConds(id);
    setNameOfTermsCond(name);
    setMessageOfTermsConds(msg)
  }
  // const createTermsConds = () => {
  //   setOpenModal(true)
  //   setModalType(1)
  // }
  const editTermsConds = (idt, nam, mesg) => {
    setOpenModal(true)
    setModalType(2);
    setValues(idt, nam, mesg)
  }

  // const deleteTermsConds = (id, name, messag) =>{
  //   setOpenModal(true)
  //   setModalType(3)
  //   setValues(id, name, messag)    
  // }

  return (
    <>
      <div className='row'>
        <div className='col-md-8'>

          <div className='card custom-card'>
            <div className='card-header d-flex justify-content-between mb-3'>
              <h5 className='card-title align-self-center'>Terms &#38; Conditions</h5>
              <div className='header-button align-self-center'>

                {/* <label>
                Add Interest
                <button
                  type='button'
                  className='btn p-1 ms-1'
                  onClick={createTermsConds}
                  
                >
                  <img src={PlusCircle} alt='PlusCircle' />
                </button>
              </label> */}

              </div>
            </div>

            <div className='card-body'>
              <div className='table-responsive'>
                <table className='table'>
                  <thead>
                    <tr>

                      <th scope='col'>Name</th>
                      <th scope='col'>Message</th>
                      <th scope='col'>Created Date</th>
                      <th scope='col'>Edit/Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? <Spinner animation="border" /> :
                      termsConditions && termsConditions.map((tag) => {
                        return (
                          <tr >
                            <><td style={{ textAlign: "left" }}>{tag.Name}</td>
                              <td style={{ textAlign: "left" }}>{tag.Message}</td>
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
                                  {/* <li>
                        <button type="button" className='dropdown-item' href='#' onClick={() => deleteTermsConds(tag.TermsAndConditionsId, tag.Name, tag.Message)} >
                          Delete Proejct
                        </button>
                      </li> */}
                                  <li>
                                    <button className='dropdown-item' href='#' onClick={() => editTermsConds(tag.TermsAndConditionsId, tag.Name, tag.Message)}>
                                      Update Terms &#38; Conditions
                        </button>
                                  </li>
                                </ul>

                              </div>
                            </td>
                          </tr>
                        )

                      })}

                    <TermsCondsModel
                      show={openModal}
                      idoftermsconds={idOfTermsConds}
                      nameoftermsconds={nameOfTermsCond}
                      messageoftermsconds={messageOfTermsConds}
                      modaltype={modalType}
                      onHide={() => setOpenModal(false)}
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
export default TermsAndConditions