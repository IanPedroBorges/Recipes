import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { MealsProvider } from '../../context/MealsContext';
import { DrinksProvider } from '../../context/DrinksContext';
import LocalStorageProvider from '../../context/LocalStorageContext';

export const renderWithRouter = (ui: JSX.Element, { route = '/' } = {}) => {
  window.history.pushState({}, '', route);

  return {
    user: userEvent.setup(),
    ...render(
      <LocalStorageProvider>
        <DrinksProvider>
          <MealsProvider>
            <BrowserRouter>
              {ui}
            </BrowserRouter>
          </MealsProvider>
        </DrinksProvider>
        ,
      </LocalStorageProvider>,
    ),
  };
};
