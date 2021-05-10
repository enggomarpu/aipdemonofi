import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import HttpService from '../../../shared/http.service'
import { StateContext } from '../../CreateProfile/Context/GlobalProvider'
//import Model from './BioModal2'
import BioModel from './BioModal'

import './Bio.css'

const Bio = (props) => {
  const userDetail = useContext(StateContext)
  const [isLoading, setLoading] = useState(true)
  const [userBio, setBio] = useState()
  const [isEdit, setEdit] = useState(false)
  const [fullUser, setFullUser] = useState()
  const [openModel, setOpenModel] = useState(false)
  const [email, setemail] = useState("")

  useEffect(() => {
    get()
  }, [openModel])

  const get = async () => {
    await HttpService.get('user/profile')
      .then((res) => {
        setFullUser(res.data)
        setBio(res.data.Bio)
        setemail(res.data.Email)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Api Call Error', err)
      })
  }

  const handleModel = () => {
    setOpenModel(true)
  }
  //   const put = async (BioData) => {
  //     await HttpService.put('user/profile', BioData).then((res) => {
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  //   }

  //   const onEdit = () => {
  //     setEdit(!isEdit);
  //     console.log('statte in bio', userDetail)
  //   }

  // const onSave = () => {

  //   const bioObje = {
  //     Email: fullUser.Email,
  //     Bio: userBio
  //   }
  //     put(bioObje);
  //     setEdit(false);
  // }
  // const OnEditing = (e) => {
  //     const { name, value } = e.target;
  //     setBio(value);

  // }
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
            {/* <button className = 'btn' onClick={onEdit}>
            {isEdit === true ? 
              <i className='fas fa-times' aria-hidden='true'></i> : <i className='fas fa-pen' aria-hidden='true'></i>}
            </button>
            {isEdit && <button><i className="fa fa-save" onClick={onSave}></i></button>} */}

            {/* <Model bioValue={userBio}/> */}
            <BioModel
              show={openModel}
              onHide={() => setOpenModel(false)}
              bioValue={userBio}
              mail={email}
            />
          </div>
        </div>
        <div className='card-body' style={{ textAlign: 'left' }}>
          {/* { isEdit === false ? <p>{isLoading ? 'Loading .... ' : userBio} </p> :
          <textarea style = {{width : '100%', minHeight : '150px'}} onChange={OnEditing} value={userBio}></textarea>
        } */}
          <p>{userBio}</p>
        </div>
      </div>
    </>
  )
}

export default Bio
