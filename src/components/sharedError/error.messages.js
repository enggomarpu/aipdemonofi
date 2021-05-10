import React, { useState, useEffect } from 'react'

import {
  REQUIRED_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  Phone_Number,
  Integers,
  Comapany_Name,
  Address,
  CONFIRM_PASSWORD,
  URL_ERROR_MESSAGE
} from './constants'

export const ErrorMessage = (props) => {
  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  const [Message, setMessage] = useState('')

  useEffect(() => {
    switch (props.type) {
      case 'required':
        setMessage(REQUIRED_MESSAGE)
        break
      case 'pattern':
        switch (props.patternType) {
          case 'email':
            setMessage(INVALID_EMAIL_MESSAGE)
            break
          case 'phoneNumber':
            setMessage(Phone_Number)
            break
          case 'integers':
            setMessage(Integers)
            break
          case 'companyName':
            setMessage(Comapany_Name)
            break
          case 'address':
            setMessage(Address)
            break
          case 'url': 
            setMessage(URL_ERROR_MESSAGE)  
          default:
            break
        }
        break
      case 'validate':
        switch (props.validationType) {
          case 'confirmPassword':
            setMessage(CONFIRM_PASSWORD)
            break
          default:
            break
        }
        break
      default:
        setMessage('')
        break
    }
  }, [props.type])
  return (
    <div className='text-dengar'>
      <span>{Message}</span>
    </div>
  )
}
