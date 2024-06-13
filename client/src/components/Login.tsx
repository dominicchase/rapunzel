import { useState } from "react";
import { LoginRequestBody } from "../types/auth.types";

type Props = {
  handleLogin: ({ email, password }: LoginRequestBody) => void;
  newUserHandler: () => void;
};

const initialData = {
  email: "",
  password: "",
};

function Login({ handleLogin, newUserHandler }: Props) {
  const [form, setForm] = useState(initialData);

  return (
    <>
      <h3 className="text-start mb-4">Login</h3>

      <form className="d-block mb-4">
        {[
          { label: "Email", name: "email", value: form.email },
          { label: "Password", name: "password", value: form.password },
        ].map((element) => (
          <section className="mb-3" key={element.name}>
            <p className="text-start mb-2">{element.label}</p>
            <input
              className="w-100"
              name={element.name}
              value={element.value}
              onChange={handleChange}
            />
          </section>
        ))}

        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin(form);
          }}
        >
          Login
        </button>
      </form>

      <p>
        Don&apos;t have an account?&nbsp;
        <button className="btn-no-bg" onClick={newUserHandler}>
          Register
        </button>
      </p>
    </>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
}

export default Login;
