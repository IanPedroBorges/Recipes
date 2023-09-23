import { createContext } from 'react';
import { DoneRecipes,
  FavoriteRecipes, InProgressRecipes, User } from '../../types/typesLocalStorage';

export type LocalStorageType = {
  user: User,
  setUser: (value: User) => void,
  doneRecipes: DoneRecipes,
  setDoneRecipes: (value: DoneRecipes) => void,
  inProgressRecipes: InProgressRecipes;
  setInProgressRecipes: (value: InProgressRecipes) => void,
  favoriteRecipes: FavoriteRecipes,
  setFavoriteRecipes: (value: FavoriteRecipes) => void,
};

export const LocalStorageContext = createContext({} as LocalStorageType);
