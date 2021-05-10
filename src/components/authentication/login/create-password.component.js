import React, { useRef, useState } from "react";
import BackButton from "../../BackButton/BackButton";
import "./login.scss";
import Logo from "../../../img/logo.png";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../../sharedError/error.messages";
import HttpService from "../../../shared/http.service";
import { useToasts } from "react-toast-notifications";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";

const CreatePassword = (props) => {
  const [password, setPassword] = useState("");
  const [isShow, setIsShow] = useState(false);
  const { register, handleSubmit, errors, watch } = useForm();
  const [errorMessage, setErrorMessage] = useState(false);

  const { addToast } = useToasts();
  const NewPassword = useRef({});

  NewPassword.current = watch("NewPassword", "");
  //const { token } = useParams();
  const onPasswordChange = (password) => {
    setPassword(password.target.value);
  };
  //console.log("check tokken", token)
  const savePassword = async (data) => {
    const token = props.match.params.token;
    const pass = data.NewPassword;

    console.log("token", token, "password", pass);
    await HttpService.post("user/create-password", {
      Token: token,
      Password: pass,
    })
      .then((response) => {
        console.log("check res", response.data);
        if (response !== undefined) {
          setIsShow(true);
          addToast("Password Created Successfully", {
            appearance: "success",
          });
          setErrorMessage("");
        }
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <>
      <div className="login-container">
        <BackButton />
        <div className="text-center mt-5 mb-5">
          <img src={Logo} alt="Logo" />
        </div>
        {!isShow ? (
          <form>
            <div className="container bg-white">
              <div className="row justify-content-center pt-5 pb-5">
                <div className="col-md-8">
                  <h2 className="text-center mb-5">Create New Passowrd</h2>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="NewPassword"
                      onChange={onPasswordChange}
                      placeholder="New Password"
                      ref={register({ required: true })}
                    />
                    <PasswordStrengthBar password={password} />
                    <ErrorMessage
                      type={errors.NewPassword && errors.NewPassword.type}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="ConfirmPassword"
                      placeholder="Confirm Password"
                      ref={register({
                        required: true,
                        validate: (value) => value === NewPassword.current,
                      })}
                    />
                    
                    <ErrorMessage
                      type={
                        errors.ConfirmPassword && errors.ConfirmPassword.type
                      }
                      validationType="confirmPassword"
                    />
                  </div>
                  {errorMessage && (
                    <div className="errorMessage alert alert-danger">
                      {errorMessage}
                    </div>
                  )}

                  <div className="form-group d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-height"
                      onClick={handleSubmit(savePassword)}
                    >
                      <span>Save New Password</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="container bg-white">
            <div className="row justify-content-center pt-5 pb-5">
              <div className="col-md-8">
                <div className="text-center mb-5">
                  <h2>New Password Created successfully</h2>
                  <Link to="/" className="text-center mb-5">
                    Login to your account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default CreatePassword;
