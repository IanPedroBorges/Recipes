import { useEffect, useState } from 'react';
import {
  MealsAndDrinks, Meals, MealsCategories, MealsNacionality,
} from '../types/typesApi';
import { api } from '../services/api';

export function useFetch(url: string) {
  const [data, setData] = useState<
  Meals | MealsCategories | MealsAndDrinks | MealsNacionality>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetching = await api(url);
        setData(fetching);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [url]);

  return data;
}
