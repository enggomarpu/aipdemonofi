import React, { Component, useEffect, useState } from "react";
import "./InterestsExpertise.scss";
import Logo from "../../img/logo.png";
import HttpService from './../../shared/http.service';
import Swal from 'sweetalert2'
import { StateContext } from "./Context/GlobalProvider";
import { data } from "jquery";
import { Link } from "react-router-dom";
import ArrowLeft from "../../img/arrow-left.png";

 const InterestsExpertise = (props) => {
  
  const [userInterests, setUserInterests] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [allInterests, setAllInterests] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [adminSelected, setAdminSelected] = useState(true)
  const [userInterestsNamesArr, setUserInterestsNamesArr] = useState([])
  const [userSkillsNamesArr, setUserSkillsNamesArr] = useState([])
  
  //static contextType = StateContext;

  
  useEffect(()=>{
    getUser();
  }, []) 
  
  const getUser = async () => {
    await HttpService.get("user/profile").then(async(res) => {
      Object.assign(data, res.data);
      setUserInterests(res.data.Interests);
      setUserSkills(res.data.Skills);
     console.log('skillsdata', res.data.Skills)
      await HttpService.get('all-skills').then(async(resp) => {
        setAllSkills(resp.data);
       
        await HttpService.get('all-interests').then((respo) => {
         
          setAllInterests(respo.data)
        })
      })
    }).catch((err) => {
      console.log(err);
    })
  }
  
  
  //Interests Checkbox
  const handleInterestsChange = (event) => {

    
    const {checked, id  } = event.target;

    const selectedInterest = allInterests.filter(element => element.InterestName === id );
    let newIntererestsArray = []; 
    let newIntererestsNamesArray = [];
    newIntererestsArray = [...userInterests];

    if (checked) {
        
        newIntererestsArray.push(selectedInterest[0]);
        
        setUserInterests(newIntererestsArray);
        
          setAdminSelected(!adminSelected)
    } else {

        newIntererestsArray.pop(selectedInterest);
        setUserInterests(newIntererestsArray);

      
          setAdminSelected(!adminSelected)

    }

    newIntererestsArray.map((tag)=>{newIntererestsNamesArray.push(tag.InterestName)});
    setUserInterestsNamesArr(newIntererestsNamesArray)
   
    console.log('interests',  userInterests);
  };

   //Skills Checkbox
    const handleSkillsChange = (event) => {

    const {checked, id  } = event.target;

    const selectedSkill = allSkills.filter(element => element.SkillName === id );

    let newSkillsArray = []; 
    let newSkillsNamesArray = [];
    newSkillsArray = [...userSkills];

    if (checked) {
        
        newSkillsArray.push(selectedSkill[0]);
        setUserSkills(newSkillsArray);
        setAdminSelected(!adminSelected);

    } else {

        newSkillsArray.pop(selectedSkill);
        setUserSkills(newSkillsArray)

    }


    newSkillsArray.map((tag)=>{newSkillsNamesArray.push(tag.SkillName)});
    setUserSkillsNamesArr(newSkillsNamesArray);
    console.log('skilsss', userSkills);
   };

  const handleSubmit = async (e) => {

    const user = JSON.parse(localStorage.getItem('user-info'));

    
      let allData = {
        Email: user.username,
        interests: userInterestsNamesArr,
        skills: userSkillsNamesArr,
      }
      console.log('data', allData)
    await HttpService.put("user/profile", allData)
        .then((res) => {
          //console.log('statu code', res.status);
          if( res.status  === 200 || res.status  === 201){
            console.log('statu code', res.status);
             props.history.push("/allset")
        }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: error.response.status,
            html: error.response.data.message,
          });
        }); 
      
  };
 
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
              <h2 className="text-center mb-5">Interests &amp; Skills</h2>
              <div className="form-group">
                  <h3>Interests</h3>
                  <p>
                    Please select all the relevant industries that you are
                    interested in learning more about.
                  </p>
                  <div className="checkbox-group mb-5" role="group" aria-label="Basic checkbox toggle button group">
                    
                        {
                        allInterests.map(parentinterest => {
                          let inter = userInterests.length > 0 && userInterests.filter(item => item.InterestName === parentinterest.InterestName);
                          let valueFound =  inter.length > 0 ? inter[0].InterestName === parentinterest.InterestName ? true : false : null;
                          
                              return (
                              <>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id={parentinterest.InterestName}
                                  autoComplete="off"
                                  defaultChecked = {valueFound ? adminSelected: !adminSelected} 
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
                            ) 
                            
                          }) //courseData...map()
                        }                     
                      
                  </div>
              </div>

              
              <div className="form-group">
             
                  <h3>Skills</h3>
                  <p>
                    Please select all the relevant industries that you are
                    interested in learning more about.
                  </p>
                  <div className="checkbox-group mb-5" role="group" aria-label="Basic checkbox toggle button group">
                  {  
                          allSkills.map(itemskill => {
                          let inter = userSkills.length > 0  && userSkills.filter(item => item.SkillName === itemskill.SkillName);
                          let valueFound =  inter.length > 0 ? inter[0].SkillName === itemskill.SkillName ? true : false : null;
                          
                              return (
                              <>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id={itemskill.SkillName}
                                  autoComplete="off"
                                  defaultChecked = {valueFound ? adminSelected: !adminSelected} 
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
                            ) 
                            
                          }) //courseData...map()
                        }                    
                  </div>
              </div>

              <div className="form-group d-grid mt-5">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-height"
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
    );
  
}

export default InterestsExpertise;
