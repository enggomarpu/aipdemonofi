import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PlusCircle from '../../../img/plus-circle.png'
import SkillModel from './adding-skills-model.component';
import HttpService from '../../../shared/http.service';
import { Spinner } from 'react-bootstrap';



const SkillsTags = (props) => {

  const [skillstags, setSkillsTags] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState();
  const [nameOfSkill, setNameOfSkill] = useState();
  const [idOfSkill, setIdOfSkill] = useState();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    get();
    props.setPageTitle();
  }, [openModal]);

  const get = async () => {
    await HttpService.get('skill').then(async (res) => {
      if (res) {

        setSkillsTags(res.data);
        setLoading(true)
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  const createSkill = () => {
    setOpenModal(true)
    setModalType(1)
  }
  const editSkill = (id, name) => {

    setOpenModal(true)
    setModalType(2);
    setNameOfSkill(name);
    setIdOfSkill(id)

  }

  const deleteSkill = (id, name) => {

    setOpenModal(true)
    setModalType(3)
    setNameOfSkill(name);
    setIdOfSkill(id)


  }

  return (
    <>
      <div className='row'>
        <div className='col-md-8'>

          <div className='card custom-card'>
            <div className='card-header d-flex justify-content-between mb-3'>
              <h5 className='card-title align-self-center'>Skills</h5>
              <div className='header-button align-self-center'>
                <label>
                  Add Skill
                <button
                    type='button'
                    className='btn p-1 ms-1'
                    onClick={createSkill}

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

                      <th scope='col'>Skill Name</th>
                      <th scope='col'>Created Date</th>
                      <th scope='col'>Edit/Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? <Spinner animation="border" /> :
                      skillstags && skillstags.map((tag) => {
                        return (
                          <tr >
                            <td style={{ textAlign: "left" }}>{tag.SkillName}</td>

                            <td style={{ textAlign: "left" }}>{format(new Date(tag.CreatedDate), 'yyyy-MM-dd')}</td>
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
                                    <button type="button" className='dropdown-item' href='#' onClick={() => deleteSkill(tag.SkillId, tag.SkillName)} >
                                      Delete Skill
                        </button>
                                  </li>
                                  <li>
                                    <button className='dropdown-item' href='#' onClick={() => editSkill(tag.SkillId, tag.SkillName)}>
                                      Update Skill
                        </button>
                                  </li>
                                </ul>

                              </div>
                            </td>
                          </tr>
                        )

                      })}

                    <SkillModel
                      show={openModal}
                      //enDate = {endtDate}
                      //description = {description}
                      //modalType = {modalType}
                      idofskill={idOfSkill}
                      nameofskill={nameOfSkill}
                      modaltype={modalType}
                      skillstags = {skillstags}
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
export default SkillsTags