import { screen } from '@testing-library/dom';
import { vi } from 'vitest';
import { renderWithRouter } from './Helpers/renderWithRouter';
import mockMealsByIngredient from './Mocks/mockMealsByIngredient';
import { mockFetchMealsByName } from './Mocks/mockMealsByName';
import { mockFetchMealsByFirstLetter } from './Mocks/mockMealsByFirstLetter';
import App from '../App';
import mockOneMeal from './Mocks/mockOneMeal';

describe('Testando o componente SearchBar', () => {
  const searchInput = 'search-input';

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Se as opções de input e o botão search são renderizados na tela meals', () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsByIngredient,
    });

    renderWithRouter(<App />, { route: '/meals' });
    const ingredient = screen.getByLabelText(/Ingredient/i);
    const name = screen.getByLabelText(/Name/i);
    const firstLetter = screen.getByLabelText(/First-Letter/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    expect(ingredient).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(firstLetter).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('Se o filtro ingredient funciona corretamente na tela meals', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsByIngredient,
    });
    const { user } = renderWithRouter(<App />, { route: '/meals' });
    const ingredient = screen.getByLabelText(/Ingredient/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId(searchInput);
    await user.type(textInput, 'tomato');
    await user.click(ingredient);
    await user.click(searchButtonBar);

    const meal = await screen.findByText('Brown Stew Chicken');
    expect(meal).toBeInTheDocument();
  });

  test('Se o filtro name funciona corretamente na tela meals', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockFetchMealsByName,
    });
    const { user } = renderWithRouter(<App />, { route: '/meals' });
    const name = screen.getByLabelText(/Name/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId(searchInput);
    await user.type(textInput, 'tomato');
    await user.click(name);
    await user.click(searchButtonBar);

    const meal = await screen.findByText('Creamy Tomato Soup');
    expect(meal).toBeInTheDocument();
  });

  test('Se o filtro firstletter funciona corretamente na tela meals', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockFetchMealsByFirstLetter,
    });
    const { user } = renderWithRouter(<App />, { route: '/meals' });
    const firstLetter = screen.getByLabelText(/First-Letter/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId(searchInput);
    await user.type(textInput, 't');
    await user.click(firstLetter);
    await user.click(searchButtonBar);

    const meal = await screen.findByText('Teriyaki Chicken Casserole');
    expect(meal).toBeInTheDocument();
  });

  test('Se havendo apenas uma receita, ocorre o redirecionamento de tela', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockOneMeal,
    });
    const { user } = renderWithRouter(<App />, { route: '/meals' });
    const ingredient = screen.getByLabelText(/Ingredient/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId(searchInput);
    await user.type(textInput, 'tomato');
    await user.click(ingredient);
    await user.click(searchButtonBar);

    const meal = await screen.findByText('Put th cheesy sausage rolls.');
    expect(meal).toBeInTheDocument();
  });

  /**
   * @todo mock
   */
  test('Se aparece um alerta na tela de meals caso sejam digitadas mais de uma letra no filtro firstletter', async () => {
    window.alert = vi.fn(() => {});
    const { user } = renderWithRouter(<App />, { route: '/meals' });
    const firstLetter = screen.getByLabelText(/First-Letter/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId(searchInput);
    await user.type(textInput, 'aa');
    await user.click(firstLetter);
    await user.click(searchButtonBar);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});

describe('Testando o alerta de receita não encontrada', () => {
  test('Se aparece um alerta na tela de meals caso a receita não exista', async () => {
    window.alert = vi.fn(() => {});
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ meals: null }),
    });

    const { user } = renderWithRouter(<App />, { route: '/meals' });
    const ingredient = screen.getByLabelText(/Ingredient/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId('search-input');
    await user.type(textInput, 'trybe');
    await user.click(ingredient);
    await user.click(searchButtonBar);

    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});
