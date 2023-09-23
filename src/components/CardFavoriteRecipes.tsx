import { useState } from 'react';
import { Recipe } from '../types/typesLocalStorage';
import FavoriteButton from './Buttons/FavoriteButton';
import style from '../pages/DoneRecipes/style.module.css';

type CardFavoriteRecipesProps = {
  recipe: Recipe,
  index: number,
};

function CardFavoriteRecipes({
  recipe, index }: CardFavoriteRecipesProps) {
  const { alcoholicOrNot, category, id, image, name, nationality, type } = recipe;

  const [alertMessage, setAlertMessage] = useState<string>('');

  const handleShare = async (link: string) => {
    await navigator.clipboard.writeText(link);
    setAlertMessage('Link copied!');
    setTimeout(() => {
      setAlertMessage('');
      console.log(alertMessage);
    }, 2000);
  };

  return (
    <div className={ style.Card }>
      <a
        href={ `/${type}s/${id}` }
      >
        <img
          className={ style.RecipeImage }
          src={ image }
          alt="foto receita"
          data-testid={ `${index}-horizontal-image` }
        />
      </a>
      <div className={ style.CardDetails }>
        <div className={ style.CardDetailsNoShare }>
          <a
            href={ `/${type}s/${id}` }
          >
            <p
              data-testid={ `${index}-horizontal-name` }
            >
              { name }
            </p>
          </a>
          {
            type === 'meal'
              ? (
                <p data-testid={ `${index}-horizontal-top-text` }>
                  { `${nationality} - ${category}` }
                </p>)
              : (<p data-testid={ `${index}-horizontal-top-text` }>{ alcoholicOrNot }</p>)
          }
        </div>
        <div className={ style.ButtonsShareAndFavorite }>
          <button
            className={ style.ShareButton }
            onClick={ () => handleShare(`http://localhost:3000/${type}s/${id}`) }
          >
            <img
              data-testid={ `${index}-horizontal-share-btn` }
              src="src/images/vector.png"
              alt="imagem compartilhar"
            />
          </button>
          <FavoriteButton
            favoriteRecipe={ recipe }
            testId={ `${index}-horizontal-favorite-btn` }
          />
        </div>
      </div>
      <p className={ style.ShareMessage }>{ alertMessage }</p>
    </div>
  );
}

export default CardFavoriteRecipes;
