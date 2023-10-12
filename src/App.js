import './reset.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Compressed decks strings seem to be longer than uncompressed ones
// import { compressUrlSafe, decompressUrlSafe } from 'urlsafe-lzma';

import { allCards, cards, personalities } from './const.js';

const Card = (props) => {
  const { card, equipped, ...rest } = props;
  const { name, img, cost, type } = card;
  return (
    <div 
      className={`card cost${cost} ${equipped ? 'equipped' : ''}`} 
      style={{ backgroundImage: `url("fvf-decks/cards/${img}")` }} 
      title={name} 
      {...rest}
    >
      <div className="cost" style={{ backgroundImage: `url("fvf-decks/cost/card_cost_icon_${cost}.png")` }} />
      <div 
        className="level" 
        style={{ 
          backgroundImage: type === "Personality"
            ? `url("fvf-decks/level/card_lvl_10.png")`
            : `url("fvf-decks/level/card_lvl_max.png")`
        }}
      />
    </div>
  );
}

const MAX_COST = 50
const MIN_CARDS = 25

export const App = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [myDeck, setMyDeck] = useState(
    (searchParams.get("deck") || "")
      .split('.')
      .map((s) => cards.find((c) => c.id === parseInt(s, 10)))
      .filter(Boolean)
  );

  useEffect(() => {
    if (myDeck.length > 0) {
      setSearchParams({ 
        deck: myDeck
          .map((c) => c.id).join('.') 
        })
    } else {
      setSearchParams({})
    }
  }, [myDeck])

  const [catergoryFilter, setCatergoryFilter] = useState(null);
  const [sort, setSort] = useState("Cost");

  const deckCost = myDeck.reduce((acc, c) => acc + c.cost, 0)
  const deckCount = myDeck.length

  const FilterButton = (props) => {
    const { filter } = props;
    return (
      <button 
        type="button" 
        disabled={catergoryFilter === filter}
        onClick={() => setCatergoryFilter(filter)}
      >
        {filter || 'All'}
      </button>
    );
  }

  return (
    <div className="App">
      <div className="myDeck">
        {myDeck
          // .sort((a, b) => b.cost - a.cost)
          .reduce((acc, c) => {
            if (acc[c.cost]) {
              acc[c.cost].push(c)
            } else {
              acc[c.cost] = [c]
            }
            return acc
          }, [])
          .map((cardsOfCost) => (
            cardsOfCost
              .map((c) => (
                <Card 
                  card={c} 
                  onClick={() => {
                    const i = myDeck.findIndex((m) => m.id === c.id)
                    const newDeck = [...myDeck]
                    newDeck.splice(i, 1)
                    setMyDeck(newDeck)
                  }}
                  key={c.id}
                />
            ))
         ))
         .reverse()
         .map((cardsOfCost) => [...cardsOfCost, <br />])
         .flat(1)
        }
      </div>
      <div className="filters">
        <FilterButton filter={null} />
        <FilterButton filter="Buff" />
        <FilterButton filter="Debuff" />
        <FilterButton filter="Weapon" />
        <FilterButton filter="Companion" />
        <FilterButton filter="Wild" />
        <FilterButton filter="Trap" />
        <span>
          Cost: {deckCost > MAX_COST ? <b style={{ color: 'red' }}>{deckCost}</b> : deckCost}/{MAX_COST}
        </span>
        <span>
          Count: {deckCount < MIN_CARDS ? <b style={{ color: 'red' }}>{deckCount}</b> : deckCount}/{MIN_CARDS}
        </span>
      </div>
      {allCards
        .filter((c) => catergoryFilter ? c.type === catergoryFilter : true)
        .map((c) => (
          <Card 
            card={c} 
            equipped={myDeck.find((m) => m.id === c.id)}
            onClick={() => {
              const i = myDeck.findIndex((m) => m.id === c.id)
              if(i >= 0) {
                const newDeck = [...myDeck]
                newDeck.splice(i, 1)
                setMyDeck(newDeck)
              } else {
                setMyDeck([...myDeck, c])
              }
            }}
            key={c.id}
          />
      ))}
    </div>
  );
}

export default App;
