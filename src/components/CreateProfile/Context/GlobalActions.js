// export const signUp = (dispatch) => async (user) => {
//     try {
//       dispatch({ type: 'SIGNUP_USER_LOADING' });
//       const res = await apiCall('/auth/sign_up', 'post', user);
//       dispatch({ type: 'SIGNUP_USER_SUCCESS', payload: res.data });
//       return res;
//     } catch (err) {
//       return dispatch({ type: 'SIGNUP_USER_FAILURE', payload: err.response.data });
//     }
//   };

// const {state, dispatch} = useContext(GlobalContext);

// export const signUp = async (user) => {
//     console.log('signup global actions')
//     dispatch({ type: 'SIGNUP_USER_SUCCESS', user });
// }