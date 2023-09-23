import React from 'react';
import { LocalStorageContext } from './LocalStorageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function LocalStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useLocalStorage('user', { email: '' });
  const [doneRecipes, setDoneRecipes] = useLocalStorage('doneRecipes', []);
  const [inProgressRecipes, setInProgressRecipes] = useLocalStorage(
    'inProgressRecipes',
    {
      drinks: {},
      meals: {},
    },
  );
  const [favoriteRecipes, setFavoriteRecipes] = useLocalStorage('favoriteRecipes', []);
  const shared = {
    user,
    setUser,
    doneRecipes,
    setDoneRecipes,
    inProgressRecipes,
    setInProgressRecipes,
    favoriteRecipes,
    setFavoriteRecipes,
  };
  return (
    <div>
      <LocalStorageContext.Provider value={ shared }>
        {children}
      </LocalStorageContext.Provider>
    </div>
  );
}
