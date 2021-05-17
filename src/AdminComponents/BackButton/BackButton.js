import React from 'react'
import './back-button.scss'
import ArrowLeft from '../../img/arrow-left.png'

const BackButton = (props) => {

  return (
    props.text ? 
    <button  className="btn-back" onClick={() => window.open( 'https://aipartnershipscorp.com')} >
      <img src={ArrowLeft} alt="LeftArrow" /> {props.text}
    </button>
    : 
    <> </>
  )
}

export default BackButton
