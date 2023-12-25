import React, { useState, useRef, useMemo } from 'react';
import './styles.css';

// Snow comes from: https://codepen.io/tutsplus/pen/BaVqjvg

const date = new Date();
// Compare days by date only, not considering hours, minutes, etc
date.setHours(0, 0, 0, 0);
// months are 0 indexed
const december1 = new Date(date.getFullYear(), 11, 1);
const december25 = new Date(date.getFullYear(), 11, 25);

const snowContent = [<>&#10052;</>, <>&#10053;</>, <>&#10054;</>];

const random = (num) => Math.floor(Math.random() * num);

function HolidayFX() {
  const snowContainer = useRef();
  const [isSnowing] = useState(date >= december1 && date <= december25);

  const flakes = useMemo(() => [...Array(100)].map((_, i) => (
    <div
      // eslint-disable-next-line react/no-array-index-key
      key={i}
      className="snow"
      style={{
        top: `-${random(100)}%`,
        left: `${random(100)}%`,
        fontSize: `${random(10) + 10}px`,
        animationDuration: `${random(25) + 25}s`,
      }}
    >
      {snowContent[random(3)]}
    </div>
  )), []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isSnowing ? (
        <div ref={snowContainer} id="snowContainer">
          {flakes}
        </div>
      ) : null}
    </>
  );
}

export default HolidayFX;
