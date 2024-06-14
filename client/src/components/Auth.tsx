import { useState } from "react";
import Register from "./Register";
import Login from "./Login";

function Auth() {
  const [isNewUser, setIsNewUser] = useState(true);

  return isNewUser ? (
    <Register newUserHandler={newUserHandler} />
  ) : (
    <Login newUserHandler={newUserHandler} />
  );

  function newUserHandler() {
    setIsNewUser((prev) => !prev);
  }
}

export default Auth;
