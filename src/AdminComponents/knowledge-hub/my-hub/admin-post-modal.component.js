import React, { useEffect, useState, useRef } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import HttpService from '../../../../src/shared/http.service';
import countryList from "react-select-country-list";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";
import MultiFilePicker from "../../../../src/shared/multi-file-picker/multi-file-picker.component";
import ImagePicker from "../../../../src/shared/image-picker/image-picker.component";

const AdminPostsModal = (props) => {

  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const phoneRegex = /^(1|)?(\d{3})(\d{3})(\d{4})$/;

  let [formattedNumber , setformattedNumber] = useState("")
  
  const [formValues, setFormValues] = useState({
    country: "",
    region: "",
    formErrors: {
      region: "",
      country: "",
    },
  });
  const [isValid, setinValid] = useState(false);
  const [isShow, setShow] = useState(true);
  const [myDocuments, setDocuments] = useState([]);
  let [logo, setLogo] = useState({});
  const [skills, setskills] = useState([]);
  let [data, setData] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedState, setSelectedState] = useState();

  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onBlur"
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    errors: errors2,
    formState: formState2,
    reset: reset2,
  } = useForm({
    mode: "onBlur"
  });

  useEffect(() => {
    get();
  }, []);

  const onFirstSubmit = async (data) => {
   if(formState.isValid){
    setData(data);
    setShow(false);
   }

  };

  const onSecondSubmit = async (formData) => {
  
    const {Email, Skills} = formData;
    data = {...data, Email, Skills};
    setData(data);
    data.Documents= myDocuments;
    data.ProfilePic= logo;
    await HttpService.post("user/create-profile", data)
      .then((res) => 
      {

      })
      .catch((err) => {
        console.log(err);
      });
      window.location.reload();
  };

  const get = async () => {
    await HttpService.get("all-skills")
      .then(async (res) => {
        reset2(res.data);
        setskills(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const selectCountry = (val) => {
    setSelectedCountry(val);
  }

  const selectRegion = (val) => {
    setSelectedState(val);
  }

  const afterDocUploaded = (filedata) => {
    let attachments =[];
    filedata.map((file) => {
      attachments.push(file);
    })
    setDocuments(attachments);
  }
 
  return (
    <>
      <div
        className="modal fade"
        id="CreateAffiliateModal"
        tabIndex="-1"
        aria-labelledby="AppModalLabel"
        aria-hidden="true"
      >
        {isShow ? 
      <form key={1} onSubmit={handleSubmit(onFirstSubmit)}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row justify-content-center">
                <div className="col-md-8 col-12">
                  <div className="row mt-5 mb-5">
                    <div className="col">
                      <h1 id="AppModalLabel">Create Account</h1>
                    </div>
                  </div>
                  <MultiFilePicker data={myDocuments} afterUpload={afterDocUploaded} label="Add Document" icon="" options={{accept:"application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*"}}/>

                  <div>
                    <div className="form-group">
                      <label> First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Name"
                        placeholder="Enter First Name"
                        ref={register({ required: true })}
                      />
                      <ErrorMessage type={errors.Name && errors.Name.type} />
                    </div>
                    <div className="form-group">
                      <label> Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="LastName"
                        placeholder="Enter Last Name"
                        ref={register({ required: true })}
                      />
                      <ErrorMessage
                        type={errors.LastName && errors.LastName.type}
                      />
                    </div>

                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        type="text"
                        style={{ minHeight: "150px" }}
                        className="form-control"
                        name="Bio"
                        placeholder="Enter Bio here"
                        ref={register({ required: true })}
                      />
                      <ErrorMessage type={errors.LastName && errors.Bio.type} />
                    </div>

                    <ImagePicker data={logo} afterUpload={(filedata) => {setLogo(filedata)}} label="Logo" icon=""/>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Address"
                        placeholder="Enter Address"
                        ref={register({ required: true })}
                      />
                      <ErrorMessage
                        type={errors.Address && errors.Address.type}
                      />
                    </div>

                    <div className="form-group">
                      <label>Address Line 2</label>
                      <input
                        type="text"
                        className="form-control"
                        name="AddressLine2"
                        placeholder="Enter Address Line 2"
                        ref={register({ required: true })}
                      />
                      <ErrorMessage
                        type={errors.AddressLine2 && errors.AddressLine2.type}
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="City"
                        placeholder="Enter City"
                        ref={register({ required: true })}
                      />
                      <ErrorMessage type={errors.City && errors.City.type} />
                    </div>

                    <div className="form-group">
            <label>Country</label>
            
            <CountryDropdown
              className="form-control"
              value={selectedCountry}
              onChange={(val) => selectCountry(val)}
            />
            <input type='text' className='d-none' value={selectedCountry} name="Country" ref={register({ required: false })} />
            
            <ErrorMessage
              type={errors.Country && errors.Country.type}
            />
          </div>
              
            <div className='form-group'>
              <label>State</label>
              
              <RegionDropdown
                className="form-control"
                country={selectedCountry}
                value={selectedState}
                onChange={(val) => selectRegion(val)} />
              <input type='text' className='d-none' name="State" value={selectedState} placeholder="Enter State" ref={register({ required: true })} />
              <ErrorMessage type={errors.State && errors.State.type} />
            </div>  

                    {/* <div className="form-group">
                      <label>Country</label>
                      <CountryDropdown
                        className="form-control"
                        name = "Country"
                        // value={country}
                        ref={register({ required: true })}
                        // onChange={(val) => selectCountry(val)}
                      />
                      <ErrorMessage
                        type={errors.Country && errors.Country.type}
                      />
                    </div>

                    <div className="form-group">
                      <label>State</label>
                      {country === "Canada" || country === "United States" ? (
                        <RegionDropdown
                          className="form-control"
                          name ="State"
                          country={
                            country === "Canada"
                              ? country
                              : country === "United States"
                              ? country
                              : ""
                          }
                          // value={region}
                          onChange={(val) => selectRegion(val)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          name="State"
                          placeholder="Enter State"
                          ref={register({ required: true })}
                        />
                      )}
                      <ErrorMessage type={errors.State && errors.State.type} />
                    </div> */}

                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        type="text"
                        style={{ minHeight: "150px" }}
                        className="form-control"
                        name="Notes"
                        placeholder="Write a note here . . ."
                        ref={register({ required: true })}
                      />
                      <ErrorMessage type={errors.Notes && errors.Notes.type} />
                    </div>
                    <div className="form-group">
                      <label>Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="CompanyName"
                        placeholder="Enter Comapnay Name"
                        ref={register({ required: true })}
                      />
                      <ErrorMessage
                        type={errors.CompanyName && errors.CompanyName.type}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="PhoneNumber"
                        placeholder="Enter Phone"
                        ref={register({ required: true})}
                       // onChange = {formatPhoneNumber}
                       // value = {formattedNumber}
                      />
                      <ErrorMessage
                        type={errors.PhoneNumber && errors.PhoneNumber.type}
                        patternType={"phoneNumber"}
                      />
                    </div>
                  </div>
                  <div className="form-group d-grid mt-5">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-height"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

        :             
      <form key = {2} onSubmit={handleSubmit2(onSecondSubmit)}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row justify-content-center">
                <div className="col-md-8 col-12">
                  <div className="row mt-5 mb-5">
                    <div className="col">
                      <h1 id="AppModalLabel">Create Account</h1>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Email"
                      placeholder="Enter Email!"
                      ref={register2({ required: true, pattern: emailRegex })}
                    />
                    <ErrorMessage
                      type={errors2.Email && errors2.Email.type}
                      patternType={"email"}
                    />
                  </div>

                  <div className="form-group">
                    <h3>Skills</h3>
                    <p>
                      Please select all the relevant industries that you are
                      interested in learning more about.
                    </p>
                    <div
                      className="checkbox-group mb-5"
                      role="group"
                      aria-label="Basic checkbox toggle button group"
                    >
                      {skills.map((itemskill) => {
                        return (
                          <>
                            <input key = {itemskill.SkillName}
                              type="checkbox"
                              className="btn-check"
                              ref={register2()}
                              id={itemskill.SkillName}
                              autoComplete="off"
                              name="Skills"
                              value = {itemskill.SkillName}
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

                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-height"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
        }
   </div>
    </>
  );
};

export default AdminPostsModal;
