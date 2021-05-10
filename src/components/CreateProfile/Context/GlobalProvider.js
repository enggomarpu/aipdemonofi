import React, { createContext, useReducer, useEffect } from "react";
import {GlobalReducer } from './GlobalReducer';
import HttpService from './../../../shared/http.service';
import axios from "axios";


const API_URL = "http://3.97.206.109:8081/";


let user = localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")) : null;
let token = localStorage.getItem("token")? JSON.parse(localStorage.getItem("token")): null;


export const initialState = {
  
    isAuthenticated: false,
    token: null || token,
    user: null || user,
    signUpErr: '',
    signInErr: '',
    stepForm: 1,
    userDetail: null
    
  };
  
export const StateContext = createContext(initialState)
export const DispatchContext = createContext();

export const GlobalProvider = ({ children }) => {
const [state, dispatch] = useReducer(GlobalReducer, initialState);

const loginUser = async (username, password) => {
  console.log('login user called');
  return await axios
    .post(API_URL + "login", {username, password
    })
    .then(response => {
      if (response.data.accessToken) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      }
      return response.data;
    });
}

const setCurrentUser = async (user) => {
  console.log('global dispatch', user);
  dispatch({type: 'SET_CURRENT_USER_SUCCESS', payload: user})
}

  const checkEmail = async (user) => {
    try {
        dispatch({ type: 'SIGNUP_USER_LOADING' });
          console.log('api call started check email');
          console.log(user);
        const res = await HttpService.post("user/check-email", {Email: user.Email})
        dispatch({ type: 'CHECK_EMAIL_SUCCESS', payload: user });
          return res;
        } catch (error) {
          if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            return dispatch({ type: 'CHECK_EMAIL_FAIL', payload: error.response.data });
          }      
      }
    }
    const signUp = async (user) => {
      try {
          dispatch({ type: 'SIGNUP_USER_LOADING' });
          console.log('api call started singUp');
          console.log(user);
          const res = await HttpService.post("user/create-profile", user)
          dispatch({ type: 'USER_SIGNUP_SUCCESS', payload: user });
            return res;
          } catch (error) {
            if (error.response) {
              // Request made and server responded
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              return dispatch({ type: 'USER_SIGNUP_SUCCESS', payload: error.response.data });
            }      
        }
      }
      const updateSignUp = async (user) => {
        try {
            dispatch({ type: 'SIGNUP_USER_LOADING' });
            console.log('api call started updaateeesingUp');
            console.log('update whole object', user);
            const res = await HttpService.put("user/profile", user)
            dispatch({ type: 'USER_SIGNUP_SUCCESS', payload: user });
              return res;
            } catch (error) {
              if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                return dispatch({ type: 'USER_SIGNUP_SUCCESS', payload: error.response.data });
              }      
          }
        }

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={{checkEmail, signUp, loginUser, setCurrentUser, updateSignUp}}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    )
  }