import { screen, waitFor } from '@testing-library/dom';
import { vi } from 'vitest';
import App from '../App';
import { renderWithRouter } from './Helpers/renderWithRouter';
import meals from './Mocks/mockMeals';
import drinks from './Mocks/mockDrinks';

const checkFirstTwelveRecipes = (recipes: object[]) => {
  // const recipeType = meal ? 'Meal' : 'Drink';

  recipes.slice(0, 12).forEach((recipe: any, index) => {
    expect(screen.getByTestId(`${index}-recipe-card`)).toBeInTheDocument();
  });
};

describe('Teste o componente Recipes.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Verifica se na rota "/meals" carrega as categorias certas', async () => {
    const { user } = renderWithRouter(<App />, { route: '/meals' });

    await waitFor(() => {
      expect(screen.getByTestId('Beef-category-filter')).toBeInTheDocument();
    }, {
      timeout: 2000,
    });

    checkFirstTwelveRecipes(meals.meals);

    const btnBreakfast = screen.getByRole('button', { name: /breakfast/i });
    expect(btnBreakfast).toBeInTheDocument();

    await user.click(btnBreakfast);

    const btnAll = screen.getByRole('button', { name: /all/i });

    await user.click(btnAll);

    checkFirstTwelveRecipes(meals.meals);

    const btnChicken = screen.getByRole('button', { name: /chicken/i });
    expect(btnChicken).toBeInTheDocument();

    await user.click(btnChicken);
    await user.click(btnChicken);

    checkFirstTwelveRecipes(meals.meals);
  });
  test('Verifica se na rota "/drinks" carrega as categorias certas', async () => {
    const { user } = renderWithRouter(<App />, { route: '/drinks' });

    await waitFor(() => {
      expect(screen.getByTestId('Ordinary Drink-category-filter')).toBeInTheDocument();
    }, {
      timeout: 1500,
    });

    checkFirstTwelveRecipes(drinks.drinks);

    const btnOrdinaryDrink = screen.getByRole('button', { name: /ordinary drink/i });
    expect(btnOrdinaryDrink).toBeInTheDocument();

    await user.click(btnOrdinaryDrink);

    const btnAll = screen.getByRole('button', { name: /all/i });

    await user.click(btnAll);

    checkFirstTwelveRecipes(drinks.drinks);

    const btnCocktail = screen.getByRole('button', { name: /cocktail/i });
    expect(btnCocktail).toBeInTheDocument();

    await user.click(btnCocktail);
    await user.click(btnCocktail);

    checkFirstTwelveRecipes(drinks.drinks);
  });
});
