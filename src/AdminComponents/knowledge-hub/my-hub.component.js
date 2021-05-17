import React, {useEffect} from 'react'
import AdminPosts from './my-hub/dashboard-post.component'
import AffiliatePosts from './AffiliatePost/affiliate-post.component'
import FeaturedPosts from './FeaturedPost/featured-post.component'
import './my-hub.scss'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';


const MyHub = (props) => {

  useEffect(() => {
 
    props.setPageTitle();
  }, [])
  
  return (
    <>
          <Tabs>
            <div className='row g-0 justify-content-between'>
              <div className='col-12'>
                <TabList
                  className='nav nav-tabs custom-tabs-nav'
                  id='myTab'
                  role='tablist'
                >
                  <Tab className='nav-item' role='presentation'>
                  Admin Posts
                  </Tab>
                  <Tab className='nav-item' role='presentation'>
                  Affiliate Posts
                  </Tab>
                  <Tab className='nav-item' role='presentation'>
                  Featured Posts
                  </Tab>
                </TabList>
              </div>
              <div className='col-auto'></div>
            </div>

            <div className='tab-content' id='myTabContent'>
              <TabPanel>
                <div
                  className='tab-pane fade show active'
                  id='profile'
                  role='tabpanel'
                  aria-labelledby='profile-tab'
                >
                  <AdminPosts />
                </div>
              </TabPanel>
              <TabPanel>
                <div
                  className='tab-pane fade show active'
                  id='profile'
                  role='tabpanel'
                  aria-labelledby='profile-tab'
                >
                  <AffiliatePosts />
                </div>
              </TabPanel>

              <TabPanel>
                <div
                  className='tab-pane fade show active'
                  id='profile'
                  role='tabpanel'
                  aria-labelledby='profile-tab'
                >
                  <FeaturedPosts />
                </div>
              </TabPanel>
            </div>
          </Tabs>
    </>
  )
}

export default MyHub



