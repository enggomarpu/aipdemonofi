import React, { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import { Controller, useForm } from 'react-hook-form'
import { ErrorMessage } from '../../sharedError/error.messages'
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useToasts } from "react-toast-notifications";
import NoImg from "../../../img/noimage.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import './ProfileForm.scss'
import filePickerService from '../../../shared/file-picker/file-picker.service';
import ImagePicker from '../../../shared/image-picker/image-picker.component';

const ProfileForm = (props) => {
  const [skillError, setSkillError] = useState("");
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
  const [profilePicture, setProfilePicture] = useState({});

  const [selectedCountry, setSelectedCountry] = useState()
  const [selectedState, setSelectedState] = useState()
  const [selectedPhone, setselectedPhone] = useState();
  const [responseError, setResponseError ] = useState('');
  //const [responseSuccess, setResponseSuccess] = useState('');

  const [showResendButton, setShowResendButton] = useState(false);
  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  //const phoneRegex = (/^(\d{3})(\d{3})(\d{4})$/);
  const { register, handleSubmit, errors, formState, reset, control } = useForm({
    mode: "onBlur"
  })

  useEffect(() => {
    get()
  }, [])

  const get = async () => {
    await HttpService.get(`user/profile/${props.userId}`)
      .then(async (res) => {
        reset(res.data.Profile)
        selectRegion(res.data.Profile.State)
        setFormData(res.data.Profile)
        console.log('user data', res.data.Profile)
        setselectedPhone(res.data.Profile.PhoneNumber);
        selectCountry(res.data.Profile.Country)
        setgetEmail(res.data.Profile.Email)
        setSelectedInterests(res.data.Profile.Interests)
        setSelectedSkills(res.data.Profile.Skills)
        setProfilePicture(res.data.ProfilePicture);
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
  const selectPhone = (val) => {
    setselectedPhone(val);
  };

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

  const onEdit = () => {
    //setResponseSuccess('');
    setResponseError('');
    setShowResendButton(false);
    setEdit(!isEdit)
  }

  const onSubmit = async (data) => {
    if (!isEdit) {
      return

    }
    setSelectError("");
    setSkillError("");
    data.skills = skillsArr.length === 0 ? selectedSkills.map(tag => tag.SkillName): skillsArr;
    data.interests = interestsArr.length === 0 ? selectedInterests.map(tag => tag.InterestName) : interestsArr;
    data.ProfilePic = profilePicture && Object.keys(profilePicture).length !== 0? profilePicture: null;

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
  const showResendButtonFunc = async (emvalue) => {

    let data;
    //setResponseSuccess('');
    setResponseError('');
    if(formData.Email !== emvalue){  
      data = {
        Email: emvalue
      }
      await HttpService.put(`user/profile/${props.userId}`, data)
      .then((res) => {
        get();
        setShowResendButton(true);
        return true;  
      })
      .catch((err) => {
        setResponseError(err.response.data.message);
        return false
      })
     
    }
  }
  const resendInvite = async (UserId) => {
    await HttpService.get(`user/resend-invite/${UserId}`)
      .then((res) => {
        this.get()
      })
      .catch((err) => {
        setResponseError(err.response.data.message)
      })
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
        setSkillError("Please choose a different value");
        return;
      }
    }
    setSkillError("");

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
  
  return (
    <>
      <div className="card custom-card border-top-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-header text-end border-bottom-0">
            <div className="header-button align-self-center">
              {isEdit ? (
                <>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      onEdit();
                    }}
                  >
                    <i className="fas fa-times" aria-hidden="true"></i>
                  </button>
                  <button className="btn" type="submit">
                    <i className="fas fa-save" aria-hidden="true"></i>{" "}
                  </button>
                </>
              ) : (
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    onEdit();
                  }}
                >
                  {" "}
                  <i className="fas fa-pen" aria-hidden="true"></i>{" "}
                </button>
              )}
            </div>
          </div>
          {isEdit ? (
            <div className="form-group">
              <ImagePicker
                data={profilePicture}
                afterUpload={(filedata) => {
                  setProfilePicture(filedata);
                }}
                label="Edit Logo"
                icon=""
              />
            </div>
          ) : (
            <div className="profile-img">
              <img
                style={{
                  maxHeight: 150,
                  maxWidth: 150,
                  minWidth: 150,
                  minHeight: 150,
                }}
                src={
                  profilePicture && profilePicture.FileHandler
                    ? filePickerService.getProfileLogo(
                        profilePicture.FileHandler
                      )
                    : NoImg
                }
              />
            </div>
          )}
          <div className="card-body">
            <div className="form-group border-bottom">
              <label> First Name</label>
              {!isEdit ? (
                <p className="title">{formData.Name}</p>
              ) : (
                <input
                  type="text"
                  className="form-control mb-m-1"
                  name="Name"
                  placeholder="Enter First Name"
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.Name && errors.Name.type} />
            </div>

            <div className="form-group border-bottom">
              <label> Last Name</label>
              {!isEdit ? (
                <p className="title">{formData.LastName}</p>
              ) : (
                <input
                  type="text"
                  className="form-control mb-m-1"
                  name="LastName"
                  placeholder="Enter Last Name"
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.LastName && errors.LastName.type} />
              {errors.last_name && "Last name is required"}
            </div>

            <div className="form-group border-bottom">
              <label>Email</label>
              {!isEdit ? (
                <p className="title">{formData.Email}</p>
              ) : !formData.IsActive ? (
                <input
                  type="text"
                  className="form-control mb-m-1"
                  name="Email"
                  placeholder="Enter Email!"
                  ref={register({
                    required: true,
                    pattern: emailRegex,
                    validate: (value) => showResendButtonFunc(value),
                  })}
                />
              ) : (
                <p className="title">{formData.Email}</p>
              )}

              {/* {responseSuccess && <div className="alert-success">{responseSuccess}</div>} */}
              {showResendButton && (
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={resendInvite}
                >
                  Resend Invite
                </button>
              )}

              {errors.Email && errors.Email.type === "validate" && (
                <div className="text-danger">{responseError}</div>
              )}

              <ErrorMessage
                type={errors.Email && errors.Email.type}
                patternType={"email"}
              />
            </div>

            <div className="form-group border-bottom">
              <label>Phone Number</label>
              {!isEdit ? (
                <p>{formData.PhoneNumber}</p>
              ) : (
                <>
                  <PhoneInput
                    className="form-control"
                    country={"ca"}
                    value={selectedPhone}
                    onChange={(val) => selectPhone(val)}
                  />

                  <input
                    type="text"
                    className="d-none"
                    name="PhoneNumber"
                    value={selectedPhone}
                    placeholder="Enter Phone Number"
                    ref={register({ required: false })}
                  />
                </>
              )}
              <ErrorMessage
                type={errors.PhoneNumber && errors.PhoneNumber.type}
                patternType={"phoneNumber"}
              />
            </div>

            <div className="form-group border-bottom">
              <label>Company Name</label>
              {!isEdit ? (
                <p className="title">{formData.CompanyName}</p>
              ) : (
                <input
                  type="text"
                  className="form-control mb-m-1"
                  name="CompanyName"
                  placeholder="Enter Comapnay Name"
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage
                type={errors.CompanyName && errors.CompanyName.type}
              />
            </div>
            <div className="form-group border-bottom">
              <label>Address</label>
              {!isEdit ? (
                <p className="title">{formData.Address}</p>
              ) : (
                <input
                  type="text"
                  className="form-control mb-m-1"
                  name="Address"
                  placeholder="Enter Address"
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.Address && errors.Address.type} />
            </div>

            {!isEdit &&
            formData.AddressLine2 &&
            formData.AddressLine2.length > 0 ? (
              <>
                <div className="form-group border-bottom ">
                  <label>Address Line 2</label>
                  <p>{formData.AddressLine2}</p>
                </div>
              </>
            ) : (
              isEdit && (
                <>
                  <div className="form-group border-bottom">
                    <label>Address Line 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="AddressLine2"
                      placeholder="Enter Address Line 2"
                      ref={register({ required: false })}
                    />
                  </div>
                </>
              )
            )}
            <ErrorMessage
              type={errors.AddressLine2 && errors.AddressLine2.type}
            />

            <div className="form-group border-bottom">
              <label>City</label>
              {!isEdit ? (
                <p className="title">{formData.City}</p>
              ) : (
                <input
                  type="text"
                  className="form-control mb-m-1"
                  name="City"
                  placeholder="Enter City"
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.City && errors.City.type} />
            </div>

            <div className="form-group border-bottom">
              <label>Country</label>
              {!isEdit ? (
                <p className="title">{formData.Country}</p>
              ) : (
                <>
                  <CountryDropdown
                    className="form-control mb-m-1"
                    value={selectedCountry}
                    onChange={(val) => selectCountry(val)}
                  />
                  <input
                    type="text"
                    className="d-none"
                    value={selectedCountry}
                    name="Country"
                    ref={register({ required: false })}
                  />
                </>
              )}
              <ErrorMessage type={errors.Country && errors.Country.type} />
            </div>

            <div className="form-group border-bottom">
              <label>State/Province</label>
              {!isEdit ? (
                <p className="title">{formData.State}</p>
              ) : (
                <>
                  <RegionDropdown
                    className="form-control mb-m-1"
                    country={selectedCountry}
                    value={selectedState}
                    onChange={(val) => selectRegion(val)}
                  />
                  <input
                    type="text"
                    className="d-none"
                    name="State"
                    value={selectedState}
                    placeholder="Enter State"
                    ref={register({ required: true })}
                  />
                </>
              )}
              <ErrorMessage type={errors.State && errors.State.type} />
            </div>

            {/* {isEdit ? (
              <button
                className="btn btn-primary"
                onClick={() => resendInvite()}
              >
                Resend Invite
              </button>
            ) : null} */}

            <div className="checkbox-group mb-2">
              <label className="d-block">Interests</label>
              {selectedInterests &&
                selectedInterests.map((res) => {
                  return (
                    <label className="btn btn-primary">
                      {res.InterestName}
                      <span
                        className="cross"
                        type="button"
                        onClick={(e) => deleteTag(e, res.InterestId)}
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </span>
                    </label>
                  );
                })}
            </div>
            <div className="checkbox-group mb-5">
              {/* <label className="d-block">Interests</label> */}
              {isEdit && (
                <Controller
                  render={({ field }) => (
                    <select
                      {...field}
                      class="form-select"
                      aria-label="Default select example"
                      id="lang"
                      name="interests"
                      ref={register({ required: false })}
                      //value={selectedInterests}
                      onChange={onSelectInterestChange}
                    >
                      <option value="">Select your Interests</option>

                      {allInterests &&
                        allInterests.map((res) => {
                          return (
                            <option value={res.InterestId}>
                              {res.InterestName}
                            </option>
                          );
                        })}
                    </select>
                  )}
                  control={control}
                  name="interests"
                />
              )}
              {selectError && (
                <label className="alert alert-danger">{selectError}</label>
              )}
            </div>
            <div className="checkbox-group mb-0">
              <label className="d-block">Skills</label>
              {selectedSkills &&
                selectedSkills.map((res) => {
                  return (
                    <label className="btn btn-primary">
                      {res.SkillName}
                      <span
                        className="cross"
                        type="button"
                        onClick={(e) => deleteSkillTag(e, res.SkillId)}
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </span>
                    </label>
                  );
                })}
            </div>
            <div className="checkbox-group mb-5">
              {/* <label className="d-block">Skills</label> */}
              {isEdit && (
                <Controller
                  render={({ field }) => (
                    <select
                      {...field}
                      class="form-select"
                      aria-label="Default select example"
                      id="lang"
                      name="skills"
                      ref={register({ required: false })}
                      //value={selectedInterests}
                      onChange={onSelectSkillChange}
                    >
                      <option value="">Select your skills</option>
                      {allSkills &&
                        allSkills.map((res) => {
                          return (
                            <option value={res.SkillId}>{res.SkillName}</option>
                          );
                        })}
                    </select>
                  )}
                  control={control}
                  name="skills"
                />
              )}

              {skillError && (
                <label className="alert alert-danger">{skillError}</label>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
export default ProfileForm
