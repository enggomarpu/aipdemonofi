import React from "react";
import ArrowLeft from "../../img/arrow-left.png";
import { Link } from "react-router-dom";
import "./AllSet.scss";
import Logo from "../../img/logo.png";
import Group from "../../img/group-icon.png";
import { useHistory } from "react-router-dom";
import HttpService from "./../../shared/http.service";

const AllSet = (props) => {
  const history = useHistory();

  const submit = async () => {
    const user = JSON.parse(localStorage.getItem("user-info"));
    await HttpService.get("delete-access-token/" + user.username)
      .then((res) => {
        history.push("/user/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="login-container">
        <Link to="/interestsexpertise" className="btn-back">
          <img src={ArrowLeft} alt="ArrowLeft" />
          Back
        </Link>
        <div className="text-center mt-5 mb-5">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="container bg-white">
          <div className="text-center mt-5">
            <img src={Group} alt="Logo" />
          </div>
          <div className="row justify-content-center pt-5 pb-5">
            <div className="col-md-8">
              <h2 className="text-center mb-4">You’re all set!</h2>
              <p className="text-center mb-4">
                Now you can begin connecting with other Affiliates as well as
                continue to build your Profile.
              </p>
              <div className="form-group d-grid">
                <button
                  onClick={submit}
                  className="btn btn-primary btn-block btn-height"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllSet;
