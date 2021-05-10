import React, { Component, useEffect, useState } from 'react'
import BackButton from '../BackButton/BackButton'
import './InterestsExpertise.scss'
import Logo from '../../img/logo.png'
import HttpService from './../../shared/http.service'
import Swal from 'sweetalert2'
import { StateContext } from './Context/GlobalProvider'
import { data } from 'jquery'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllInterests,
  getAllSkills,
  getUserInterSkills,
  putInterSkills,
} from '../../reducers/interests-expertise/interestsexpertise.reducer'
import { Redirect } from 'react-router'

const InterestsExpertise = (props) => {
  const [allSkills, setAllSkills] = useState([])
  const [allInterests, setAllInterests] = useState([])
  const [userInterests, setUserInterests] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [isErrorInterests, setIsErrorInterests] = useState(false)
  const [isErrorSkills, setIsErrorSkills] = useState(false)
  const [userInterestsNamesArr, setUserInterestsNamesArr] = useState([])
  const [userSkillsNamesArr, setUserSkillsNamesArr] = useState([])

  const [adminSelected, setAdminSelected] = useState(true)
  const dispatch = useDispatch()

  //const loginState = useSelector(state => state.login);
  const interexpState = useSelector((state) => state.interexp)

  useEffect(() => {
    getUser()
  }, [interexpState.stateUpdated])

  const getUser = async () => {
    //await HttpService.get("user/profile").then(async(res) => {
    //Object.assign(data, res.data);

    if (!interexpState.stateUpdated) {
      dispatch(getUserInterSkills())
    }

    setUserSkills(interexpState.userSkills)
    setUserInterests(interexpState.userInterests)

    //await HttpService.get('all-skills').then(async(resp) => {

    if (interexpState.allInterests.length === 0) {
      dispatch(getAllInterests())
    }
    //
    setAllInterests(interexpState.allInterests)

    // await HttpService.get('all-interests').then((respo) => {
    //setAllInterests(respo.data);
    //})
    if (interexpState.allSkills.length === 0) {
      dispatch(getAllSkills())
    }
    // //
    setAllSkills(interexpState.allSkills)
    //})
    //}).catch((err) => {
    //console.log(err);
    //})
  }

  //Interests Checkbox
  const handleInterestsChange = async (event) => {
    setIsErrorInterests(false)

    const { checked, id } = event.target

    const selectedInterest = allInterests.filter(
      (element) => element.InterestName === id
    )
    let newIntererestsArray = []
    let newIntererestsNamesArray = []
    newIntererestsArray = [...userInterests]

    if (checked) {
      newIntererestsArray.push(selectedInterest[0])

      setUserInterests(newIntererestsArray)
      setAdminSelected(!adminSelected)
    } else {
      newIntererestsArray.pop(selectedInterest)

      setUserInterests(newIntererestsArray)
      setAdminSelected(!adminSelected)
    }

    newIntererestsArray.map((tag) => {
      newIntererestsNamesArray.push(tag.InterestName)
    })

    setUserInterestsNamesArr(newIntererestsNamesArray)

    console.log('interests', userInterests)
  }

  //Skills Checkbox
  const handleSkillsChange = async (event) => {
    setIsErrorSkills(false)
    const { checked, id } = event.target

    const selectedSkill = allSkills.filter(
      (element) => element.SkillName === id
    )

    let newSkillsArray = []
    let newSkillsNamesArray = []
    newSkillsArray = [...userSkills]

    if (checked) {
      newSkillsArray.push(selectedSkill[0])
      setUserSkills(newSkillsArray)
      setAdminSelected(!adminSelected)
    } else {
      newSkillsArray.pop(selectedSkill)

      setUserSkills(newSkillsArray)
      setAdminSelected(!adminSelected)
    }

    newSkillsArray.map((tag) => {
      newSkillsNamesArray.push(tag.SkillName)
    })
    setUserSkillsNamesArr(newSkillsNamesArray)
    console.log('skilsss', userSkills)
  }

  const handleSubmit = async (e) => {
    if (userInterests.length === 0) {
      setIsErrorInterests(true)
    }
    if (userSkills.length === 0) {
      setIsErrorSkills(true)
    }

    const user = JSON.parse(localStorage.getItem('user-info'))
    if (!isErrorInterests && !isErrorSkills) {
      let allData = {
        Email: user.username,
        interests: userInterestsNamesArr,
        skills: userSkillsNamesArr,
      }
      // await HttpService.put("user/profile", allData)
      //     .then((res) => {
      //       //console.log('statu code', res.status);
      //       if( res.status  === 200 || res.status  === 201){
      //         console.log('statu code', res.status);
      //          props.history.push("/allset")
      //     }
      //     })
      //     .catch((error) => {
      //       Swal.fire({
      //         icon: 'error',
      //         title: error.response.status,
      //         html: error.response.data.message,
      //       });
      //     });

      //   }

      if (!interexpState.dataPutted) {
        dispatch(putInterSkills(allData))
      }
      if (interexpState.putFail) {
        Swal.fire({
          icon: 'error',
          //title: error.response.status,
          html: interexpState.errorMessage,
        })
      }
    }
  }

  return (
    <>
      <BackButton />
      <div className='text-center mt-5 mb-5'>
        <img src={Logo} alt='Logo' />
      </div>
      <div className='container bg-white'>
        <div className='row justify-content-center pt-5 pb-5'>
          <div className='col-md-8'>
            {/* {requestFail && <div className="alert alert-danger">Server Issue: {errorResponse}</div>} */}
            <h2 className='text-center mb-5'>Interests &amp; Skills</h2>
            <div className='form-group'>
              {isErrorInterests && (
                <div className='alert alert-danger'>
                  At least one interest required
                </div>
              )}
              <h3>Interests</h3>
              <p>
                Please select all the relevant industries that you are
                interested in learning more about.
              </p>
              <div
                className='checkbox-group mb-3'
                role='group'
                aria-label='Basic checkbox toggle button group'
              >
                {allInterests.map((parentinterest) => {
                  let inter = userInterests.filter(
                    (item) => item.InterestName === parentinterest.InterestName
                  )
                  let valueFound =
                    inter.length > 0
                      ? inter[0].InterestName === parentinterest.InterestName
                        ? true
                        : false
                      : null

                  return (
                    <>
                      <input
                        type='checkbox'
                        className='btn-check'
                        id={parentinterest.InterestName}
                        autoComplete='off'
                        defaultChecked={
                          valueFound ? adminSelected : !adminSelected
                        }
                        name={parentinterest.InterestName}
                        onChange={handleInterestsChange}
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor={parentinterest.InterestName}
                      >
                        {parentinterest.InterestName}
                      </label>
                    </>
                  )
                }) //courseData...map()
                }
              </div>
            </div>

            <div className='form-group'>
              {isErrorSkills && (
                <div className='alert alert-danger'>
                  At least one interest required
                </div>
              )}
              <h3>Skills</h3>
              <p>
                Please select all the relevant industries that you are
                interested in learning more about.
              </p>
              <div
                className='checkbox-group mb-3'
                role='group'
                aria-label='Basic checkbox toggle button group'
              >
                {allSkills.map((itemskill) => {
                  let inter = userSkills.filter(
                    (item) => item.SkillName === itemskill.SkillName
                  )
                  let valueFound =
                    inter.length > 0
                      ? inter[0].SkillName === itemskill.SkillName
                        ? true
                        : false
                      : null

                  return (
                    <>
                      <input
                        type='checkbox'
                        className='btn-check'
                        id={itemskill.SkillName}
                        autoComplete='off'
                        defaultChecked={
                          valueFound ? adminSelected : !adminSelected
                        }
                        name={itemskill.SkillName}
                        onChange={handleSkillsChange}
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor={itemskill.SkillName}
                      >
                        {itemskill.SkillName}
                      </label>
                    </>
                  )
                }) //courseData...map()
                }
              </div>
            </div>

            <div className='form-group d-grid mt-5'>
              <button
                type='button'
                className='btn btn-primary btn-block btn-height'
                onClick={handleSubmit}
                // disabled={this.state.requestFail}
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InterestsExpertise
