import { vi } from 'vitest';
import { screen } from '@testing-library/dom';
import App from '../App';
import { renderWithRouter } from './Helpers/renderWithRouter';
import { mockFetchMealsByFirstLetter } from './Mocks/mockMealsByFirstLetter';

describe('testando o componente Profile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  test('testando se o email aparece na tela', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockFetchMealsByFirstLetter,
    });

    const { user } = renderWithRouter(<App />);
    const inputEmail = screen.getByRole('textbox');
    const inputPassword = screen.getByPlaceholderText(/senha/i);
    const buttonLogin = screen.getByRole('button', { name: /enter/i });
    expect(inputEmail).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    expect(buttonLogin).toBeInTheDocument();
    expect(inputEmail).toHaveValue('');
    expect(inputPassword).toHaveValue('');
    expect(buttonLogin).toBeDisabled();
    await user.type(inputEmail, 'tryber@teste.com');
    await user.type(inputPassword, '1234567');
    await user.click(buttonLogin);
    const profileBtn = screen.getByTestId('profile-top-btn');
    expect(profileBtn).toBeInTheDocument();
    await user.click(profileBtn);
    const profileEmail = screen.getByRole('heading', { name: /tryber@teste\.com/i });
    const btnFavorite = screen.getByTestId('profile-favorite-btn');
    const btnLogout = screen.getByTestId('profile-logout-btn');
    expect(profileEmail).toBeInTheDocument();
    expect(btnFavorite).toBeInTheDocument();
    expect(btnLogout).toBeInTheDocument();
    await user.click(btnLogout);
    expect(profileBtn).not.toBeInTheDocument();
  });
  test('testando se o button favorite', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockFetchMealsByFirstLetter,
    });

    const { user } = renderWithRouter(<App />);
    const inputEmail = screen.getByRole('textbox');
    const inputPassword = screen.getByPlaceholderText(/senha/i);
    const buttonLogin = screen.getByRole('button', { name: /enter/i });
    expect(inputEmail).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    expect(buttonLogin).toBeInTheDocument();
    expect(inputEmail).toHaveValue('');
    expect(inputPassword).toHaveValue('');
    expect(buttonLogin).toBeDisabled();
    await user.type(inputEmail, 'tryber@teste.com');
    await user.type(inputPassword, '1234567');
    await user.click(buttonLogin);
    const profileBtn = screen.getByTestId('profile-top-btn');
    expect(profileBtn).toBeInTheDocument();
    await user.click(profileBtn);
    const profileEmail = screen.getByRole('heading', { name: /tryber@teste\.com/i });
    const btnFavorite = screen.getByTestId('profile-favorite-btn');
    const btnLogout = screen.getByTestId('profile-logout-btn');
    expect(profileEmail).toBeInTheDocument();
    expect(btnFavorite).toBeInTheDocument();
    expect(btnLogout).toBeInTheDocument();
    await user.click(btnFavorite);
    const title = screen.getByRole('heading', { name: /favorite recipes/i });
    expect(title).toBeInTheDocument();
  });
  test('testando o component not found', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockFetchMealsByFirstLetter,
    });

    renderWithRouter(<App />, { route: '/dsdssads' });
    const notFound = screen.getByTestId('not');
    expect(notFound).toBeInTheDocument();
  });
});
