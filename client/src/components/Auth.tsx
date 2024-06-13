import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import { login, register } from "../api/POST";
import { LoginRequestBody, RegisterRequestBody } from "../types/auth.types";

function Auth() {
  const navigate = useNavigate();

  const [isNewUser, setIsNewUser] = useState(true);

  return isNewUser ? (
    <Register handleRegister={handleRegister} newUserHandler={newUserHandler} />
  ) : (
    <Login handleLogin={handleLogin} newUserHandler={newUserHandler} />
  );

  function handleRegister({ email, password }: RegisterRequestBody) {
    register({ email, password }).then(() => {
      navigateToBacklog();
    });
  }

  function handleLogin({ email, password }: LoginRequestBody) {
    login({ email, password }).then(() => {
      navigateToBacklog();
    });
  }

  function navigateToBacklog() {
    navigate("/");
  }

  function newUserHandler() {
    setIsNewUser((prev) => !prev);
  }
}

export default Auth;
