import { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Drinks, Meals } from '../../types/typesApi';
import {
  LocalStorageContext } from '../../context/LocalStorageContext/LocalStorageContext';
import FavoriteButton from '../Buttons/FavoriteButton';
import ShareButton from '../Buttons/ShareButton';
import StatusButton from '../Buttons/StatusButton';
import style from './styles.module.css';
import mealIcon from '../../images/icone-prato.png';

import { ingredientsDetails, measuresDetails } from '../../utils/ingredientsDetails';

export default function MealsDetails({ meals }: { meals: Meals }) {
  const { inProgressRecipes, doneRecipes, favoriteRecipes,
    setInProgressRecipes } = useContext(LocalStorageContext);
  const [data, setData] = useState<Drinks[]>([]);
  const { strMeal, strMealThumb, strCategory, strYoutube, strInstructions } = meals;

  const path = useLocation().pathname;
  const currentDate = new Date();

  const mealTags = meals.strTags.length > 0
    ? [meals.strTags
      .substring(0, meals.strTags.indexOf(',')),
    meals.strTags.substring(meals.strTags.indexOf(',')).replace(',', '')]
    : [];

  const ingredientsAndNumbers = ingredientsDetails(meals);

  const getChecked = (ingredientNum: number) => {
    if (inProgressRecipes.meals[meals.idMeal]) {
      return inProgressRecipes.meals[meals.idMeal].includes(ingredientNum);
    }
  };

  const addProgress = (ingredientNum: number) => {
    if (inProgressRecipes.meals[meals.idMeal]
      && inProgressRecipes.meals[meals.idMeal].includes(ingredientNum)) {
      const ingredientList = inProgressRecipes.meals[meals.idMeal];
      const filtered = ingredientList.filter((ing) => ing !== ingredientNum);

      if (filtered) {
        setInProgressRecipes({
          ...inProgressRecipes,
          meals: {
            ...inProgressRecipes.meals,
            [meals.idMeal]: filtered,
          },
        });
      }

      if (filtered.length === 0) {
        setInProgressRecipes({
          ...inProgressRecipes,
          meals: {},
        });
      }
    } else {
      setInProgressRecipes({
        ...inProgressRecipes,
        meals: {
          ...inProgressRecipes.meals,
          [meals.idMeal]: inProgressRecipes.meals[meals.idMeal]
            ? [...inProgressRecipes.meals[meals.idMeal], ingredientNum]
            : [ingredientNum],
        },
      });
    }
  };

  const measures = measuresDetails(meals);

  const recipeStatus = () => {
    if (inProgressRecipes.meals[meals.idMeal]
      && !(doneRecipes.some((recipe) => recipe.id === meals.idMeal))) {
      return 'Continue Recipe';
    }
    if (doneRecipes.some((recipe) => recipe.id === meals.idMeal)
    && inProgressRecipes.meals[meals.idMeal]) {
      return '';
    }
    return 'Start Recipe';
  };

  const status = recipeStatus();

  const finishVisibility = inProgressRecipes.meals[meals.idMeal] === undefined
  || inProgressRecipes.meals[meals.idMeal].length < ingredientsAndNumbers.length
  || status === '';

  useEffect(() => {
    const recommendationMeals = async () => {
      try {
        const response = await fetch(
          'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=',
        );
        const drinkRecommendation = await response.json();
        setData(drinkRecommendation.drinks);
      } catch (error) {
        console.log(error);
      }
    };
    recommendationMeals();
  }, [favoriteRecipes, meals.idMeal, inProgressRecipes]);

  return (
    <div className={ style.DivMain }>
      <img src={ strMealThumb } alt={ strMeal } data-testid="recipe-photo" />
      <h1 data-testid="recipe-title">{strMeal}</h1>
      <div className={ style.DivAbsolute }>
        <div>
          <img src={ mealIcon } alt="" />
          <h2 data-testid="recipe-category">{strCategory}</h2>
        </div>
        <div className={ style.DivBtns }>
          <ShareButton link={ `http://localhost:3000/meals/${meals.idMeal}` } />
          <FavoriteButton
            favoriteRecipe={
            { id: meals.idMeal,
              type: 'meal',
              category: meals.strCategory,
              nationality: meals.strArea,
              alcoholicOrNot: '',
              name: meals.strMeal,
              image: strMealThumb }
            }
            testId="favorite-btn"
          />
        </div>
      </div>
      <h1 data-testid="recipe-title">{strMeal}</h1>
      <div className={ style.DivList }>
        <h3>Ingredients</h3>
        <div>
          {path.includes('progress') ? (
            ingredientsAndNumbers.map((ingredient, index) => (
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
          ) : (ingredientsAndNumbers.map((ingredient, index) => (
            <li
              key={ ingredient }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {measures[index] === undefined
                ? `${ingredient.slice(2)}`
                : `${ingredient.slice(2)} - ${measures[index]}`}
            </li>
          )))}
        </div>
      </div>
      <div className={ style.DivInstructions }>
        <h3>Instructions</h3>
        <div>
          <p data-testid="instructions">{strInstructions}</p>
        </div>
      </div>
      <div>
        <iframe
          src={ strYoutube.replace('watch?v=', 'embed/') }
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share"
          data-testid="video"
          allowFullScreen
        />
      </div>
      <div className={ style.DivImages }>
        <h3>Recommended</h3>
        <div>
          {data
            && data.slice(0, 6).map((drink, index) => (
              <Link
                to={ `/drinks/${drink.idDrink}` }
                key={ drink.strDrink }
                data-testid={ `${index}-recommendation-card` }
              >
                <img
                  src={ drink.strDrinkThumb }
                  alt={ drink.strDrink }
                />
                <p data-testid={ `${index}-recommendation-title` }>
                  {drink.strDrink}
                </p>
              </Link>
            ))}
        </div>
      </div>
      <div className={ style.BtnStatus }>
        {!path.includes('progress')
        && (status === 'Continue Recipe' || status === 'Start Recipe') && (
          <StatusButton
            page={ `/meals/${meals.idMeal}/in-progress` }
            btnName={ status }
            testID="start-recipe-btn"
          />
        )}
        {path.includes('progress')
        && <StatusButton
          page={ `/meals/${meals.idMeal}/done-recipes` }
          btnName="Finish Recipe"
          testID="finish-recipe-btn"
          visibility={ finishVisibility }
          recipe={ {
            id: meals.idMeal,
            type: 'meal',
            nationality: meals.strArea,
            category: meals.strCategory,
            alcoholicOrNot: '',
            name: meals.strMeal,
            image: strMealThumb,
            doneDate: currentDate.toISOString(),
            tags: mealTags,
          } }
        />}
      </div>
    </div>
  );
}
