import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router';
import { firstLogin } from './firstlogin.reducer';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const FirstLoginComponent = (props) => {

    const firstLoginState = useSelector(state => state.firstLogin);


    const dispatch = useDispatch();
    const { token } = useParams();


    useEffect(() => {
        if (!firstLoginState.isVerified && !firstLoginState.error) {
            dispatch(firstLogin(token))
        }

    }, [firstLoginState.isVerified, firstLoginState.error])

    if (firstLoginState.isVerified) {
        //props.history.push('/')
        return <Redirect to={{ pathname: "/", state: { isVerified: true } }} />
    }
    return (

        <div>
            <div className='login-container'>

                <div className='text-center mt-5 mb-5'>
                    {/* <img src={Logo} alt='Logo' /> */}
                </div>
                {firstLoginState && firstLoginState.error &&
                        
              
                            

                                <div className='container bg-white'>
                                    <div className='row justify-content-center pt-5 pb-5'>
                                        <div className='col-md-8 text-center' >
                                            <h2 className='text-center text-danger mb-5'><span>{firstLoginState.errorMessage}</span></h2>
                                            <br />
                                            <Link to={`/`} className=''>
                                                <button type='button' className='btn btn-primary btn-block btn-height text-center mb-5'>Back to Login</button>
                                            </Link>
                                        </div>
                                    </div>

                               
                </div>}
            </div>
        </div>



    )

}
export default FirstLoginComponent;