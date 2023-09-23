import { screen } from '@testing-library/dom';
import { vi } from 'vitest';
import { renderWithRouter } from './Helpers/renderWithRouter';
import mockDrinksByIngredient from './Mocks/mockDrinksByIngredient';
import { mockFetchDrinksByName } from './Mocks/mockDrinksByName';
import { mockFetchDrinksByFirstLetter } from './Mocks/mockDrinksByFirstLetter';
import App from '../App';
import mockOneDrink from './Mocks/mockOneDrink';

describe('Testando o componente SearchBar', () => {
  const searchInput = 'search-input';

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Se as opções de input e o botão search são renderizados na tela drinks', () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockFetchDrinksByName,
    });
    renderWithRouter(<App />, { route: '/drinks' });
    const ingredient = screen.getByLabelText(/Ingredient/i);
    const name = screen.getByLabelText(/Name/i);
    const firstLetter = screen.getByLabelText(/First-Letter/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    expect(ingredient).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(firstLetter).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('Se o filtro ingredient funciona corretamente na tela drinks', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockDrinksByIngredient,
    });

    const { user } = renderWithRouter(<App />, { route: '/drinks' });
    const ingredient = screen.getByLabelText(/Ingredient/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId(searchInput);
    await user.type(textInput, 'Gin');
    await user.click(ingredient);
    await user.click(searchButtonBar);
    const drink = await screen.findByText('Abbey Cocktail');

    expect(drink).toBeInTheDocument();
  });

  test('Se o filtro name funciona corretamente na tela drinks', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockFetchDrinksByName,
    });

    const { user } = renderWithRouter(<App />, { route: '/drinks' });
    const name = screen.getByLabelText(/Name/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId(searchInput);
    await user.type(textInput, 'mule');
    await user.click(name);
    await user.click(searchButtonBar);

    const drink = await screen.findByText('Moscow Mule');
    expect(drink).toBeInTheDocument();
  });

  test('Se o filtro firstletter funciona corretamente na tela drinks', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockFetchDrinksByFirstLetter,
    });

    const { user } = renderWithRouter(<App />, { route: '/drinks' });
    const firstLetter = screen.getByLabelText(/First-Letter/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId(searchInput);
    await user.type(textInput, 'a');
    await user.click(firstLetter);
    await user.click(searchButtonBar);

    const drink = await screen.findByText('Ace');
    expect(drink).toBeInTheDocument();
  });

  test('Se havendo apenas uma receita, ocorre o redirecionamento de tela', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockOneDrink,
    });
    const { user } = renderWithRouter(<App />, { route: '/drinks' });
    const ingredient = screen.getByLabelText(/Ingredient/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId(searchInput);
    await user.type(textInput, 'Vodka');
    await user.click(ingredient);
    await user.click(searchButtonBar);

    const drink = await screen.findByText('Combine vodka and ginger beer in a highball glass.');
    expect(drink).toBeInTheDocument();
  });

  test('Se aparece um alerta na tela de drinks caso sejam digitadas mais de uma letra no filtro firstletter', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockOneDrink,
    });
    window.alert = vi.fn(() => {});
    const { user } = renderWithRouter(<App />, { route: '/drinks' });
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

describe(('Testando o alerta de receita não encontrada'), () => {
  test('Se aparece um alerta na tela de drinks caso a receita não exista', async () => {
    window.alert = vi.fn(() => {});
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ drinks: null }),
    });

    const { user } = renderWithRouter(<App />, { route: '/drinks' });
    const ingredient = screen.getByLabelText(/Ingredient/i);
    const searchButtonHeader = screen.getByTestId('btn-Click');
    const searchButtonBar = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButtonHeader);
    const textInput = screen.getByTestId('search-input');
    await user.type(textInput, 'trybe@trybe');
    await user.click(ingredient);
    await user.click(searchButtonBar);

    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});
