import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drinks, Meals } from '../../types/typesApi';
import FavoriteButton from '../Buttons/FavoriteButton';
import ShareButton from '../Buttons/ShareButton';
import StatusButton from '../Buttons/StatusButton';
import { LocalStorageContext }
  from '../../context/LocalStorageContext/LocalStorageContext';

import style from './styles.module.css';

import iconDrink from '../../images/DrinksDetails/iconDrink.svg';

import { ingredientsDetails, measuresDetails } from '../../utils/ingredientsDetails';

export default function DrinksDetails({ drink }: { drink: Drinks }) {
  const {
    inProgressRecipes,
    doneRecipes,
    favoriteRecipes,
    setInProgressRecipes,
  } = useContext(LocalStorageContext);

  const path = useLocation().pathname;
  const currentDate = new Date();

  const [data, setData] = useState<Meals[]>([]);

  const { strDrink, strDrinkThumb, strAlcoholic, strInstructions } = drink;

  const ingredientsAndNumbers = ingredientsDetails(drink);

  const measures = measuresDetails(drink);

  const recipeStatus = () => {
    if (
      inProgressRecipes.drinks[drink.idDrink]
      && !doneRecipes.some((recipe) => recipe.id === drink.idDrink)
    ) {
      return 'Continue Recipe';
    }
    if (
      doneRecipes.some((recipe) => recipe.id === drink.idDrink)
      && inProgressRecipes.drinks[drink.idDrink]
    ) {
      return '';
    }
    return 'Start Recipe';
  };

  const status = recipeStatus();

  const finishVisibility = inProgressRecipes.drinks[drink.idDrink] === undefined
    || inProgressRecipes.drinks[drink.idDrink].length
      < ingredientsAndNumbers.length
    || status === '';

  const getChecked = (ingredientNum: number) => {
    if (inProgressRecipes.drinks[drink.idDrink]) {
      return inProgressRecipes.drinks[drink.idDrink].includes(ingredientNum);
    }
  };

  const addProgress = (ingredientNum: number) => {
    if (
      inProgressRecipes.drinks[drink.idDrink]
      && inProgressRecipes.drinks[drink.idDrink].includes(ingredientNum)
    ) {
      const ingredientList = inProgressRecipes.drinks[drink.idDrink];
      const filtered = ingredientList.filter((ing) => ing !== ingredientNum);

      if (filtered) {
        setInProgressRecipes({
          ...inProgressRecipes,
          drinks: {
            ...inProgressRecipes.drinks,
            [drink.idDrink]: filtered,
          },
        });
      }

      if (filtered.length === 0) {
        setInProgressRecipes({
          ...inProgressRecipes,
          drinks: {},
        });
      }
    } else {
      setInProgressRecipes({
        ...inProgressRecipes,
        drinks: {
          ...inProgressRecipes.drinks,
          [drink.idDrink]: inProgressRecipes.drinks[drink.idDrink]
            ? [...inProgressRecipes.drinks[drink.idDrink], ingredientNum]
            : [ingredientNum],
        },
      });
    }
  };

  useEffect(() => {
    const recommendationDrink = async () => {
      try {
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/search.php?s=',
        );
        const mealsRecommendation = await response.json();
        setData(mealsRecommendation.meals);
      } catch (error) {
        console.log(error);
      }
    };
    recommendationDrink();
  }, [favoriteRecipes, drink.idDrink]);

  return (
    <div className={ style.DivMain }>
      <img src={ strDrinkThumb } alt={ strDrink } data-testid="recipe-photo" />
      <h1 data-testid="recipe-title">{strDrink}</h1>
      <div className={ style.DivAbsolute }>
        <div>
          <img src={ iconDrink } alt="" />
          <h2 data-testid="recipe-category">{strAlcoholic}</h2>
        </div>
        <div className={ style.DivBtns }>
          <ShareButton link={ `http://localhost:3000/drinks/${drink.idDrink}` } />
          <FavoriteButton
            favoriteRecipe={ {
              id: drink.idDrink,
              type: 'drink',
              category: drink.strCategory,
              nationality: '',
              alcoholicOrNot: drink.strAlcoholic,
              name: strDrink,
              image: strDrinkThumb,
            } }
            testId="favorite-btn"
          />
        </div>
      </div>
      <div className={ style.DivList }>
        <h3>Ingredients</h3>
        <div>
          {path.includes('progress')
            ? ingredientsAndNumbers.map((ingredient, index) => (
              <label
                style={ getChecked(Number(ingredient.slice(0, 1)))
                  ? { textDecoration: 'line-through solid rgb(0, 0, 0)' }
                  : { textDecoration: 'none' } }
                htmlFor={ ingredient }
                key={ ingredient }
                data-testid={ `${index}-ingredient-step` }
              >
                <input
                  type="checkbox"
                  name={ ingredient }
                  id={ ingredient }
                  checked={ getChecked(Number(ingredient.slice(0, 1))) }
                  onChange={ () => addProgress(Number(ingredient.slice(0, 1))) }
                />
                {measures[index] === undefined
                  ? `${ingredient.slice(2)}`
                  : `${ingredient.slice(2)} - ${measures[index]}`}
              </label>
            ))
            : ingredientsAndNumbers.map((ingredient, index) => (
              <li
                key={ ingredient }
                data-testid={ `${index}-ingredient-name-and-measure` }
              >
                {measures[index] === undefined
                  ? `${ingredient.slice(2)}`
                  : `${ingredient.slice(2)} - ${measures[index]}`}
              </li>
            ))}
        </div>
      </div>
      <div className={ style.DivInstructions }>
        <h3>Instructions</h3>
        <div>
          <p data-testid="instructions">{strInstructions}</p>
        </div>
      </div>
      <div className={ style.DivImages }>
        <h3>Recommended</h3>
        <div>
          {data
            && data.slice(0, 6).map((meals, index) => (
              <Link
                to={ `/meals/${meals.idMeal}` }
                key={ meals.strMeal }
                data-testid={ `${index}-recommendation-card` }
              >
                <img
                  src={ meals.strMealThumb }
                  alt={ meals.strMeal }
                />
                <p data-testid={ `${index}-recommendation-title` }>
                  {meals.strMeal}
                </p>
              </Link>
            ))}
        </div>
      </div>
      <div className={ style.BtnStatus }>
        {!path.includes('progress')
          && (status === 'Continue Recipe' || status === 'Start Recipe') && (
            <StatusButton
              page={ `/drinks/${drink.idDrink}/in-progress` }
              btnName={ status }
              testID="start-recipe-btn"
            />
        )}
        {path.includes('progress') && (
          <StatusButton
            page={ `/drinks/${drink.idDrink}/done-recipes` }
            btnName="Finish Recipe"
            testID="finish-recipe-btn"
            visibility={ finishVisibility }
            recipe={ {
              id: drink.idDrink,
              type: 'drink',
              nationality: '',
              category: drink.strCategory,
              alcoholicOrNot: drink.strAlcoholic,
              name: strDrink,
              image: strDrinkThumb,
              doneDate: currentDate.toISOString(),
              tags: [],
            } }
          />
        )}
      </div>
    </div>
  );
}
