import React, { useEffect, useState, lazy } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import AdminDashboardComponent from "./AdminComponents/AdminDashboard/admin-main-dashboard.component";
import AffiliatesListViewComponent from "./AdminComponents/AffiliatesListView/affiliates-list-view.component";
import AdminSubAccountsComponent from "./AdminComponents/AdminSubAccounts/admin-sub-accounts.component";
import AffiliatesSubAccountsComponent from "./AdminComponents/AffiliatesSubAccounts/affiliates-sub-accounts-approvement.component";
import PendingPosts from "./AdminComponents/AdminDashboard/post/PendingPosts/PendingPosts";
import ViewAffiliateprofiles from "./AdminComponents/ViewAffiliates/view-affiliate-profile.component";
import "react-confirm-alert/src/react-confirm-alert.css";
import EventAdminCalendar from "./AdminComponents/AdminDashboard/CalenderEvents/event-calendar.component";
import TagsList from "./AdminComponents/ListOfTags/AddingTags/tags-list.component";
import SkillsTags from "./AdminComponents/ListOfTags/AddingSkills/adding-skills-tags.component";
import InterestsTags from "./AdminComponents/ListOfTags/AddingInterest/interests-add-tags.component";
import TermsAndConditions from "./AdminComponents/ListOfTags/TermsAndCondition/terms-and-conditons.component";
import Header from "./AdminComponents/Header/Header";
import Sidebar from "./AdminComponents/Sidebar/Sidebar";
import Notifications from "./AdminComponents/Notifications/Notifications"
import MyHub from "./AdminComponents/knowledge-hub/my-hub.component";
import { HeadingEnum } from "./AdminComponents/sharedError/constants";
import initStore from './store/store';
import { Provider } from "react-redux";
import serviceInterceptor from "./service/service.interceptor";
import ForgotPassword from './AdminComponents/authentication/admin-login/forgot-password.component'
import CreatePassword from './AdminComponents/authentication/create-password.component'
import Pushy from 'pushy-sdk-web';



export const store = initStore();
serviceInterceptor.interceptor();


const LoginComponent = lazy(() =>
  import('./AdminComponents/authentication/admin-login/admin.login.module').then(module => {
    store.injectReducer('login', module.default.reducer);
    store.injectSaga('login', module.default.saga);
    return import('./AdminComponents/authentication/admin-login/adminlogincomponent');
  })
);

const AvailableCollaboration = lazy(() =>
  import('./AdminComponents/AvailableCollaborations/Collaboration-List/collaboration-list.module').then(module => {
    store.injectReducer('collaborationlist', module.default.reducer);
    store.injectSaga('collaborationlist', module.default.saga);
    return import('./AdminComponents/AvailableCollaborations/Collaboration-List/collaborations-list.component');
  })
);

const ViewColabReviewRequest = lazy(() =>
  import('./AdminComponents/AvailableCollaborations/Review-Request/request-view.module').then(module => {
    store.injectReducer('collaborationViewRequest', module.default.reducer);
    store.injectSaga('collaborationViewRequest', module.default.saga);
    return import('./AdminComponents/AvailableCollaborations/Review-Request/view-collaboration-request.component');
  })
);

// const VerifyOtpComponent = lazy(() =>
//   import('./AdminComponents/authentication/verify-otp/verify-otp.module').then(module => {
//     store.injectReducer('verifyOtp', module.default.reducer);
//     store.injectSaga('verifyOtp', module.default.saga);
//     return import('./AdminComponents/authentication/verify-otp/verify-otp.component');
//   })
// );
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  const getUserInfo = () => {
    let userInfo = localStorage.getItem("user-info");
    userInfo = JSON.parse(userInfo);
    return userInfo && userInfo.accessToken;
  };

    Pushy.register({ appId: '607d3e9ebe50e00f1b8f55ab' }).then(function (deviceToken) {
        // Print device token to console
        console.log('Pushy device token: ' + deviceToken);
        //setDeviceTokenApp(deviceToken);

        // Succeeded, optionally do something to alert the user
    }).catch(function (err) {
        // Handle registration errors
        console.error(err);
    });


  useEffect(() => {
    setIsLoggedIn(getUserInfo());
  }, []);

  return (
    <>
     <Provider store={store}>
      <ToastProvider autoDismiss={true} >
      <React.Suspense fallback="loading...">
        <BrowserRouter>
          {isLoggedIn ? <>
            <Header heading={pageTitle} setIsLoggedIn={setIsLoggedIn} />
            <div className='main'>
              <div className='siderbar'>
                <Sidebar />
              </div>
              <div className='main-wrapper'>
                <Switch>
                  {/* <Route exact path="/">
                    <Route to="/admindashboard" />
                  </Route> */}
                  <Route exact path="/admindashboard"
                    render={props => <AdminDashboardComponent {...props} setPageTitle={() => setPageTitle(HeadingEnum.Dashboard)} />} />
                    <Route exact path="/notifications"
                    render={props => <Notifications {...props} setPageTitle={() => setPageTitle(HeadingEnum.Notifications)} />} />
                  <Route exact path="/Affiliates/affiliateslist"
                    render={props => <AffiliatesListViewComponent {...props} setPageTitle={() => setPageTitle(HeadingEnum.AffiliatesList)} />} />
                  <Route exact path="/Affiliates/affilitessubaccounts"
                    render={props => <AffiliatesSubAccountsComponent {...props} setPageTitle={() => setPageTitle(HeadingEnum.AffiliatesListSubAccount)} />} />
                  <Route exact path="/affiliatesprofile/:id"
                    render={props => <ViewAffiliateprofiles {...props} setPageTitle={() => setPageTitle(HeadingEnum.AffiliateProfile)} />} />
                    <Route exact path="/colabReviewRequest/:id"
                    render={props => <ViewColabReviewRequest {...props} setPageTitle={() => setPageTitle(HeadingEnum.ColabReviewRequest)} />} />
                  <Route exact path="/adminsubaccounts"
                    render={props => <AdminSubAccountsComponent {...props} setPageTitle={() => setPageTitle(HeadingEnum.AdminSubAccounts)} />} />
                  <Route exact path="/pendingposts"
                    render={props => <PendingPosts {...props} setPageTitle={() => setPageTitle(HeadingEnum.PendingPosts)} />} />
                      <Route exact path="/Affiliates/availablecollboration"
                    render={props => <AvailableCollaboration {...props} setPageTitle={() => setPageTitle(HeadingEnum.AvailableCollaboration)} />} />
                  <Route exact path="/admindashboard/admincalendar"
                    render={props => <EventAdminCalendar {...props} setPageTitle={() => setPageTitle(HeadingEnum.EventsCalender)} />} />
                  <Route exact path="/knowledgeHub/myhub"
                    render={props => <MyHub {...props} setPageTitle={() => setPageTitle(HeadingEnum.Myhub)} />} />
                  <Route exact path="/list/tagslist"
                    render={props => <TagsList {...props} setPageTitle={() => setPageTitle(HeadingEnum.Tags)} />} />
                  <Route exact path="/list/skillslist"
                    render={props => <SkillsTags {...props} setPageTitle={() => setPageTitle(HeadingEnum.Skills)} />} />
                  <Route exact path="/list/interestslist"
                    render={props => <InterestsTags {...props} setPageTitle={() => setPageTitle(HeadingEnum.Interest)} />} />
                  <Route exact path="/list/termscondslist"
                    render={props => <TermsAndConditions {...props} setPageTitle={() => setPageTitle(HeadingEnum.TermsAndCondition)} />} />
                 
                </Switch>
              </div>
            </div>
          </> :
            <Switch>
              <Route exact path="/"
               render={props => <LoginComponent {...props} setIsLoggedIn={() => setIsLoggedIn(true)} />} />
              {/* <Route exact path="/verify-otp/:email" component={VerifyOtpComponent} /> */}
              <Route exact path="/forgotPassword" component={ForgotPassword} />
              <Route exact path="/create-password/:token" component={CreatePassword} />
            </Switch>
          }
        </BrowserRouter>
        </React.Suspense>
      </ToastProvider>
      </Provider>
    </>
  );
};

export default App;
