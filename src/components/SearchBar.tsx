import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DrinksContext } from '../context/DrinksContext/DrinksContext';
import { MealsContext } from '../context/MealsContext/MealsContext';
import { drinksSearch, mealsSearch } from '../services/api';

export default function SearchBar() {
  const drinksContext = useContext(DrinksContext);
  const mealsContext = useContext(MealsContext);

  const { inputValue, setSearchFilter, searchFilter } = drinksContext;

  const nav = useNavigate();
  const local = useLocation();
  const page = local.pathname.slice(1);

  const INITIAL_STATE = {
    ingredient: false,
    name: false,
    firstLetter: false,
  };

  const [selected, setSelected] = useState(INITIAL_STATE);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    setSearchFilter(target.name);
    switch (target.name) {
      case 'ingredient':
        setSelected({
          firstLetter: false,
          name: false,
          ingredient: true,
        });
        break;
      case 'name':
        setSelected({
          firstLetter: false,
          ingredient: false,
          name: true,
        });
        break;
      case 'first-letter':
        setSelected({
          name: false,
          ingredient: false,
          firstLetter: true,
        });
        break;
      default:
        setSelected({ ...selected });
    }
  };

  const execSearch = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (inputValue.length > 1 && searchFilter === 'first-letter') {
      return window.alert('Your search must have only 1 (one) character');
    }

    const mealsData = await mealsSearch(searchFilter, inputValue, page);
    if (mealsData) {
      mealsContext.setMeals(mealsData);
      if (mealsData.length === 1) {
        nav(`/meals/${mealsData[0].idMeal}`);
      }
    }

    const drinksData = await drinksSearch(searchFilter, inputValue, page);
    if (drinksData) {
      drinksContext.setDrinks(drinksData);
      if (drinksData.length === 1) {
        nav(`/drinks/${drinksData[0].idDrink}`);
      }
    }

    if (mealsData === null) {
      window.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
    if (drinksData === null) {
      window.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
  };

  return (
    <div className="search-filters">
      <div className="radio-container">
        <label htmlFor="ingredient">
          <input
            type="radio"
            name="ingredient"
            id="ingredient"
            data-testid="ingredient-search-radio"
            checked={ selected.ingredient }
            onChange={ handleCheck }
          />
          <span>
            Ingredient
          </span>
        </label>
        <label htmlFor="name">
          <input
            type="radio"
            name="name"
            id="name"
            data-testid="name-search-radio"
            checked={ selected.name }
            onChange={ handleCheck }
          />
          <span>
            Name
          </span>
        </label>
        <label htmlFor="first-letter">
          <input
            type="radio"
            name="first-letter"
            id="first-letter"
            data-testid="first-letter-search-radio"
            checked={ selected.firstLetter }
            onChange={ handleCheck }
          />
          <span>
            First-Letter
          </span>
        </label>
      </div>
      <button
        data-testid="exec-search-btn"
        onClick={ execSearch }
      >
        <span>
          SEARCH
        </span>
      </button>
    </div>
  );
}
