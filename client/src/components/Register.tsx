import React from "react";

function Register() {
  return (
    <>
      <h3 className="text-start">Create an account</h3>

      <form className="d-block">
        <input className="d-block" placeholder="Email" />
        <input className="d-block" placeholder="Password" />
        <button className="d-block">Create now</button>
      </form>

      <p>
        I already have an account <button>Sign in</button>
      </p>
    </>
  );
}

export default Register;
