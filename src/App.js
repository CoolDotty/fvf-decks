import './reset.css';
import './App.css';
import React, { useState } from 'react';

import { allCards, cards, personalities } from './const.js';

const Card = (props) => {
  const { card } = props;
  const { name, img, cost } = card;
  return (
    <div className={`card cost${cost}`} style={{ backgroundImage: `url("fvf-decks/cards/${img}")` }} title={name}>
      <div className="cost" style={{ backgroundImage: `url("fvf-decks/cost/card_cost_icon_${cost}.png")` }} />
    </div>
  );
}

const MAX_COST = 50
const MIN_CARDS = 25

export const App = () => {

  const [myDeck, setMyDeck] = useState([]);

  const deckCost = myDeck.reduce((acc, c) => acc + c.cost, 0)
  const deckCount = myDeck.length

  return (
    <div className="App">
      {allCards.map((c) => <Card card={c} key={c.id} />)}
    </div>
  );
}

export default App;
