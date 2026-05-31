"use client";

/**
 * Brainsty concierge experience — the prototype's AI2UI design, mobile-first,
 * powered by the grounded Aetna + UHealth dataset and rendered through the
 * official @a2ui/react framework.
 *
 * - Known intents (menu / chip / choice taps) resolve INSTANTLY from the pure
 *   dataset (no network, no LLM).
 * - Free-text questions take a keyword fast-path; otherwise Gemini classifies the
 *   intent + writes a short reply. Cards always come from the dataset.
 * - Two layouts: Chat (conversational cards) and Guided (UI-led wizard).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/context/language-context';
import { T } from './design/tokens';
import { Logo, Icon, Say, Typing, ActionChip, Sparkline } from './design/primitives';
import { ConciergeCanvas } from './design/canvas-host';
import { respond, type CanvasData, type Chip } from '@/ai/concierge/dataset';
import { assembleCanvas } from '@/ai/concierge/assembler';
import { conciergeClassify } from '@/ai/flows/concierge-classify';

interface Turn {
  role: 'user' | 'ai';
  text?: string;
  say?: string;
  canvas?: CanvasData | null;
}

// Keyword fast-path: typed text -> intent, before any LLM call. Kept CONSERVATIVE
// and healthcare-specific so off-topic questions fall through to the LLM (which
// then answers them with a short gist via the `general` intent).
const KW: [RegExp, string][] = [
  [/\bmri\b|ct scan|imaging/i, 'cost_mri'],
  [/procedure cost|cost of|price of|how much (is|does|for|would)/i, 'estimate_cost'],
  [/deductible|out.?of.?pocket|\boop\b/i, 'deductible'],
  [/\bbill\b|dispute|overcharg|\beob\b/i, 'dispute_bill'],
  [/in.?network|find (a |an )?(doctor|provider|specialist)|cardiolog|dermatolog|orthoped|primary care/i, 'find_provider'],
  [/compare (price|facilit|cost)|cheaper|where.*(cheaper|less|best price)/i, 'compare_price'],
  [/(switch|pick|choose|change).*plan|hdhp|\bppo\b|premium/i, 'pick_plan'],
  [/coinsurance|\bcopay\b|out.?of.?pocket max/i, 'explain_term'],
];
function routeText(s: string): string | null {
  for (const [re, it] of KW) if (re.test(s)) return it;
  return null;
}

// ── state machine: instant for intents, LLM only for free text ───────
function useConcierge() {
  const { language } = useLanguage();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [chips, setChips] = useState<Chip[]>([]);
  const [canvas, setCanvas] = useState<CanvasData | null>(null);
  const started = useRef(false);

  const act = useCallback((intent: string) => {
    const r = respond(intent);
    setChips([]);
    if (r.userEcho) setTurns((t) => [...t, { role: 'user', text: r.userEcho! }]);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setTurns((t) => [...t, { role: 'ai', say: r.say, canvas: r.canvas }]);
      setCanvas(r.canvas);
      setChips(r.chips || []);
    }, r.sayDelay || 480);
  }, []);

  const ask = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q) return;
      setTurns((t) => [...t, { role: 'user', text: q }]);
      setChips([]);
      setBusy(true);

      const kw = routeText(q);
      let intent = kw ?? 'menu';
      let say: string | undefined;
      if (!kw) {
        try {
          const out = await conciergeClassify({ query: q, language });
          intent = out.intent;
          say = out.say;
        } catch {
          intent = 'menu';
        }
      }
      const r = respond(intent);
      setBusy(false);
      setTurns((t) => [...t, { role: 'ai', say: say || r.say, canvas: r.canvas }]);
      setCanvas(r.canvas);
      setChips(r.chips || []);
    },
    [language]
  );

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const r = respond('start');
    setTurns([{ role: 'ai', say: r.say, canvas: r.canvas }]);
    setChips(r.chips || []);
    setCanvas(r.canvas);
  }, []);

  return { turns, busy, chips, canvas, act, ask };
}

// Always pin to the newest message — re-scrolls on the next frame and again
// after a short delay so late-laid-out A2UI cards don't leave us mid-thread.
function useStickToBottom(deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const toBottom = () => { el.scrollTop = el.scrollHeight; };
    toBottom();
    const raf = requestAnimationFrame(toBottom);
    const t = setTimeout(toBottom, 140);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

// ── A2UI canvas dispatcher (the rich block, via official A2UI) ───────
function Block({ canvas, on }: { canvas: CanvasData | null | undefined; on: (i: string) => void }) {
  if (!canvas) return null;
  return <ConciergeCanvas messages={assembleCanvas(canvas)} onAction={on} />;
}

// ── chrome ───────────────────────────────────────────────────────────
function Header({
  variant,
  setVariant,
  onRestart,
}: {
  variant: 'chat' | 'guided';
  setVariant: (v: 'chat' | 'guided') => void;
  onRestart: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 12px', flexShrink: 0 }}>
      <Logo size={34} glow />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, letterSpacing: -0.2, display: 'flex', alignItems: 'center', gap: 6 }}>
          Wefella
          <span style={{ width: 7, height: 7, borderRadius: 9, background: T.good, boxShadow: '0 0 0 3px ' + T.tealSoft }} />
        </div>
        <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>Aetna · UHealth Miami · independent</div>
      </div>
      <div style={{ display: 'flex', background: T.sunk, border: `1px solid ${T.line}`, borderRadius: 999, padding: 2 }}>
        {(['chat', 'guided'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            style={{
              all: 'unset', cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
              padding: '5px 10px', borderRadius: 999, textTransform: 'capitalize',
              color: variant === v ? '#fff' : T.ink2,
              background: variant === v ? T.grad : 'transparent',
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <button onClick={onRestart} title="Restart" aria-label="Restart"
        style={{ all: 'unset', cursor: 'pointer', width: 34, height: 34, borderRadius: 999, background: T.sunk, display: 'grid', placeItems: 'center', border: `1px solid ${T.line}` }}>
        <Icon name="arrow" size={16} color={T.ink2} />
      </button>
    </div>
  );
}

function ChipRow({ chips, on, label = 'Suggested next' }: { chips: Chip[]; on: (i: string) => void; label?: string }) {
  if (!chips.length) return null;
  return (
    <div style={{ flexShrink: 0, animation: 'bsRise .3s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px 6px' }}>
        <Sparkline />
        <span style={{ fontSize: 10.5, color: T.ink3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
      </div>
      <div className="bs-scroll" style={{ display: 'flex', gap: 8, padding: '0 16px 4px', overflowX: 'auto' }}>
        {chips.map((c, i) => (
          <ActionChip key={i} label={c.label} icon={c.icon} primary={c.primary} onClick={() => on(c.intent)} />
        ))}
      </div>
    </div>
  );
}

function InputBar({ on, dark = false, busy }: { on: (t: string) => void; dark?: boolean; busy?: boolean }) {
  const [v, setV] = useState('');
  const submit = () => {
    if (!v.trim() || busy) return;
    on(v);
    setV('');
  };
  return (
    <div style={{ flexShrink: 0, padding: '8px 14px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: dark ? 'rgba(255,255,255,.1)' : T.surface,
        border: `1px solid ${dark ? 'rgba(255,255,255,.16)' : T.line2}`, borderRadius: 999, padding: '6px 6px 6px 14px', boxShadow: dark ? 'none' : T.shadowSm }}>
        <Icon name="clip" size={18} color={dark ? 'rgba(255,255,255,.6)' : T.ink3} />
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Ask Wefella anything…"
          style={{ all: 'unset', flex: 1, fontFamily: T.font, fontSize: 14, color: dark ? '#fff' : T.ink, padding: '4px 0' }}
        />
        <button onClick={submit} disabled={busy}
          style={{ all: 'unset', cursor: busy ? 'default' : 'pointer', width: 34, height: 34, borderRadius: 999, opacity: busy ? 0.5 : 1,
            background: T.grad, display: 'grid', placeItems: 'center', boxShadow: '0 4px 10px rgba(80,72,229,.35)' }}>
          <Icon name="send" size={17} color="#fff" />
        </button>
      </div>
    </div>
  );
}

// ── A · Conversational cards ─────────────────────────────────────────
function VariantChat({ c }: { c: ReturnType<typeof useConcierge> }) {
  const { turns, busy, chips, act, ask } = c;
  const scroll = useStickToBottom([turns, busy, chips]);
  return (
    <>
      <div ref={scroll} className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 6px' }}>
        {turns.map((t, i) =>
          t.role === 'user' ? (
            <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, animation: 'bsRise .3s ease both' }}>
              <div style={{ maxWidth: '80%', background: T.grad, color: '#fff', fontSize: 14, fontWeight: 600, padding: '9px 13px', borderRadius: 16, borderBottomRightRadius: 5, boxShadow: '0 4px 12px rgba(80,72,229,.25)' }}>{t.text}</div>
            </div>
          ) : (
            <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 13, animation: 'bsRise .3s ease both' }}>
              <Logo size={28} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {t.say && (
                  <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 16, borderTopLeftRadius: 5, padding: '10px 13px', boxShadow: T.shadowSm }}>
                    <Say text={t.say} />
                  </div>
                )}
                {t.canvas && <Block canvas={t.canvas} on={act} />}
              </div>
            </div>
          )
        )}
        {busy && (
          <div style={{ display: 'flex', gap: 9, marginBottom: 12 }}>
            <Logo size={28} />
            <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 16, borderTopLeftRadius: 5, padding: '6px 12px', boxShadow: T.shadowSm }}><Typing /></div>
          </div>
        )}
      </div>
      {!busy && <ChipRow chips={chips} on={act} />}
      <InputBar on={ask} busy={busy} />
    </>
  );
}

// ── C · Guided wizard ────────────────────────────────────────────────
function VariantGuided({ c }: { c: ReturnType<typeof useConcierge> }) {
  const { turns, busy, chips, canvas, act, ask } = c;
  const last = [...turns].reverse().find((t) => t.role === 'ai');
  const say = last ? last.say : '';
  return (
    <>
      <div style={{ display: 'flex', gap: 11, padding: '4px 16px 14px', flexShrink: 0, alignItems: 'flex-start' }}>
        <Logo size={36} glow />
        <div style={{ flex: 1, paddingTop: 1 }}>
          <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 }}>Wefella</div>
          <div key={say} style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.4, letterSpacing: -0.2, animation: 'bsRise .3s ease both' }}>
            {busy ? <Typing /> : say}
          </div>
        </div>
      </div>
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {canvas && !busy && (
          <div key={canvas.type + turns.length} style={{ animation: 'bsPop .35s ease both' }}>
            <Block canvas={canvas} on={act} />
          </div>
        )}
      </div>
      {!busy && chips.length > 0 && (
        <div style={{ flexShrink: 0, padding: '12px 16px 4px', display: 'flex', flexDirection: 'column', gap: 9, animation: 'bsRise .3s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkline />
            <span style={{ fontSize: 10.5, color: T.ink3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Choose what’s next</span>
          </div>
          {chips.slice(0, 3).map((cc, i) => (
            <ActionChip key={i} big label={cc.label} icon={cc.icon} primary={cc.primary} onClick={() => act(cc.intent)} />
          ))}
        </div>
      )}
      <InputBar on={ask} busy={busy} />
    </>
  );
}

export default function ConciergeExperience() {
  const [variant, setVariant] = useState<'chat' | 'guided'>('chat');
  const [nonce, setNonce] = useState(0); // remount to restart cleanly
  const restart = () => {
    setVariant('chat');
    setNonce((n) => n + 1);
  };
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: T.bg, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '12px', fontFamily: T.font, color: T.ink }}>
      <div
        key={nonce}
        style={{
          width: '100%',
          maxWidth: 440,
          height: 'calc(100vh - 88px)',
          maxHeight: 900,
          minHeight: 560,
          background: T.bg,
          border: `1px solid ${T.line2}`,
          borderRadius: 26,
          boxShadow: '0 24px 60px rgba(16,24,40,.10)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ConciergeInner variant={variant} setVariant={setVariant} restart={restart} />
      </div>
    </div>
  );
}

// Inner so `useConcierge` resets when the outer remounts (key=nonce).
function ConciergeInner({ variant, setVariant, restart }: { variant: 'chat' | 'guided'; setVariant: (v: 'chat' | 'guided') => void; restart: () => void }) {
  const c = useConcierge();
  return (
    <>
      <Header variant={variant} setVariant={setVariant} onRestart={restart} />
      <div style={{ height: 1, background: T.line, flexShrink: 0 }} />
      {variant === 'chat' ? <VariantChat c={c} /> : <VariantGuided c={c} />}
    </>
  );
}
