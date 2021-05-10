import React, { useState, useEffect } from 'react'
import NoImg from "../../../img/noimage.png";
import HttpService from '../../../shared/http.service'
import { Controller, useForm } from 'react-hook-form'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'
import countryList from 'react-select-country-list'
import { useToasts } from 'react-toast-notifications'
import { ErrorMessage } from '../../sharedError/error.messages'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './ProfileForm.scss'

import BeatLoader from 'react-spinners/BeatLoader'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import ImagePicker from '../../../shared/image-picker/image-picker.component'

const ProfileForm = ({ data, skills, interests }) => {
const { addToast } = useToasts()
const [userDetail, setUser] = useState({})
let [formData, setFormData] = useState({})
const [isLoading, setLoading] = useState(false)
// const [userInfo, setInfo] = useState();
const [isEdit, setEdit] = useState(false)
// const [fullUser, setFullUser] = useState();

const [selectedCountry, setSelectedCountry] = useState()
const [selectedState, setSelectedState] = useState()

const [selectedInterests, setSelectedInterests] = useState([])
const [allInterests, setAllInterests] = useState([])
const [interestsArr, setInterestsArr] = useState([])

const [selectedSkills, setSelectedSkills] = useState([])
const [allSkills, setAllSkills] = useState([])
const [skillsArr, setSkillsArr] = useState([])
const [profilePicture, setProfilePicture] = useState({})
const [selectError, setSelectError] = useState()
const [skillsError, setSkillsError] = useState()
const [selectedPhone, setselectedPhone] = useState()
const [isSub, setIsSub] = useState(false);

const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const userInfo = JSON.parse(localStorage.getItem('user-info'));
const {
register,
handleSubmit,
errors,
control,
} = useForm()

useEffect(() => {
get()
}, [])

const get = async () => {
setLoading(true)
await HttpService.get('user/profile')
.then(async (res) => {
//reset(res.data)
//formData = res.data
console.log('hello', res.data )
if (res.data.Email !== (userInfo && userInfo.username)) {
setIsSub(true)
}

//setValue('Name', res.data.Email)
//setValue('Email', userInfo && userInfo.username)
setFormData(res.data)
selectRegion(res.data.State)
selectCountry(res.data.Country)
setselectedPhone(res.data.PhoneNumber)
setSelectedInterests(res.data.Interests)
setSelectedSkills(res.data.Skills)
setProfilePicture(res.data.ProfilePicture)
})
.catch((err) => {
console.log(err)
})

await HttpService.get('all-interests').then(async (response) => {
setAllInterests(response.data)
await HttpService.get('all-skills').then((skillres) => {
setAllSkills(skillres.data)
})
})
}

const onSubmit = async (data) => {
if (!isEdit) {
return
}
if(isSub){
userInfo.name = data.Name;
userInfo.lastName = data.LastName;
data.Email = userInfo.username;
//userInfo.username = data.Email;
console.log('userinfo', userInfo);
localStorage.setItem('user-info', JSON.stringify(userInfo));
}
//setSkillsError("");
//setSelectError("");

if(!isSub){
data.skills =
skillsArr.length === 0
? selectedSkills.map((tag) => tag.SkillName)
: skillsArr
data.interests =
interestsArr.length === 0
? selectedInterests.map((tag) => tag.InterestName)
: interestsArr

data.ProfilePic = profilePicture && Object.keys(profilePicture).length !== 0 ? profilePicture : null;
//data.ProfilePic = profilePicture
}

await HttpService.put('user/profile', data)
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
const onEdit = () => {
setEdit(!isEdit)
}
const selectPhone = (val) => {
setselectedPhone(val)
}

const selectCountry = (val) => {
setSelectedCountry(val)
}

const selectRegion = (val) => {
setSelectedState(val)
}

const onSelectInterestChange = (e, id) => {
let interestsArray = []
let selectedTags

const newValues = allInterests.filter(
(selected) => selected.InterestId === parseInt(e.target.value)
)

if (selectedInterests.length > 0) {
selectedTags = selectedInterests.filter(
(selected) => selected.InterestId === parseInt(e.target.value)
)
}
if (selectedInterests.length > 0) {
if (selectedTags[0]) {
setSelectError('Please choose a different value')
return
}
}
setSelectError('')

let alltags = [...selectedInterests, ...newValues]
alltags.map((tag) => {
interestsArray.push(tag.InterestName)
})
setSelectedInterests(alltags)
setInterestsArr(interestsArray)
}

const onSelectSkillChange = (e) => {
let skillsArray = []
let selectedTags

const newValues = allSkills.filter(
(selected) => selected.SkillId === parseInt(e.target.value)
)

if (selectedSkills.length > 0) {
selectedTags = selectedSkills.filter(
(selected) => selected.SkillId === parseInt(e.target.value)
)
}

if (selectedSkills.length > 0) {
if (selectedTags[0]) {
setSkillsError('Please choose a different value')
return
}
}
setSkillsError('')

let alltags = [...selectedSkills, ...newValues]

alltags.map((tag) => {
return skillsArray.push(tag.SkillName)
//console.log(tag.InterestName)
})
setSelectedSkills(alltags)
setSkillsArr(skillsArray)
}

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

        {isEdit && !isSub ? (
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
                  ? filePickerService.getProfileLogo(profilePicture.FileHandler)
                  : NoImg
              }
            />
          </div>
        )}
        {!isLoading && (
          <BeatLoader
            css={`
              text-align: center;
              margin-left: 50%;
            `}
            color={"#2f3272"}
            loading={!isLoading}
            size={10}
            margin={2}
          />
        )}

        {isLoading && (
          <div className="card-body">
            <div className="form-group">
              <label> First Name</label>
              {!isEdit ? (
                // <p>{formData.Name}</p>
                isSub ? (
                  <p>{userInfo && userInfo.name}</p>
                ) : (
                  <p>{formData.Name}</p>
                )
              ) : (
                <input
                  type="text"
                  className="form-control"
                  name="Name"
                  placeholder="Enter First Name"
                  defaultValue={
                    isSub ? userInfo && userInfo.name : formData.Name
                  }
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.Name && errors.Name.type} />
            </div>

            <div className="form-group">
              <label> Last Name</label>
              {!isEdit ? (
                isSub ? (
                  <p>{userInfo && userInfo.lastName}</p>
                ) : (
                  <p>{formData.LastName}</p>
                )
              ) : (
                <input
                  type="text"
                  className="form-control"
                  name="LastName"
                  defaultValue={
                    isSub ? userInfo && userInfo.lastName : formData.LastName
                  }
                  placeholder="Enter     Last Name"
                  ref={register({ required: true })}
                />
              )}
              <ErrorMessage type={errors.LastName && errors.LastName.type} />
            </div>

            <div className="form-group">
              <label>Email</label>
              {isSub ? (
                <p>{userInfo && userInfo.username}</p>
              ) : (
                <p>{formData.Email}</p>
              )}
              <input
                type="text"
                className="d-none"
                name="Email"
                placeholder="Enter Email"
                defaultValue={
                  isSub ? userInfo && userInfo.username : formData.Email
                }
                ref={register({ required: false, pattern: emailRegex })}
              />
              <ErrorMessage
                type={errors.Email && errors.Email.type}
                patternType={"email"}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              {isSub || !isEdit ? (
                <p>{formData.PhoneNumber}</p>
              ) : (
                !isSub && (
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
                )
              )}
              <ErrorMessage
                type={errors.PhoneNumber && errors.PhoneNumber.type}
                patternType={"phoneNumber"}
              />
            </div>

            <div className="form-group">
              <label>Company Name</label>
              {isSub || !isEdit ? (
                <p>{formData.CompanyName}</p>
              ) : (
                !isSub && (
                  <input
                    type="text"
                    className="form-control"
                    name="CompanyName"
                    defaultValue={formData.CompanyName}
                    placeholder="Enter Comapnay Name"
                    ref={register({ required: true })}
                  />
                )
              )}
              <ErrorMessage
                type={errors.CompanyName && errors.CompanyName.type}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              {isSub || !isEdit ? (
                <p>{formData.Address}</p>
              ) : (
                !isSub && (
                  <input
                    type="text"
                    className="form-control"
                    name="Address"
                    defaultValue={formData.Address}
                    placeholder="Enter Address"
                    ref={register({ required: true })}
                  />
                )
              )}
              <ErrorMessage type={errors.Address && errors.Address.type} />
            </div>

            {(isSub || !isEdit) &&
            formData.AddressLine2 &&
            formData.AddressLine2.length > 0 ? (
              <>
                <div className="form-group">
                  <label>Address Line 2</label>
                  <p>{formData.AddressLine2}</p>
                </div>
              </>
            ) : (
              isEdit &&
              !isSub && (
                <>
                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="AddressLine2"
                      defaultValue={formData.AddressLine2}
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

            <div className="form-group">
              <label>City</label>
              {isSub || !isEdit ? (
                <p>{formData.City}</p>
              ) : (
                !isSub && (
                  <input
                    type="text"
                    className="form-control"
                    name="City"
                    placeholder="Enter City"
                    defaultValue={formData.City}
                    ref={register({ required: true })}
                  />
                )
              )}
              <ErrorMessage type={errors.City && errors.City.type} />
            </div>

            <div className="form-group">
              <label>Country</label>
              {isSub || !isEdit ? (
                <p>{formData.Country}</p>
              ) : (
                !isSub && (
                  <>
                    <CountryDropdown
                      className="form-control"
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
                )
              )}
              <ErrorMessage type={errors.Country && errors.Country.type} />
            </div>

            <div className="form-group">
              <label>State/Province</label>
              {isSub || !isEdit ? (
                <p>{formData.State}</p>
              ) : (
                !isSub && (
                  <>
                    <RegionDropdown
                      className="form-control"
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
                )
              )}
              <ErrorMessage type={errors.State && errors.State.type} />
            </div>
            {!isSub && (
              <div className="checkbox-group mb-3">
                <label className="d-block">Interests</label>
                {selectedInterests &&
                  selectedInterests.map((res) => {
                    return (
                      <label className="btn btn-outline-primary">
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
            )}

            {!isSub && (
              <div className="checkbox-group mb-3">
                {/* {/ <label className="d-block">Interests</label> /} */}
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
                    defaultValue={interestsArr}
                  />
                )}

                <ErrorMessage
                  type={errors.interests && errors.interests.type}
                />
                {selectError && (
                  <label className="alert alert-danger">{selectError}</label>
                )}
              </div>
            )}
            {!isSub && (
              <div className="checkbox-group mb-3">
                <label className="d-block">Skills</label>
                {selectedSkills &&
                  selectedSkills.map((res) => {
                    return (
                      <label className="btn btn-outline-primary">
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
            )}

            {!isSub && (
              <div className="checkbox-group mb-3">
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
                              <option value={res.SkillId}>
                                {res.SkillName}
                              </option>
                            );
                          })}
                      </select>
                    )}
                    control={control}
                    name="skills"
                    defaultValue={skillsArr}
                  />
                )}

                <ErrorMessage type={errors.skills && errors.skills.type} />
                {skillsError && (
                  <label className="alert alert-danger">{skillsError}</label>
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  </>
);
}
export default ProfileForm