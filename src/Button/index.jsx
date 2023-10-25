import React from 'react';

import './styles.css';

export default function Button(props) {
  const { onClick, label } = props;

  return (
    <button
      type="button"
      className="Button"
      onClick={onClick}
      aria-label={label}
    >
      <div>{label}</div>
    </button>
  );
}
