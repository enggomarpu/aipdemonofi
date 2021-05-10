import React, { useState, useEffect } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import Bio from './Bio/Bio'
import MyProjects from './MyProjects/MyProjects'
import MyCertifications from './MyCertifications/MyCertifications'
import MyTeam from './MyTeam/MyTeam'
import PendingRequests from './PendingRequests/PendingRequests'
import ProfileForm from './ProfileForm/ProfileForm'
import SubAccounts from './SubAccounts/SubAccounts'
import Documents from './MyDocuments/documents';
import HttpService from '../../shared/http.service';

const Profile = (props) => {
  const [profileData, setProfileData] = useState(null)
  const [interests, setInterests] = useState(null)
  const [subAccountsData, setSubAccountsData] = useState(null)
  const [myCertifications, setMyCertifications] = useState(null)
  const [myTeams, setmyTeams] = useState(null)
  const [myProjects, setmyProjects] = useState(null)
  const [myBio, setMyBio] = useState(null)
  const [skills, setskills] = useState(null)
  const [userId, setUserId] = useState(false)
  const [resData, setResData] = useState(false)
  const { id } = props.match.params;
  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    var userId = id ? id : JSON.parse(localStorage.getItem('user-info')).userId;
    setUserId(userId);
    await HttpService.get(`user/profile/${userId}`).then((res) => {
      setProfileData(res.data.Profile);
      setInterests(res.data.Profile.Interests);
      setSubAccountsData(res.data.SubAccounts);
      setMyCertifications(res.data.MyCertifications);
      setmyTeams(res.data.TeamMembers);
      setMyBio(res.data.Profile.Bio);
      setmyProjects(res.data.MyProjects);
      setskills(res.data.Profile.Skills);
      if(res) {
        setResData(res.data);
      }
      console.log('skills=' + res.data.Profile.Skills)
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
      <Header
        heading="My Profile"
      />

      <div className='main'>
        <div className='siderbar'>
          <Sidebar />
        </div>
        <div className='main-wrapper'>
          <div className='row'>
            <div className='col-md-8'>
               {resData && <Bio data={myBio}
                heading5='Bio'
              />} 
              {myProjects && <MyProjects data={myProjects} headin5='My Projects' button='Add Project' />}
              <PendingRequests />
              {myCertifications && <MyCertifications
                data={myCertifications}
                heading5='My Certifications'
                button='Add Certifications'
              />}
              {myTeams && <MyTeam data={myTeams} />}
            </div>
            <div className='col-md-4'>
            {profileData && skills &&  interests && <ProfileForm data={profileData} skills={skills} interests={interests} />}
              {subAccountsData ? <SubAccounts data={subAccountsData} /> : null}
              <Documents />
            </div>
          </div>

        </div>
      </div>



    </>
  )
}

export default Profile
