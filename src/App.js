import './reset.css';
import './App.css';
import React, { useState } from 'react';
import { REPO_NAME } from './index.js';

const cards = [
  "Card_0001_bake.png", "Card_0010_bake.png", "Card_0019_bake.png", "Card_0028_bake.png", "Card_0038_bake.png", "Card_0051_bake.png", "Card_0064_bake.png", "Card_0078_bake.png", "Card_0096_bake.png", "Card_0114_bake.png", "Card_1005_bake.png",
  "Card_0002_bake.png", "Card_0011_bake.png", "Card_0020_bake.png", "Card_0030_bake.png", "Card_0041_bake.png", "Card_0056_bake.png", "Card_0067_bake.png", "Card_0083_bake.png", "Card_0098_bake.png", "Card_0124_bake.png", "Card_1006_bake.png",
  "Card_0003_bake.png", "Card_0012_bake.png", "Card_0021_bake.png", "Card_0031_bake.png", "Card_0042_bake.png", "Card_0057_bake.png", "Card_0068_bake.png", "Card_0085_bake.png", "Card_0099_bake.png", "Card_0127_bake.png", "Card_1007_bake.png",
  "Card_0004_bake.png", "Card_0013_bake.png", "Card_0022_bake.png", "Card_0032_bake.png", "Card_0044_bake.png", "Card_0058_bake.png", "Card_0069_bake.png", "Card_0086_bake.png", "Card_0100_bake.png", "Card_0128_bake.png", "Card_1010_bake.png",
  "Card_0005_bake.png", "Card_0014_bake.png", "Card_0023_bake.png", "Card_0033_bake.png", "Card_0046_bake.png", "Card_0059_bake.png", "Card_0070_bake.png", "Card_0088_bake.png", "Card_0102_bake.png", "Card_0137_bake.png", "Card_1011_bake.png",
  "Card_0006_bake.png", "Card_0015_bake.png", "Card_0024_bake.png", "Card_0034_bake.png", "Card_0047_bake.png", "Card_0060_bake.png", "Card_0071_bake.png", "Card_0090_bake.png", "Card_0104_bake.png", "Card_1001_bake.png", "Card_1013_bake.png",
  "Card_0007_bake.png", "Card_0016_bake.png", "Card_0025_bake.png", "Card_0035_bake.png", "Card_0048_bake.png", "Card_0061_bake.png", "Card_0072_bake.png", "Card_0091_bake.png", "Card_0109_bake.png"
]

const personalities = [
  "Card_1002_bake.png", "Card_1014_bake.png",
  "Card_0008_bake.png", "Card_0017_bake.png", "Card_0026_bake.png", "Card_0036_bake.png", "Card_0049_bake.png", "Card_0062_bake.png", "Card_0074_bake.png", "Card_0092_bake.png", "Card_0111_bake.png", "Card_1003_bake.png",
  "Card_0009_bake.png", "Card_0018_bake.png", "Card_0027_bake.png", "Card_0037_bake.png", "Card_0050_bake.png", "Card_0063_bake.png", "Card_0075_bake.png", "Card_0094_bake.png", "Card_0113_bake.png", "Card_1004_bake.png"
]

export const App = () => {

  const [deck, setDeck] = useState([]);

  console.log(REPO_NAME)

  return (
    <div className="App">
      {cards.map((c) => <img src={`/${REPO_NAME}/cards/${cards}`} />)}
    </div>
  );
}

export default App;
