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
    const token = await response.json();
    if (response.ok) {
      const user = await UserService.getByEmail(email);
      const data = await user.json();
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("loggedUser", data.id);
      sessionStorage.setItem("role", data.role);
      setStatusMessage('Login successful, redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 2000)
    } else {
      setStatusMessage(token.errorMessage);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email"
            type="email"
            name="email"
            placeholder="jan.janssens@example.com"
            onChange={(event) => setEmail(event.target.value)}
          required
          />
        </div>
        <div >
          <label htmlFor="password">Password</label>
          <input id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="********"
            onChange={(event) => setPassword(event.target.value)}
          required
          />
          <button type="button" onClick={togglePasswordVisibility}>
            👁️
          </button>
        </div>
        <button type="submit">Log in</button>
      </form>
      {statusMessage && (
        <p> {statusMessage} </p>
      )}
    </>
  );
}

export default UserLogin;