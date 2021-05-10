import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import BackButton from "../BackButton/BackButton";
import "./CreateProfile.scss";
import Logo from "../../img/logo.png";
import HttpService from "./../../shared/http.service";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "../sharedError/error.messages";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CreateProfile = (props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    control,
  } = useForm();

  const [formValues, setFormValues] = useState({
    country: "",
    region: "",
  });

  const [data, setData] = useState({});
  const [isData, setIsData] = useState(false);
  const [isShow, setShow] = useState(false);
  const [isValid, setinValid] = useState(false);
  const [selectedPhone, setselectedPhone] = useState();

  const history = useHistory();

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    await HttpService.get("user/profile")
      .then((res) => {
        reset(res.data);
        setData(data);
        setIsData(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectPhone = (val) => {
    setselectedPhone(val);
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
  const userLocal = JSON.parse(localStorage.getItem("user-info"));
  const userBioObject = {
    Email: userLocal.username,
  };
  const onSubmit = async (data) => {
    setShow(true);
    const userLocal = JSON.parse(localStorage.getItem("user-info"));
    const userBioObject = {
      Email: userLocal.username,
      ...data,
    };
    HttpService.put("user/profile", userBioObject)
      .then((res) => {
        history.push("/interestsexpertise");
      })
      .catch((err) => {
        console.log(err);
      });
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

          {isData && !isShow && (
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

              <div className="form-group">
                <label>Phone Number</label>

                {/* <PhoneInput
                      className="form-control"
                      country={"ca"}
                      value={selectedPhone}
                      onChange={(val) => selectPhone(val)}
                    /> */}

                <Controller
                  name="PhoneNumber"
                  control={control}
                  as={
                    <PhoneInput
                      className="form-control"
                      country={"ca"}
                      name="PhoneNumber"
                      //value={createProfileState.user.PhoneNumber}
                      //onChange={(val) => selectPhone(val)}
                    />
                  }
                  rules={{ required: true }}
                  defaultValue={null}
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
