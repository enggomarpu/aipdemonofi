import React, { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'

const AffiliateBio = (props) => {
const [userBio, setBio] = useState()

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    await HttpService.get(`user/profile/${props.userId}`)
      .then((res) => {

        setBio(res.data.Profile.Bio)
      })
      .catch((err) => {
        console.error('Api Call Error', err)
      })
  }

  return (
    <>
      <div className='card custom-card'>
        <div className='card-header d-flex justify-content-between mb-3'>
          <h5 className='card-title align-self-center'>{props.heading5}</h5>
        </div>
        <div className='card-body' style={{ textAlign: 'left' }}>
          <p>{userBio}</p>
        </div>
      </div>
    </>
  )
}

export default AffiliateBio
