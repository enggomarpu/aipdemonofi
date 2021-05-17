import React from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import Bio from './AffiliteBio/Bio'
import MyProjects from './AffiliateProjects/MyProjects'
import MyCertifications from './AffiliateCertifications/MyCertifications'
import MyTeam from './AffiliateTeam/MyTeam'
import PendingRequests from './AffiliateRequests/PendingRequests'
import ProfileForm from './AffiliateProfileForm/ProfileForm'
import SubAccounts from './AffiliateSubAccounts/SubAccounts'
import Documents from './AffiliateDocuments/documents'

const Profile = (props) => {
  // const [profileData, setProfileData] = useState(null)
  // const [interests, setInterests] = useState(null)
  // const [subAccountsData, setSubAccountsData] = useState(null)
  // const [myCertifications, setMyCertifications] = useState(null)
  // const [myTeams, setmyTeams] = useState(null)
  // const [myProjects, setmyProjects] = useState(null)
  // const [myBio, setMyBio] = useState(null)
  // const [skills, setskills] = useState(null)
  // const [userId, setUserId] = useState(false)
  // const [resData, setResData] = useState(false)
  const { id } = props.match.params
  const { email } = props.match.params

  // const get = async () => {
  //   var userId = id ? id : JSON.parse(localStorage.getItem('user-info')).userId;
  //  // setUserId(userId);
  //   await HttpService.get(`user/profile/${userId}`).then((res) => {
  //     // setProfileData(res.data.Profile);
  //     // setInterests(res.data.Profile.Interests);
  //     // setSubAccountsData(res.data.SubAccounts);
  //     // setMyCertifications(res.data.MyCertifications);
  //     // setmyTeams(res.data.TeamMembers);
  //     // setMyBio(res.data.Profile.Bio);
  //     // setmyProjects(res.data.MyProjects);
  //     // setskills(res.data.Profile.Skills);
  //     if(res) {
  //      // setResData(res.data);
  //     }
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }

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
              <div className='row'>
                <div className='col-md-6'>
                  <Bio
                    userId={props.match.params.id}
                    username={props.match.params.email}
                    heading5='Bio'
                  />
                </div>
                <div className='col-md-6'>
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
            </div>
            <div className='col-md-4'>
              <ProfileForm
                userId={props.match.params.id}
                username={props.match.params.email}
              />
              <SubAccounts userId={props.match.params.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
