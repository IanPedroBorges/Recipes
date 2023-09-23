import { useState } from 'react';

import iconShare from '../../images/shareIcon.svg';

export default function ShareButton({ link }: { link: string }) {
  const [alert, setAlert] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setAlert(true);
      setTimeout(() => setAlert(false), 2000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {alert && (
        <span
          style={ { color: 'white', fontWeight: '500' } }
        >
          Link copiado!
        </span>)}
      <button
        style={ { background: 'none', border: 'none', padding: '5px' } }
        data-testid="share-btn"
        onClick={ handleClick }
      >
        <img src={ iconShare } alt="Share Icon" width="30px" />
      </button>
    </div>
  );
}
