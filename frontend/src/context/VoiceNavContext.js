import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceNavContext = createContext(null);

const getRecognition = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  try { return new SR(); } catch { return null; }
};

export const VoiceNavProvider = ({ children }) => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const recRef = useRef(null);
  const restartTimer = useRef(null);

  const stop = () => {
    setEnabled(false);
    try { recRef.current && recRef.current.stop(); } catch {}
  };

  const start = () => {
    const rec = getRecognition();
    if (!rec) return;
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).slice(-1)[0][0].transcript.trim().toLowerCase();
      handleCommand(transcript);
    };
    rec.onend = () => {
      if (enabled) restartTimer.current = setTimeout(() => { try { rec.start(); } catch {} }, 300);
    };
    try { rec.start(); } catch {}
    recRef.current = rec;
    setEnabled(true);
  };

  useEffect(() => () => { clearTimeout(restartTimer.current); stop(); }, []);

  const handleCommand = (cmd) => {
    // Navigation
    const navMap = {
      'home': '/',
      'dashboard': '/disabled/dashboard',
      'schemes': '/disabled/dashboard/schemes',
      'wishlist': '/disabled/dashboard/wishlist',
      'jobs': '/disabled/dashboard/jobs',
      'community': '/disabled/dashboard/community',
      'profile': '/disabled/dashboard/profile',
      'messages': '/disabled/dashboard/messages',
      'login': '/disabled/login',
    };
    const goToMatch = cmd.match(/^(go to|open|navigate to)\s+(.+)$/);
    if (goToMatch) {
      const key = goToMatch[2].trim();
      const path = navMap[key];
      if (path) { navigate(path); return; }
    }

    // Scroll commands
    if (/scroll (down|up|top|bottom)/.test(cmd)) {
      const h = window.innerHeight * 0.85;
      if (cmd.includes('down')) window.scrollBy({ top: h, behavior: 'smooth' });
      else if (cmd.includes('up')) window.scrollBy({ top: -h, behavior: 'smooth' });
      else if (cmd.includes('top')) window.scrollTo({ top: 0, behavior: 'smooth' });
      else if (cmd.includes('bottom')) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }

    // History
    if (cmd === 'back') { window.history.back(); return; }
    if (cmd === 'forward') { window.history.forward(); return; }

    // Click by text/label
    const clickMatch = cmd.match(/^(click|press|select)\s+(.+)$/);
    if (clickMatch) {
      const target = clickMatch[2];
      const all = Array.from(document.querySelectorAll('button, [role="button"], a, [tabindex]'));
      const el = all.find(el => ((el.innerText || el.textContent || '').trim().toLowerCase() === target) ||
        (el.getAttribute('aria-label') || '').toLowerCase() === target);
      if (el) el.click();
      return;
    }

    // Wishlist flows
    if (/^(add|create) wishlist( item)?$/.test(cmd)) {
      const btn = Array.from(document.querySelectorAll('button, [role="button"]'))
        .find(b => /add new item/i.test(b.innerText || ''));
      if (btn) btn.click();
      return;
    }

    const setMatch = cmd.match(/^set\s+(.+?)\s+to\s+(.+)$/);
    if (setMatch) {
      const field = setMatch[1].trim().toLowerCase();
      const value = setMatch[2].trim();
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      const target = inputs.find(el => {
        const label = (el.closest('label')?.innerText || '') + ' ' + (document.querySelector(`label[for="${el.id}"]`)?.innerText || '');
        const placeholder = el.getAttribute('placeholder') || '';
        const name = el.getAttribute('name') || '';
        const merged = `${label} ${placeholder} ${name}`.toLowerCase();
        return merged.includes(field);
      });
      if (target) {
        if (target.tagName === 'SELECT') {
          const opt = Array.from(target.options).find(o => (o.text || '').toLowerCase() === value.toLowerCase());
          if (opt) { target.value = opt.value; target.dispatchEvent(new Event('change', { bubbles: true })); }
        } else {
          target.value = value;
          target.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
      return;
    }

    if (/^(submit|save|create)$/.test(cmd)) {
      const btn = Array.from(document.querySelectorAll('button, [role="button"]'))
        .find(b => /(add item|save|submit)/i.test(b.innerText || ''));
      if (btn) btn.click();
      return;
    }
  };

  const value = useMemo(() => ({ enabled, start, stop, toggle: () => (enabled ? stop() : start()) }), [enabled]);
  return (
    <VoiceNavContext.Provider value={value}>{children}</VoiceNavContext.Provider>
  );
};

export const useVoiceNav = () => {
  const ctx = useContext(VoiceNavContext);
  if (!ctx) throw new Error('useVoiceNav must be used within VoiceNavProvider');
  return ctx;
};


