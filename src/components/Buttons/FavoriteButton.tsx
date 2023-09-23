import { useContext } from 'react';
import { Recipe } from '../../types/typesLocalStorage';
import favoriteIcon from '../../images/blackHeartIcon.svg';
import noIsFavoriteIcon from '../../images/whiteHeartIcon.svg';
import {
  LocalStorageContext,
} from '../../context/LocalStorageContext/LocalStorageContext';

type FavoriteButtonProps = {
  favoriteRecipe: Recipe,
  testId: string,
};

export default function FavoriteButton({
  favoriteRecipe, testId }: FavoriteButtonProps) {
  const { favoriteRecipes, setFavoriteRecipes } = useContext(LocalStorageContext);

  const favorite = favoriteRecipes.some(
    (recipe) => recipe.id === favoriteRecipe.id,
  );

  const handleClickFavorite = () => {
    if (favorite) {
      const newFavorite = favoriteRecipes.filter(
        (recipe) => recipe.id !== favoriteRecipe.id,
      );
      setFavoriteRecipes(newFavorite);
    } else {
      setFavoriteRecipes([...favoriteRecipes, favoriteRecipe]);
    }
  };

  return (
    <button
      onClick={ handleClickFavorite }
    >
      <img
        // style={ { color: '#FCC436', border: '1px solid #FCC436', borderRadius: '100%' } }
        data-testid={ testId }
        src={ favorite ? favoriteIcon : noIsFavoriteIcon }
        alt="Favorite Icon"
        width="30px"
      />
    </button>
  );
}
