import { useState } from "react";
import { RegisterRequestBody } from "../types/auth.types";

type Props = {
  handleRegister: ({ email, password }: RegisterRequestBody) => void;
  newUserHandler: () => void;
};

const initialData = {
  email: "",
  password: "",
  confirmPassword: "",
};

function Register({ handleRegister, newUserHandler }: Props) {
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
          <section className="mb-3">
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
            handleRegister(form);
          }}
        >
          Register
        </button>
      </form>

      <p>
        Already have an account?&nbsp;
        <button className="btn-no-bg" onClick={newUserHandler}>
          Login
        </button>
      </p>
    </>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
}

export default Register;
