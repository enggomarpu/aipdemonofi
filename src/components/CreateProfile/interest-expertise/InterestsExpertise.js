import { Redirect } from 'react-router'
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import ArrowLeft from "../../../img/arrow-left.png";
import './InterestsExpertise.scss'
import Logo from '../../../img/logo.png'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { getData, saveData } from './interestsexpertise.reducer'

const InterestsExpertise = (props) => {
  const dispatch = useDispatch()

  const [adminSelected, setAdminSelected] = useState(true)
  const [userInterestsNamesArr, setUserInterestsNamesArr] = useState([])
  const [userSkillsNamesArr, setUserSkillsNamesArr] = useState([])
  const [userInterests, setUserInterests] = useState([])
  const [userSkills, setUserSkills] = useState()

  const interexpState = useSelector((state) => state.interexp)
  //setUserInterests(interexpState.interExp.Interests)

  console.log('full interests and skills', interexpState);

  useEffect(() => {
    initData()
    if(interexpState.dataSet){
      setUserInterests(interexpState.interExp.Interests);
      setUserSkills(interexpState.interExp.Skills);
    }
  }, [interexpState && interexpState.dataSet])

  const initData = () => {
    dispatch(getData())
  }

  if (interexpState.dataPutted) {
    return <Redirect to='/allset' />
  }
  if (interexpState.error) {
    Swal.fire({
      icon: 'error',
      //title: error.response.status,
      html: interexpState.errorMessage,
    })
  }

  //Interests Checkbox
  const handleInterestsChange = async (event) => {
    //setIsErrorInterests(false);
    const { checked, id } = event.target
    const selectedInterest = interexpState.interExp.AllInterests.filter(
      (element) => element.InterestName === id
    )
    //console.log('interests', selectedInterest);
    let newIntererestsArray = []
    let newIntererestsNamesArray = []
    newIntererestsArray = [...userInterests]
    //newIntererestsArray = userInterests;
    if (checked) {
      newIntererestsArray.push(selectedInterest[0])
      setUserInterests(newIntererestsArray);
      setAdminSelected(!adminSelected)
    } else {
      
      // newIntererestsArray = newIntererestsArray.filter(
      //   (element) => element.InterestName !== id
      // )
      newIntererestsArray.pop(selectedInterest);
      console.log('deselect', newIntererestsArray);
      setUserInterests(newIntererestsArray);
      setAdminSelected(!adminSelected)
    }

    newIntererestsArray.map((tag) => {
      return newIntererestsNamesArray.push(tag.InterestName)
    })
    setUserInterestsNamesArr(newIntererestsNamesArray)
    console.log('interest', newIntererestsNamesArray);
  }

  //Skills Checkbox
  const handleSkillsChange = async (event) => {
    //setIsErrorSkills(false)
    const { checked, id } = event.target
    const selectedSkill = interexpState.interExp.AllSkills.filter(
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

      // newSkillsArray = newSkillsArray.filter(
      //   (element) => element.SkillName !== id
      // )
      newSkillsArray.pop(selectedSkill);
      setUserSkills(newSkillsArray)
      //newSkillsArray.pop(selectedSkill);
      console.log('deselect', newSkillsArray);
      setAdminSelected(!adminSelected)
    }
    newSkillsArray.map((tag) => {
      return newSkillsNamesArray.push(tag.SkillName)
    })
    setUserSkillsNamesArr(newSkillsNamesArray)
    console.log('skills', newSkillsNamesArray);
  }

  const handleSubmit = async (e) => {
    const user = JSON.parse(localStorage.getItem('user-info'))
    let allData = {
      Email: user.username,
      interests: userInterestsNamesArr.length === 0 ? userInterests.map(tag => tag.InterestName) :  userInterestsNamesArr,
      skills: userSkillsNamesArr === 0 ? userSkills.map(tag => tag.SkillName): userSkillsNamesArr,
    }
    // await httpService.put("user/profile", allData)
    //     .then((res) => {
    //       //console.log('statu code', res.status);
    //       if( res.status  === 200 || res.status  === 201){
    //         console.log('statu code', res.status);
    //          props.history.push("/allset")
    //       }
    //     })
    //     .catch((error) => {
    //       Swal.fire({
    //         icon: 'error',
    //         title: error.response.status,
    //         html: error.response.data.message,
    //       });
    //     });

    console.log('data validatednnnnnnnn', allData)
    if (!interexpState.dataPutted) {
      dispatch(saveData(allData))
    }
  }

  return (
    <>
      
        <Link to="/create-profile" className="btn-back">
          <img src={ArrowLeft} alt="ArrowLeft" />
          Back
        </Link>
        <div className="text-center mt-5 mb-5">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="container bg-white">
          <div className="row justify-content-center pt-5 pb-5">
            <div className="col-md-8">
              <h2 className="text-center mb-5">Interests &amp; Skills </h2>
              <div className="form-group">
                <h3>Interests</h3>
                <p>
                  Please select all the relevant industries that you are
                  interested in learning more about.
                </p>
                <div
                  className="checkbox-group mb-3"
                  role="group"
                  aria-label="Basic checkbox toggle button group"
                >
                  {interexpState.interExp.AllInterests &&
                    interexpState.interExp.AllInterests.map((parentinterest) => {
                      let inter = interexpState.interExp.Interests.filter((item) => item.InterestName === parentinterest.InterestName );
                        let valueFound = inter.length > 0 ? inter[0].InterestName === parentinterest.InterestName ? true : false : null;
                        return (
                          <>
                            <input
                              type="checkbox"
                              className="btn-check"
                              id={parentinterest.InterestName}
                              autoComplete="off"
                              defaultChecked={
                                valueFound ? adminSelected : !adminSelected
                              }
                              name={parentinterest.InterestName}
                              onChange={handleInterestsChange}
                            />
                            <label
                              className="btn btn-outline-primary"
                              htmlFor={parentinterest.InterestName}
                            >
                              {parentinterest.InterestName}
                            </label>
                          </>
                        );
                      }
                    )}
                </div>
              </div>

              <div className="form-group">
                <h3>Skills</h3>
                <p>
                  Please select all the relevant areas that you have expertise
                  in and/or Experience in.{" "}
                </p>
                <div
                  className="checkbox-group mb-3"
                  role="group"
                  aria-label="Basic checkbox toggle button group"
                >
                  {interexpState.interExp.AllSkills &&
                    interexpState.interExp.AllSkills.map((itemskill) => { let inter = interexpState.interExp.Skills.filter((item) => item.SkillName === itemskill.SkillName
                      );
                      let valueFound =
                        inter.length > 0
                          ? inter[0].SkillName === itemskill.SkillName
                            ? true
                            : false
                          : null;

                      return (
                        <>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={itemskill.SkillName}
                            autoComplete="off"
                            defaultChecked={
                              valueFound ? adminSelected : !adminSelected
                            }
                            name={itemskill.SkillName}
                            onChange={handleSkillsChange}
                          />
                          <label
                            className="btn btn-outline-primary"
                            htmlFor={itemskill.SkillName}
                          >
                            {itemskill.SkillName}
                          </label>
                        </>
                      );
                    })}
                </div>
              </div>

              <div className="form-group d-grid mt-5">
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-height"
                  onClick={handleSubmit}
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
     
    </>
  );
}
