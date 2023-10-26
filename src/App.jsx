import './reset.css';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import Card from './Card';
import Radio from './Radio';
import DropDown from './DropDown';
import Button from './Button';
import TextInput from './TextInput';

// Compressed decks strings seem to be longer than uncompressed ones
// import { compressUrlSafe, decompressUrlSafe } from 'urlsafe-lzma';

import {
  allCards, personalityToId, defaultCardSort,
} from './const';

const MAX_COST = 50;
const MIN_CARDS = 25;

// Big air quotes on this one. Just for sorting nicely
const cardTypeValue = {
  Personality: 0,
  Buff: 1,
  Debuff: 2,
  Weapon: 3,
  Helper: 4,
  Wild: 5,
  Trap: 6,
};

const cardSorters = {
  id: defaultCardSort,
  cost: (a, b) => a.cost - b.cost,
  type: (a, b) => (
    a.type === b.type
      ? defaultCardSort(a, b)
      : cardTypeValue[a.type] - cardTypeValue[b.type]),
  // Rarity
};

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
  const [cardSearch, setCardSearch] = useState('');
  const [cardSort, setCardSort] = useState('id');
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [successfulCopies, setSuccessfulCopies] = useState([]);

  const copyPasteRef = useRef();

  const tryToCopy = async (e) => {
    copyPasteRef.current.focus();
    copyPasteRef.current.setSelectionRange(0, window.location.href.length);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSuccessfulCopies((copies) => {
        const c = [...copies, {
          id: Date.now().toString(36), // :)
          x: e.clientX,
          y: e.clientY,
        }];
        return c;
      });
    } catch {
      // It's all good, we open the fallback option regardless
    }
  };

  const deckCost = myCards
    .reduce((acc, c) => acc + c.cost, 0);
  const deckCount = myCards
    .length;

  const deckIsEmpty = myDeck.length <= 0;

  const filteredAndSortedContentCard = allCards
    .filter((c) => (
      cardFilter !== 'All'
        ? c.type === cardFilter
        : c.type !== 'Personality'
    ))
    .filter((c) => (
      cardSearch.length > 0
        ? c.name.toLowerCase().includes(cardSearch.toLowerCase())
        : true
    ))
    .sort(cardSorters[cardSort]);

  return (
    <div className="App">
      {successfulCopies.map((s) => (
        <CopiedPopup
          key={s.id}
          event={s}
          onDone={() => {
            setSuccessfulCopies((prevState) => prevState.filter((sc) => sc !== s));
          }}
        />
      ))}
      <div className="topMenuContainer">
        <div className="topMenu">
          <div className="title">
            <img className="logo" src="./favicon.ico" alt="" />
            <span className="text">
              FvF Deck Builder
            </span>
          </div>
          <div className="costMenu">
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
          <div>
            <Button
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              label="Share"
              forceActive={shareMenuOpen}
            />
          </div>
        </div>
        <div
          className="ShareMenu"
          style={{
            transform: `translate(0%, 100%) scale(1.0, ${shareMenuOpen ? 1.0 : 0.0})`,
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="ShareCopyPastInput">Link:&nbsp;</label>
          <TextInput
            id="ShareCopyPastInput"
            ref={copyPasteRef}
            type="text"
            value={window.location.href}
            readOnly
            onClick={tryToCopy}
          />
        </div>
      </div>
      <div className={`myDeck ${deckIsEmpty ? 'hello' : ''}`}>
        {deckIsEmpty ? (
          <>
            <p style={{ fontSize: '2em' }}>
              Hey there friend!
            </p>
            <p>
              Pick some cards below to create your ultimate deck!
            </p>
            <p>
              The URL updates as you go, so copy paste at any time to
              share your build!
            </p>
          </>
        ) : null}
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
          .map((cardsOfCost, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="row" key={rowIndex}>
              {cardsOfCost.map((c) => (
                <Card
                  card={c}
                  onClick={() => {
                    const i = myDeck.findIndex((m) => m.id === c.id);
                    const newDeck = [...myDeck];
                    newDeck.splice(i, 1);
                    setMyDeck(newDeck);
                  }}
                  key={`mydeck${c.id}`}
                />
              ))}
            </div>
          ))
          .reverse()
          .flat(1)}
        {// Character art in background
          myCharacters.map((c, i) => (
            <div
              key={`charart${c.name}`}
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
        <div className="cardTypes">
          <Radio
            options={[
              { label: 'All', value: 'All', icon: null },
              { label: 'Personality', value: 'Personality', icon: 'personality_icon.png' },
              { label: 'Buff', value: 'Buff', icon: 'buff_icon.png' },
              { label: 'Debuff', value: 'Debuff', icon: 'debuff_icon.png' },
              { label: 'Weapon', value: 'Weapon', icon: 'weapon_icon.png' },
              { label: 'Helper', value: 'Helper', icon: 'helper_icon.png' },
              { label: 'Wild', value: 'Wild', icon: 'wild_icon.png' },
              { label: 'Trap', value: 'Trap', icon: 'trap_icon.png' },
            ]}
            value={cardFilter}
            onChange={setCardFilter}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Search:&nbsp;
          <TextInput
            value={cardSearch}
            onChange={setCardSearch}
            style={{ width: 'calc(100% - 5em)' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Sort:&nbsp;
          <DropDown
            options={[
              { value: 'id', label: 'ID' },
              { value: 'cost', label: 'Cost' },
              { value: 'type', label: 'Type' },
              // { value: 'rarity', label: 'Rarity' },
            ]}
            value={cardSort}
            onChange={(option) => setCardSort(option.value)}
          />
        </div>
      </div>
      <div className="content">
        {filteredAndSortedContentCard.length > 0
          ? filteredAndSortedContentCard
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
                key={`content${c.id}`}
              />
            ))
          : (
            <div className="error">
              No results for &ldquo;
              {cardSearch}
              &rdquo;
              <br />
              💔
            </div>
          )}
      </div>
      <footer>
        <div>
          <a href="https://friendsvsfriends.com">Friends vs Friends</a>
          {' '}
          is created by
          {' '}
          <a href="https://brainwashgang.com/">Brainwash Gang</a>
          {' '}
          and published by
          {' '}
          <a href="https://rawfury.com/">Raw Fury</a>
        </div>
        <br />
        <div>
          FvF-Decks is an
          {' '}
          <a href="https://github.com/KarlTheCool/fvf-decks">open-source project</a>
          {' '}
          maintained with 💔 by all its contributors
        </div>
      </footer>
    </div>
  );
}

const COPIED_POPUP_TIMEOUT = 500;
function CopiedPopup(props) {
  const { event, onDone } = props;

  const copiedRef = useRef();

  useEffect(() => {
    const me = copiedRef.current;
    me.style.transition = `opacity ${COPIED_POPUP_TIMEOUT}ms, transform ${COPIED_POPUP_TIMEOUT}ms`;
    me.style.opacity = 0.0;
    me.style.transform = 'translate(-50%, -150%)';
    setTimeout(onDone, COPIED_POPUP_TIMEOUT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden
      ref={copiedRef}
      style={{
        position: 'fixed',
        top: `${event.y}px`,
        left: `${event.x}px`,
        zIndex: 999,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      Copied!
    </div>
  );
}
