"use client";

import { useState, useRef, useEffect } from 'react';
import { aiConciergeAssistance } from '@/ai/flows/ai-concierge-assistance';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Loader2, 
  User, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  UserPlus, 
  Info, 
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
  Settings
} from 'lucide-react';
import { BrainstyLogo } from '@/components/shared/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isScan?: boolean;
}

interface UiComponent {
  type: 'profile-form' | 'poll' | 'yes-no' | 'insurance-card';
  props: Record<string, any>;
}

export default function ConciergeClient() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to Brainsty Healthcare Intelligence! I'm Wefella, your healthcare guardian. Let's start by configuring your medical shield profile so I can track your deductible and protect you from unfair billing practices.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeUi, setActiveUi] = useState<UiComponent | null>({
    type: 'profile-form',
    props: {
      title: "Create Your Guardian Profile",
      fields: ["name", "age", "insurance"]
    }
  });

  // UI styling state controlled by bottom pills
  const [uiStyle, setUiStyle] = useState<'recommended' | 'flat' | 'shadows'>('recommended');

  // Dynamic CSS variables based on uiStyle
  const roundedClass = 
    uiStyle === 'flat' ? 'rounded-none' : 
    uiStyle === 'shadows' ? 'rounded-2xl' : 'rounded-[28px]';

  const innerRoundedClass = 
    uiStyle === 'flat' ? 'rounded-none' : 
    uiStyle === 'shadows' ? 'rounded-xl' : 'rounded-2xl';

  const shadowClass = 
    uiStyle === 'flat' ? 'shadow-none border border-hairline' : 
    uiStyle === 'shadows' ? 'shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-hairline' : 
    'shadow-[0_12px_40px_rgba(0,0,0,0.02)] border border-[#e6e6e6]/60';

  // Profile data states
  const [profileName, setProfileName] = useState('');
  const [profileAge, setProfileAge] = useState('');
  const [profileInsurance, setProfileInsurance] = useState('');
  const [shieldCardData, setShieldCardData] = useState<any>(null);

  // PDF Upload & Scan states
  const [pdfName, setPdfName] = useState('');
  const [pdfSize, setPdfSize] = useState('');
  const [uploadProgress, setUploadProgress] = useState(-1); // -1 means no upload
  const [scanStepMessage, setScanStepMessage] = useState('');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch pre-existing Firestore profile on load
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name && data.insuranceProvider) {
            setProfileName(data.name);
            setProfileAge(data.age || '');
            setProfileInsurance(data.insuranceProvider);
            if (data.insuranceCard) {
              setShieldCardData(data.insuranceCard);
              // Swap to next poll task in A2UI since they already have a profile
              setActiveUi({
                type: 'poll',
                props: {
                  question: "What would you like Wefella to shield you from today?",
                  options: [
                    "Compare procedure prices",
                    "Fight an emergency surprise bill",
                    "Scan a medical bill (PDF)",
                    "Optimize employer benefits"
                  ]
                }
              });
            } else {
              // Populate mock shield card details if profile exists but card metadata was missing
              const mockCard = {
                name: data.name,
                age: data.age || 34,
                insurance: data.insuranceProvider,
                memberId: "BRN-" + Math.floor(100000 + Math.random() * 900000),
                groupNumber: "GR-" + Math.floor(1000 + Math.random() * 9000),
                status: "SHIELD ACTIVE"
              };
              setShieldCardData(mockCard);
              setActiveUi({
                type: 'poll',
                props: {
                  question: "What would you like Wefella to shield you from today?",
                  options: [
                    "Compare procedure prices",
                    "Fight an emergency surprise bill",
                    "Scan a medical bill (PDF)",
                    "Optimize employer benefits"
                  ]
                }
              });
            }
          }
        }
      } catch (err) {
        console.error("Error reading profile from Firestore:", err);
      }
    }
    loadProfile();
  }, [user]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { 
      id: Math.random().toString(), 
      role: 'user', 
      content: textToSend 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiConciergeAssistance({ query: textToSend, language });
      const assistantMessage: Message = { 
        id: Math.random().toString(), 
        role: 'assistant', 
        content: response.response 
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update the active A2UI component returned by the orchestrator flow
      if (response.uiComponent) {
        setActiveUi({
          type: response.uiComponent.type,
          props: response.uiComponent.props
        });
        if (response.uiComponent.type === 'insurance-card') {
          setShieldCardData(response.uiComponent.props);
          // Sync dynamically generated card to Firestore
          if (user) {
            await updateDoc(doc(db, "users", user.uid), {
              insuranceCard: response.uiComponent.props
            });
          }
        }
      } else {
        // If a simple textual query completed without direct A2UI instructions, keep poll available
        if (shieldCardData) {
          setActiveUi({
            type: 'poll',
            props: {
              question: "What would you like Wefella to shield you from next?",
              options: [
                "Compare procedure prices",
                "Fight an emergency surprise bill",
                "Scan a medical bill (PDF)",
                "Optimize employer benefits"
              ]
            }
          });
        } else {
          setActiveUi(null);
        }
      }
    } catch (err) {
      const errorMessage: Message = { 
        id: Math.random().toString(), 
        role: 'assistant', 
        content: "I encountered an error analyzing your request. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileAge.trim() || !profileInsurance.trim()) return;

    setIsLoading(true);
    try {
      // 1. Save core data to Firestore in the user document
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          name: profileName,
          age: parseInt(profileAge),
          insuranceProvider: profileInsurance,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      // 2. Trigger AI logic to consolidate and generate the Virtual Shield Card
      const messageText = `I completed my profile: Name is ${profileName}, Age is ${profileAge}, Insurance is ${profileInsurance}`;
      await handleSendMessage(messageText);
    } catch (err) {
      console.error("Firestore sync error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    setPdfName(file.name);
    setPdfSize(formattedSize);
    
    // Add User Upload attachment message in chat log
    const userAttachMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: `📎 Attached medical document: ${file.name} (${formattedSize})`
    };
    setMessages(prev => [...prev, userAttachMsg]);

    setUploadProgress(0);
    setScanStepMessage("Ingesting PDF streams...");

    // Simulate an interactive uploading and progressive medical scanning animation inside chat
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStepMessage("Shield scan completed!");
          
          // Sync file metadata to Firestore once finished
          if (user) {
            updateDoc(doc(db, "users", user.uid), {
              lastUploadedBill: {
                filename: file.name,
                filesize: formattedSize,
                uploadedAt: new Date().toISOString(),
                status: "SCANNED_OK"
              }
            });
          }
          
          // Trigger actual scan analysis in the backend
          setTimeout(() => {
            setUploadProgress(-1);
            handleSendMessage(`Analyze my uploaded medical bill: ${file.name}`);
          }, 600);

          return 100;
        }
        
        // Progressive scan text steps based on percent
        const nextProgress = prev + 10;
        if (nextProgress === 20) setScanStepMessage("Parsing layout hierarchy...");
        else if (nextProgress === 40) setScanStepMessage("Extracting billing line-items...");
        else if (nextProgress === 60) setScanStepMessage("Checking insurance fee schedule compatibility...");
        else if (nextProgress === 80) setScanStepMessage("Validating surprise billing protection limits...");
        
        return nextProgress;
      });
    }, 180);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, uploadProgress]);

  // Clickable shortcut boxes definitions (exactly 6 items matching mockup icons and layout)
  const dashboardShortcuts = [
    { 
      title: "Find a Doctor", 
      desc: "Search for in-network physicians near you", 
      text: "Help me find an in-network doctor for my provider.",
      icon: UserPlus, 
      color: "bg-blue-50/80 text-blue-600 border border-blue-100/60" 
    },
    { 
      title: "Schedule Appointment", 
      desc: "Book and manage upcoming medical visits", 
      text: "I want to schedule an appointment with a local provider.",
      icon: Calendar, 
      color: "bg-cyan-50/80 text-cyan-600 border border-cyan-100/60" 
    },
    { 
      title: "View Lab Results", 
      desc: "Decode and understand test reports easily", 
      text: "Let's review my recent clinical lab results.",
      icon: Activity, 
      color: "bg-indigo-50/80 text-indigo-600 border border-indigo-100/60" 
    },
    { 
      title: "Refill Prescription", 
      desc: "Order pharmacy pick-ups and check prices", 
      text: "I need to refill a prescription and check savings.",
      icon: Heart, 
      color: "bg-purple-50/80 text-purple-600 border border-purple-100/60" 
    },
    { 
      title: "Check Coverage", 
      desc: "Examine active deductibles and procedure rules", 
      text: "Verify my active deductible and coverage shield status.",
      icon: ShieldCheck, 
      color: "bg-sky-50/80 text-sky-600 border border-sky-100/60" 
    },
    { 
      title: "Telehealth Visit", 
      desc: "Connect instantly with a resident doctor", 
      text: "I need to start an instant telehealth consultation.",
      icon: Video, 
      color: "bg-teal-50/80 text-teal-600 border border-teal-100/60" 
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] py-6 px-4 md:px-8 flex items-center justify-center font-body antialiased">
      
      {/* Visual Application Frame Container - matches the browser mockup look */}
      <div className="w-full max-w-7xl bg-canvas border border-[#e6e6e6]/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-[32px] overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-120px)] min-h-[680px] max-h-[880px] transition-all duration-500">
        
        {/* LEFT COLUMN: Premium Wefella Conversational Stream Pane */}
        <div className="w-full lg:w-[38%] xl:w-[35%] border-r border-hairline flex flex-col h-full bg-canvas overflow-hidden">
          
          {/* Chat Pane Sticky Header */}
          <div className="h-[64px] border-b border-hairline px-6 flex justify-between items-center bg-canvas shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-md shadow-primary/10">
                <BrainstyLogo className="h-5 w-5 text-white" />
              </div>
              <span className="text-[17px] font-bold tracking-tight text-ink">Wefella AI</span>
            </div>
            
            {/* Mock Header Navigation Actions */}
            <div className="flex items-center gap-1">
              <button className="text-muted/70 hover:text-primary p-2 hover:bg-slate-50 transition-colors rounded-full" aria-label="Add User">
                <UserPlus className="h-4 w-4" />
              </button>
              <button className="text-muted/70 hover:text-primary p-2 hover:bg-slate-50 transition-colors rounded-full" aria-label="Chats history">
                <MessageSquare className="h-4 w-4" />
              </button>
              <button className="text-muted/70 hover:text-primary p-2 hover:bg-slate-50 transition-colors rounded-full" aria-label="New Chat">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages scroll area */}
          <ScrollArea className="flex-1 px-6 py-6" ref={scrollAreaRef}>
            <div className="space-y-6 pb-4">
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3.5',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-sm border border-primary/20 shrink-0 mt-0.5">
                      <BrainstyLogo className="h-5 w-5 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      'px-5 py-4 max-w-[85%] text-[14px] leading-relaxed transition-all duration-300 font-normal',
                      message.role === 'user'
                        ? 'bg-blue-50/70 text-[#1c69d4] border border-blue-100/50'
                        : 'bg-slate-100/80 text-slate-800 border border-transparent',
                      roundedClass
                    )}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary shrink-0 font-bold text-[12px] mt-0.5 shadow-sm">
                      {profileName ? profileName.slice(0, 2).toUpperCase() : <User className="h-4.5 w-4.5" />}
                    </div>
                  )}
                </div>
              ))}

              {/* Dynamic PDF Scanner Card - rendered inline inside chat conversation stream */}
              {uploadProgress >= 0 && (
                <div className="flex items-start gap-3.5 justify-start">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-sm border border-primary/20 shrink-0 mt-0.5">
                    <BrainstyLogo className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className={cn("bg-canvas p-5 w-[85%] max-w-sm", shadowClass, roundedClass)}>
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
                    
                    {/* Animated scanning bar */}
                    <div className="mt-4 space-y-1.5 text-left">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-[1px] text-primary">
                        <span className="flex items-center gap-1.5">
                          <Activity className="h-3 w-3 animate-pulse" /> {scanStepMessage}
                        </span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="bg-gradient-to-r from-primary to-indigo-600 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active A2UI Widget Form/Poll Interface - rendered inline at current flow point */}
              {activeUi && activeUi.type !== 'insurance-card' && (
                <div className="flex items-start gap-3.5 justify-start pt-2 border-t border-hairline/40">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary/10 to-indigo-600/10 flex items-center justify-center text-primary shrink-0 mt-0.5 border border-primary/20">
                    <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                  </div>
                  
                  <div className={cn("p-6 w-[85%] bg-canvas border-l-4 border-l-primary", shadowClass, roundedClass)}>
                    
                    {/* A2UI Component Type 1: Profile Form */}
                    {activeUi.type === 'profile-form' && (
                      <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                        <div className="space-y-0.5">
                          <h3 className="text-[16px] font-bold text-ink flex items-center gap-1.5">
                            {activeUi.props.title || "Configure Shield Profile"}
                          </h3>
                          <p className="text-[12px] font-light text-muted leading-relaxed">Consolidate details to activate your digital insurance protection card.</p>
                        </div>
                        <div className="space-y-3.5 pt-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-[1px] text-body-strong">Full Name</label>
                            <Input
                              required
                              value={profileName}
                              onChange={(e) => setProfileName(e.target.value)}
                              placeholder="e.g., Brainsty Smith"
                              className={cn("bg-slate-50/50 border-hairline focus-visible:ring-primary focus-visible:border-primary text-[13px] h-10 px-3.5", innerRoundedClass)}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-[1px] text-body-strong">Age</label>
                              <Input
                                required
                                type="number"
                                value={profileAge}
                                onChange={(e) => setProfileAge(e.target.value)}
                                placeholder="e.g., 34"
                                className={cn("bg-slate-50/50 border-hairline focus-visible:ring-primary text-[13px] h-10 px-3.5", innerRoundedClass)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-[1px] text-body-strong">Insurance Plan</label>
                              <Input
                                required
                                value={profileInsurance}
                                onChange={(e) => setProfileInsurance(e.target.value)}
                                placeholder="e.g., BCBS, Aetna"
                                className={cn("bg-slate-50/50 border-hairline focus-visible:ring-primary text-[13px] h-10 px-3.5", innerRoundedClass)}
                              />
                            </div>
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className={cn("w-full mt-4 bg-primary hover:bg-primary-active text-white h-10 text-[13px] font-bold shadow-sm shadow-primary/20", innerRoundedClass)}
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Consolidate Shield & Activate"}
                        </Button>
                      </form>
                    )}

                    {/* A2UI Component Type 2: Options Poll */}
                    {activeUi.type === 'poll' && (
                      <div className="space-y-4 text-left">
                        <div className="space-y-0.5">
                          <h3 className="text-[15px] font-bold text-ink leading-tight">{activeUi.props.question}</h3>
                          <p className="text-[11px] font-light text-muted leading-tight">Select an action to launch our automated agent shield.</p>
                        </div>
                        <div className="flex flex-col gap-2 pt-1.5">
                          {activeUi.props.options?.map((option: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => {
                                handleSendMessage(option);
                                if (option.toLowerCase().includes("pdf") && fileInputRef.current) {
                                  fileInputRef.current.click();
                                }
                              }}
                              className={cn(
                                "w-full text-left p-3.5 border border-[#e6e6e6]/80 bg-canvas hover:border-primary hover:bg-slate-50/20 transition-all text-[13px] font-normal text-ink flex items-center justify-between group",
                                innerRoundedClass
                              )}
                            >
                              <span className="group-hover:text-primary transition-colors">{option}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* A2UI Component Type 3: Binary Confirmation */}
                    {activeUi.type === 'yes-no' && (
                      <div className="space-y-4 text-left">
                        <div className="space-y-0.5">
                          <h3 className="text-[15px] font-bold text-ink leading-snug">{activeUi.props.question}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <Button
                            onClick={() => handleSendMessage("Yes")}
                            className={cn("bg-primary text-white hover:bg-primary-active h-10 text-[13px] font-bold", innerRoundedClass)}
                          >
                            Yes, proceed
                          </Button>
                          <Button
                            onClick={() => handleSendMessage("No")}
                            variant="outline"
                            className={cn("border-hairline hover:bg-slate-50 h-10 text-[13px] text-muted hover:text-ink font-medium", innerRoundedClass)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex items-start gap-3.5 justify-start">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-sm border border-primary/20 shrink-0 mt-0.5 animate-pulse">
                    <BrainstyLogo className="h-5 w-5 text-white" />
                  </div>
                  <div className={cn("bg-slate-100/80 px-6 py-4 flex items-center border border-transparent shadow-none", roundedClass)}>
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-primary" />
                  </div>
                </div>
              )}

            </div>
          </ScrollArea>

          {/* Active Style Control Pills - matches mockup bottom options */}
          <div className="px-6 py-2 flex items-center justify-start gap-1.5 border-t border-hairline/40 bg-canvas shrink-0">
            <button
              onClick={() => setUiStyle('recommended')}
              className={cn(
                "px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1px] transition-all rounded-full border",
                uiStyle === 'recommended' 
                  ? "bg-primary text-white border-primary shadow-sm" 
                  : "bg-canvas text-muted/70 border-hairline hover:bg-slate-50 hover:text-ink"
              )}
            >
              Recommended
            </button>
            <button
              onClick={() => setUiStyle('flat')}
              className={cn(
                "px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1px] transition-all rounded-full border",
                uiStyle === 'flat' 
                  ? "bg-primary text-white border-primary shadow-sm" 
                  : "bg-canvas text-muted/70 border-hairline hover:bg-slate-50 hover:text-ink"
              )}
            >
              100% Flat
            </button>
            <button
              onClick={() => setUiStyle('shadows')}
              className={cn(
                "px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1px] transition-all rounded-full border",
                uiStyle === 'shadows' 
                  ? "bg-primary text-white border-primary shadow-sm" 
                  : "bg-canvas text-muted/70 border-hairline hover:bg-slate-50 hover:text-ink"
              )}
            >
              20% Shadows
            </button>
          </div>

          {/* Pill-shaped Chat Input Container - matches mockup */}
          <div className="p-4 bg-canvas border-t border-hairline shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} 
              className="w-full flex items-center gap-2.5"
            >
              <div className="flex-grow flex items-center bg-slate-50 border border-slate-200/80 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all rounded-full px-4 py-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-muted/60 hover:text-primary transition-colors cursor-pointer mr-2.5 p-1 hover:bg-slate-200/40 rounded-full shrink-0"
                  title="Upload PDF Bill"
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow bg-transparent border-none outline-none focus:ring-0 focus:border-none focus-visible:ring-0 text-[14px] font-body text-ink placeholder:text-muted/50 h-10 w-full"
                  disabled={isLoading}
                  aria-label="Wefella input message"
                />
              </div>
              
              <Button 
                type="submit" 
                size="icon" 
                className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-md shadow-primary/10 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4.5 w-4.5" />
              </Button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: Persistent Wefella Healthcare Shield Dashboard */}
        <div className="flex-1 bg-[#f8fafc]/50 flex flex-col h-full overflow-hidden">
          
          {/* Dashboard Header Bar */}
          <div className="h-[64px] border-b border-hairline px-8 flex justify-between items-center bg-[#f8fafc]/50 shrink-0">
            <span className="text-[17px] font-bold text-ink tracking-tight">Dashboard</span>
            
            {/* Search Placeholder, Help, Notification and Profile icons */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/50 rounded-full px-3.5 py-1.5 text-muted/65 w-[180px] text-[12px] cursor-pointer hover:bg-slate-100/30 transition-colors">
                <Search className="h-3.5 w-3.5" />
                <span>Search features...</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="text-muted/60 hover:text-ink p-1.5 hover:bg-slate-50 transition-colors rounded-full" aria-label="Help">
                  <HelpCircle className="h-4.5 w-4.5" />
                </button>
                
                <button className="text-muted/60 hover:text-ink p-1.5 hover:bg-slate-50 transition-colors rounded-full relative" aria-label="Notifications">
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#f8fafc]" />
                </button>
                
                {/* User avatar initial initial photo mockup */}
                <Avatar className="h-8 w-8 border border-slate-200 shadow-sm rounded-full shrink-0">
                  <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-[11px]">
                    {profileName ? profileName.slice(0, 2).toUpperCase() : "BS"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Main scrollable grid panels */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col xl:flex-row gap-8 items-start">
            
            {/* 3x2 Grid of 6 Interactive Shortcut Cards */}
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
                      onClick={() => handleSendMessage(shortcut.text)}
                      className={cn(
                        "text-left p-5 bg-canvas hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex flex-col justify-between h-[155px] cursor-pointer group",
                        shadowClass,
                        roundedClass
                      )}
                    >
                      <div className="space-y-3 w-full text-left">
                        {/* Custom Colored Icon Box */}
                        <div className={cn("h-10 w-10 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105", shortcut.color)}>
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

            {/* Premium Digital Insurance Shield Card Sidebar */}
            <div className="w-full xl:w-[320px] shrink-0 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-indigo-400">Guardian Shield</span>
                {profileName && (
                  <button 
                    onClick={() => {
                      // Reset profile triggers
                      setProfileName('');
                      setProfileAge('');
                      setProfileInsurance('');
                      setShieldCardData(null);
                      setActiveUi({
                        type: 'profile-form',
                        props: {
                          title: "Create Your Guardian Profile",
                          fields: ["name", "age", "insurance"]
                        }
                      });
                    }}
                    className="text-[10px] font-bold uppercase tracking-[1px] text-muted hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Settings className="h-3 w-3" /> Reset Plan
                  </button>
                )}
              </div>

              {/* The Stunning Digital Shield Card */}
              <div 
                className={cn(
                  "w-full h-[380px] max-w-sm overflow-hidden flex flex-col justify-between p-6 relative transition-all duration-700 ease-out select-none",
                  profileName 
                    ? "bg-gradient-to-br from-[#1c69d4] via-[#4f46e5] to-[#9333ea] text-white shadow-[0_20px_50px_rgba(99,102,241,0.22)] border border-white/10" 
                    : "bg-slate-800 border-2 border-dashed border-slate-700/80 text-slate-400 shadow-none",
                  roundedClass
                )}
              >
                {/* Glowing light overlay (Active only) */}
                {profileName && (
                  <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                )}

                {profileName ? (
                  /* ACTIVE / UNLOCKED PREMIUM STATE */
                  <>
                    {/* Top logo header */}
                    <div className="flex justify-between items-start z-10">
                      <div className="flex items-center gap-2">
                        <div className="h-8.5 w-8.5 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                          <BrainstyLogo className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-[15px] font-bold tracking-[0.5px]">Brainsty</span>
                      </div>
                      
                      <span className="text-[9px] font-bold bg-emerald-500/25 text-emerald-300 px-2.5 py-1 border border-emerald-500/35 tracking-[1px] uppercase rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        Shield Active
                      </span>
                    </div>

                    {/* Member Title */}
                    <div className="my-6 z-10 text-left">
                      <span className="text-[9px] font-bold uppercase tracking-[1.5px] text-indigo-200/80 block">Healthcare Shield</span>
                      <h4 className="text-[23px] font-bold font-display leading-tight tracking-tight mt-1 truncate">{profileName}</h4>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-white/15 pt-4 z-10 text-left">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[1px] text-indigo-200/60 block">Member ID</span>
                        <span className="text-[13.5px] font-bold font-code text-white mt-0.5 block">{shieldCardData?.memberId || "BRN-881571"}</span>
                      </div>
                      
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[1px] text-indigo-200/60 block">Group ID</span>
                        <span className="text-[13.5px] font-bold font-code text-white mt-0.5 block">{shieldCardData?.groupNumber || "GR-9002"}</span>
                      </div>
                      
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[1px] text-indigo-200/60 block">Plan Provider</span>
                        <span className="text-[13px] font-bold text-white mt-0.5 block truncate">{profileInsurance || "BCBS"}</span>
                      </div>
                      
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[1px] text-indigo-200/60 block">Shield Protection</span>
                        <span className="text-[13px] font-bold text-white mt-0.5 block">100% Protected</span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="text-[10px] text-white/50 font-light border-t border-white/10 pt-3.5 mt-4 flex justify-between items-center z-10">
                      <span>DEDUCTIBLE MET: $340 / $1,000</span>
                      <span>AGE: {profileAge || "34"}</span>
                    </div>
                  </>
                ) : (
                  /* INACTIVE / LOCKED STATE - incentivizes the user visually */
                  <div className="flex flex-col justify-between h-full w-full py-2">
                    <div className="flex justify-between items-center text-slate-500">
                      <div className="flex items-center gap-2">
                        <BrainstyLogo className="h-6 w-6 text-slate-600 opacity-60" />
                        <span className="text-[14px] font-bold">Brainsty</span>
                      </div>
                      <span className="text-[8px] font-bold border border-slate-700/60 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-[0.5px]">
                        Inactive
                      </span>
                    </div>

                    {/* Centered Lock icon and prompt */}
                    <div className="flex flex-col items-center justify-center flex-grow py-8 text-center space-y-3.5">
                      <div className="h-12 w-12 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 shadow-sm shadow-black/10">
                        <Lock className="h-5 w-5 animate-pulse text-slate-400" />
                      </div>
                      
                      <div className="space-y-1.5 px-4 text-center">
                        <span className="text-[14px] font-bold text-slate-200 block">Shield Profile Locked</span>
                        <span className="text-[11px] text-slate-400 block leading-normal max-w-[210px] mx-auto">
                          Complete Wefella's profile guardian form on the left to activate your coverage.
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-700/40 pt-3 text-center">
                      <span className="text-[9px] font-bold uppercase tracking-[1px] text-slate-500">
                        Awaiting configuration...
                      </span>
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
