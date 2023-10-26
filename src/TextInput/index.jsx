import React, { forwardRef } from 'react';

import './styles.css';

export default forwardRef(function TextInput(props, ref) {
  const { value, onChange, ...rest } = props;

  return (
    <input
      type="text"
      className="TextInput"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      ref={ref}
      {...rest}
    />
  );
});
