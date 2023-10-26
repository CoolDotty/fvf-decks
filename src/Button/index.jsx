import React from 'react';

import './styles.css';

export default function Button(props) {
  const { onClick, label, forceActive } = props;

  return (
    <button
      type="button"
      className={`Button ${forceActive ? 'forceActive' : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      <div>{label}</div>
    </button>
  );
}
