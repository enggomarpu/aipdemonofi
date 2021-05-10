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