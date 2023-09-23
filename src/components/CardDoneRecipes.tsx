import { Link } from 'react-router-dom';
import style from '../pages/DoneRecipes/style.module.css';

type CardDoneRecipesProps = {
  id: string,
  type: string,
  index: number,
  category: string,
  name: string,
  image: string,
  doneDate: string,
  tags: string[],
  nationality: string,
  alcoholicOrNot: string,
  handleClick: (link: string) => void,
  alert: string,
};

function CardDoneRecipes({
  id,
  type,
  index,
  category,
  name,
  image,
  doneDate,
  tags,
  nationality,
  alcoholicOrNot,
  handleClick,
  alert,
}: CardDoneRecipesProps) {
  return (
    <div className={ style.Card }>
      <Link
        to={ `/${type}s/${id}` }
      >
        <img
          className={ style.RecipeImage }
          src={ image }
          alt="foto receita"
          data-testid={ `${index}-horizontal-image` }
        />
      </Link>
      <div className={ style.CardDetails }>
        <div className={ style.CardDetailsNoShare }>
          <Link
            to={ `/${type}s/${id}` }
            data-testid={ `${index}-horizontal-name` }
          >
            <p>{ name }</p>
          </Link>
          {
            type === 'meal' ? (
              <p data-testid={ `${index}-horizontal-top-text` }>
                { `${nationality} - ${category}` }
              </p>
            ) : (<p data-testid={ `${index}-horizontal-top-text` }>{ alcoholicOrNot }</p>)
          }
          <p data-testid={ `${index}-horizontal-done-date` }>{ doneDate }</p>
          {
            tags.map((tag, idx) => (
              <p
                key={ idx }
                data-testid={ `${index}-${tag}-horizontal-tag` }
                className={ style.Tags }
              >
                { tag }
              </p>
            ))
          }
        </div>
        <button
          className={ style.ShareButton }
          onClick={ () => handleClick(`http://localhost:3000/${type}s/${id}`) }
        >
          <img
            data-testid={ `${index}-horizontal-share-btn` }
            src="src/images/vector.png"
            alt="imagem compartilhar"
          />
          <p className={ style.ShareMessage }>{ alert }</p>
        </button>
      </div>
    </div>
  );
}

export default CardDoneRecipes;
