import './App.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import DoneRecipes from './pages/DoneRecipes/DoneRecipes';
import FavoriteRecipes from './pages/FavoriteRecipes';
import Layout from './components/Layout';
import RecipeDetails from './pages/RecipeDetails';
import NotFound from './pages/NotFound';
import Recipes from './pages/Recipes/Recipes';
import RecipeInProgress from './pages/RecipeInProgress';

function App() {
  return (
    <Routes>
      <Route index element={ <Login /> } />
      <Route path="/" element={ <Layout /> }>
        <Route path="/meals" element={ <Recipes path="meals" /> } />
        <Route path="/drinks" element={ <Recipes path="drinks" /> } />
        <Route path="/profile" element={ <Profile /> } />
        <Route path="/done-recipes" element={ <DoneRecipes /> } />
        <Route path="/favorite-recipes" element={ <FavoriteRecipes /> } />
      </Route>
      <Route path="/meals/:id" element={ <RecipeDetails /> } />
      <Route
        path="/meals/:id/in-progress"
        element={ <RecipeInProgress /> }
      />
      <Route path="/drinks/:id" element={ <RecipeDetails /> } />
      <Route
        path="/drinks/:id/in-progress"
        element={ <RecipeInProgress /> }
      />
      <Route path="/*" element={ <NotFound /> } />
    </Routes>
  );
}

export default App;
