import React from 'react';

import './styles.css';

export default function Radio(props) {
  const { options, onChange, value } = props;

  return (
    <>
      {options.map((o) => (
        <label
          className={`radio ${o.value === value ? 'checked' : ''}`}
          key={`cardtype${o.value}`}
          htmlFor={o.value}
          style={{
            display: 'grid',
            placeItems: 'center',
          }}>
          <input
            id={o.value}
            style={{ display: 'none' }}
            type="radio"
            value={o.value}
            checked={o.value === value}
            onChange={() => onChange(o.value)}
          />
          {o.icon ? (
            <img
              src={`./icons/${o.icon}`}
              alt={o.label}
              style={{ width: '1em', height: '1em' }}
            />
          ) : (
            <div>{o.label}</div>
          )}
        </label>
      ))}
    </>
  );
}
