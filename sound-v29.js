/* Original procedural effects. No downloads, microphone, music, or game-save writes. */
(function (root) {
'use strict';
const PREF_KEY = 'bens-burgers.audio.v1';
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
function preferences(storage) {
  try {
    const p = JSON.parse(storage?.getItem(PREF_KEY) || 'null');
    return { enabled: p?.enabled !== false, volume: Number.isFinite(p?.volume) ? clamp(p.volume, 0, 1) : .45 };
  } catch (_) { return { enabled: true, volume: .45 }; }
}
function actionCue(action, result, detail = {}) {
  if (!result) return null;
  if (!result.ok) return 'error';
  if (action === 'ingredient') return /^raw/.test(detail.id) ? 'select' : detail.id === 'sauce' ? 'sauce' : detail.id === 'topBun' ? 'cap' : 'place';
  if (action === 'grill') return detail.occupied ? 'place' : 'grillDrop';
  if (action === 'fries' || action === 'drink') return detail.occupied ? 'collect' : action === 'fries' ? 'basket' : 'cup';
  return ({ serve: 'serve', buy: 'purchase', undo: 'undo', customer: 'select' })[action] || null;
}
class SoundEngine {
  constructor({ storage = null, contextFactory = null, hidden = () => false } = {}) {
    Object.assign(this, preferences(storage));
    this.storage = storage; this.contextFactory = contextFactory; this.hidden = hidden;
    this.ctx = null; this.voices = new Set(); this.loops = new Map(); this.last = new Map();
    this.notice = ''; this.onchange = () => {}; this.failed = false;
  }
  persist() {
    try { this.storage?.setItem(PREF_KEY, JSON.stringify({ enabled: this.enabled, volume: this.volume })); }
    catch (_) { this.notice = 'Sound settings cannot be saved in this browser.'; }
    this.onchange();
  }
  ensure() {
    if (this.ctx && this.ctx.state !== 'closed') return true;
    try {
      const Factory = this.contextFactory || (() => {
        const C = root.AudioContext || root.webkitAudioContext;
        if (!C) throw new Error('Audio unavailable');
        return new C({ latencyHint: 'interactive' });
      });
      this.ctx = Factory();
      this.master = this.ctx.createGain(); this.master.gain.value = this.volume * .65;
      this.ambience = this.ctx.createGain(); this.ambience.gain.value = 1;
      this.ambience.connect(this.master); this.master.connect(this.ctx.destination);
      this.noise = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 2), this.ctx.sampleRate);
      const data = this.noise.getChannelData(0); let seed = 2941;
      for (let i = 0; i < data.length; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const white = seed / 2147483648 - 1;
        data[i] = white * (.35 + .3 * Math.sin(i / this.ctx.sampleRate * 31) ** 2);
      }
      this.ctx.addEventListener?.('statechange', () => {
        if (this.ctx.state !== 'running') this.stopAll();
        this.onchange();
      });
      return true;
    } catch (_) { this.failed = true; this.notice = 'Audio is unavailable here. The game still works silently.'; this.onchange(); return false; }
  }
  // Only called directly from user input; no automatic audio on page load.
  unlock() {
    if (!this.enabled || this.hidden() || !this.ensure()) return;
    if (this.ctx.state !== 'running' && this.ctx.resume) {
      try {
        const attempt = this.ctx.resume();
        Promise.resolve(attempt).then(() => this.onchange()).catch(() => {
          this.notice = 'Tap the sound button to retry audio.'; this.onchange();
        });
      } catch (_) { this.notice = 'Tap the sound button to retry audio.'; this.onchange(); }
    }
    this.onchange();
  }
  audible() { return this.enabled && this.volume > 0 && !this.hidden() && this.ctx?.state === 'running'; }
  setEnabled(value) {
    this.enabled = !!value;
    if (!this.enabled) this.stopAll(); else this.unlock();
    this.persist();
  }
  setVolume(value) {
    if (!Number.isFinite(Number(value))) return;
    this.volume = clamp(Number(value), 0, 1);
    if (!this.volume) this.stopAll();
    if (this.master) { const t = this.ctx.currentTime; this.master.gain.cancelScheduledValues(t); this.master.gain.setTargetAtTime(this.volume * .65, t, .015); }
    this.persist();
  }
  track(sources, nodes, endTime = null) {
    const entry = { sources, nodes, stopped: false };
    this.voices.add(entry);
    sources[0].onended = () => {
      nodes.forEach(n => { try { n.disconnect(); } catch (_) {} });
      this.voices.delete(entry);
    };
    if (endTime !== null) sources.forEach(s => s.stop(endTime));
    return entry;
  }
  stop(entry) {
    if (!entry || entry.stopped) return;
    entry.stopped = true;
    entry.sources.forEach(s => { try { s.stop(); } catch (_) {} });
    entry.nodes.forEach(n => { try { n.disconnect(); } catch (_) {} });
    this.voices.delete(entry);
  }
  stopAll() { for (const v of [...this.voices]) this.stop(v); this.loops.clear(); }
  silenceForPage() {
    this.stopAll();
    try { this.ctx?.suspend?.().catch(() => {}); } catch (_) {}
  }
  tone(hz, delay = 0, duration = .22, level = .13, endHz = hz, type = 'sine') {
    if (!this.audible() || this.voices.size >= 48) return;
    const c = this.ctx, t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(hz, t); o.frequency.exponentialRampToValueAtTime(Math.max(30, endHz), t + duration);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + .007); g.gain.exponentialRampToValueAtTime(.0001, t + duration);
    o.connect(g); g.connect(this.master); o.start(t); this.track([o], [o, g], t + duration + .015);
  }
  burst(hz = 1200, duration = .13, level = .18, delay = 0) {
    if (!this.audible() || this.voices.size >= 48) return;
    const c = this.ctx, t = c.currentTime + delay, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.noise; f.type = 'bandpass'; f.frequency.value = hz; f.Q.value = .7;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + .009); g.gain.exponentialRampToValueAtTime(.0001, t + duration);
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t); this.track([s], [s, f, g], t + duration + .015);
  }
  play(name) {
    if (!this.audible()) return false;
    const t = this.ctx.currentTime, gap = name === 'error' ? .3 : name === 'ready' ? .25 : .075;
    if (t - (this.last.get(name) ?? -99) < gap) return false;
    this.last.set(name, t);
    switch (name) {
      case 'select': this.tone(520, 0, .055, .06, 650, 'triangle'); break;
      case 'place': this.tone(220, 0, .10, .17, 85); this.burst(800, .09, .12); break;
      case 'cap': this.tone(170, 0, .15, .19, 60); this.burst(750, .14, .15); break;
      case 'sauce': this.tone(380, 0, .16, .10, 140); this.burst(1000, .20, .14); break;
      case 'grillDrop': this.burst(3000, .36, .36); this.tone(155, 0, .12, .12, 75); break;
      case 'basket': this.burst(2200, .13, .14); this.tone(440, 0, .09, .08, 390); break;
      case 'cup': this.tone(660, 0, .07, .08, 420); this.burst(1600, .08, .07); break;
      case 'collect': this.tone(620, 0, .12, .09); this.tone(830, .08, .17, .09); break;
      case 'ready': this.tone(880, 0, .42, .15); this.tone(1320, .035, .3, .045); break;
      case 'arrival': this.tone(660, 0, .20, .07); this.tone(880, .12, .26, .07); break;
      case 'serve': this.burst(2600, .07, .13); [740, 988, 1480].forEach((n, i) => this.tone(n, .05 + i * .09, .27, .10)); break;
      case 'purchase': [523, 659, 784].forEach((n, i) => this.tone(n, i * .10, .25, .10)); break;
      case 'shift': [523, 659, 784, 1047].forEach((n, i) => this.tone(n, i * .11, .32, .10)); break;
      case 'burn': this.tone(390, 0, .13, .08, 300); this.tone(300, .18, .14, .08, 250); break;
      case 'undo': this.burst(900, .1, .09); break;
      case 'error': this.tone(180, 0, .10, .065, 130); break;
      default: return false;
    }
    // Briefly lower kitchen noise beneath the informational chimes.
    if (['ready', 'serve', 'purchase', 'arrival', 'shift'].includes(name)) {
      const g = this.ambience.gain;
      g.cancelScheduledValues(t); g.setValueAtTime(.36, t); g.setTargetAtTime(1, t + .4, .18);
    }
    return true;
  }
  setLoops(wanted) {
    if (!this.audible()) wanted = {};
    for (const [key, v] of this.loops) if (!wanted[key]) { this.stop(v); this.loops.delete(key); }
    for (const [key, amount] of Object.entries(wanted)) {
      if (!amount) continue;
      const level = clamp(amount, 0, 1);
      if (this.loops.has(key)) { this.loops.get(key).gain.gain.setTargetAtTime(level * .18, this.ctx.currentTime, .08); continue; }
      const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), depth = c.createGain();
      s.buffer = this.noise; s.loop = true; f.type = 'bandpass'; f.Q.value = .65;
      f.frequency.value = key === 'grill' ? 2700 : key === 'fryer' ? 950 : 1500;
      g.gain.value = level * .18; lfo.frequency.value = key === 'grill' ? 8 : key === 'fryer' ? 6 : 13;
      depth.gain.value = .015; lfo.connect(depth); depth.connect(g.gain);
      s.connect(f); f.connect(g); g.connect(this.ambience); s.start(); lfo.start();
      const v = this.track([s, lfo], [s, f, g, lfo, depth]); v.gain = g; this.loops.set(key, v);
    }
  }
}
function snapshot(game) {
  return {
    paused: !!game.paused, phase: game.phase,
    grills: game.grills.map(g => g ? game.stage(g) : 'empty'),
    jobs: Object.fromEntries(['fries', 'drink'].map(k => [k, game.jobs[k] ? { id: game.jobs[k].orderId, ready: game.jobs[k].elapsed >= game.jobs[k].duration } : null])),
    orders: game.orders.map(o => ({ id: o.id, arrived: o.arrivalLeft <= 0 })),
    activeArriving: (game.active?.arrivalLeft || 0) > 0
  };
}
function transitions(prev, next) {
  const effects = [], loops = {};
  const running = !next.paused && next.phase === 'playing';
  if (running && !next.activeArriving) {
    const cooking = next.grills.filter(s => s === 'raw' || s === 'cooking').length;
    const ready = next.grills.filter(s => s === 'ready').length;
    if (cooking || ready) loops.grill = Math.min(1, cooking * .6 + ready * .15);
    if (next.jobs.fries && !next.jobs.fries.ready) loops.fryer = .65;
    if (next.jobs.drink && !next.jobs.drink.ready) loops.drink = .65;
  }
  if (prev && running && !prev.paused) {
    next.grills.forEach((s, i) => {
      if (s === 'ready' && ['raw', 'cooking'].includes(prev.grills[i])) effects.push('ready');
      if (s === 'burned' && prev.grills[i] !== 'burned' && prev.grills[i] !== 'empty') effects.push('burn');
    });
    for (const k of ['fries', 'drink']) if (next.jobs[k]?.ready && prev.jobs[k] && !prev.jobs[k].ready && prev.jobs[k].id === next.jobs[k].id) effects.push('ready');
    if (next.orders.some(o => o.arrived && prev.orders.some(p => p.id === o.id && !p.arrived))) effects.push('arrival');
  }
  return { effects: [...new Set(effects)], loops };
}
class SoundDirector {
  constructor(engine) { this.engine = engine; this.previous = null; }
  sync(game) {
    const next = snapshot(game), result = transitions(this.previous, next);
    if (next.paused && !this.previous?.paused) this.engine.stopAll();
    this.engine.setLoops(result.loops);
    for (const cue of result.effects) this.engine.play(cue);
    // Advance even while muted, so restoring audio cannot replay old notifications.
    this.previous = next;
  }
  action(action, result, detail) { const cue = actionCue(action, result, detail); if (cue) this.engine.play(cue); }
  pause() { this.engine.stopAll(); if (this.previous) this.previous.paused = true; }
}
const api = { SoundEngine, SoundDirector, actionCue, preferences, transitions, snapshot, PREF_KEY };
if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }
let storage = null; try { storage = root.localStorage; } catch (_) {}
const engine = new SoundEngine({ storage, hidden: () => document.hidden });
root.BBSound = new SoundDirector(engine);
const refresh = () => {
  const on = engine.enabled && engine.volume > 0;
  const main = document.getElementById('soundBtn'), toggle = document.getElementById('soundToggle');
  for (const b of [main, toggle]) if (b) { b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? 'Mute sound effects' : 'Enable sound effects'); }
  if (main) { main.dataset.muted = String(!on); main.title = on ? 'Mute sound (volume in Pause)' : 'Turn sound on'; }
  if (toggle) toggle.textContent = on ? 'SOUND ON' : 'SOUND OFF';
  const slider = document.getElementById('soundVolume');
  if (slider) { slider.value = Math.round(engine.volume * 100); slider.setAttribute('aria-valuetext', slider.value + ' percent'); }
  const output = document.getElementById('soundVolumeValue'); if (output) output.textContent = Math.round(engine.volume * 100) + '%';
  const note = document.getElementById('soundNote'); if (note) note.textContent = engine.notice || 'Gentle effects only. No background music.';
};
engine.onchange = refresh;
const toggle = () => {
  if (engine.enabled && engine.volume > 0) engine.setEnabled(false);
  else { if (!engine.volume) engine.setVolume(.45); engine.setEnabled(true); engine.play('select'); }
};
document.getElementById('soundBtn')?.addEventListener('click', toggle);
document.getElementById('soundToggle')?.addEventListener('click', toggle);
document.getElementById('soundVolume')?.addEventListener('input', e => { engine.setVolume(Number(e.target.value) / 100); });
document.getElementById('soundVolume')?.addEventListener('change', () => { engine.unlock(); engine.play('ready'); });
document.addEventListener('click', () => engine.unlock(), { capture: true });
document.addEventListener('keydown', e => { if (['Enter', ' ', 'ArrowLeft', 'ArrowRight'].includes(e.key)) engine.unlock(); }, { capture: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) engine.silenceForPage(); });
root.addEventListener('pagehide', () => engine.silenceForPage());
root.addEventListener('storage', e => {
  if (e.key !== PREF_KEY) return;
  Object.assign(engine, preferences(storage));
  if (engine.master) engine.master.gain.setTargetAtTime(engine.volume * .65, engine.ctx.currentTime, .015);
  if (!engine.enabled || !engine.volume) engine.stopAll(); refresh();
});
Object.defineProperty(root, 'bbAudioState', { get: () => ({ enabled: engine.enabled, volume: engine.volume, state: engine.ctx?.state || 'not-started', loops: [...engine.loops.keys()], voices: engine.voices.size }) });
refresh();
})(globalThis);
