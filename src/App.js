import logo from './logo.svg';
import './App.css';
import Pushy from 'pushy-sdk-web';
import { useEffect } from 'react';
import Header from './Header';

function App() {

  //const deviceToken = '379d424b0cf1fe9c81a3e4';

  useEffect(()=>{

  }, [])


  Pushy.register({ appId: '607d3e9ebe50e00f1b8f55ab' }).then(function (deviceToken) {
    // Print device token to console
    console.log('Pushy device token: ' + deviceToken);

    // Send the token to your backend server via an HTTP GET request
    //fetch('https://push-notifications-app-aip.herokuapp.com/register/'+deviceToken);

    // Succeeded, optionally do something to alert the user
  }).catch(function (err) {
    // Handle registration errors
    console.error(err);
  });

const hitUrl = () => {
}

  const hitUrlNotify = () => {
    fetch('https://push-notifications-app-aip.herokuapp.com/push');
}

  return (
    <div className="App">
      <Header />
      <h1>Hello World</h1>
      <button onClick={hitUrl}>Button</button>
      <button onClick={hitUrlNotify}>Pusth Notification</button>
    </div>
  );
}

export default App;
