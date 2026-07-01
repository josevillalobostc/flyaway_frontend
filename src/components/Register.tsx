import {
  useState,
  type ChangeEventHandler,
  type SubmitEventHandler,
} from "react";
import { userRegister, type RegisterRequest } from "../api";
import { useNavigate } from "react-router-dom";

const formVacío: RegisterRequest = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
};

interface fields {
  email: boolean;
  firstName: boolean;
  lastName: boolean;
  password: boolean;
}

const initFields: fields = {
  email: false,
  firstName: false,
  lastName: false,
  password: false,
};

export default function Register() {
  const [form, setForm] = useState<RegisterRequest>(formVacío);
  const [formFields, setFormFields] = useState<fields>(initFields);
  const [apiResponse, setApiResponse] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newFields = { ...initFields };
    for (const field in form) {
      const key = field as keyof RegisterRequest;
      if (form[key] === "") {
        newFields[key] = true;
        hasErrors = true;
      }
    }
    setFormFields(newFields);
    if (hasErrors) {
      return;
    }
    userRegister(form)
      .then(() => {
        setIsError(false);
        setApiResponse("Registro con éxito");
      })
      .catch((e) => {
        setIsError(true);
        setApiResponse(e?.response?.data?.message || (typeof e?.response?.data === 'string' ? e.response.data : "Error"));
      });
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormFields((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  return (
    <div className="flex flex-col p-4 items-center justify-center font-mono">
      <form className="text-white" onSubmit={handleSubmit}>
        <div className="p-4 gap-4">
          <label>Correo: </label>
          <input
            placeholder="example@example.com"
            name="email"
            className="outline-none border border-transparent focus:border-rose-500"
            onChange={handleChange}
          />
          {formFields.email ? <label> No puede ser vacío </label> : <></>}
        </div>
        <div className="p-4 gap-4">
          <label>Nombre: </label>
          <input
            placeholder="Ian"
            className="outline-none border border-transparent focus:border-rose-500"
            name="firstName"
            onChange={handleChange}
          />
          {formFields.firstName ? <label> No puede ser vacío </label> : <></>}
        </div>
        <div className="p-4 gap-4">
          <label>Apellido: </label>
          <input
            placeholder="Brossard"
            name="lastName"
            className="outline-none border border-transparent focus:border-rose-500"
            onChange={handleChange}
          />
          {formFields.lastName ? <label> No puede ser vacío </label> : <></>}
        </div>
        <div className="p-4 gap-4">
          <label>Password: </label>
          <input
            placeholder="password"
            name="password"
            type="password"
            className="outline-none border border-transparent focus:border-rose-500"
            onChange={handleChange}
          />
          {formFields.password ? <label> No puede ser vacío </label> : <></>}
        </div>

        <button
          type="submit"
          className="bg-gray-800 hover:bg-gray-600 p-2 rounded-2xl shadow"
        >
          Register
        </button>
        {isError ? <label>{apiResponse}</label> : <></>}
      </form>
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="bg-gray-800 hover:bg-gray-600 p-2 rounded-2xl shadow text-white"
        >
          Ya tienes cuenta? Inicia sesión
        </button>
        <button
          type="button"
          onClick={() => navigate("/flights")}
          className="bg-gray-800 hover:bg-gray-600 p-2 rounded-2xl shadow text-white"
        >
          Ir a Flights
        </button>
      </div>
    </div>
  );
}
