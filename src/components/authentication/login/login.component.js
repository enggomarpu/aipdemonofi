import React, { useEffect, useState } from 'react'
import BackButton from '../../BackButton/BackButton'
import './login.scss'
import Logo from '../../../img/logo.png'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from './../../sharedError/error.messages'
import { login, getWithoutToken, verifyOTP, firstLogin, resendOTP } from './login.reducer'
import { useDispatch, useSelector } from 'react-redux'
import Countdown from "react-countdown";
import { Form } from 'react-bootstrap';
import Model from './TermsCondition'
import { form } from 'react-validation/build/form'
import Pushy from 'pushy-sdk-web';



const LoginComponent = (props) => {
   const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const [isDisabled, setIsDisabled] = useState(true);
  const [date, setDate] = useState(Date.now() + 12000);
  const [email, setEmail] = useState('');
  const { token } = useParams();
  const [values, setValues] = useState({password: "", showPassword: false });
  const dispatch = useDispatch();
  const [deviceTokenApp, setDeviceTokenApp] = useState();
  const loginState = useSelector(state => state.login);
  const [verifiedTokenState, setVerifiedTokenState ] = useState();
  const { register, handleSubmit, errors, setValue } = useForm();

  useEffect(() => {
    rememberMe();
    let verifiedToken = props.location.state && props.location.state.isVerified ? true : false 
    setVerifiedTokenState( verifiedToken );
    //console.log()
  }, [])

  if (!loginState.error && Object.keys(loginState.user).length != 0) {
    if (loginState.user.IsFirstLogin) {
      if (!loginState.withoutToken) {
        dispatch(getWithoutToken(loginState.user.Email))
      }
      if (loginState.user.accessToken) {
        return <Redirect to="/create-profile" />
      }
    }
    else {
      if (loginState.showOtp && loginState.otpSucceded) {
        return <Redirect to="/user/dashboard" />
      }
    }
  }  
 
  const rememberMe = async () => {
    if (localStorage.getItem('rememberme') && (localStorage.getItem('username') !== '')) {
      setValue('username', localStorage.getItem('username'));
      setValue('password', localStorage.getItem('password'));
    }
  }

  const onSubmit = async (formdata, e) => {

    Pushy.register({ appId: '607d3e9ebe50e00f1b8f55ab' }).then(function (deviceToken) {
      // Print device token to console
      console.log('Pushy device token: ' + deviceToken);
      setDeviceTokenApp(deviceToken);
  
      // Succeeded, optionally do something to alert the user
  }).catch(function (err) {
      // Handle registration errors
      console.error(err);
  });

    e.preventDefault();
    if (formdata.rememberme) {
      localStorage.setItem('username', formdata.username);
      localStorage.setItem('password', formdata.password);
      localStorage.setItem('rememberme', formdata.rememberme);
    }
    setEmail(formdata.username);

    if(loginState.showOtp){
      console.log('device token', deviceTokenApp)
      dispatch(verifyOTP({ Email: formdata.username, Password:formdata.password,  VerificationCode: formdata.otp, deviceToken: deviceTokenApp }))
    }
    if(!loginState.showOtp){
      dispatch(login(formdata));
    }  
    if(!formdata.otp){
      setDate(Date.now() + 30000);
    }
    
  }
  // if(loginState.codeSent){
  //   setIsDisabled(true);
  //   setDate(Date.now() + 9000);
  // }

  const resendCode = async () => {
    if(!isDisabled){
      setIsDisabled(true);
      setDate(Date.now() + 9000);
    }
    dispatch(resendOTP({Email: email }))
};
const handleClickShowPassword = () => {
  setValues({ ...values, showPassword: !values.showPassword });
};
  return (
    <>
      <div className="login-container">
        <BackButton text="Back to main Website" />
        <div className="text-center mt-5 mb-5">
          <img src={Logo} alt="Logo" />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="container bg-white">
            <div className="row justify-content-center pt-5 pb-5">
              <div className="col-md-8">
                <h2 className="text-center mb-5">Login to your Account</h2>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    placeholder="Email"
                    className="form-control"
                    name="username"
                    ref={register({ required: true, pattern: emailRegex })}
                  />
                  <ErrorMessage
                    type={errors.username && errors.username.type}
                    patternType={"email"}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>

                  <div class="input-group mb-3">
                    <input
                      className="form-control"
                      type={values.showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Password"
                      name="password"
                      ref={register({ required: true })}
                    />
                    <span
                      class="input-group-text"
                      id="password"
                      onClick={handleClickShowPassword}
                    >
                      {values.showPassword ? (
                        <i class="fa fa-eye" aria-hidden="true"></i>
                      ) : (
                        <i class="fa fa-eye-slash" aria-hidden="true"></i>
                      )}
                    </span>
                  </div>

                  <ErrorMessage
                    type={errors.password && errors.password.type}
                  />
                </div>
                <div className="form-check">
                  <input
                    id="Remember"
                    className="form-check-input"
                    type="checkbox"
                    name="rememberme"
                    ref={register}
                  />
                  <label className="pull-left checkbox-inline">
                    Remember me
                  </label>
                  <Link to="/forgotPassword" className="float-end link">
                    Forgot password?
                  </Link>
                </div>

                {/* {loginState.isVerified && */}
                {verifiedTokenState && (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="TermsConditions"
                      type="checkbox"
                      name="termsconditions"
                      ref={register({ required: true })}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="TermsConditions"
                    >
                      I have read and accept the{" "}
                      <Link
                        to="/"
                        className="lite-link"
                        type="button"
                        //  className='btn p-1 ms-1'
                        data-bs-toggle="modal"
                        data-bs-target="#TermsAndCondition"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                    <ErrorMessage
                      type={
                        errors.termsconditions && errors.termsconditions.type
                      }
                    />
                  </div>
                )}
                <Model />
                {loginState.error && (
                  <div className="text-danger">
                    <span>{loginState.errorMessage}</span>
                  </div>
                )}
                {/* otp form ended here */}
                {loginState.showOtp && !loginState.user.IsFirstLogin ? (
                  <div className="row">
                    <div className="col-8">
                      <Countdown
                        date={date}
                        key={date}
                        onComplete={() => setIsDisabled(false)}
                      />
                    </div>
                    <div className="col-4 text-end">
                      {!isDisabled && (
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={resendCode}
                        >
                          Resend
                        </button>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        Please enter OTP send to you on your provided email id
                      </label>
                      <input
                        type="number"
                        // inputmode="numeric"
                        className="form-control"
                        placeholder="****"
                        name="otp"
                        ref={register({ required: true })}
                      />
                      <ErrorMessage type={errors.otp && errors.otp.type} />
                    </div>
                    {loginState.verifyError && (
                      <div className="text-danger">
                        <span>{loginState.errorMessage}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-height"
                    >
                      {loginState && loginState.loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <span>Submit</span>
                    </button>
                  </div>
                ) : (
                  <div className="form-group d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-height"
                    >
                      {loginState && loginState.loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <span>Login</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default LoginComponent
