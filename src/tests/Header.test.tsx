import { screen } from '@testing-library/dom';
import { vi } from 'vitest';
import App from '../App';
import { renderWithRouter } from './Helpers/renderWithRouter';
import { mockMealsDetails } from './Mocks/mockMealsDetails';

describe('Testando o componente Header', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('testando se o componente aparece na tela quando esta na rota meals com todos as informações', () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    renderWithRouter(<App />, { route: '/meals' });
    const title = screen.getByRole('heading', { name: /meals/i });
    expect(title).toBeInTheDocument();
  });
  test('testando se o input aparece e some', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    const { user } = renderWithRouter(<App />, { route: '/meals' });

    const inputLiteral = 'search-input';

    const searchButton = screen.getByTestId('btn-Click');
    expect(searchButton).toBeInTheDocument();
    expect(screen.queryByTestId(inputLiteral)).not.toBeInTheDocument();
    await user.click(searchButton);
    const input = await screen.findByTestId(inputLiteral);
    expect(screen.queryByTestId(inputLiteral)).toBeInTheDocument();

    await user.type(input, 'chicken breast');

    expect(input).toHaveValue('chicken_breast');
  });
  test('testando se ao clicar no icone perfil a barra de pesquisa some', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    const { user } = renderWithRouter(<App />, { route: '/meals' });

    const oldTitle = screen.getByRole('heading', { name: /meals/i });
    expect(oldTitle).toBeInTheDocument();
    const searchButton = screen.getByTestId('profile-top-btn');
    expect(searchButton).toBeInTheDocument();
    expect(screen.queryByTestId('btn-Click')).toBeInTheDocument();
    await user.click(searchButton);
    expect(screen.queryByTestId('btn-Click')).not.toBeInTheDocument();
    const title = screen.getByRole('heading', { name: /profile/i });
    expect(title).toBeInTheDocument();
  });
});
