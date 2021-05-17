import React, { useEffect, useState } from 'react'
import Logo from '../../../img/logo.png'
import BackButton from '../../BackButton/BackButton'
import { Link, Redirect } from 'react-router-dom'
import { useForm } from 'react-hook-form'
// import Pushy from 'pushy-sdk-web';
import Countdown from 'react-countdown'
import { ErrorMessage } from '../../sharedError/error.messages'
import { login, resendOTP, verifyOTP } from './admin.login.reducer'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'
import './login.scss'

const AdminLoginComponent = (props) => {

  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  
  const [otpShow, setOtpShow] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [date, setDate] = useState(Date.now() + 9000)
  const [email, setEmail] = useState()
  const [formdataotp, setFormdataOtp] = useState()
  const [values, setValues] = useState({password: "", showPassword: false });
  const [deviceTokenApp, setDeviceTokenApp] = useState()
  const dispatch = useDispatch()
  const loginState = useSelector((state) => state.login)
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: 'all'
  })

  useEffect(() => {
    rememberMeFunction()
  }, [])

  const rememberMeFunction = () => {
    if (
      localStorage.getItem('adminrememberme') &&
      localStorage.getItem('adminusername') !== ''
    ) {
      setValue('username', localStorage.getItem('adminusername'))
      setValue('password', localStorage.getItem('adminpassword'))
    }
  }

  const onSubmit = async (formdata, e) => {
    //   Pushy.register({ appId: '607d3e9ebe50e00f1b8f55ab' }).then(function (deviceToken) {
    //     // Print device token to console
    //     console.log('Pushy device token: ' + deviceToken);
    //     setDeviceTokenApp(deviceToken);

    //     // Succeeded, optionally do something to alert the user
    // }).catch(function (err) {
    //     // Handle registration errors
    //     console.error(err);
    // });
    e.preventDefault()

    if (formdata.rememberme) {
      localStorage.setItem('adminusername', formdata.username)
      localStorage.setItem('adminpassword', formdata.password)
      localStorage.setItem('adminrememberme', formdata.rememberme)
    }
    //dispatch(login(formdata));
    setEmail(formdata.username)

    if (loginState.showOtp) {
      console.log('device token', deviceTokenApp, formdata)
      dispatch(
        verifyOTP({
          Email: formdata.username,
          Password: formdata.password,
          VerificationCode: formdata.otp,
          deviceToken: deviceTokenApp,
        })
      )
    }
    if (!loginState.showOtp) {
      dispatch(login(formdata))
    }
    if (!formdata.otp) {
      setDate(Date.now() + 15000)
    }
  }

  if (!loginState.error && Object.keys(loginState.user).length != 0) {
    if (loginState.showOtp && loginState.otpSucceded) {
      props.setIsLoggedIn()
      return <Redirect to='/admindashboard' />
    }
  }

  const resendCode = async () => {
    if (!isDisabled) {
      setIsDisabled(true)
      setDate(Date.now() + 9000)
    }
    dispatch(resendOTP({ Email: email }))
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  return (
    <>
      <div className='login-container'>
        <BackButton text='Back to main Website' />
        <div className='text-center mt-5 mb-5'>
          <img src={Logo} alt='Logo' />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='container bg-white'>
            <div className='row justify-content-center pt-5 pb-5'>
              <div className='col-md-8'>
                <h2 className='text-center mb-5'>Login to your Account</h2>
                <div className='form-group'>
                  <label>Email</label>
                  <input
                    type='text'
                    placeholder='Email'
                    className='form-control'
                    name='username'
                    ref={register({
                      required: true,
                      pattern: emailRegex
                    })}
                  />
                  <ErrorMessage
                    type={errors.username && errors.username.type}
                    patternType={'email'}
                  />
                </div>
                <div className='form-group'>
                  <label>Password</label>

                  <div class='input-group mb-3'>
                    <input
                      className='form-control'
                      type={values.showPassword ? "text" : "password"}
                      id='password'
                      placeholder='Password'
                      name='password'
                      ref={register({ required: true })}
                    />
                    <span class='input-group-text' id='password' onClick={handleClickShowPassword}>
                      {values.showPassword ? <i class="fa fa-eye" aria-hidden="true"></i> : <i class="fa fa-eye-slash" aria-hidden="true"></i>}
                    </span>
                  </div>

                  <ErrorMessage
                    type={errors.password && errors.password.type}
                  />
                </div>
                <div className='form-check'>
                  <input
                    id='Remember'
                    className='form-check-input'
                    type='checkbox'
                    name='rememberme'
                    ref={register}
                  />
                  <label className='pull-left checkbox-inline'>
                    Remember me
                  </label>
                  <Link to='/forgotPassword' className='float-end link'>
                    Forgot password?
                  </Link>
                </div>
                {/* otp form start here */}
                {loginState.showOtp && (
                  <div className='row'>
                    <div className='col-8'>
                      <Countdown
                        date={date}
                        key={date}
                        onComplete={() => {
                          setIsDisabled(false)
                        }}
                      />
                    </div>
                    <div className='col-4 text-end'>
                      {!isDisabled && (
                        <button
                          className='btn btn-primary'
                          type='button'
                          onClick={resendCode}
                        >
                          Resend
                        </button>
                      )}
                    </div>
                    <div className='form-group'>
                      <label>
                        Please enter OTP send to you on your provided email id
                      </label>
                      <input
                        type='number'
                        className='form-control'
                        placeholder='****'
                        name='otp'
                        ref={register({ required: true })}
                        min='0'
                      />
                      <ErrorMessage type={errors.otp && errors.otp.type} />
                    </div>
                    {loginState.verifyError && (
                      <div className='text-danger'>
                        <span>{loginState.errorMessage}</span>
                      </div>
                    )}
                    <button
                      type='submit'
                      className='btn btn-primary btn-block btn-height'
                    >
                      {loginState && loginState.loading && (
                        <span className='spinner-border spinner-border-sm'></span>
                      )}
                      <span>Submit</span>
                    </button>
                  </div>
                )}{' '}
                {/* otp form ended here */}
                {loginState.error && (
                  <div className='text-danger'>
                    <span>{loginState.errorMessage}</span>
                  </div>
                )}
                {!loginState.showOtp && (
                  <div className='form-group d-grid'>
                    <button
                      type='submit'
                      className='btn btn-primary btn-block btn-height'
                    >
                      {loginState && loginState.loading && (
                        <span className='spinner-border spinner-border-sm'></span>
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
  )
}

export default AdminLoginComponent
