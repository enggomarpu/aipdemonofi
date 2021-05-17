import React, { useEffect, useState } from 'react'
import Countdown from "react-countdown";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { Form } from 'react-bootstrap'
import { resendOTP, verifyOTP } from './verify-otp.reducer';
import { ErrorMessage } from '../../sharedError/error.messages';
import '../admin-login/login.scss'
import Logo from '../../../img/logo.png'

const VerifyOtpComponent = (props) => {
    const verifyOTPState = useSelector(state => state.verifyOtp);
    const dispatch = useDispatch();
    const { email } = useParams();
    const [message, setMessage] = useState('User is not valid');
    const [isDisabled, setIsDisabled] = useState(true);
    const [date, setDate] = useState(Date.now() + 9000);
    const { register, handleSubmit, errors, formState, reset, setValue } = useForm();

    useEffect(() => {
        if (!email) {
            props.history.push("/");
        }
        switch (verifyOTPState.type) {
            case 'verifyOtp/verifyOTPSuccess':
                props.history.push("/admindashboard");
                break;
            case 'verifyOtp/resendOTPSuccess':
                setIsDisabled(true);
                setDate(Date.now() + 9000);
                break;
            case 'verifyOtp/verifyOTPFail':
                
                break;
            default:
                break;
        }
    }, [verifyOTPState]);

    const onSubmit = async (formdata, e) => {
        e.preventDefault();
        dispatch(verifyOTP({
            Email: email,
            VerificationCode: formdata.otp
        }))
    };

    const resendCode = async () => {
        dispatch(resendOTP({
            Email: email
        }))
    };

    return (
        <>
            <div className='login-container'>
                <div className='text-center mt-5 mb-5'>
                    <img src={Logo} alt='Logo' />
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className='container bg-white'>
                        <div className='row justify-content-center pt-5 pb-5'>
                            <div className='col-md-8'>
                                <h2 className='text-center mb-5'>Login to your Account</h2>
                                <div className='form-group d-grid'>
                                    <div className="row">
                                        <div className="col-10">
                                            <Countdown date={date} key={date} onComplete={() => { setIsDisabled(false) }} />
                                        </div>
                                        <div className="col-2">
                                            {!isDisabled &&
                                                <button className="btn btn-primary" type="button" onClick={resendCode}>
                                                    Resend
                                                </button>
                                            }
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label>Please enter OTP send to you on your provided email id</label>
                                        <input
                                            type='number'
                                            className='form-control'
                                            placeholder='****'
                                            name="otp"
                                            ref={register({ required: true })}
                                        />
                                        <ErrorMessage type={errors.otp && errors.otp.type} />
                                    </div>

                                    {verifyOTPState.verifyError && (
                                        <div className='text-danger'>
                                            <span>{verifyOTPState.errorMessage}</span>
                                        </div>
                                    )}           
                                    

                                    <button type='submit' className='btn btn-primary btn-block btn-height' >
                                        <span>Submit</span>
                                    </button>

                                    {verifyOTPState.resendError && (
                                        <div className='text-danger'>
                                            <span>{verifyOTPState.errorMessage}</span>
                                        </div>
                                    )}   

                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    );
}

export default VerifyOtpComponent;
