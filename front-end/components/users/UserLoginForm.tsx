import UserService from "@/services/UserService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";


function UserLogin() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const { t } = useTranslation();
  const validate = () => {
    setStatusMessage('');
    setEmailError('');
    setPasswordError('');

    let valid = true;
    if (email.trim() === "") {
      setEmailError(t('users.errorEmail'));
      valid = false;
    }
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { valid = false; setEmailError(t('users.errorEmailFormat')); }
    }
    if (password.trim() === "") {
      setPasswordError(t('users.errorPassword'));
      valid = false;
    }
    else if (password.length < 7) {
      setPasswordError(t('users.errorPasswordLength'));
      valid = false;
    }

    return valid;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const response = await UserService.login({ email, password });
    const user = await response.json();
    if (response.ok) {
      sessionStorage.setItem('token', user.token);
      sessionStorage.setItem('loggedUser', user.id);
      // Hash roles to give malicious users a challenge :)
      // admin = SHA256-hash of 4dM1nFullStaCk
      // user = SHA256-hash of Us3rFullSt4ck
      if (user.role === 'admin')
        sessionStorage.setItem('role', '91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8');
      else sessionStorage.setItem('role', '4b975fd8f0ff3e9fe958e701d5053be7dc223b684ec633f3d322d8868d395d33');
      setStatusMessage(t('users.login.success'));
      setTimeout(() => {
        router.push('/');
      }, 2500)
    } else {
      setStatusMessage(t('users.login.error'));
    }
  };

  return (
    <>
    <div className="bg-gray-100 flex items-center justify-center">

    <div className="container mx-auto my-8" >
      <div className="bg-gray-100 flex items-center justify-center">
              {statusMessage && <p className=" text-red-500">{statusMessage}</p>}
      </div>
      <form className="mt-4 flex flex-col items-center" onSubmit={handleSubmit}>
      <div className=" bg-gray-100 p-4 rounded-lg">
          <div className="relative bg-inherit mt-4">
          <label className="global-label" htmlFor="email">{t('users.email')}</label>
          <input className="global-input" id="email"
            type="text"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <p className=" text-red-500">{emailError}</p>

          </div>
        </div>
        <div className=" bg-gray-100 p-4 rounded-lg">
          <div className="relative bg-inherit mt-4">
          <label className="global-label" htmlFor="password">{t('users.password')}</label>
          <input className="global-input" id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="global-button" type="button" onClick={togglePasswordVisibility}>
            👁️
          </button>
          <p className=" text-red-500">{passwordError}</p>

          </div>

        </div>
        <button className="global-button" type="submit">{t('users.login.login')}</button>
      </form>
    </div>
    </div>
    </>
  );
}

export default UserLogin;