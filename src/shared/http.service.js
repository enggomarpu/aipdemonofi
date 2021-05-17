// import axios from 'axios';
// //import { useEffect, useState } from 'react';
// const API_URL = '';
// // const API_URL = 'http://localhost:3001/';
// const TOKEN = JSON.parse(localStorage.getItem('user-info'));


// // const useFetch = (url,type,data={}) =>{
// //   const [state,setState] = useState();
// //  // const [state,setState] = useState();
// //  // const [state,setState] = useState();
  
// //   useEffect(()=>{
// //     axios.get({
// //       url: API_URL+url,
// //       type,
// //       headers: {Authorization: 'Bearer ' + TOKEN.accessToken},
// //       data
// //     }).then(res=>setState(res.data))
// //   },[url,type])
// //  // return {state, settype, seturl};
// // }

// //export default useFetch;
// class HttpService {
//   async login(url, username, password) {
//     return await axios
//       .post(API_URL + url, {
//         username,
//         password,
//       })
//       .then((response) => {
//         // if (response.data.accessToken) {
//         //     localStorage.setItem('user-info', JSON.stringify(response.data))
//         // }
//         return response.data;
//       });
//   }

//   async verifyToken(route) {
//     return await axios.get(API_URL + route);
//   }

//   async get(route) {
//     if (!TOKEN) {
//       return;
//     }
//     const res = await axios.get(API_URL + route, {
//       headers: { Authorization: "Bearer " + TOKEN.accessToken },
//     });
//     return res;
//   }

//   async getwithoutTokken(route) {
//     const res = await axios.get(API_URL + route);
//     return res;
//   }

//   async twoFactorValidation(route, data) {
//     return await axios.post(API_URL + route, data);
//   }

//   post(route, data) {
//     if (!TOKEN) {
//       return;
//     }
//     return axios.post(API_URL + route, data, {
//       headers: { Authorization: "Bearer " + TOKEN.accessToken },
//     });
//   }
//   async postWithOutToken(route, data) {
//     const res = await axios.post(API_URL + route, data);
//     return res;
//   }

//   put(route, data) {
//     if (!TOKEN) {
//       return;
//     }
//     return axios.put(API_URL + route, data, {
//       headers: { Authorization: "Bearer " + TOKEN.accessToken },
//     });
//   }

//   delete(route) {
//     if (!TOKEN) {
//       return;
//     }
//     return axios.delete(API_URL + route, {
//       headers: { Authorization: "Bearer " + TOKEN.accessToken },
//     });
//   }

//   getCurrentUser() {
//     if (!TOKEN) {
//       return;
//     }
//     return JSON.parse(localStorage.getItem("user-info"));
//   }

//   getCurrentUserToken() {
//     if (!TOKEN) {
//       return;
//     }
//     return TOKEN;
//   }

//   getCurrentUserId() {
//     if (!TOKEN) {
//       return;
//     }
//     return JSON.parse(localStorage.getItem("user-info")).Id;
//   }
// }

// export default new HttpService();

import Axios from 'axios';

function Service() {
  this.get = (api, params) => {
    return Axios.get(api, params);
  };
  this.post = (api, params) => {
    return Axios.post(api, params);
  };
  this.put = (api, params) => {
    return Axios.put(api, params);
  };
  this.delete = (api, params) => {
    return Axios.delete(api, params);
  };
  this.getErrorDetails = (errorResponse) => {
    if(errorResponse && errorResponse.data && errorResponse.data.message){
      return errorResponse.data.message;
    }
    else {
      return errorResponse.statusText;
    }
  };
}
export default new Service();