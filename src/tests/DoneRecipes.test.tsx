import { screen } from '@testing-library/dom';
import { vi } from 'vitest';
import App from '../App';
import { renderWithRouter } from './Helpers/renderWithRouter';
import { mockTeriyaki } from './Mocks/mockTeriaki';

describe('Testando o componente DoneRecipes', () => {
  const ROUTE_DONE = '/done-recipes';
  const ROUTE_MEAL = '/meals/52772';

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Verifica se o componente renderiza corretamente quando esta na rota "/done-recipes"', () => {
    global.fetch = vi.fn();

    renderWithRouter(<App />, { route: ROUTE_DONE });

    const title = screen.getByText(/Done Recipes/i);
    expect(title).toBeInTheDocument();
  });

  test('Verifica se as meals finalizadas são renderizadas', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockTeriyaki,
    });
    console.error = vi.fn();

    const { user } = renderWithRouter(<App />, { route: ROUTE_MEAL });

    const name = await screen.findByText(/Teriyaki Chicken Casserole/i);
    expect(name).toBeInTheDocument();

    const continueButton = await screen.findByRole('button', { name: /Start Recipe/i });
    await user.click(continueButton);

    const option1 = await screen.findByText('soy sauce - 3/4 cup');
    const option2 = await screen.findByText('water - 1/2 cup');
    const option3 = await screen.findByText('brown sugar - 1/4 cup');
    const option4 = await screen.findByText('ground ginger - 1/2 teaspoon');
    const option5 = await screen.findByText('minced garlic - 1/2 teaspoon');
    const option6 = await screen.findByText('cornstarch - 4 Tablespoons');
    const option7 = await screen.findByText('chicken breasts - 2');
    const option8 = await screen.findByText('stir-fry vegetables - 1 (12 oz.)');
    const option9 = await screen.findByText('brown rice - 3 cups');
    const finishButton = await screen.findByRole('button', { name: /Finish Recipe/i });

    await user.click(option1);
    await user.click(option2);
    await user.click(option3);
    await user.click(option4);
    await user.click(option5);
    await user.click(option6);
    await user.click(option7);
    await user.click(option8);
    await user.click(option9);
    await user.click(finishButton);

    const headerDoneRecipes = screen.getByText(/Done Recipes/i);
    expect(headerDoneRecipes).toBeInTheDocument();

    const buttonDrinks = await screen.findByRole('button', { name: /Drinks/i });
    const buttonMeals = await screen.findByRole('button', { name: /Meals/i });
    const buttonAll = await screen.findByRole('button', { name: /All/i });
    const casserole = await screen.findAllByText(/Casserole/i);

    await user.click(buttonDrinks);
    expect(casserole[0]).not.toBeInTheDocument();

    await user.click(buttonMeals);
    const nationalityAndType = await screen.findAllByText(/Japanese - Chicken/i);
    expect(nationalityAndType[0]).toBeInTheDocument();

    await user.click(buttonAll);
    const meat = await screen.findAllByText(/Meat/i);
    expect(meat[0]).toBeInTheDocument();

    const shareButton = await screen.findByAltText(/imagem compartilhar/i);
    await user.click(shareButton);
    expect(console.error).not.toThrowError();
    const shareAlert = await screen.findByText(/Link copied!/i);
    expect(shareAlert).toBeInTheDocument();
  });
});
