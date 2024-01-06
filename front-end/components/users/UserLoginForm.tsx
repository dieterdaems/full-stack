import UserService from "@/services/UserService";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";


function UserLogin() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const validate = () => {
    setStatusMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "" || !emailRegex.test(email) || password.trim() === "") {
      setStatusMessage("Both email and password are required, and email should be in the right format\n");
      return false
    }
    return true;
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
      setStatusMessage('Login successful, redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 2500)
    } else {
      setStatusMessage(user.errorMessage);
    }
  };

  return (
    <>
    <div className="bg-gray-100 flex items-center justify-center">

    <div className="container mx-auto my-8" >
      <form className="mt-4 flex flex-col items-center" onSubmit={handleSubmit}>
      <div className=" bg-gray-100 p-4 rounded-lg">
          <div className="relative bg-inherit mt-4">
          <label className="global-label" htmlFor="email">Email</label>
          <input className="global-input" id="email"
            type="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          </div>
        </div>
        <div className=" bg-gray-100 p-4 rounded-lg">
          <div className="relative bg-inherit mt-4">
          <label className="global-label" htmlFor="password">Password</label>
          <input className="global-input" id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="global-button" type="button" onClick={togglePasswordVisibility}>
            👁️
          </button>
          </div>
        </div>
        <button className="global-button" type="submit">Log in</button>
      </form>
      {statusMessage && (
        <p className=" text-red-500"> {statusMessage} </p>
      )}
    </div>
    </div>
    </>
  );
}

export default UserLogin;