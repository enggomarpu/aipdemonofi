import { initialState } from './GlobalProvider';


export const GlobalReducer = (state = initialState, action) => {
    switch (action.type) {
      case "LOGIN_SUCCESS":
      console.log(action.payload);  
      localStorage.setItem("user", JSON.stringify(action.payload.data));
      localStorage.setItem("token", JSON.stringify(action.payload.data.accessToken));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.data,
        token: action.payload.data.accessToken
      };
      case "LOGIN_DATA":
      console.log(action.payload);  
      return {
        ...state,
        userData: action.payload,
      };

      case 'SET_CURRENT_USER_SUCCESS':
      return { ...state, userDetail: action.payload };

      case 'CHECK_EMAIL_SUCCESS':
        console.log('reducer checkemail', action)
        return { ...state, user: action.payload, isAuthenticated: true, signUpErr: "" };
      case 'CHECK_EMAIL_FAIL':
        console.log('checkemailfail', action)
        return { ...state, signUpErr: action.payload.message };

      case 'USER_SIGNUP_SUCCESS':
        console.log('reducer singup', action)
        return { ...state, user: action.payload, isAuthenticated: true, signUpErr: "" };
      case 'USER_SIGNUP_FAIL':
        console.log('signup failure', action)
        return { ...state, signUpErr: action.payload.message };

        
        




      // case 'SET_CURRENT_USER_SUCCESS':
      //   return { ...state, user: action.payload };
        
        // Sign in cases
      case 'SIGNIN_USER_SUCCESS':
        console.log(action)
        return { ...state, user: action.payload.user, isAuthenticated: true };
      case 'SIGNIN_USER_FAILURE':
        console.log(action);
        return { ...state, signInErr: action.payload.error }
      default:
        return state;
    }
  }
  
  