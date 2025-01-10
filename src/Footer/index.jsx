import React from 'react';
import './styles.css';

export default function Footer() {
  return (
    <footer>
      <div>
        <a href="https://friendsvsfriends.com">Friends vs Friends</a> is created by{' '}
        <a href="https://brainwashgang.com/">Brainwash Gang</a> and published by{' '}
        <a href="https://rawfury.com/">Raw Fury</a>
      </div>
      <br />
      <div>
        FvF-Decks is an{' '}
        <a href="https://github.com/CoolDotty/fvf-decks">open-source project</a>{' '}
        maintained with 💔 by all its contributors
      </div>
    </footer>
  );
}
