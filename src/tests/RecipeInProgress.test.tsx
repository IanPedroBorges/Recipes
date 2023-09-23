import { vi } from 'vitest';
import { screen } from '@testing-library/dom';
import RecipeDetails from '../pages/RecipeDetails';
import { renderWithRouter } from './Helpers/renderWithRouter';
import {
  mockMealsDetails,
} from './Mocks/mockMealsDetails';
import RecipeInProgress from '../pages/RecipeInProgress';

const mealsPath = '/meals/52977/in-progress';
const ingStep = '0-ingredient-step';

const finish = 'finish-recipe-btn';

describe('Teste das comidas em progresso', () => {
  test('Inputs de checkbox e finish button renderizam corretamente', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    renderWithRouter(<RecipeInProgress />, { route: mealsPath });

    expect(await screen
      .findByTestId('12-ingredient-step')).toBeInTheDocument();

    expect(await screen
      .findByTestId(finish));
  });

  test('É possível tickar as checkboxes e elas ficam riscadas', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    const { user } = renderWithRouter(<RecipeInProgress />, { route: mealsPath });

    const step = await screen.findByTestId(ingStep);

    expect(await screen.findByLabelText('Lentils - 1 cup')).toBeInTheDocument();

    await user.click(step);

    expect(step).toHaveStyle('text-decoration: line-through solid rgb(0, 0, 0)');
  });

  test('É possível encontrar o id da Receita na localStorage após tickar ingrediente', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    window.localStorage.setItem(
      'inProgressRecipes',
      JSON.stringify({
        meals: { 52977: ['aaaa'] },
        drinks: {},
      }),
    );

    const { user } = renderWithRouter(<RecipeInProgress />, { route: mealsPath });

    const step = await screen.findByTestId(ingStep);

    await user.click(step);

    const data = localStorage.getItem(
      'inProgressRecipes',
    );

    expect(data).not.toBeFalsy();
    expect(data?.includes('52977')).toBeTruthy();
  });

  test('A chave inProgress é criada ao tickar ingrediente', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    const { user } = renderWithRouter(<RecipeInProgress />, { route: mealsPath });

    const step = await screen.findByTestId('0-ingredient-step');

    await user.click(step);

    const data = localStorage.getItem(
      'inProgressRecipes',
    );

    expect(data).not.toBeFalsy();
  });

  test('A chave inProgressRecipes > meals é um objeto vazio caso nada foi tickado', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    window.localStorage.setItem(
      'inProgressRecipes',
      JSON.stringify({
        meals: { 52977: [1] },
        drinks: {},
      }),
    );

    const { user } = renderWithRouter(<RecipeInProgress />, { route: mealsPath });

    const step = await screen.findByTestId(ingStep);

    await user.click(step);

    const data = localStorage.getItem(
      'inProgressRecipes',
    );

    expect(data?.includes('52977')).toBeFalsy();
  });

  test('As receitas sem medidas só aparecem os ingredientes', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    const ingredient1 = mockMealsDetails.meals[0].strIngredient1;

    renderWithRouter(<RecipeDetails />, { route: mealsPath });

    const step = await screen.findByTestId(ingStep);

    expect(step.innerHTML.includes(ingredient1)).toBeTruthy();
  });
});
