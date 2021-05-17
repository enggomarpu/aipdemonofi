import React, { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import BioModel from './bio-modal.component'

import './Bio.css'

const AffiliateBio = (props) => {
  const [userBio, setBio] = useState()
  const [getEmail, setgetEmail] = useState()
  const [openModel, setOpenModel] = useState(false)

  useEffect(() => {
    get();
  }, [openModel]);

  const get = async () => {
    await HttpService.get(`user/profile/${props.userId}`)
      .then((res) => {
        setgetEmail(res.data.Profile.Email)
        setBio(res.data.Profile.Bio)
      })
      .catch((err) => {
        console.error('Api Call Error', err)
      })
  }

  const handleModel = () => {
    setOpenModel(true)
  }
  return (
    <>
      <div className='card custom-card'>
        <div className='card-header d-flex justify-content-between mb-3'>
          <h5 className='card-title align-self-center'>{props.heading5}</h5>
          <div className='header-button align-self-center'>
            <button type='button' className='btn p-1 ms-1'>
              <i
                className='fas fa-pen'
                aria-hidden='true'
                onClick={handleModel}
              ></i>
            </button>
            <BioModel
              show={openModel}
              onHide={() => setOpenModel(false)}
              bioValue={userBio}
              UserID={props.userId}
              email={getEmail}
            />
          </div>
        </div>
        <div className='card-body' style={{ textAlign: 'left' }}>
          <p>{userBio}</p>
        </div>
      </div>
    </>
  )
}

export default AffiliateBio
