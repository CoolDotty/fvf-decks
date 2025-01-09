import React from 'react';
import { createRoot } from 'react-dom/client';
import Button from '../Button';
import TextInput from '../TextInput';
import Modal from '../Modal';

import './styles.css';

const MAX_COST = 50;
const MIN_CARDS = 25;

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

export default function TopBar({
  deckCost,
  deckCount,
  isResetModalOpen,
  setIsResetModalOpen,
  setMyDeck,
  shareMenuOpen,
  setShareMenuOpen,
  isLoadMenuOpen,
  setIsLoadMenuOpen,
  copyPasteRef,
  inputRef,
  tryToCopy,
}) {
  const handleButtonClick = (e) => {
    e.preventDefault();
    if (!inputRef || !inputRef.current) return;

    inputRef.current.click();
  };

  return (
    <div className="topMenuContainer">
      <div className="topMenu">
        <div className="title">
          <img className="logo" src="./favicon.ico" alt="" />
          <span className="text">FvF Deck Builder</span>
        </div>
        <div className="costMenu">
          <span>
            Cost:{' '}
            {deckCost > MAX_COST ? <b style={{ color: 'red' }}>{deckCost}</b> : deckCost}/
            {MAX_COST}
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
          <Button onClick={() => setIsResetModalOpen(!isResetModalOpen)} label="Reset" />
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
  );
}
