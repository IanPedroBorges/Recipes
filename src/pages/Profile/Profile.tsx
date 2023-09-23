import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import iconStyledDone from '../../images/doneRecipeBtn.svg';
import iconFavorite from '../../images/favoriteBtnProfile.svg';
import iconLogout from '../../images/logoutIconProfile.svg';
import style from './style.module.css';
import { LocalStorageContext }
  from '../../context/LocalStorageContext/LocalStorageContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(LocalStorageContext);

  const handleClickLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className={ style.DivMain }>
      <h2 data-testid="profile-email">{user.email}</h2>
      <div className={ style.DivBtn }>
        <button
          data-testID="profile-done-btn"
          onClick={ () => navigate('/done-recipes') }
        >
          <img src={ iconStyledDone } alt="" />
          Done Recipes
        </button>
        <button
          onClick={ () => navigate('/favorite-recipes') }
          data-testid="profile-favorite-btn"
        >
          <img src={ iconFavorite } alt="" />
          Favorite Recipes
        </button>
        <button onClick={ handleClickLogout } data-testid="profile-logout-btn">
          <img src={ iconLogout } alt="" />
          Logout
        </button>
      </div>
    </div>
  );
}
