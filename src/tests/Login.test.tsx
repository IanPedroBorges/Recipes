import { screen } from '@testing-library/dom';
import { vi } from 'vitest';
import App from '../App';
import { renderWithRouter } from './Helpers/renderWithRouter';
import mockDrinksByIngredient from './Mocks/mockDrinksByIngredient';

describe('Testando o componente Login', () => {
  const VALID_EMAIL = 'tryber@test.com';
  const EMAIL_INPUT = 'email-input';
  const PASSWORD_INPUT = 'password-input';
  const LOGIN_BUTTON = 'login-submit-btn';

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Verifica se o componente renderiza corretamente quando esta na rota "/"', () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockDrinksByIngredient,
    });

    renderWithRouter(<App />, { route: '/' });

    const title = screen.getByRole('heading', { name: /Login/i });
    expect(title).toBeInTheDocument();

    const emailInput = screen.getByTestId(EMAIL_INPUT);
    const passwordInput = screen.getByTestId(PASSWORD_INPUT);
    const loginButton = screen.getByTestId(LOGIN_BUTTON);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('Verifica se a validação funciona corretamente', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockDrinksByIngredient,
    });

    const { user } = renderWithRouter(<App />, { route: '/' });

    const emailInput = screen.getByTestId(EMAIL_INPUT);
    const passwordInput = screen.getByTestId(PASSWORD_INPUT);
    const loginButton = screen.getByTestId(LOGIN_BUTTON);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeDisabled();

    await user.type(emailInput, VALID_EMAIL);
    await user.type(passwordInput, '123456');
    expect(loginButton).toBeDisabled();
    expect(emailInput).toHaveValue(VALID_EMAIL);
    expect(passwordInput).toHaveValue('123456');
    expect(loginButton).toBeDisabled();
    await user.clear(emailInput);
    await user.clear(passwordInput);

    await user.type(emailInput, 'tryber@test');
    await user.type(passwordInput, '1234567');
    expect(loginButton).toBeDisabled();
    user.clear(emailInput);
    user.clear(passwordInput);

    await user.type(emailInput, VALID_EMAIL);
    await user.type(passwordInput, '1234567');
    expect(loginButton).toBeEnabled();
  });

  test('Verifica se o email é armazenado no local storage', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockDrinksByIngredient,
    });

    const { user } = renderWithRouter(<App />, { route: '/' });

    const emailInput = screen.getByTestId(EMAIL_INPUT);
    const passwordInput = screen.getByTestId(PASSWORD_INPUT);
    const loginButton = screen.getByTestId(LOGIN_BUTTON);

    await user.type(emailInput, VALID_EMAIL);
    await user.type(passwordInput, '1234567');
    expect(loginButton).toBeEnabled();
    await user.click(loginButton);

    const { pathname } = window.location;
    expect(pathname).toBe('/meals');
    const userLocalStorage = localStorage.getItem('user');
    const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;

    expect(parsedUser).toEqual({ email: VALID_EMAIL });
  });
});
