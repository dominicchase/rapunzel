import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/POST";
import { RegisterRequestBody } from "../types/auth.types";

type Props = {
  newUserHandler: () => void;
};

const initialData = {
  email: "",
  password: "",
  confirmPassword: "",
};

function Register({ newUserHandler }: Props) {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialData);

  return (
    <>
      <h3 className="text-start mb-4">Register</h3>

      <form className="d-block mb-4">
        {[
          { label: "Email", name: "email", value: form.email },
          { label: "Password", name: "password", value: form.password },
          {
            label: "Confirm Password",
            name: "confirmPassword",
            value: form.confirmPassword,
          },
        ].map((element) => (
          <section className="mb-3" key={`${element.name}-field`}>
            <p className="text-start mb-2">{element.label}</p>
            <input
              className="w-100"
              name={element.name}
              value={element.value}
              onChange={handleChange}
            />
          </section>
        ))}

        <button onClick={(e) => handleRegister(e, form)}>Register</button>
      </form>

      <p>
        Already have an account?&nbsp;
        <button className="btn-no-bg" onClick={newUserHandler}>
          Login
        </button>
      </p>
    </>
  );

  function handleRegister(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    { email, password }: RegisterRequestBody
  ) {
    e.preventDefault();

    register({ email, password }).then(() => {
      navigate("/");
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
}

export default Register;
