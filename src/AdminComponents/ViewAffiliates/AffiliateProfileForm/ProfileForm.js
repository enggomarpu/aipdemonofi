import React, { useState, useEffect } from 'react'
import profile_img from '../../../img/profile-image.png'
import HttpService from '../../../shared/http.service'
import { Controller, useForm } from 'react-hook-form'
import { ErrorMessage } from '../../sharedError/error.messages'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'
import { useToasts } from 'react-toast-notifications'

import './ProfileForm.scss'

const ProfileForm = (props) => {
  const { addToast } = useToasts()
  const [userDetail, setUser] = useState({})
  const [isLoading, setLoading] = useState(true)
  const [isEdit, setEdit] = useState(false)
  const [selectError, setSelectError] = useState()
  const [selectedInterests, setSelectedInterests] = useState([])
  const [allInterests, setAllInterests] = useState([])
  const [interestsArr, setInterestsArr] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [getEmail, setgetEmail] = useState()
  const [allSkills, setAllSkills] = useState([])
  const [skillsArr, setSkillsArr] = useState([])
  const [formData, setFormData] = useState({})
  const [profilePicture, setProfilePicture] = useState({})

  const [selectedCountry, setSelectedCountry] = useState()
  const [selectedState, setSelectedState] = useState()

  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  //const phoneRegex = (/^(\d{3})(\d{3})(\d{4})$/);
  const { register, handleSubmit, errors, formState, reset, control } = useForm()

  useEffect(() => {
    get()
  }, [])

  const get = async () => {
    await HttpService.get(`user/profile/${props.userId}`)
      .then(async (res) => {
        reset(res.data.Profile)
        selectRegion(res.data.Profile.State)
        setFormData(res.data.Profile)
        selectCountry(res.data.Profile.Country)
        setgetEmail(res.data.Profile.Email)
        setSelectedInterests(res.data.Profile.Interests)
        setSelectedSkills(res.data.Profile.Skills)
        setLoading(false)
        setProfilePicture(res.data.Profile.ProfilePicture)

        await HttpService.get('all-interests').then(async (response) => {
          setAllInterests(response.data)
          await HttpService.get('all-skills').then((skillres) => {
            setAllSkills(skillres.data)
          })
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const selectCountry = (val) => {
    setSelectedCountry(val)
  }

  const selectRegion = (val) => {
    setSelectedState(val)
  }

  const userProfile = {
    userID: props.userId,
    Email: getEmail,
  }

  // const onSubmit = async (userobject) => {
  //   await HttpService.put('user/profile', userobject)
  //     .then((res) => {
  //       this.onEdit()
  //       this.get()
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }

  const onEdit = () => {
    setEdit(!isEdit)
    console.log('country after get', selectedCountry)
  }

  const onSubmit = async (data) => {
    if (!isEdit) {
      return
    }
    data.skills = skillsArr.length === 0 ? selectedSkills.map(tag => tag.SkillName): skillsArr;
    data.interests = interestsArr.length === 0 ? selectedInterests.map(tag => tag.InterestName) : interestsArr;
    data.ProfilePic = profilePicture;

    await HttpService.put(`user/profile/${props.userId}`, data)
      .then((res) => {
        onEdit()
        get()
        addToast('Profile Updated Successfully', {
          appearance: 'success',
        })
       
      })
      .catch((err) => {
        console.log(err)
      })

    // props.addPost(data.content);
  }

  
  const onSelectInterestChange = (e, id) => {

    let interestsArray = [];
    let selectedTags;

    const newValues = allInterests.filter(selected => selected.InterestId === parseInt(e.target.value));
    if(selectedInterests.length > 0){
      selectedTags = selectedInterests.filter(selected => selected.InterestId === parseInt(e.target.value));
    }
    if(selectedInterests.length > 0){
      if (selectedTags[0]) {
        setSelectError("Please choose a different value");
        return;
      }
    }
    setSelectError("");
    let alltags = [...selectedInterests, ...newValues];
    alltags.map((tag) => { interestsArray.push(tag.InterestName) })

    setSelectedInterests(alltags);
    setInterestsArr(interestsArray);
  }

  const onSelectSkillChange = (e) => {
    let skillsArray = [];
    let selectedTags;

    const newValues = allSkills.filter((selected) => selected.SkillId === parseInt(e.target.value)
    );
   
    if(selectedSkills.length > 0){
      selectedTags = selectedSkills.filter((selected) => selected.SkillId === parseInt(e.target.value));
    }
    
    if(selectedSkills.length > 0){
      if (selectedTags[0]) {
        setSelectError("Please choose a different value");
        return;
      }
    }
    setSelectError("");

    let alltags = [...selectedSkills, ...newValues];

    alltags.map((tag) => {
      return skillsArray.push(tag.SkillName);
      //console.log(tag.InterestName)
    });
    setSelectedSkills(alltags);
    setSkillsArr(skillsArray);
  };


  const deleteTag = (e, id) => {
    let interestsArray = []
    const newValues = selectedInterests.filter(
      (selected) => selected.InterestId !== id
    )

    newValues.map((tag) => {
      return interestsArray.push(tag.InterestName)
    })

    setSelectedInterests(newValues)
    setInterestsArr(interestsArray)
    //window.location.reload()
  }
  const deleteSkillTag = (e, id) => {
    let skillsArray = []
    const newValues = selectedSkills.filter(
      (selected) => selected.SkillId !== id
    )

    newValues.map((tag) => {
      return skillsArray.push(tag.SkillName)
    })

    setSelectedSkills(newValues)
    setSkillsArr(skillsArray)
  }
  const resendInvite = async (UserId) => {
    await HttpService.get(`user/resend-invite/${props.userId}`)
      .then((res) => {
        this.get()
      })
      .catch((err) => {
        console.log('Something weirred has happened')
      })
  }
  return (
    <>
      <div className='card custom-card border-top-0'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='card-header text-end border-bottom-0'>
            <div className='header-button align-self-center'>
              {isEdit ? (
                <>
                  <button
                    className='btn'
                    type='button'
                    onClick={() => {
                      onEdit()
                    }}
                  >
                    <i className='fas fa-times' aria-hidden='true'></i>
                  </button>
                  <button className='btn' type='submit'>
                    <i className='fas fa-save' aria-hidden='true'></i>{' '}
                  </button>
                </>
              ) : (
                <button
                  className='btn'
                  type='button'
                  onClick={() => {
                    onEdit()
                  }}
                >
                  {' '}
                  <i className='fas fa-pen' aria-hidden='true'></i>{' '}
                </button>
              )}
            </div>
          </div>
          <div className='profile-img'>
            {profilePicture && (
              <img
                src={
                  'https://cdn.filestackcontent.com/resize=height:200,width:200/' +
                  profilePicture.FileHandler
                }
                alt=''
              />
            )}
          </div>
          <div className='card-body'>
            <div className='form-group border-bottom'>
              <label> First Name</label>
              {!isEdit ? (
                <p className='title'>{formData.Name}</p>
              ) : (
                <input
                  type='text'
                  className='form-control mb-m-1'
                  name='Name'
                  placeholder='Enter First Name'
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.Name && errors.Name.type} />
            </div>

            <div className='form-group border-bottom'>
              <label> Last Name</label>
              {!isEdit ? (
                <p className='title'>{formData.LastName}</p>
              ) : (
                <input
                  type='text'
                  className='form-control mb-m-1'
                  name='LastName'
                  placeholder='Enter Last Name'
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.LastName && errors.LastName.type} />
              {errors.last_name && 'Last name is required'}
            </div>

            <div className='form-group border-bottom'>
              <label>Email</label>
              {!isEdit ? (
                <p className='title'>{formData.Email}</p>
              ) :!formData.IsActive ? (
                <input
                  type="text"
                  className="form-control mb-m-1"
                  name="Email"
                  placeholder="Enter Email!"
                  ref={register({ required: true, pattern: emailRegex })}
                />
              ): <p className="title">{formData.Email}</p> }
              <ErrorMessage
                type={errors.Email && errors.Email.type}
                patternType={'email'}
              />
            </div>

            <div className='form-group border-bottom'>
              <label>Phone Number</label>
              {!isEdit ? (
                <p className='title'>{formData.PhoneNumber}</p>
              ) : (
                <input
                  type='text'
                  className='form-control mb-m-1'
                  name='PhoneNumber'
                  placeholder='Enter Phone'
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage
                type={errors.PhoneNumber && errors.PhoneNumber.type}
                patternType={'phoneNumber'}
              />
            </div>

            <div className='form-group border-bottom'>
              <label>Company Name</label>
              {!isEdit ? (
                <p className='title'>{formData.CompanyName}</p>
              ) : (
                <input
                  type='text'
                  className='form-control mb-m-1'
                  name='CompanyName'
                  placeholder='Enter Comapnay Name'
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage
                type={errors.CompanyName && errors.CompanyName.type}
              />
            </div>
            <div className='form-group border-bottom'>
              <label>Address</label>
              {!isEdit ? (
                <p className='title'>{formData.Address}</p>
              ) : (
                <input
                  type='text'
                  className='form-control mb-m-1'
                  name='Address'
                  placeholder='Enter Address'
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.Address && errors.Address.type} />
            </div>

            <div className='form-group border-bottom'>
              <label>Address Line 2</label>
              {!isEdit ? (
                <p className='title'>{formData.AddressLine2}</p>
              ) : (
                <input
                  type='text'
                  className='form-control mb-m-1'
                  name='AddressLine2'
                  placeholder='Enter Address Line 2'
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage
                type={errors.AddressLine2 && errors.AddressLine2.type}
              />
            </div>

            <div className='form-group border-bottom'>
              <label>City</label>
              {!isEdit ? (
                <p className='title'>{formData.City}</p>
              ) : (
                <input
                  type='text'
                  className='form-control mb-m-1'
                  name='City'
                  placeholder='Enter City'
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.City && errors.City.type} />
            </div>

            <div className='form-group border-bottom'>
              <label>Country</label>
              {!isEdit ? (
                <p className='title'>{formData.Country}</p>
              ) : (
                <>
                  <CountryDropdown
                    className='form-control mb-m-1'
                    value={selectedCountry}
                    onChange={(val) => selectCountry(val)}
                  />
                  <input
                    type='text'
                    className='d-none'
                    value={selectedCountry}
                    name='Country'
                    ref={register({ required: false })}
                  />
                </>
              )}
              <ErrorMessage type={errors.Country && errors.Country.type} />
            </div>

            <div className='form-group border-bottom'>
              <label>State</label>
              {!isEdit ? (
                <p className='title'>{formData.State}</p>
              ) : (
                <>
                  <RegionDropdown
                    className='form-control mb-m-1'
                    country={selectedCountry}
                    value={selectedState}
                    onChange={(val) => selectRegion(val)}
                  />
                  <input
                    type='text'
                    className='d-none'
                    name='State'
                    value={selectedState}
                    placeholder='Enter State'
                    ref={register({ required: true })}
                  />
                </>
              )}
              <ErrorMessage type={errors.State && errors.State.type} />
            </div>

            {isEdit ? (
              <button
                className='btn btn-primary'
                onClick={() => resendInvite()}
              >
                Resend Invite
              </button>
            ) : null}

            <div className='checkbox-group mb-2'>
              <label className='d-block'>Interest</label>
              {selectedInterests &&
                selectedInterests.map((res) => {
                  return (
                    <label className='btn btn-primary'>
                      {res.InterestName}
                      <span
                        className='cross'
                        type='button'
                        onClick={(e) => deleteTag(e, res.InterestId)}
                      >
                        <i className='fa fa-times' aria-hidden='true'></i>
                      </span>
                    </label>
                  )
                })}
            </div>
            <div className='checkbox-group mb-5'>
                <label className='d-block'>Interests</label>
                
                <Controller
                  render={
                    ({ field }) =>
                    <select {...field} class="form-select" aria-label="Default select example"
                    id="lang"
                    name="interests"
                    ref={register({ required: false })}
                    //value={selectedInterests}
                    onChange={onSelectInterestChange}
                  >
                    <option value="">Select your Interests</option>
                    
                    {allInterests && allInterests.map((res) => {
                      return (
                        <option value={res.InterestId}>{res.InterestName}</option>
                      )
                    })}
                  </select>
                  }
                  control={control}
                  name="interests"

                />
                { selectError && <label className="alert alert-danger">{selectError}</label> }
              </div>    
            <div className='checkbox-group mb-0'>
              <label className='d-block'>Skills</label>
              {selectedSkills &&
                selectedSkills.map((res) => {
                  return (
                    <label className='btn btn-primary'>
                      {res.SkillName}
                      <span
                        className='cross'
                        type='button'
                        onClick={(e) => deleteSkillTag(e, res.SkillId)}
                      >
                        <i className='fa fa-times' aria-hidden='true'></i>
                      </span>
                    </label>
                  )
                })}
            </div>
            <div className='checkbox-group mb-5'>
                <label className='d-block'>Skills</label>
                <Controller
                  render={
                    ({ field }) =>
                      <select {...field} class="form-select" aria-label="Default select example"
                        id="lang"
                        name="skills"
                        ref={register({ required: false })}
                        //value={selectedInterests}
                        onChange={onSelectSkillChange}
                      >
                        <option value="">Select your skills</option>
                        {allSkills && allSkills.map((res) => {
                          return (
                            <option value={res.SkillId}>{res.SkillName}</option>
                          )
                        })}
                      </select>
                  }
                  control={control}
                  name="skills"

                />
                
                { selectError && <label className="alert alert-danger">{selectError}</label> }
              </div>
          </div>
        </form>
      </div>
    </>
  )
}
export default ProfileForm
