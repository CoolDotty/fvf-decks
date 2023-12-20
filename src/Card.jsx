import './reset.css';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';

import './Card.css';

// https://github.com/heyitsarpit/react-hooks-library/blob/main/packages/core/useHover/index.ts
const useHover = (ref) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return () => {};

    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [ref]);

  return isHovered;
};

export default function Card(props) {
  const { card, equipped, ...rest } = props;
  const {
    name, img, cost, type,
  } = card;

  const containerRef = useRef();
  const contentRef = useRef();

  const isHovered = useHover(containerRef);

  useEffect(() => {
    // https://codepen.io/kevinpowell/pen/GRBdLEv
    const container = containerRef.current;
    const content = contentRef.current;

    const onMouseMove = (e) => {
      if (!isHovered) return;
      // get mouse position
      // relative to card
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // find the middle
      const middleX = container.offsetWidth / 2;
      const middleY = container.offsetHeight / 2;

      // get offset from middle as a percentage
      // and tone it down a little
      const offsetX = ((x - middleX) / middleX) * 9;
      const offsetY = ((y - middleY) / middleY) * 9;

      // set rotation
      content.style.setProperty('--rotateX', `${offsetX}deg`);
      content.style.setProperty('--rotateY', `${-1 * offsetY}deg`);
    };

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      // reset to no roation on exit
      content.style = '';
      content.style = '';
    };
  }, [isHovered]);

  return (
    <div className="cardContainer" ref={containerRef} {...rest}>
      <div className={`card ${equipped ? 'equipped' : ''}`} title={name} ref={contentRef}>
        <div
          className={`cardContent cost${cost}`}
          style={{ backgroundImage: `url("cards/${img}")` }}
        >
          <div
            className="cost"
            style={{
              backgroundImage: `url("cost/card_cost_icon_${cost}.png")`,
            }}
          />
          <div
            className="level"
            style={{
              backgroundImage:
                type === 'Personality'
                  ? 'url("level/card_lvl_10.png")'
                  : 'url("level/card_lvl_max.png")',
            }}
          />
        </div>
      </div>
    </div>
  );
}
