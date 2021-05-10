import React from 'react'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { isPassword } from "validator";

function Validation () {

 const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };
  
  const email = value => {
    if (!isEmail(value)) {
      return (
        <div className="alert alert-danger" role="alert">
          This is not a valid email.
        </div>
      );
    }
  };

  const password = value => {
    if (!isPassword(value)) {
      return (
        <div className="alert alert-danger" role="alert">
          This is not a valid password.
        </div>
      );
    }
  };

    return (
      <Form
        onSubmit={this.handleLogin}
        ref={c => {this.form = c;}}
      >
        <Input
          type="text"
          className="form-control"
          validations={[required, email]}
        />
        <Input
          type="text"
          className="form-control"
          validations={[required, password]}
        />
  
        <CheckButton
          style={{ display: "none" }}
          ref={c => {this.checkBtn = c;}}
        />
      </Form>
    );
  }
export default Validation