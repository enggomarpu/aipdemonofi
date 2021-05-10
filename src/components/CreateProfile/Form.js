import React, { Component } from "react";
import CreateProfile from "./CreateProfile";
import InterestsExpertise from "./InterestsExpertise";
import AllSet from "./AllSet";
import HttpService from "./../../shared/http.service";
import { DispatchContext, StateContext } from "./Context/GlobalProvider";
import FirstLogin from "./FirstLogin";

export class Form extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      // firstName: '',
      userInfo: {},
      interskills: {},
      dataReceived: false,
      requestSuccess: false,
      errorResponse: "",
      isLoading: true,
      // lastName: '',
      // email: '',
      // occupation: '',
      // city: '',
      // bio: ''
    };
    //this.handleCheckBox = this.handleCheckBox.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static contextType = StateContext;
  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    console.log("step value", this.context.stepForm);
    this.setState({
      step: step + 1,
    });
  };
  //handlecheckbox
  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  };

  // Handle fields change
  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  submitHanlder = async (obj) => {
    let allData;
    await this.setState({ interskills: obj });
    await this.setState({ dataReceived: true });

    console.log();
  };
  onSubmitData = (userData) => {
    this.setState({
      userInfo: { ...this.state.interests, userData },
    });
  };

  render() {
    const { step } = this.state;
    // const { firstName, lastName, email, occupation, city, bio } = this.state;
    // const values = { firstName, lastName, email, occupation, city, bio };

    switch (step) {
      case 1:
        return (
          <FirstLogin
            nextStep={this.nextStep}
            //onSubmit={this.onSubmitData}
            //handleChange={this.handleChange}
            //values={values}
          />
        );
      case 2:
        return (
          <CreateProfile
            nextStep={this.nextStep}
            onSubmit={this.onSubmitData}
            //handleChange={this.handleChange}
            //values={values}
          />
        );
      case 3:
        return (
          <InterestsExpertise
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            onChangeInterestsCheckBox={this.handleCheckBox}
            onChangeSkillsCheckBox={this.handleSkillsCheckBox}
            onSubmit={this.submitHanlder}
            requestStatus={this.state.requestSuccess}
            errorResponse={this.state.errorResponse}
            //interestsError={this.state.interestsError}
            //skillsError={this.state.skillsError}
            //handleChange={this.handleChange}
            //values={values}
          />
        );
      case 4:
        return (
          <AllSet
            nextStep={this.nextStep}

            //prevStep={this.prevStep}
            //values={values}
          />
        );
      // case 4:
      //   return <Success />;
      default:
        console.log("This is a multi-step form built with React.");
    }
  }
}

export default Form;
