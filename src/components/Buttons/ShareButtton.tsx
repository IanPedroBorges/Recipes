import { useState } from 'react';

export default function ShareButton({ link }: { link: string }) {
  const [alert, setAlert] = useState('');

  const handleClick = async () => {
    await navigator.clipboard.writeText(link);
    setAlert('Link copied!');
  };
  return (
    <div>
      <p>{ alert }</p>
      <button
        data-testid="share-btn"
        onClick={ handleClick }
      >
        Share
      </button>
    </div>
  );
}
