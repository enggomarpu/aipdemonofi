import React from "react";
import BackButton from "../../BackButton/BackButton";
import "./login.scss";
import Logo from "../../../img/logo.png";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";
import HttpService from "../../../shared/http.service";
import { useToasts } from "react-toast-notifications";

const ForgotPassword = () => {
  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const { register, handleSubmit, errors } = useForm();
  const { addToast } = useToasts();

  const onSubmit = async (data) => {
    const email = data.Email;

    await HttpService.get(`user/admin-forgot-password/${email}`)
      .then((res) => {
        if (res) {
          addToast("Check Your Email to Change the Password", {
            appearance: "success",
          });
        }
      })
      .catch((err) => {
        addToast("User does not Exist ", {
          appearance: "error",
        });
      });
  };

  return (
    <>
      <div className="login-container">
        <BackButton />
        <div className="text-center mt-5 mb-5">
          <img src={Logo} alt="Logo" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          (
          <div className="container bg-white">
            <div className="row justify-content-center pt-5 pb-5">
              <div className="col-md-8">
                <h2 className="text-center mb-5">Forgot Password</h2>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="Email"
                    type="email"
                    className="form-control"
                    placeholder="johnsmith@gmail.com"
                    ref={register({ required: true, pattern: emailRegex })}
                  />
                  <ErrorMessage
                    type={errors.Email && errors.Email.type}
                    patternType={"email"}
                  />
                </div>

                <div className="form-group d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-height"
                  >
                    <span>Reset Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        )
      </div>
    </>
  );
};
export default ForgotPassword;
