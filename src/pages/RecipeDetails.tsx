import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { MealsAndDrinks } from '../types/typesApi';
import MealsDetails from '../components/DrinksAndMealsDetails/MealsDetails';
import DrinksDetails from '../components/DrinksAndMealsDetails/DrinksDetails';

export default function RecipeDetails() {
  const { pathname } = useLocation();
  const { id } = useParams();

  const [details, setDetails] = useState<MealsAndDrinks>();
  const [isMeals, setIsMeals] = useState<boolean>();

  useEffect(() => {
    const getDetails = async () => {
      try {
        if (pathname.includes('meals')) {
          const data = await api(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
          );
          setIsMeals(true);
          setDetails(data);
        } else {
          const data = await api(
            `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`,
          );
          setIsMeals(false);
          setDetails(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDetails();
  }, [pathname, id]);

  return (
    <section>
      {isMeals
        ? details && (
          <MealsDetails
            meals={ details.meals[0] }
          />
        )
        : details && (
          <DrinksDetails
            drink={ details.drinks[0] }
          />
        )}
    </section>
  );
}
