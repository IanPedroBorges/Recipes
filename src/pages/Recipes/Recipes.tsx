import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CardRecipes from '../../components/CardRecipes/CardRecipes';
import { DrinksContext } from '../../context/DrinksContext/DrinksContext';
import { MealsContext } from '../../context/MealsContext/MealsContext';
import { api } from '../../services/api';
import style from './styles.module.css';


type RecipesProps = {
  path: string,
};

function Recipes({ path } : RecipesProps) {
  const { drinks, setDrinks } = useContext(DrinksContext);
  const { meals, setMeals } = useContext(MealsContext);
  const [carregando, setCarregando] = useState(false);

  const [listCategory, setListCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const MEAL_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  const DRINK_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

  useEffect(() => {
    const fetchData = async () => {
      setCarregando(true);
      if (path === 'meals' && meals?.length === 0) {
        const dataMeals = await api(MEAL_URL);
        setMeals(dataMeals?.meals);
        const dataCategoryMeals = await api('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        setListCategory(dataCategoryMeals?.meals);
        setCarregando(false);
      }
      if (path === 'drinks' && drinks?.length === 0) {
        const dataDrinks = await api(DRINK_URL);
        setDrinks(dataDrinks?.drinks);

        const dataCategoryDrinks = await api('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
        setListCategory(dataCategoryDrinks?.drinks);
        setCarregando(false);
      }
    };
    fetchData();
  }, [path]);

  const handleClickCategory = async (clickedValue: string) => {
    const dataMeals = await api(MEAL_URL);
    const dataDrinks = await api(DRINK_URL);
    setCarregando(true);

    if (path === 'drinks') {
      const drinksFilteredByCategory = await api(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${clickedValue}`);
      setDrinks(drinksFilteredByCategory?.drinks);
      setCarregando(false);
    }
    if (path === 'meals') {
      const mealsFilteredByCategory = await api(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${clickedValue}`);
      setMeals(mealsFilteredByCategory?.meals);
      setCarregando(false);
    }
    if (selectedCategory === clickedValue) {
      setMeals(dataMeals?.meals);
      setDrinks(dataDrinks?.drinks);
      setCarregando(false);
    } else {
      setSelectedCategory(clickedValue);
      setCarregando(false);
    }
  };

  const handleClickClear = async () => {
    if (path === 'drinks') {
      const dataDrinks = await api(DRINK_URL);
      setDrinks(dataDrinks?.drinks);
    }
    if (path === 'meals') {
      const dataMeals = await api(MEAL_URL);
      setMeals(dataMeals?.meals);
    }
  };

  if (carregando) return <h1>Loading...</h1>;

  return (
    <>
      <div className={ style.DivButtons }>
        {listCategory && (
          listCategory.slice(0, 5).map((categoryBtn: { strCategory: string }, index) => (
            <button
              key={ index }
              data-testid={ `${categoryBtn.strCategory}-category-filter` }
              onClick={ () => handleClickCategory(categoryBtn.strCategory) }
            >
              <img
                src={ `https://raw.githubusercontent.com/IanPedroBorges/Recipes/1083554fe7d0cfa0a5303bcf1bc729f0d9475038/src/images/category_items/${categoryBtn.strCategory}.svg` }
                alt={ categoryBtn.strCategory }
              />
            </button>
          ))
        )}
        <button
          data-testid="All-category-filter"
          onClick={ handleClickClear }
        >
          <img
            src={ path === 'meals' ? 'https://raw.githubusercontent.com/IanPedroBorges/Recipes/1083554fe7d0cfa0a5303bcf1bc729f0d9475038/src/images/category_items/All.svg'
              : 'https://raw.githubusercontent.com/IanPedroBorges/Recipes/1083554fe7d0cfa0a5303bcf1bc729f0d9475038/src/images/category_items/AllDrinks.svg' }
            alt="all"
          />
        </button>
      </div>
      <main className={ style.Main }>
        {path === 'drinks' && drinks?.length > 0 ? (
          drinks?.slice(0, 12).map((current, index) => (
            <Link to={ `/drinks/${current.idDrink}` } key={ index }>
              <CardRecipes data={ current } type={ path } index={ index } />
            </Link>
          ))
        ) : (meals?.slice(0, 12).map((current, index) => (
          <Link to={ `/meals/${current.idMeal}` } key={ index }>
            <CardRecipes key={ index } data={ current } type={ path } index={ index } />
          </Link>
        )))}
      </main>
    </>
  );
}

export default Recipes;
