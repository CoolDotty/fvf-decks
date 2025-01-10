import { useState, useEffect } from 'react';

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

export default useHover;
