import './reset.css';
import './App.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { useSearchParams } from 'react-router-dom';
import Card from './Card';
import Radio from './Radio';
import DropDown from './DropDown';
import Button from './Button';
import TextInput from './TextInput';
import Modal from './Modal';
import NotFound from './NotFound';

// Compressed decks strings seem to be longer than uncompressed ones
// import { compressUrlSafe, decompressUrlSafe } from 'urlsafe-lzma';

import { allCards, personalityToRender, defaultCardSort } from './const';

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
  type: (a, b) =>
    a.type === b.type
      ? defaultCardSort(a, b)
      : cardTypeValue[a.type] - cardTypeValue[b.type],
  // Rarity
};

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const deckParamString = searchParams.get('deck');
  const deckParamCards = (deckParamString || '')
    .split('.')
    .map((s) => allCards.find((c) => c.id === parseInt(s, 10)))
    .filter(Boolean);

  const [myDeck, _setMyDeck] = useState(deckParamCards);
  const deckStateString = myDeck.map((c) => c.id).join('.') || null;
  // Update the useState and also the url
  const setMyDeck = useCallback(
    (d) => {
      _setMyDeck(d);
      if (d.length > 0) {
        setSearchParams({ deck: d.map((c) => c.id).join('.') || null });
      } else {
        setSearchParams({});
      }
    },
    [_setMyDeck, setSearchParams]
  );

  const myCards = myDeck.filter((c) => c.type !== 'Personality');
  const myCharacters = myDeck.filter((c) => c.type === 'Personality');

  /* eslint-disable no-unused-vars, no-undef */
  const isTestBuild = process.env.PUBLIC_URL === '';
  const isFvFHelpBuild = process.env.PUBLIC_URL === 'https://friendsvsfriends.help';
  const isItchBuild = process.env.PUBLIC_URL === '.';
  /* eslint-enable no-unused-vars, no-undef */

  // If the url doesn't match the deck, defer to the url state.
  // (Undo / redo deck when browser push / pop happens)
  useEffect(() => {
    if (deckParamString !== deckStateString) {
      _setMyDeck(deckParamCards);
    }
    // Also do some hackery to update the url
    // to filter out broken card ids.
    const deckHasInvalidCards = (deckParamString || '')
      .split('.')
      .find((s) => !allCards.find((c) => c.id === parseInt(s, 10)));
    if (deckHasInvalidCards) {
      // Not setSearchParam as this will push the state
      // We want to replace the current one to preserve the stack.
      setSearchParams({ deck: deckStateString }, { replace: true });
    }
  }, [deckParamString, deckStateString, deckParamCards, _setMyDeck, setSearchParams]);

  const [cardFilter, setCardFilter] = useState('All');
  const [cardSearch, setCardSearch] = useState('');
  const [cardSort, setCardSort] = useState('id');
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [successfulCopies, setSuccessfulCopies] = useState([]);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoadMenuOpen, setIsLoadMenuOpen] = useState(false);

  const copyPasteRef = useRef();
  const inputRef = useRef();

  /* https://stackoverflow.com/questions/67399620/how-to-make-open-url-on-click-on-button-in-reactjs */
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  /* https://medium.com/@ctrlaltmonique/how-to-create-a-custom-file-upload-button-in-react-with-typescript-b08150f1532e */
  function handleFileUpload(e) {
    const { files } = e.target;
    if (!files) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      /* process the player.log file */
      const fileContentArray = reader.result.split('\n');
      let userString;
      for (let i = 0; i < fileContentArray.length; i += 1) {
        const line = fileContentArray[i];
        if (line.trim().startsWith('===> {"code":0,"user"')) {
          userString = line;
          break;
        }
      }
      const userData = JSON.parse(userString.slice(4).trim()).user;
      const inventory = userData.cards;
      const divRoot = document.getElementById('decksHolder');
      const root = createRoot(divRoot);
      const DECKS = [];
      userData.decks.forEach((deck) => {
        const cardIds = [];
        deck.cards.forEach((card) => {
          inventory.forEach((invCard) => {
            // eslint-disable-next-line no-underscore-dangle
            if (invCard._id === card) {
              cardIds.push(invCard.cardid);
            }
          });
        });
        const madeurl = `/?deck=${cardIds.join('.')}`;
        DECKS.push({ name: deck.name, url: madeurl });
      });
      root.render(
        DECKS.map((deck) => (
          <Button
            key={deck.name}
            label={deck.name}
            style={{ margin: '8px' }}
            onClick={() => openInNewTab(deck.url)}
          />
        ))
      );
    };
    reader.readAsText(file);
  }

  function handleButtonClick(e) {
    e.preventDefault();
    if (!inputRef || !inputRef.current) return;

    inputRef.current.click();
  }

  const shareableUrl = `friendsvsfriends.help/${window.location.search}`;
  const tryToCopy = async (e) => {
    copyPasteRef.current.focus();
    copyPasteRef.current.setSelectionRange(0, shareableUrl.length);
    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText(shareableUrl);
        setSuccessfulCopies((copies) => {
          const c = [
            ...copies,
            {
              id: Date.now().toString(36), // :)
              x: e.clientX,
              y: e.clientY,
            },
          ];
          return c;
        });
      } catch (err) {
        // It's all good, we open the fallback option regardless
      }
    }, 0);
  };

  const deckCost = myCards.reduce((acc, c) => acc + c.cost, 0);
  const deckCount = myCards.length;

  const deckIsEmpty = myDeck.length <= 0;

  const filteredAndSortedContentCard = allCards
    .filter((c) =>
      cardFilter !== 'All' ? c.type === cardFilter : c.type !== 'Personality'
    )
    .filter((c) =>
      cardSearch.length > 0
        ? c.name.toLowerCase().includes(cardSearch.toLowerCase())
        : true
    )
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
            <span className="text">FvF Deck Builder</span>
          </div>
          <div className="costMenu">
            <span>
              Cost:{' '}
              {deckCost > MAX_COST ? (
                <b style={{ color: 'red' }}>{deckCost}</b>
              ) : (
                deckCost
              )}
              /{MAX_COST}
            </span>
            <span>
              Count:{' '}
              {deckCount < MIN_CARDS ? (
                <b style={{ color: 'red' }}>{deckCount}</b>
              ) : (
                deckCount
              )}
              /{MIN_CARDS}
            </span>
          </div>
          <div>
            <Button
              onClick={() => setIsResetModalOpen(!isResetModalOpen)}
              label="Reset"
            />
            <Modal
              isOpen={isResetModalOpen}
              onCancel={() => setIsResetModalOpen(false)}
              onConfirm={() => {
                setMyDeck([]);
                setIsResetModalOpen(false);
              }}
            />
            <Button
              onClick={() => {
                setShareMenuOpen(!shareMenuOpen);
                setIsLoadMenuOpen(false);
              }}
              label="Share"
              forceActive={shareMenuOpen}
            />
            <Button
              onClick={() => {
                setIsLoadMenuOpen(!isLoadMenuOpen);
                setShareMenuOpen(false);
              }}
              label="Load"
            />
          </div>
        </div>
        <div
          className="ShareMenu"
          aria-hidden={!shareMenuOpen}
          style={{
            transform: `translate(0%, 100%) scale(1.0, ${shareMenuOpen ? 1.0 : 0.0})`,
          }}>
          <div className="ShareContainer">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="ShareCopyPastInput">Link:&nbsp;</label>
            <TextInput
              id="ShareCopyPastInput"
              ref={copyPasteRef}
              type="text"
              value={`friendsvsfriends.help/${window.location.search}`}
              readOnly
              onClick={tryToCopy}
            />
          </div>
        </div>
        <div
          className="LoadMenu"
          aria-hidden={!isLoadMenuOpen}
          style={{
            transform: `translate(0%, 100%) scale(1.0, ${isLoadMenuOpen ? 1.0 : 0.0})`,
          }}>
          <div className="LoadContainer">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <Button onClick={(e) => handleButtonClick(e)} label="Upload Player.log" />
            <input
              ref={inputRef}
              type="file"
              id="fileInput"
              hidden
              onChange={(e) => handleFileUpload(e)}
            />
            <div id="decksHolder" />
          </div>
          {/* eslint-disable-next-line react/style-prop-object */}
          <div style={{ marginTop: '0.5rem' }}>
            <span>
              Located in: /Users/
              <span style={{ fontStyle: 'italic', opacity: 0.5 }}>your name</span>
              /AppData/LocalLow/Brainwash Gang/Friends vs Friends/player.log
            </span>
          </div>
        </div>
      </div>
      <div className={`myDeck ${deckIsEmpty ? 'hello' : ''}`}>
        {deckIsEmpty ? (
          <>
            <p style={{ fontSize: '2em' }}>Hey there friend!</p>
            <p>Pick some cards below to create your ultimate deck!</p>
            {isItchBuild ? null : (
              <p>
                The URL updates as you go, so click share and click the link to share your
                build!
              </p>
            )}
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
        {
          // Character art in background
          myCharacters.map((c, i) => (
            <div
              key={`charart${c.name}`}
              className="characterArt"
              style={{
                zIndex: (i + 1) * -1,
                // opacity: (myCharacters.length - i) * (0.75 / myCharacters.length),
                backgroundImage: `url("${personalityToRender(c.name)}")`,
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
              {
                label: 'Personality',
                value: 'Personality',
                icon: 'personality_icon.png',
              },
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
        {filteredAndSortedContentCard.length > 0 ? (
          filteredAndSortedContentCard.map((c) => (
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
        ) : (
          <NotFound cardSearch={cardSearch} />
        )}
      </div>
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
    </div>
  );
}

const COPIED_POPUP_TIMEOUT = 500;
function CopiedPopup(props) {
  const { event, onDone } = props;

  const copiedRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      const me = copiedRef.current;
      me.style.opacity = 0.0;
      me.style.transform = 'translate(-50%, -150%)';
      setTimeout(onDone, COPIED_POPUP_TIMEOUT);
    }, 100);
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
        opacity: 1.0,
        transition: `opacity ${COPIED_POPUP_TIMEOUT}ms, transform ${COPIED_POPUP_TIMEOUT}ms`,
      }}>
      Copied!
    </div>
  );
}
