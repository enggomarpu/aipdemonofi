import React, { useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import DashboardPosts from './my-hub/dashboard-post.component'
import FavouritePosts from './my-hub/favourite-post.component'
import MyContent from './my-hub/my-content.component'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'

const MyHub = () => {

  const [show, sethide] = useState(false)

  return (
    <>
      <Header heading='Favourite Posts' />
      <div className='main'>
        <div className='siderbar'>
          <Sidebar />
        </div>
        <div className='main-wrapper'>
          <Tabs>
            <div className='row g-0 justify-content-between'>
              <div className='col-12'>
                <TabList
                  className='nav nav-tabs custom-tabs-nav'
                  id='myTab'
                  role='tablist'
                >
                  <Tab className='nav-item' role='presentation'>
                    My Contents
                  </Tab>
                  <Tab className='nav-item' role='presentation'>
                    Favourites
                  </Tab>
                  <Tab className='nav-item' role='presentation'>
                    Dashboard Posts
                  </Tab>
                </TabList>
              </div>
              {show && 
              <div className='col-12 mr-5'>
                <button>Add Content</button>
              </div>
              }
            </div>

            <div className='tab-content' id='myTabContent'>
              <TabPanel>
                <div
                  className='tab-pane fade show active'
                  id='profile'
                  role='tabpanel'
                  aria-labelledby='profile-tab'
                >
                  <MyContent />
                </div>
              </TabPanel>
              <TabPanel>
                <div
                  className='tab-pane fade show active'
                  id='profile'
                  role='tabpanel'
                  aria-labelledby='profile-tab'
                >
                  <FavouritePosts />
                </div>
              </TabPanel>

              <TabPanel>
                <div
                  className='tab-pane fade show active'
                  id='profile'
                  role='tabpanel'
                  aria-labelledby='profile-tab'
                >
                  <DashboardPosts />
                </div>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default MyHub
