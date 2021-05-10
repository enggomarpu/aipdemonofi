import React from 'react';

// this is the equivalent to the createStore method of Redux
// https://redux.js.org/api/createstore

const MyContext = React.createContext({
    userData: null,
    userInfo: (userInfo) => {},

});
export const UserProvider = MyContext.Provider

export default MyContext;