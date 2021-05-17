import Axios from 'axios';

const interceptor = () => {
  Axios.interceptors.request.use(
    (conf) => {
      // you can add some information before send it.
      // conf.headers['Auth'] = 'some token'
      conf.url = `https://dev-affiliate-secure.aipartnershipscorp.com/api/${conf.url}`;
      authHeader(conf);
      return conf;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  Axios.interceptors.response.use(
    (next) => {
      return Promise.resolve(next);
    },
    (error) => {
      // You can handle error here and trigger warning message without get in the code inside
       // Do something with response error
      return Promise.reject(error);
    }
  );
};

const authHeader = (conf) => {
  // return authorization header with jwt token
  let userInfo = JSON.parse(localStorage.getItem('user-info'));
  if (userInfo && userInfo.accessToken) {
    conf.headers['Authorization'] = `Bearer ${userInfo.accessToken}`;
  }
}

export default {
  interceptor,
};