import React, { lazy } from "react";
import AllSet from "./components/CreateProfile/AllSet";
import InterestsExpertise from "./components/CreateProfile/InterestsExpertise";
import CreateProfile from "./components/CreateProfile/CreateProfile";
import Affiliates from "./components/Affiliates/Affiliates";
import DashboardComponent from "./components/dashboard/dashboard.component";
import Profile from "./components/Profile/Profile";
import ViewProfile from "./components/AffiliatesList/ViewAffiliate/profile-view";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import "react-confirm-alert/src/react-confirm-alert.css";
import EventCalendar from "./components/dashboard/Event/event-calendar.component";
import MyHub from "./components/knowledge-hub/my-hub.component";
import initStore from './store/store';
import { Provider } from "react-redux";
import serviceInterceptor from "./service/service.interceptor";
import Notifications from "./components/Notifications/Notifications";
import AffiliatesContacts from "./components/Contacts/affiliate-contacts";
import ForgotPassword from "./components/authentication/login/forgot-password.component";
import CreatePassword from "./components/authentication/login/create-password.component";

export const store = initStore();
serviceInterceptor.interceptor();

const LoginComponent = lazy(() =>
  import('./components/authentication/login/login.module').then(module => {
    store.injectReducer('login', module.default.reducer);
    store.injectSaga('login', module.default.saga);
    return import('./components/authentication/login/login.component');
  })
);

const VerifyOtpComponent = lazy(() =>
  import('./components/authentication/verify-otp/verifyOtp.module').then(module => {
    store.injectReducer('verifyOtp', module.default.reducer);
    store.injectSaga('verifyOtp', module.default.saga);
    return import('./components/authentication/verify-otp/verifyOtp.component');
  })
);

const FirstLoginComponent = lazy(() =>
  import('./components/authentication/first-login/firstLogin.module').then(module => {
    store.injectReducer('firstLogin', module.default.reducer);
    store.injectSaga('firstLogin', module.default.saga);
    return import('./components/authentication/first-login/first-login.component');
  })
);

// const CreateProfile = lazy(() =>
//   import('./components/CreateProfile/create-profile/createProfile.module').then(module => {
//     store.injectReducer('createProfile', module.default.reducer);
//     store.injectSaga('createProfile', module.default.saga);
//     return import('./components/CreateProfile/create-profile/CreateProfile');
//   })
// );

// const InterestsExpertise= lazy(() =>
//   import('./components/CreateProfile/interest-expertise/interestsexpertise.module').then(module => {
//     store.injectReducer('interexp', module.default.reducer);
//     store.injectSaga('interexp', module.default.saga);
//     return import('./components/CreateProfile/interest-expertise/InterestsExpertise');
//   })
// );

const AvailableCollaborationComponent = lazy(() =>
  import('./components/Collaborations/available-collaborations/available-collaborations.module').then(module => {
    store.injectReducer('available_collaboration', module.default.reducer);
    store.injectSaga('available_collaboration', module.default.saga);
    return import('./components/Collaborations/available-collaborations/available-collaborations.component');
  })
);


const App = () => {

  Pushy.register({ appId: '607d3e9ebe50e00f1b8f55ab' }).then(function (deviceToken) {
    // Print device token to console
    console.log('Pushy device token: ' + deviceToken);
    //setDeviceTokenApp(deviceToken);

    // Succeeded, optionally do something to alert the user
}).catch(function (err) {
    // Handle registration errors
    console.error(err);
});

  return (
    <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <ToastProvider autoDismiss={true}>
        <React.Suspense fallback="loading...">
          {/* <Route exact path="/" component={LoginComponent} /> */}
          <Route exact path="/" render={(props) => <LoginComponent {...props}/>} />
          <Route exact path="/forgotPassword" component={ForgotPassword} />
          <Route exact path="/verify-otp/:email" component={VerifyOtpComponent} />
          <Route exact path="/create-password/:token" component={CreatePassword} />
          <Route exact path="/firstlogin/:token" component={FirstLoginComponent} />
          <Route exact path="/create-profile" component={CreateProfile} />
          <Route exact path="/allset" component={AllSet} />
          <Route exact path="/interestsexpertise" component={InterestsExpertise}/>
          <Route exact path="/Affiliates/affiliateslist" component={Affiliates} />
          <Route exact path="/profile/:id" component={ViewProfile} />
          <Route exact path="/user/profile" component={Profile} />
          <Route exact path="/user/dashboard" component={DashboardComponent} />
          <Route exact path="/Affiliates/availablecollboration" component={AvailableCollaborationComponent} />
          <Route exact path="/user/dashboard/calendar" component={EventCalendar} />
          <Route exact path="/knowledgeHub/myhub" component={MyHub} />
          <Route exact path="/notifications" component={Notifications} />
          <Route exact path="/user/contacts" component={AffiliatesContacts} />
          </React.Suspense>
        </ToastProvider>
        
      </Switch>
    </BrowserRouter>
  </Provider>
  );
};

export default App;
