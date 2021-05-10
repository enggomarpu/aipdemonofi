import React from 'react'
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
import Bio from './bio'
import MyProjects from './projects'
import MyCertifications from './certification'
import MyTeam from './team'
import ProfileForm from './profileform'
const ViewProfile = (props) => {
  return (
    <>
      <Header heading='My Profile' />

      <div className='main'>
        <div className='siderbar'>
          <Sidebar />
        </div>
        <div className='main-wrapper'>
          <div className='row'>
            <div className='col-md-8'>
            <button className = "btn btn-primary">Add to Contact</button>
              <div className='row'>
                <div className='col-md-12'>
                  <Bio
                    userId={props.match.params.id}
                    username={props.match.params.email}
                    heading5='Bio'
                  />
                </div>
              </div>

              <MyProjects
                userId={props.match.params.id}
                headin5='My Projects'
                button='Add New Project'
              />
               <MyCertifications
                userId={props.match.params.id}
                heading5='My Certifications'
                button='Add certifications'
              />
                <MyTeam userId={props.match.params.id} />

            </div>
            <div className='col-md-4'>
              <ProfileForm
                userId={props.match.params.id}
                username={props.match.params.email}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewProfile
