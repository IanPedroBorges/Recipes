import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { LocalStorageContext }
  from '../../context/LocalStorageContext/LocalStorageContext';

import style from './styles.module.css';

import iconRecipe from '../../images/Login/iconRecipe.svg';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(LocalStorageContext);

  const email = useLogin('');
  const password = useLogin('');

  const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUser({ email: email.value });
    navigate('/meals');
  };

  return (
    <main className={ style.MainDiv }>
      <img src={ iconRecipe } alt="" />
      <div className={ style.IconDiv } />
      <div className={ style.FormDiv }>
        <h1>Login</h1>
        <form onSubmit={ handleSubmit }>
          <input
            value={ email.value }
            type="email"
            name="email"
            data-testid="email-input"
            onChange={ ({ target }) => email.handleChange(target.value) }
            placeholder="Email"
          />
          <input
            type="password"
            value={ password.value }
            name="senha"
            data-testid="password-input"
            onChange={ ({ target }) => password.handleChange(target.value) }
            placeholder="Senha"
          />
          <button
            data-testid="login-submit-btn"
            disabled={
              password.value.length <= 6 || !regexEmail.test(email.value)
            }
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
