import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/POST";
import { LoginRequestBody } from "../types/auth.types";

type Props = {
  newUserHandler: () => void;
};

const initialData = {
  email: "",
  password: "",
};

function Login({ newUserHandler }: Props) {
  const navigate = useNavigate();

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

        <button onClick={(e) => handleLogin(e, form)}>Login</button>
      </form>

      <p>
        Don&apos;t have an account?&nbsp;
        <button className="btn-no-bg" onClick={newUserHandler}>
          Register
        </button>
      </p>
    </>
  );

  function handleLogin(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    { email, password }: LoginRequestBody
  ) {
    e.preventDefault();

    login({ email, password }).then(() => {
      navigate("/");
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
}

export default Login;
