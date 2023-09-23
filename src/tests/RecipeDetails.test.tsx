import { vi } from 'vitest';
import { screen } from '@testing-library/dom';
import RecipeDetails from '../pages/RecipeDetails';
import { renderWithRouter } from './Helpers/renderWithRouter';
import {
  mockMealsDetails,
  mockMealsDetailsNoMeasure,
} from './Mocks/mockMealsDetails';
import { drinksMockDetail } from './Mocks/mockDrinkDetail';

const mealsPath = '/meals/52977';
const recipePhoto = 'recipe-photo';
const btnStartRecipe = 'start-recipe-btn';
const btnFavorite = 'favorite-btn';
const drinkPath = '/drink/15997';

describe('testando o componente RecipeDetails', () => {
  test('testando se o componente é renderizado no Meals Component e suas funcionidades', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetails,
    });

    const { user } = renderWithRouter(<RecipeDetails />, { route: mealsPath });
    const drinkDetails = await screen.findByTestId(recipePhoto);
    const title = await screen.findByRole('heading', { name: /corba/i });
    const btnStartOrContinue = await screen.findByTestId(btnStartRecipe);
    const youtubePlayer = await screen.findByTitle(/youtube video player/i);
    const shareButton = await screen.findByTestId('share-btn');
    const favoriteButton = await screen.findByTestId(btnFavorite);
    const ingredientsList = await screen.findAllByRole('listitem');
    expect(ingredientsList.length).toBe(13);
    expect(shareButton).toBeInTheDocument();
    expect(favoriteButton).toBeInTheDocument();
    expect(drinkDetails).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(youtubePlayer).toBeInTheDocument();
    expect(btnStartOrContinue).toBeInTheDocument();
    expect(btnStartOrContinue).toHaveTextContent('Start Recipe');
    await user.click(favoriteButton);
    await user.click(shareButton);
    expect(global.fetch).toBeCalledTimes(3);
    await user.click(btnStartOrContinue);
    const path = window.location.pathname;
    expect(path).toBe('/meals/52977/in-progress');
  });
  test('testando se o componente é renderizado no Meals Component com o local storage ', async () => {
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

    renderWithRouter(<RecipeDetails />, { route: mealsPath });
    console.log(localStorage.getItem('inProgressRecipes'));
    const drinkDetails = await screen.findByTestId(recipePhoto);
    const title = await screen.findByRole('heading', { name: /corba/i });
    const btnStartOrContinue = await screen.findByTestId(btnStartRecipe);
    expect(drinkDetails).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(btnStartOrContinue).toBeInTheDocument();
    expect(btnStartOrContinue).toHaveTextContent('Continue Recipe');
  });
  test('testando o componente quando nao ha Measures', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockMealsDetailsNoMeasure,
    });
    renderWithRouter(<RecipeDetails />, { route: mealsPath });
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const ingredientes = await screen.findAllByRole('listitem');
    expect(ingredientes.length).toBe(13);
    expect(ingredientes[0]).toHaveTextContent('Lentils -');
    expect(ingredientes[1]).toHaveTextContent('Onion - ola');
  });
  test('testando se o componente é renderizado no Drink Component e suas funcionidades', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => drinksMockDetail,
    });

    const { user } = renderWithRouter(<RecipeDetails />, {
      route: drinkPath,
    });
    const drinkDetails = await screen.findByTestId(recipePhoto);
    const title = await screen.findByRole('heading', { name: /GG/i });
    const btnStartOrContinue = await screen.findByTestId(btnStartRecipe);
    const shareButton = await screen.findByTestId('share-btn');
    const favoriteButton = await screen.findByTestId(btnFavorite);
    const ingredientsList = await screen.findAllByRole('listitem');
    expect(ingredientsList.length).toBe(3);
    expect(shareButton).toBeInTheDocument();
    expect(favoriteButton).toBeInTheDocument();
    expect(drinkDetails).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(btnStartOrContinue).toBeInTheDocument();
    expect(btnStartOrContinue).toHaveTextContent('Start Recipe');
    await user.click(favoriteButton);
    await user.click(shareButton);
    expect(global.fetch).toBeCalledTimes(3);
    await user.click(btnStartOrContinue);
    const path = window.location.pathname;
    expect(path).toBe('/drinks/15997/in-progress');
  });
  test('testando se o componente é renderizado no Drink Component com o local storage ', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => drinksMockDetail,
    });
    window.localStorage.setItem(
      'inProgressRecipes',
      JSON.stringify({
        meals: {},
        drinks: { 15997: ['aaaa'] },
      }),
    );

    const { user } = renderWithRouter(<RecipeDetails />, {
      route: drinkPath,
    });
    console.log(localStorage.getItem('inProgressRecipes'));
    const drinkDetails = await screen.findByTestId(recipePhoto);
    const title = await screen.findByRole('heading', { name: /GG/i });
    const btnStartOrContinue = await screen.findByTestId(btnStartRecipe);
    expect(drinkDetails).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(btnStartOrContinue).toBeInTheDocument();
    expect(btnStartOrContinue).toHaveTextContent('Continue Recipe');
    const btnFavorit = await screen.findByTestId(btnFavorite);
    expect(btnFavorit).toBeInTheDocument();
    await user.click(btnFavorit);
  });
  test('testando o componente em caso de erro de fetch', async () => {
    global.fetch = vi.fn(() => Promise.reject());
    renderWithRouter(<RecipeDetails />, { route: drinkPath });
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
