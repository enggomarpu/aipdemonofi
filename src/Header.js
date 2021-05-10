import React, { useState } from 'react';
import Pushy from 'pushy-sdk-web';


const Header = () => {
    const [count, setCount] = useState(0);
    // Handle push notifications (only when web page is open)
    Pushy.setNotificationListener(function (data) {
        // Print notification payload data
        console.log('Received notification: ' + JSON.stringify(data));
        //setCount(count + 1)
        // Attempt to extract the "message" property from the payload: {"message":"Hello World!"}
        let message = data.message || 'Test notification';
    
        // Display an alert with message sent from 
        //alert('Received notification: ' + message);
      });
    return (
        <div>
            <h2>Notification{count}</h2>
            <h1>Hello</h1>
        </div>
    );
}
export default Header;