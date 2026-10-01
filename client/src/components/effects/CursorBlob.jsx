import { useEffect, useRef } from 'react';

export const CursorBlob = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target;
      if (t && t.closest && t.closest('a, button, input, textarea, select, [data-cursor-hover]')) {
        el.classList.add('is-hover');
      } else {
        el.classList.remove('is-hover');
      }
    };

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-blob" aria-hidden="true" />;
};
