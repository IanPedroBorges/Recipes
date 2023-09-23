import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LocalStorageContext,
} from '../../context/LocalStorageContext/LocalStorageContext';
import { DoneRecipe } from '../../types/typesLocalStorage';

export default function StatusButton(
  { page, btnName, testID, visibility = false, recipe = {
    id: '',
    type: '',
    nationality: '',
    category: '',
    alcoholicOrNot: '',
    name: '',
    image: '',
    doneDate: '',
    tags: [],
  } }
  : { page: string, btnName: string, testID: string,
    visibility?: boolean, recipe?: DoneRecipe },
) {
  const { doneRecipes, setDoneRecipes } = useContext(LocalStorageContext);

  const navigate = useNavigate();

  const handleFinish = () => {
  /*     doneRecipes.forEach((currRecipe) => {
      if (currRecipe.id === recipe.id) {

      }
    }) */
    if (recipe) {
      setDoneRecipes([
        ...doneRecipes,
        recipe,
      ]);
    }
    navigate('/done-recipes');
  };

  return (
    <button
      className="btnStatus"
      data-testid={ testID }
      onClick={ btnName === 'Finish Recipe' ? handleFinish : () => navigate(page) }
      disabled={ visibility }
    >
      { btnName }
    </button>
  );
}
