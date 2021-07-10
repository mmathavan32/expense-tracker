import React, { Component } from "react";
import "../styles/main.css";
import Login from "./forms/Login";
import Register from "./forms/Register";
import fire from "../config/Fire";
import Tracker from "./tracker/Tracker";
import Spinner from "../assets/loader.gif";

export default class Main extends Component {
  state = {
    user: 1,
    loading: true,
    formSwitcher: false,
  };

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  formSwitcher = (action) => {
    console.log(action);
    this.setState({
      formSwitcher: action === "register" ? true : false,
    });
  };

  render() {
    const form = this.state.formSwitcher === false ? <Login /> : <Register />;
    if (this.state.user === 1) {
      return (
        <div className="main-block">
          <div className="spinner">
            <img src={Spinner} alt="Spinner" className="img-spinner" />
          </div>
        </div>
      );
    }
    return (
      <>
        {!this.state.user ? (
          <div className="main-block">
            {form}
            {this.state.formSwitcher === false ? (
              <span className="underLine">
                Not Registered?
                <button
                  className="linkBtn"
                  onClick={() =>
                    this.formSwitcher(
                      this.state.formSwitcher === false ? "register" : "login"
                    )
                  }
                >
                  Register
                </button>
              </span>
            ) : (
              <span className="underLine">
                Have an account?
                <button
                  className="linkBtn"
                  onClick={() =>
                    this.formSwitcher(
                      this.state.formSwitcher === false ? "register" : "login"
                    )
                  }
                >
                  Login
                </button>
              </span>
            )}
          </div>
        ) : (
          <Tracker />
        )}
      </>
    );
  }
}
