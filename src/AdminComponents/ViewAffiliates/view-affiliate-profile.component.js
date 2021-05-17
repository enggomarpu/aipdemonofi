import React, { useEffect } from 'react'
import Bio from './AffiliteBio/bio.component'
import MyProjects from './AffiliateProjects/affiliate-projects.component'
import MyCertifications from './AffiliateCertifications/MyCertifications'
import MyTeam from './AffiliateTeam/affiliate-team.component'
import PendingRequests from './AffiliatePendingRequests/PendingRequests'
import ProfileForm from './AffiliateProfileForm/affiliate-profile-form.component'
import SubAccounts from './AffiliateSubAccounts/affiliate-sub-accounts.component'
import Documents from './AffiliateDocuments/documents'
import AffiliateContacts from './AffiliateContacts/affiliate-contacts.component'

const AffiliateProfileView = (props) => {

  useEffect(() => {
    props.setPageTitle();
  }, [])
  return (
    <>
      <div className='row'>
        <div className='col-md-8'>
        <div className = "row">
          <div className = "col-md-6">
          <Bio
            userId={props.match.params.id}
            username={props.match.params.email}
            heading5='Bio'
          />

          </div>
          <div className = "col-md-6">
          <Documents userId={props.match.params.id} />
          </div>
        </div>
         

          

          <MyProjects
            userId={props.match.params.id}
            headin5='My Projects'
            button='Add New Project'
          />
          <PendingRequests userId={props.match.params.id} />
          <MyCertifications
            userId={props.match.params.id}
            heading5='My Certifications'
            button='Add certifications'
          />
          <MyTeam userId={props.match.params.id} />
          <AffiliateContacts  userId={props.match.params.id}/>
        </div>
        <div className='col-md-4'>
          <ProfileForm
            userId={props.match.params.id}
            username={props.match.params.email}
          />
          <SubAccounts userId={props.match.params.id} />
          
        </div>
      </div>
    </>
  )
}

export default AffiliateProfileView
