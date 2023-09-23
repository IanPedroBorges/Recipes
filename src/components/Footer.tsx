import { NavLink } from 'react-router-dom';

import iconDrink from '../images/icone-bebida.png';
import iconFood from '../images/icone-prato.png';

export default function Footer() {
  return (
    <footer
      data-testid="footer"
      style={ { position: 'fixed', bottom: 0 } }
    >
      <nav>
        <NavLink to="/drinks">
          <img
            style={ { width: '24.61px', height: '25.12px' } }
            src={ iconDrink }
            data-testid="drinks-bottom-btn"
            alt="icon-drinks"
          />
        </NavLink>
        <NavLink to="meals">
          <img
            style={ { width: '40.33px', height: '29.53px' } }
            src={ iconFood }
            data-testid="meals-bottom-btn"
            alt="icon-meals"
          />
        </NavLink>
      </nav>
    </footer>
  );
}
