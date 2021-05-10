import React, { Component, useContext, useState, useEffect } from "react";
import BackButton from "../BackButton/BackButton";
import "./CreateProfile.scss";
import Logo from "../../img/logo.png";
import { DispatchContext, StateContext } from "./Context/GlobalProvider";
import HttpService from "./../../shared/http.service";
import {useParams} from 'react-router-dom'

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  console.log("formvalid", formErrors);
  // validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach((val) => {
    (val === null || val === "") && (valid = false);
  });

  Object.values(rest).forEach((val) => {
    (val === null || val === "") && (valid = false);
  });

  return valid;
};

const CreateProfile = (props) => {
  let { token } = useParams();

  useEffect(() => { get() }, []);

    const get = async () => {
      await HttpService.verifyToken('user/verify-token/'+token.toString()).then((res) => {
        
      }).catch((err) => {
        console.log(err);
      });
    }
  
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    formErrors: {
      email: "",
      password: "",
    },
  });
  const [isValid, setinValid] = useState(false);

  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);

  const handleChange = (e) => {
    //e.preventDefault();
    setinValid(false);
    const { name, value } = e.target;
    let formErrors = { ...formValues.formErrors };
    //this.setState({ isValid: false });

    //console.log('context', this.context);
    switch (name) {
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      case "password":
        formErrors.password =
          value.length < 6 ? "minimum 6 characaters required" : "";
        break;
      default:
        break;
    }

    //  setFormValues({ formErrors, [name]: value });
    setFormValues((prevState) => ({ ...prevState, formErrors, [name]: value }));
    //this.setState({ ...formValues, [name]: value}, () => console.log(formValues))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = formValues.formErrors;
    if (formValid(formValues)) {
      console.log(`
        --SUBMITTING--
        Full Name: ${formValues.fullName}
        Company Name: ${formValues.companyName}
        Email: ${formValues.email}
        Password: ${formValues.password}
      `);
      const userInfo = {
        Email: formValues.email,
        Password: formValues.password,
      };

      //   const dataReturned = await GlobalDispatch.loginData(userInfo).then(
      //     (response) => {
      //       if (response !== undefined) {
      //         if (response.data) {
      //           console.log("logignnn", response);
      //           props.nextStep();
      //         }
      //       }
      //     }
      //   );
      //const dataReturned = GlobalDispatch.loginData(userInfo);
      //props.nextStep();

      setinValid(false);
      //setFormValues((prevState) => ({...prevState, isValid: false}))
    } else {
      console.log(formValues.email);

      if (!formValues.email) {
        setFormValues((prevState) => ({
          ...prevState,
          formErrors: {
            ...prevState.formErrors,
            email: "minimum 3 characaters required",
          },
        }));
      }
      if (!formValues.password) {
        setFormValues((prevState) => ({
          ...prevState,
          formErrors: {
            ...prevState.formErrors,
            password: "minimum 3 characaters required",
          },
        }));
      }

      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
      //setFormValues((prevState) => ({...prevState, isValid: true}))
      setinValid(true);
      //this.props.nextStep();
      //this.props.nextStep();
    }
  };

  const { formErrors } = formValues;
  const {
    fullName,
    email,
    password,
    companyName,
    address,
    location,
    phone,
  } = formValues;

  return (
    <div className="login-container">
      <BackButton />
      <div className="text-center mt-5 mb-5">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="container bg-white">
        <div className="row justify-content-center pt-5 pb-5">
          <div className="col-md-8">
            <h1 className="text-center   ">Complete Your Profie</h1>
            {GlobalState.signUpErr && (
              <div className="alert alert-danger text-center">
                <span className="text-danger text-capitalize">
                  {GlobalState.signUpErr}
                </span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Email</label>
                <input
                  //className={formErrors.firstName.length > 0 ? "error" : null}
                  placeholder="John Smith"
                  type="text"
                  className="form-control"
                  name="email"
                  noValidate
                  value={email || ""}
                  onChange={handleChange}
                />
                {formErrors.email.length > 0 && (
                  <div className="errorMessage alert alert-danger">
                    {formErrors.email}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  //className={formErrors.firstName.length > 0 ? "error" : null}
                  placeholder="John Smith"
                  type="password"
                  className="form-control"
                  name="password"
                  noValidate
                  value={password || ""}
                  onChange={handleChange}
                />
                {formErrors.password.length > 0 && (
                  <div className="errorMessage alert alert-danger">
                    {formErrors.password}
                  </div>
                )}
              </div>

              {isValid && (
                <div className="errorMessage alert alert-danger">
                  Form Invalid
                </div>
              )}
              <div className="form-group d-grid mt-5">
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-height"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
