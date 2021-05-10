import React from 'react'
import './Affiliates.scss'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import Affiliatelist from '../AffiliatesList/AffiliatesList'
const Affiliates = () => {
  return (
    <>
      <Header 
        heading = "Affiliates"
      />

      <div className="main">
        <div className="siderbar">
          <Sidebar />
        </div>
        <Affiliatelist />
      </div>
    </>
  )
}

export default Affiliates
