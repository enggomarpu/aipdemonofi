import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import BackButton from "../../BackButton/BackButton";
import { useDispatch, useSelector } from "react-redux";
import "./CreateProfile.scss";
import Logo from "../../../img/logo.png";
import HttpService from "../../../shared/http.service";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";
import { getUser, postUser } from "./createProfile.reducer";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CreateProfile = (props) => {
  const userLocal = JSON.parse(localStorage.getItem("user-info"));
  const { register, handleSubmit, errors, control, reset } = useForm();
  const [selectedPhone, setSelectedPhone] = useState();

  const [formValues, setFormValues] = useState({
    country: "",
    region: "",
  });
  const dispatch = useDispatch();
  const createProfileState = useSelector((state) => state.createProfile);
  const actionType = createProfileState && createProfileState.type;

  useEffect(() => {
    get();
  }, [createProfileState.isData]);

  const get = async () => {
    if (!userLocal) {
      props.history.push("/");
    }
    if (createProfileState.isData) {
      reset(createProfileState.user);
      console.log("user data", createProfileState.user);
    }
    if (Object.keys(createProfileState.user).length == 0) {
      dispatch(getUser());
    }
  };

  //   switch (actionType) {
  //     case 'createProfile/getUserSuccess':
  //       reset(createProfileState.user);
  //       break;
  //     // case 'createProfile/postUserSuccess':
  //     //   props.history.push("/interestsexpertise");
  //     //   break;
  //     default:
  //       break;
  //   }
  // };

  if (createProfileState.postUser) {
    return <Redirect to="/interestsexpertise" />;
  }

  const selectPhone = (val) => {
    setSelectedPhone(val);
  };

  const selectCountry = (val) => {
    setFormValues((prevState) => ({ ...prevState, country: val }));
  };

  const selectRegion = (val) => {
    if (country === "United States" || country === "Canada") {
      console.log("entered the valid region");
      setFormValues((prevState) => ({ ...prevState, region: val }));
    }
  };
  // const userLocal = JSON.parse(localStorage.getItem('user-info'));
  //   const userBioObject = {
  //     Email: userLocal.username,
  //   }
  const onSubmit = (data) => {
    data.PhoneNumber = selectedPhone
      ? selectedPhone
      : createProfileState.user.PhoneNumber;

    const userBioObject = {
      Email: userLocal.username,
      ...data,
    };
    dispatch(postUser(userBioObject));
  };

  const { region, country } = formValues;

  return (
    <div className="login-container">
      <BackButton />
      <div className="text-center mt-5 mb-5">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="container bg-white">
        <div className="row justify-content-center pt-5 pb-5">
          <div className="col-md-8">
            <h1 className="text-center">Complete Your Profile</h1>
          </div>

          {createProfileState.isData && (
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <ErrorMessage type={errors.LastName && errors.LastName.type} />
              </div>

              {/* <div className='form-group'>
                  <label>Phone Number</label>
                  <input type='text'
                    className='form-control' name="PhoneNumber" placeholder="Enter Phone" ref={register({ required: true })} />
                  <ErrorMessage type={errors.PhoneNumber && errors.PhoneNumber.type} />
                </div> */}

              <div className="form-group">
                <label>Phone Number</label>
                <Controller
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      className="form-control"
                      country={"us"}
                      name="PhoneNumber"
                      value={createProfileState.user.PhoneNumber}
                      onChange={(val) => selectPhone(val)}
                      ref={register({ required: true })}
                    />
                  )}
                  control={control}
                  name="PhoneNumber"
                />
              </div>
              <ErrorMessage
                type={errors.PhoneNumber && errors.PhoneNumber.type}
              />

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
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="Address"
                  placeholder="Enter Address"
                  ref={register({ required: true })}
                />
                <ErrorMessage type={errors.Address && errors.Address.type} />
              </div>

              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  className="form-control"
                  name="AddressLine2"
                  placeholder="Enter Address Line 2"
                  ref={register({ required: false })}
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
              <div className="form-group d-grid mt-5">
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-height"
                >
                  Next
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
