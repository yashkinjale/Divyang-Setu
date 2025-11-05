import React, { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react';

const ScreenReaderContext = createContext(null);

export const ScreenReaderProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  const liveRef = useRef(null);

  const speak = (text, options = {}) => {
    if (!enabled || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(String(text));
      utter.rate = options.rate ?? 1;
      utter.pitch = options.pitch ?? 1;
      utter.lang = options.lang ?? 'en-US';
      window.speechSynthesis.speak(utter);
    } catch {}
  };

  const announce = (message) => {
    if (!enabled || !liveRef.current) return;
    liveRef.current.textContent = '';
    // Allow DOM to flush so screen readers re-announce
    setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = message;
      speak(message);
    }, 50);
  };

  // NOTE: We intentionally only announce focus/route changes to avoid overwhelming users

  useEffect(() => {
    if (!enabled) return;
    const onFocus = (e) => {
      const el = e.target;
      if (!el) return;
      const label = el.getAttribute?.('aria-label') || el.getAttribute?.('aria-labelledby') || el.placeholder || el.alt || el.innerText || el.textContent || '';
      const value = (el.value && typeof el.value === 'string') ? ` ${el.value}` : '';
      const msg = String(label).trim().slice(0, 180) + value;
      if (msg) speak(msg);
    };
    document.addEventListener('focusin', onFocus);
    return () => document.removeEventListener('focusin', onFocus);
  }, [enabled]);

  const value = useMemo(() => ({ enabled, setEnabled, toggle: () => setEnabled(v => !v), speak, announce }), [enabled]);

  return (
    <ScreenReaderContext.Provider value={value}>
      {children}
      <div ref={liveRef} aria-live="assertive" aria-atomic="true" style={{ position: 'fixed', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)', clipPath: 'inset(50%)' }} />
    </ScreenReaderContext.Provider>
  );
};

export const useScreenReader = () => {
  const ctx = useContext(ScreenReaderContext);
  if (!ctx) throw new Error('useScreenReader must be used within ScreenReaderProvider');
  return ctx;
};


