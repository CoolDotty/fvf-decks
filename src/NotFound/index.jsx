import React from 'react';

import './styles.css';

export default function NotFound(props) {
  const { cardSearch } = props;

  return (
    <div className="error">
      No results for &ldquo;
      {cardSearch}
      &rdquo;
      <br />
      💔
    </div>
  );
}
