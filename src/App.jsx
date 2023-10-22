import './reset.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Compressed decks strings seem to be longer than uncompressed ones
// import { compressUrlSafe, decompressUrlSafe } from 'urlsafe-lzma';

import {
  allCards, personalityToId,
} from './const';

function Card(props) {
  const { card, equipped, ...rest } = props;
  const {
    name, img, cost, type,
  } = card;
  return (
    <div
      className={`card ${equipped ? 'equipped' : ''}`}
      title={name}
      {...rest}
    >
      <div
        className={`cardContent cost${cost}`}
        style={{ backgroundImage: `url("cards/${img}")` }}
      >
        <div
          className="cost"
          style={{ backgroundImage: `url("cost/card_cost_icon_${cost}.png")` }}
        />
        <div
          className="level"
          style={{
            backgroundImage: type === 'Personality'
              ? 'url("level/card_lvl_10.png")'
              : 'url("level/card_lvl_max.png")',
          }}
        />
      </div>
    </div>
  );
}

const MAX_COST = 50;
const MIN_CARDS = 25;

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [myDeck, setMyDeck] = useState(
    (searchParams.get('deck') || '')
      .split('.')
      .map((s) => allCards.find((c) => c.id === parseInt(s, 10)))
      .filter(Boolean),
  );
  const myCards = myDeck.filter((c) => c.type !== 'Personality');
  const myCharacters = myDeck.filter((c) => c.type === 'Personality');

  useEffect(() => {
    if (myDeck.length > 0) {
      setSearchParams({
        deck: myDeck
          .map((c) => c.id).join('.'),
      });
    } else {
      setSearchParams({});
    }
  }, [myDeck, setSearchParams]);

  const [cardFilter, setCardFilter] = useState('All');

  const deckCost = myCards
    .reduce((acc, c) => acc + c.cost, 0);
  const deckCount = myCards
    .length;

  return (
    <div className="App">
      <div className="filters">
        <span>
          Cost:
          {' '}
          {deckCost > MAX_COST ? <b style={{ color: 'red' }}>{deckCost}</b> : deckCost}
          /
          {MAX_COST}
        </span>
        <span>
          Count:
          {' '}
          {deckCount < MIN_CARDS ? <b style={{ color: 'red' }}>{deckCount}</b> : deckCount}
          /
          {MIN_CARDS}
        </span>
      </div>
      <div className="myDeck">
        {myDeck
          .reduce((acc, c) => {
            const order = c.type === 'Personality' ? 1000 : c.cost;
            if (acc[order]) {
              acc[order].push(c);
            } else {
              acc[order] = [c];
            }
            return acc;
          }, [])
          .map((cardsOfCost) => (
            cardsOfCost
              .map((c) => (
                <Card
                  card={c}
                  onClick={() => {
                    const i = myDeck.findIndex((m) => m.id === c.id);
                    const newDeck = [...myDeck];
                    newDeck.splice(i, 1);
                    setMyDeck(newDeck);
                  }}
                  key={c.id}
                />
              ))
          ))
          .reverse()
          .map((cardsOfCost) => [...cardsOfCost, <br />])
          .flat(1)}
        {// Character art in background
          myCharacters.map((c, i) => (
            <div
              className="characterArt"
              style={{
                zIndex: (i + 1) * -1,
                // opacity: (myCharacters.length - i) * (0.75 / myCharacters.length),
                backgroundImage: `url("characters/character_full_${personalityToId(c.name)}_default.png")`,
                backgroundSize: 'contain',
                backgroundPosition: 'center right',
                transform: `
                translate(
                  ${i * (-25 / myCharacters.length)}%, 
                  ${i * (-10 / myCharacters.length)}%
                )
                scale(
                  ${1.0 - (1.0 / myCharacters.length) * i}
                )
              `,
              }}
            />
          ))
}
      </div>
      <div className="filters">
        {['All', 'Personality', 'Buff', 'Debuff', 'Weapon', 'Companion', 'Wild', 'Trap'].map((t) => (
          <label style={t === cardFilter ? { textDecoration: 'underline' } : null}>
            <input
              style={{ display: 'none' }}
              type="radio"
              name="cardFilters"
              value={t}
              checked={t === cardFilter}
              onChange={() => setCardFilter(t)}
            />
            {t}
          </label>
        ))}
      </div>
      {allCards
        .filter((c) => (cardFilter !== 'All' ? c.type === cardFilter : true))
        .map((c) => (
          <Card
            card={c}
            equipped={myDeck.find((m) => m.id === c.id)}
            onClick={() => {
              const i = myDeck.findIndex((m) => m.id === c.id);
              if (i >= 0) {
                const newDeck = [...myDeck];
                newDeck.splice(i, 1);
                setMyDeck(newDeck);
              } else {
                setMyDeck([...myDeck, c]);
              }
            }}
            key={c.id}
          />
        ))}
    </div>
  );
}
