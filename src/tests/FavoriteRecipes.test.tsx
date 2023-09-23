import { screen } from '@testing-library/dom';
import App from '../App';
import { renderWithRouter } from './Helpers/renderWithRouter';

describe('Testando o componente FavoriteRecipes', () => {
  const ROUTE_FAVORITE = '/favorite-recipes';

  const setLocalStorage = () => {
    const data = [
      { id: '52977',
        type: 'meal',
        category: 'Side',
        nationality: 'Turkish',
        alcoholicOrNot: '',
        name: 'Corba',
        image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg' },
      { id: '11007',
        type: 'drink',
        category: 'Ordinary Drink',
        nationality: '',
        alcoholicOrNot: 'Alcoholic',
        name: 'Margarita',
        image: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg' }];

    localStorage.setItem('favoriteRecipes', JSON.stringify(data));
  };

  test('Verifica se o componente renderiza corretamente quando esta na rota "/favorite-recipes"', () => {
    renderWithRouter(<App />, { route: ROUTE_FAVORITE });

    const title = screen.getByText(/Favorite Recipes/i);
    expect(title).toBeInTheDocument();
  });

  test('Verifica se as receitas salvas no localStorage são renderizadas na tela', () => {
    setLocalStorage();
    renderWithRouter(<App />, { route: ROUTE_FAVORITE });

    const recipe1 = screen.getByText(/Corba/i);
    expect(recipe1).toBeInTheDocument();
    const recipe2 = screen.getByText(/Margarita/i);
    expect(recipe2).toBeInTheDocument();
  });

  test('Verifica se os botões de filtro são renderizados na tela', () => {
    renderWithRouter(<App />, { route: ROUTE_FAVORITE });

    const filterAll = screen.getByTestId(/filter-by-all-btn/i);
    expect(filterAll).toBeInTheDocument();
    const filterMeal = screen.getByTestId(/filter-by-meal-btn/i);
    expect(filterMeal).toBeInTheDocument();
    const filterDrink = screen.getByTestId(/filter-by-drink-btn/i);
    expect(filterDrink).toBeInTheDocument();
  });

  test('Verifica se o botão "filter-by-meal" funciona', async () => {
    const { user } = renderWithRouter(<App />, { route: ROUTE_FAVORITE });

    const filterMeal = screen.getByTestId(/filter-by-meal-btn/i);

    const recipe1 = screen.getByText(/Corba/i);
    expect(recipe1).toBeInTheDocument();
    const recipe2 = screen.getByText(/Margarita/i);
    expect(recipe2).toBeInTheDocument();

    await user.click(filterMeal);
    expect(recipe1).toBeInTheDocument();
    expect(recipe2).not.toBeInTheDocument();
  });

  test('Verifica se o botão "filter-by-drink" funciona', async () => {
    const { user } = renderWithRouter(<App />, { route: ROUTE_FAVORITE });

    const filterDrink = screen.getByTestId(/filter-by-drink-btn/i);

    const recipe1 = screen.getByText(/Corba/i);
    expect(recipe1).toBeInTheDocument();
    const recipe2 = screen.getByText(/Margarita/i);
    expect(recipe2).toBeInTheDocument();

    await user.click(filterDrink);
    expect(recipe1).not.toBeInTheDocument();
    expect(recipe2).toBeInTheDocument();
  });

  test('Verifica se o botão "filter-by-all" funciona', async () => {
    const { user } = renderWithRouter(<App />, { route: ROUTE_FAVORITE });

    const filterAll = screen.getByTestId(/filter-by-all-btn/i);
    const filterMeal = screen.getByTestId(/filter-by-meal-btn/i);

    await user.click(filterMeal);
    await user.click(filterAll);

    const recipe1 = screen.getByText(/Corba/i);
    expect(recipe1).toBeInTheDocument();
    const recipe2 = screen.getByText(/Margarita/i);
    expect(recipe2).toBeInTheDocument();

    await user.click(filterAll);
    expect(recipe1).toBeInTheDocument();
    expect(recipe2).toBeInTheDocument();
  });

  test('Verifica se o botão "share-btn" funciona', async () => {
    const { user } = renderWithRouter(<App />, { route: ROUTE_FAVORITE });

    const shareBtn = screen.getByTestId(/0-horizontal-share-btn/i);
    expect(shareBtn).toBeInTheDocument();
    await user.click(shareBtn);
    const alertMessage = screen.getByText(/Link copied!/i);
    expect(alertMessage).toBeInTheDocument();
  });
});
