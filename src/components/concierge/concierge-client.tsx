"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { aiConciergeAssistance } from '@/ai/flows/ai-concierge-assistance';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import {
  Send,
  Loader2,
  User,
  FileText,
  UserPlus,
  Activity,
  Heart,
  Plus,
  Calendar,
  Search,
  HelpCircle,
  Bell,
  Paperclip,
  ShieldCheck,
  Video,
  MessageSquare,
  Lock,
  Sparkles,
  Settings,
  RotateCcw,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { BrainstyLogo } from '@/components/shared/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import A2uiHost from './a2ui-host';
import { compileWidget, DEFAULT_MENU } from '@/ai/a2ui/build';
import { CONCIERGE_SURFACE_ID } from '@/ai/a2ui/catalog';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export default function ConciergeClient() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Welcome to Brainsty. I'm Wefella, your healthcare guardian. Let's set up your medical shield so I can track your deductible and block unfair bills.",
    },
  ]);
  // The A2UI message array for the most recent assistant turn (R4 surface).
  const [activeA2ui, setActiveA2ui] = useState<unknown[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);

  // UI styling state controlled by bottom pills
  const [uiStyle, setUiStyle] = useState<'recommended' | 'flat' | 'shadows'>('recommended');
  const roundedClass =
    uiStyle === 'flat' ? 'rounded-none' : uiStyle === 'shadows' ? 'rounded-2xl' : 'rounded-[28px]';
  const innerRoundedClass =
    uiStyle === 'flat' ? 'rounded-none' : uiStyle === 'shadows' ? 'rounded-xl' : 'rounded-2xl';
  const shadowClass =
    uiStyle === 'flat'
      ? 'shadow-none border border-hairline'
      : uiStyle === 'shadows'
        ? 'shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-hairline'
        : 'shadow-[0_12px_40px_rgba(0,0,0,0.02)] border border-[#e6e6e6]/60';

  // Profile data states
  const [profileName, setProfileName] = useState('');
  const [profileAge, setProfileAge] = useState('');
  const [profileInsurance, setProfileInsurance] = useState('');
  const [shieldCardData, setShieldCardData] = useState<any>(null);

  // PDF Upload & Scan states
  const [pdfName, setPdfName] = useState('');
  const [pdfSize, setPdfSize] = useState('');
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [scanStepMessage, setScanStepMessage] = useState('');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Core send routine.
   * @param clear  When true (any option/shortcut/restart click), wipe the
   *               transcript and the rendered widget first so the canvas is
   *               clean for the new answer (requirement R1).
   */
  const sendMessage = useCallback(
    async (textToSend: string, opts?: { clear?: boolean }) => {
      const text = textToSend.trim();
      if (!text || isLoading) return;

      const clear = opts?.clear ?? false;
      const userMessage: Message = { id: Math.random().toString(), role: 'user', content: text };

      setMessages((prev) => (clear ? [userMessage] : [...prev, userMessage]));
      if (clear) setActiveA2ui([]);
      setInput('');
      setIsLoading(true);
      setLastLatencyMs(null);

      const startedAt = performance.now();
      try {
        const response = await aiConciergeAssistance({ query: text, language });
        setLastLatencyMs(Math.round(performance.now() - startedAt));
        setMessages((prev) => [
          ...prev,
          { id: Math.random().toString(), role: 'assistant', content: response.response },
        ]);
        // R4 guarantee: if the model returned no widget but the user is onboarded,
        // fall back to the deterministic task menu so options are always offered.
        const a2ui = (response.a2ui as unknown[]) ?? [];
        setActiveA2ui(
          a2ui.length === 0 && shieldCardData
            ? compileWidget(CONCIERGE_SURFACE_ID, DEFAULT_MENU)
            : a2ui
        );
      } catch (err) {
        console.error('Concierge flow error:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: 'error',
            content: 'I hit an error reaching the shield brain. Please try again.',
          },
        ]);
        setActiveA2ui([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, language, shieldCardData]
  );

  // Re-render the main task options at any time (requirement R2).
  // Deterministic + instant: no LLM call, so options are guaranteed to appear.
  const showOptions = useCallback(() => {
    setMessages([
      {
        id: 'menu-' + Math.random().toString(),
        role: 'assistant',
        content: 'Here are your main options — pick one, or just type your question.',
      },
    ]);
    setActiveA2ui(compileWidget(CONCIERGE_SURFACE_ID, DEFAULT_MENU));
    setLastLatencyMs(null);
  }, []);

  // A2UI action click -> treat as an option selection: clear + send.
  const handleA2uiAction = useCallback(
    (value: string) => {
      if (value.toLowerCase().includes('pdf') && fileInputRef.current) {
        fileInputRef.current.click();
        return;
      }
      sendMessage(value, { clear: true });
    },
    [sendMessage]
  );

  // Fetch pre-existing Firestore profile on load.
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name && data.insuranceProvider) {
            setProfileName(data.name);
            setProfileAge(data.age || '');
            setProfileInsurance(data.insuranceProvider);
            setShieldCardData(
              data.insuranceCard || {
                name: data.name,
                age: data.age || 34,
                insurance: data.insuranceProvider,
                memberId: 'BRN-' + Math.floor(100000 + Math.random() * 900000),
                groupNumber: 'GR-' + Math.floor(1000 + Math.random() * 9000),
                status: 'SHIELD ACTIVE',
              }
            );
            // Offer the task menu straight away for returning members.
            showOptions();
          }
        }
      } catch (err) {
        console.error('Error reading profile from Firestore:', err);
      }
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileAge.trim() || !profileInsurance.trim()) return;

    // Build the local shield card immediately (native, app chrome).
    const card = {
      name: profileName,
      age: parseInt(profileAge, 10),
      insurance: profileInsurance,
      memberId: 'BRN-' + Math.floor(100000 + Math.random() * 900000),
      groupNumber: 'GR-' + Math.floor(1000 + Math.random() * 9000),
      status: 'SHIELD ACTIVE',
    };
    setShieldCardData(card);

    try {
      if (user) {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            email: user.email,
            name: profileName,
            age: card.age,
            insuranceProvider: profileInsurance,
            insuranceCard: card,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error('Firestore sync error:', err);
    }

    // Reward onboarding with an instant, deterministic welcome + task menu
    // (no LLM round-trip, so options always appear — R4).
    setMessages([
      {
        id: 'welcome-shield',
        role: 'assistant',
        content: `Shield activated, ${profileName}. I'll guard your bills and surface real prices. What would you like to do?`,
      },
    ]);
    setActiveA2ui(compileWidget(CONCIERGE_SURFACE_ID, DEFAULT_MENU));
  };

  const resetProfile = () => {
    setProfileName('');
    setProfileAge('');
    setProfileInsurance('');
    setShieldCardData(null);
    setActiveA2ui([]);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Profile reset. Let's rebuild your medical shield — fill in the details below.",
      },
    ]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    setPdfName(file.name);
    setPdfSize(formattedSize);

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        role: 'user',
        content: `Attached medical document: ${file.name} (${formattedSize})`,
      },
    ]);

    setUploadProgress(0);
    setScanStepMessage('Ingesting PDF streams...');

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStepMessage('Shield scan completed!');
          if (user) {
            updateDoc(doc(db, 'users', user.uid), {
              lastUploadedBill: {
                filename: file.name,
                filesize: formattedSize,
                uploadedAt: new Date().toISOString(),
                status: 'SCANNED_OK',
              },
            }).catch((err) => console.error('Bill metadata sync failed:', err));
          }
          setTimeout(() => {
            setUploadProgress(-1);
            sendMessage(`Analyze my uploaded medical bill: ${file.name}`);
          }, 600);
          return 100;
        }
        const nextProgress = prev + 10;
        if (nextProgress === 20) setScanStepMessage('Parsing layout hierarchy...');
        else if (nextProgress === 40) setScanStepMessage('Extracting billing line-items...');
        else if (nextProgress === 60) setScanStepMessage('Checking insurance fee schedule...');
        else if (nextProgress === 80) setScanStepMessage('Validating surprise-billing limits...');
        return nextProgress;
      });
    }, 180);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, uploadProgress, activeA2ui]);

  const dashboardShortcuts = [
    { title: 'Find a Doctor', desc: 'Search in-network physicians near you', text: 'Help me find an in-network doctor for my provider.', icon: UserPlus, color: 'bg-blue-50/80 text-blue-600 border border-blue-100/60' },
    { title: 'Schedule Appointment', desc: 'Book and manage upcoming visits', text: 'I want to schedule an appointment with a local provider.', icon: Calendar, color: 'bg-cyan-50/80 text-cyan-600 border border-cyan-100/60' },
    { title: 'View Lab Results', desc: 'Decode and understand test reports', text: "Let's review my recent clinical lab results.", icon: Activity, color: 'bg-indigo-50/80 text-indigo-600 border border-indigo-100/60' },
    { title: 'Refill Prescription', desc: 'Order pharmacy pick-ups, check prices', text: 'I need to refill a prescription and check savings.', icon: Heart, color: 'bg-purple-50/80 text-purple-600 border border-purple-100/60' },
    { title: 'Check Coverage', desc: 'Examine deductibles and procedure rules', text: 'Verify my active deductible and coverage shield status.', icon: ShieldCheck, color: 'bg-sky-50/80 text-sky-600 border border-sky-100/60' },
    { title: 'Telehealth Visit', desc: 'Connect instantly with a resident doctor', text: 'I need to start an instant telehealth consultation.', icon: Video, color: 'bg-teal-50/80 text-teal-600 border border-teal-100/60' },
  ];

  // Onboarding is complete only once the shield card is built (on submit/load) —
  // NOT when the name field is first typed, otherwise the form unmounts mid-entry.
  const onboarded = !!shieldCardData;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] py-4 px-3 md:px-8 flex items-start lg:items-center justify-center font-body antialiased">
      <div className="w-full max-w-7xl bg-canvas border border-[#e6e6e6]/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-[24px] lg:rounded-[32px] overflow-hidden flex flex-col lg:flex-row lg:h-[calc(100vh-120px)] lg:min-h-[680px] lg:max-h-[880px] transition-all duration-500">

        {/* LEFT COLUMN: Wefella conversational stream */}
        <div className="w-full lg:w-[38%] xl:w-[35%] border-b lg:border-b-0 lg:border-r border-hairline flex flex-col h-[68vh] lg:h-full bg-canvas overflow-hidden">

          {/* Header */}
          <div className="h-[64px] border-b border-hairline px-5 flex justify-between items-center bg-canvas shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-md shadow-primary/10 shrink-0">
                <BrainstyLogo className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[16px] font-bold tracking-tight text-ink leading-none">Wefella AI</span>
                {(lastLatencyMs !== null || isLoading) && (
                  <span className="text-[10px] font-medium text-muted/70 mt-0.5 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {isLoading ? 'thinking…' : `answered in ${lastLatencyMs} ms`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* R2: always-available "show options again" control */}
              <button
                onClick={showOptions}
                disabled={isLoading || !onboarded}
                className="text-muted/70 hover:text-primary p-2 hover:bg-slate-50 transition-colors rounded-full disabled:opacity-40"
                aria-label="Show options"
                title="Show my options again"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={onboarded ? showOptions : undefined}
                disabled={isLoading || !onboarded}
                className="text-muted/70 hover:text-primary p-2 hover:bg-slate-50 transition-colors rounded-full disabled:opacity-40"
                aria-label="New chat"
                title="New chat"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button className="text-muted/70 hover:text-primary p-2 hover:bg-slate-50 transition-colors rounded-full hidden sm:inline-flex" aria-label="Chats history">
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-5 py-5" ref={scrollAreaRef}>
            <div className="space-y-5 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {message.role !== 'user' && (
                    <div className={cn(
                      'h-9 w-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm',
                      message.role === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-500'
                        : 'bg-gradient-to-tr from-primary to-indigo-600 text-white border border-primary/20'
                    )}>
                      {message.role === 'error' ? <AlertTriangle className="h-4 w-4" /> : <BrainstyLogo className="h-5 w-5 text-white" />}
                    </div>
                  )}

                  <div
                    className={cn(
                      'px-5 py-3.5 max-w-[85%] text-[14px] leading-relaxed transition-all duration-300',
                      message.role === 'user'
                        ? 'bg-blue-50/70 text-[#1c69d4] border border-blue-100/50'
                        : message.role === 'error'
                          ? 'bg-red-50/70 text-red-700 border border-red-100'
                          : 'bg-slate-100/80 text-slate-800 border border-transparent',
                      roundedClass
                    )}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>

                  {message.role === 'user' && (
                    <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary shrink-0 font-bold text-[12px] mt-0.5 shadow-sm">
                      {profileName ? profileName.slice(0, 2).toUpperCase() : <User className="h-4 w-4" />}
                    </div>
                  )}
                </div>
              ))}

              {/* Native profile form (app chrome, shown until onboarded) */}
              {!onboarded && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary/10 to-indigo-600/10 flex items-center justify-center text-primary shrink-0 mt-0.5 border border-primary/20">
                    <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                  </div>
                  <div className={cn('p-5 w-[88%] bg-canvas border-l-4 border-l-primary', shadowClass, roundedClass)}>
                    <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                      <div className="space-y-0.5">
                        <h3 className="text-[16px] font-bold text-ink">Create Your Guardian Profile</h3>
                        <p className="text-[12px] font-light text-muted leading-relaxed">Activate your digital insurance protection card.</p>
                      </div>
                      <div className="space-y-3.5 pt-1">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-[1px] text-body-strong">Full Name</label>
                          <Input required value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="e.g., Brainsty Smith" className={cn('bg-slate-50/50 border-hairline focus-visible:ring-primary text-[13px] h-10 px-3.5', innerRoundedClass)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-[1px] text-body-strong">Age</label>
                            <Input required type="number" value={profileAge} onChange={(e) => setProfileAge(e.target.value)} placeholder="34" className={cn('bg-slate-50/50 border-hairline focus-visible:ring-primary text-[13px] h-10 px-3.5', innerRoundedClass)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-[1px] text-body-strong">Insurance</label>
                            <Input required value={profileInsurance} onChange={(e) => setProfileInsurance(e.target.value)} placeholder="BCBS, Aetna" className={cn('bg-slate-50/50 border-hairline focus-visible:ring-primary text-[13px] h-10 px-3.5', innerRoundedClass)} />
                          </div>
                        </div>
                      </div>
                      <Button type="submit" disabled={isLoading} className={cn('w-full mt-2 bg-primary hover:bg-primary-active text-white h-10 text-[13px] font-bold shadow-sm shadow-primary/20', innerRoundedClass)}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Consolidate Shield & Activate'}
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {/* PDF scanner card (inline) */}
              {uploadProgress >= 0 && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-sm border border-primary/20 shrink-0 mt-0.5">
                    <BrainstyLogo className="h-5 w-5 text-white" />
                  </div>
                  <div className={cn('bg-canvas p-5 w-[85%] max-w-sm', shadowClass, roundedClass)}>
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-10 bg-slate-50 border border-slate-200 flex flex-col justify-between p-1.5 shadow-sm rounded-lg shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-[7px] font-bold text-primary font-code leading-none">PDF</span>
                      </div>
                      <div className="flex-grow space-y-0.5 overflow-hidden text-left">
                        <span className="text-[13px] font-bold text-ink block truncate">{pdfName}</span>
                        <span className="text-[11px] font-light text-muted block">{pdfSize}</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1.5 text-left">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-[1px] text-primary">
                        <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 animate-pulse" /> {scanStepMessage}</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-200">
                        <div className="bg-gradient-to-r from-primary to-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* A2UI-rendered interactive surface for the latest assistant turn (R4/R5) */}
              {activeA2ui.length > 0 && !isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary/10 to-indigo-600/10 flex items-center justify-center text-primary shrink-0 mt-0.5 border border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className={cn('p-4 w-[88%] bg-canvas border-l-4 border-l-primary', shadowClass, roundedClass)}>
                    <A2uiHost messages={activeA2ui} onAction={handleA2uiAction} />
                  </div>
                </div>
              )}

              {/* Thinking indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-sm border border-primary/20 shrink-0 mt-0.5 animate-pulse">
                    <BrainstyLogo className="h-5 w-5 text-white" />
                  </div>
                  <div className={cn('bg-slate-100/80 px-6 py-4 flex items-center border border-transparent', roundedClass)}>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Style pills */}
          <div className="px-5 py-2 flex items-center justify-start gap-1.5 border-t border-hairline/40 bg-canvas shrink-0 overflow-x-auto">
            {(['recommended', 'flat', 'shadows'] as const).map((style) => (
              <button
                key={style}
                onClick={() => setUiStyle(style)}
                className={cn(
                  'px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1px] transition-all rounded-full border whitespace-nowrap',
                  uiStyle === style
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-canvas text-muted/70 border-hairline hover:bg-slate-50 hover:text-ink'
                )}
              >
                {style === 'recommended' ? 'Recommended' : style === 'flat' ? '100% Flat' : '20% Shadows'}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-canvas border-t border-hairline shrink-0">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="w-full flex items-center gap-2.5">
              <div className="flex-grow flex items-center bg-slate-50 border border-slate-200/80 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all rounded-full px-4 py-1.5">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-muted/60 hover:text-primary transition-colors cursor-pointer mr-2.5 p-1 hover:bg-slate-200/40 rounded-full shrink-0" title="Upload PDF Bill">
                  <Paperclip className="h-4 w-4" />
                </button>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-grow bg-transparent border-none outline-none focus:ring-0 text-[14px] font-body text-ink placeholder:text-muted/50 h-10 w-full" disabled={isLoading} aria-label="Wefella input message" />
              </div>
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-md shadow-primary/10 hover:shadow-lg transition-all disabled:opacity-50" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: dashboard */}
        <div className="flex-1 bg-[#f8fafc]/50 flex flex-col lg:h-full overflow-hidden">
          <div className="h-[64px] border-b border-hairline px-6 md:px-8 flex justify-between items-center bg-[#f8fafc]/50 shrink-0">
            <span className="text-[17px] font-bold text-ink tracking-tight">Dashboard</span>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/50 rounded-full px-3.5 py-1.5 text-muted/65 w-[180px] text-[12px]">
                <Search className="h-3.5 w-3.5" />
                <span>Search features...</span>
              </div>
              <button className="text-muted/60 hover:text-ink p-1.5 hover:bg-slate-50 transition-colors rounded-full" aria-label="Help"><HelpCircle className="h-4 w-4" /></button>
              <button className="text-muted/60 hover:text-ink p-1.5 hover:bg-slate-50 transition-colors rounded-full relative" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#f8fafc]" />
              </button>
              <Avatar className="h-8 w-8 border border-slate-200 shadow-sm rounded-full shrink-0">
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-[11px]">
                  {profileName ? profileName.slice(0, 2).toUpperCase() : 'BS'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex-1 lg:overflow-y-auto p-5 md:p-8 flex flex-col xl:flex-row gap-6 xl:gap-8 items-start">
            <div className="flex-grow w-full xl:w-2/3 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted-soft">Shield Core Options</span>
                <span className="text-[11px] font-light text-muted/60">Select to trigger Wefella</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dashboardShortcuts.map((shortcut, i) => {
                  const ShortcutIcon = shortcut.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => sendMessage(shortcut.text, { clear: true })}
                      disabled={isLoading}
                      className={cn(
                        'text-left p-5 bg-canvas hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex flex-col justify-between h-[150px] cursor-pointer group disabled:opacity-60',
                        shadowClass,
                        roundedClass
                      )}
                    >
                      <div className="space-y-3 w-full text-left">
                        <div className={cn('h-10 w-10 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105', shortcut.color)}>
                          <ShortcutIcon className="h-5 w-5" />
                        </div>
                        <h4 className="text-[15px] font-bold text-ink group-hover:text-primary transition-colors leading-tight">{shortcut.title}</h4>
                      </div>
                      <p className="text-[12px] font-light text-muted leading-snug mt-2 w-full text-left">{shortcut.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shield card */}
            <div className="w-full xl:w-[320px] shrink-0 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-indigo-400">Guardian Shield</span>
                {onboarded && (
                  <button onClick={resetProfile} className="text-[10px] font-bold uppercase tracking-[1px] text-muted hover:text-primary transition-colors flex items-center gap-1">
                    <Settings className="h-3 w-3" /> Reset Plan
                  </button>
                )}
              </div>

              <div className={cn('w-full h-[360px] max-w-sm overflow-hidden flex flex-col justify-between p-6 relative transition-all duration-700 ease-out select-none', onboarded ? 'bg-gradient-to-br from-[#1c69d4] via-[#4f46e5] to-[#9333ea] text-white shadow-[0_20px_50px_rgba(99,102,241,0.22)] border border-white/10' : 'bg-slate-800 border-2 border-dashed border-slate-700/80 text-slate-400', roundedClass)}>
                {onboarded ? (
                  <>
                    <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex justify-between items-start z-10">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                          <BrainstyLogo className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-[15px] font-bold tracking-[0.5px]">Brainsty</span>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-500/25 text-emerald-300 px-2.5 py-1 border border-emerald-500/35 tracking-[1px] uppercase rounded-full">Shield Active</span>
                    </div>
                    <div className="my-5 z-10 text-left">
                      <span className="text-[9px] font-bold uppercase tracking-[1.5px] text-indigo-200/80 block">Healthcare Shield</span>
                      <h4 className="text-[22px] font-bold leading-tight tracking-tight mt-1 truncate">{profileName}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-white/15 pt-4 z-10 text-left">
                      <div><span className="text-[9px] font-bold uppercase tracking-[1px] text-indigo-200/60 block">Member ID</span><span className="text-[13px] font-bold font-code text-white mt-0.5 block">{shieldCardData?.memberId || 'BRN-881571'}</span></div>
                      <div><span className="text-[9px] font-bold uppercase tracking-[1px] text-indigo-200/60 block">Group ID</span><span className="text-[13px] font-bold font-code text-white mt-0.5 block">{shieldCardData?.groupNumber || 'GR-9002'}</span></div>
                      <div><span className="text-[9px] font-bold uppercase tracking-[1px] text-indigo-200/60 block">Plan Provider</span><span className="text-[13px] font-bold text-white mt-0.5 block truncate">{profileInsurance || 'BCBS'}</span></div>
                      <div><span className="text-[9px] font-bold uppercase tracking-[1px] text-indigo-200/60 block">Protection</span><span className="text-[13px] font-bold text-white mt-0.5 block">100% Covered</span></div>
                    </div>
                    <div className="text-[10px] text-white/50 font-light border-t border-white/10 pt-3.5 mt-3 flex justify-between items-center z-10">
                      <span>DEDUCTIBLE: $340 / $1,000</span>
                      <span>AGE: {profileAge || '34'}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-between h-full w-full py-2">
                    <div className="flex justify-between items-center text-slate-500">
                      <div className="flex items-center gap-2">
                        <BrainstyLogo className="h-6 w-6 text-slate-600 opacity-60" />
                        <span className="text-[14px] font-bold">Brainsty</span>
                      </div>
                      <span className="text-[8px] font-bold border border-slate-700/60 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-[0.5px]">Inactive</span>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-grow py-8 text-center space-y-3.5">
                      <div className="h-12 w-12 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400">
                        <Lock className="h-5 w-5 animate-pulse text-slate-400" />
                      </div>
                      <div className="space-y-1.5 px-4 text-center">
                        <span className="text-[14px] font-bold text-slate-200 block">Shield Profile Locked</span>
                        <span className="text-[11px] text-slate-400 block leading-normal max-w-[210px] mx-auto">Complete Wefella's profile form on the left to activate coverage.</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-700/40 pt-3 text-center">
                      <span className="text-[9px] font-bold uppercase tracking-[1px] text-slate-500">Awaiting configuration...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
