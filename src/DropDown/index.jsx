import React from 'react';
import Select from 'react-select';

import './styles.css';

export default function DropDown(props) {
  const {
    options,
    value,
    onChange,
  } = props;
  return (
    <Select
      components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
      isSearchable={false}
      className="react-select"
      placeholder={value}
      options={options}
      unstyled
      value={value}
      onChange={(option) => onChange(option)}
      clearable={false}
    />
  );
}
