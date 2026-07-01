import {
  useState,
  type ChangeEventHandler,
  type SubmitEventHandler,
} from "react";
import { userLogin, type LoginRequest, type TokenResponse } from "../api";
import { useNavigate } from "react-router-dom";

const formVacío: LoginRequest = {
  email: "",
  password: "",
};

interface fields {
  email: boolean;
  password: boolean;
}

const initFields: fields = {
  email: false,
  password: false,
};

export default function Login() {
  const [form, setForm] = useState<LoginRequest>(formVacío);
  const [formFields, setFormFields] = useState<fields>(initFields);
  const [apiResponse, setApiResponse] = useState("");
  const [isError, setIsError] = useState(false);
  const [token, setToken] = useState<TokenResponse | void>(() => {});

  const navigate = useNavigate();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newFields = { ...initFields };
    for (const field in form) {
      const key = field as keyof LoginRequest;
      if (form[key] === "") {
        newFields[key] = true;
        hasErrors = true;
      }
    }
    setFormFields(newFields);
    if (hasErrors) {
      return;
    }
    userLogin(form)
      .then((tokenResponse) => {
        setIsError(false);
        setApiResponse("Registro con éxito");
        setToken(tokenResponse);
        localStorage.setItem("jwt_token", tokenResponse.token);
        navigate("/flights");
      })
      .catch((e) => {
        setIsError(true);
        setApiResponse(e?.response?.data?.message || (typeof e?.response?.data === 'string' ? e.response.data : "Error"));
        setToken(() => {});
        localStorage.removeItem("jwt_token");
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
    <div className="flex flex-row p-4 items-center justify-center font-mono">
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
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="bg-gray-800 hover:bg-gray-600 p-2 rounded-2xl shadow ml-4"
        >
          No tienes cuenta? Registrate
        </button>
        {isError ? <label>{apiResponse}</label> : <></>}
      </form>
      {token ? <label> {token.token}</label> : <></>}
    </div>
  );
}
