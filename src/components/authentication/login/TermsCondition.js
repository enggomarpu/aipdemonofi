import React, { useState, useEffect } from 'react'
import HttpService from '../../../shared/http.service'
import Form from "react-validation/build/form";

const Model = () => {
  const [TAC, setTAC] = useState([]);

  useEffect( () => {
    console.log('testing')
       get();
  }, []);

    const get = async () => {
    await HttpService.get('TermsAndConditions').then((res) => {
      setTAC(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    
    <>
      <Form
        className='modal fade'
        id='TermsAndCondition'
        tabIndex='-1'
        aria-labelledby='AppModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
          {TAC.map((result) => {
          return ( 
            <>
            <div className='modal-header'>
              <h5 className='modal-title' id='AppModalLabel'>
              {result.Name}
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                
              ></button>
            </div>
            <div className='modal-body'>
                    <div className='form-check'>
                    
                    <label className='form-check-label' htmlFor='TermsConditions'>
                      {result.Message}
                    </label>
                  </div>
            </div>
            </>
          )} )}
            
            {/* <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm'
                data-bs-dismiss='modal'
              >
                Disagree
              </button>
              <button type='button' className='btn btn-primary btn-sm'>
                Agree
              </button>
              
            </div> */}
          </div>
        </div>
      </Form>
    
    </>
  )
}


export default Model
