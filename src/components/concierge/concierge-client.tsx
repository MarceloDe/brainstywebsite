"use client";

import { useState, useRef, useEffect } from 'react';
import { aiConciergeAssistance } from '@/ai/flows/ai-concierge-assistance';
import { useAuth } from '@/context/auth-context';
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
  Plus
} from 'lucide-react';
import { BrainstyLogo } from '@/components/shared/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UiComponent {
  type: 'profile-form' | 'poll' | 'yes-no' | 'insurance-card';
  props: Record<string, any>;
}

export default function ConciergeClient() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
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

  // Profile data states
  const [profileName, setProfileName] = useState('');
  const [profileAge, setProfileAge] = useState('');
  const [profileInsurance, setProfileInsurance] = useState('');
  const [shieldCardData, setShieldCardData] = useState<any>(null);

  // PDF Upload states
  const [pdfName, setPdfName] = useState('');
  const [pdfSize, setPdfSize] = useState('');
  const [uploadProgress, setUploadProgress] = useState(-1); // -1 means no upload

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

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiConciergeAssistance({ query: textToSend });
      const assistantMessage: Message = { role: 'assistant', content: response.response };
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
        setActiveUi(null);
      }
    } catch (err) {
      const errorMessage: Message = { role: 'assistant', content: "I encountered an error analyzing your request. Please try again." };
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

    setPdfName(file.name);
    setPdfSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`);
    setUploadProgress(0);

    // Simulate an interactive uploading progress animation
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Sync file metadata to Firestore once finished
          if (user) {
            updateDoc(doc(db, "users", user.uid), {
              lastUploadedBill: {
                filename: file.name,
                filesize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                uploadedAt: new Date().toISOString(),
                status: "SCANNED_OK"
              }
            });
          }
          // Automatically trigger concierge query to scan bill
          handleSendMessage(`Analyze my uploaded bill: ${file.name}`);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Clickable shortcut boxes triggers
  const shortcuts = [
    { title: "Price an MRI Procedure", desc: "Compare average cash price vs hospital negotiated rates", text: "Find real negotiated prices for an MRI procedure" },
    { title: "Fight Surprise Emergency Bill", desc: "Scan and build dispute scripts for emergency billing", text: "Fight an emergency surprise bill" },
    { title: "Optimize Pharmacy Expenses", desc: "Check drug therapeutic alternatives and plan deductibles", text: "Review active plan pharmacy costs" },
    { title: "Deductible Strategy Check", desc: "Determine how to structure employer benefits year-round", text: "Optimize employer benefits options" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-canvas text-ink py-10 px-4 md:px-8">
      {/* Dynamic Grid Layout: Chat on Left, Floating A2UI Canvas on Right */}
      <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Premium Wefella Chat Area */}
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
          <div className="mb-6">
            <h1 className="text-[32px] font-bold font-display tracking-tight text-ink">
              Meet Wefella
            </h1>
            <p className="text-[14px] font-light text-body">
              Your autonomous AI healthcare resident. No insurer ties. Independent shield protection.
            </p>
          </div>

          {/* Interactive Chat Canvas */}
          <div className="flex-grow border border-hairline bg-canvas rounded-none flex flex-col p-6 h-full relative overflow-hidden">
            <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
              <div className="space-y-6 pb-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-4',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-10 w-10 border border-hairline rounded-full bg-surface-soft">
                        <AvatarFallback className="bg-canvas text-ink">
                          <BrainstyLogo className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-xl px-5 py-4 rounded-none border border-hairline',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-surface-soft text-ink'
                      )}
                    >
                      <p className="text-[15px] font-body leading-relaxed whitespace-pre-line">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-10 w-10 border border-hairline rounded-full bg-primary text-primary-foreground">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-4 justify-start">
                    <Avatar className="h-10 w-10 border border-hairline rounded-full bg-surface-soft">
                      <AvatarFallback className="bg-canvas text-ink">
                        <BrainstyLogo className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-surface-soft border border-hairline rounded-none px-6 py-4 flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>

              {/* Clickable Quick Shortcut Grid - Displayed inside free chat canvas when screen is quiet */}
              {messages.length <= 2 && (
                <div className="mt-8 pt-8 border-t border-hairline">
                  <h3 className="text-[13px] font-bold uppercase tracking-[1.5px] text-muted mb-4">Suggested Operations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shortcuts.map((shortcut, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(shortcut.text)}
                        className="text-left p-5 border border-hairline bg-canvas hover:border-primary transition-all duration-300 rounded-none flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <h4 className="text-[15px] font-bold text-ink group-hover:text-primary transition-colors">{shortcut.title}</h4>
                          <p className="text-[12px] font-light text-muted leading-snug">{shortcut.desc}</p>
                        </div>
                        <div className="mt-4 flex items-center text-[13px] font-bold text-primary tracking-[0.5px]">
                          Launch Shield <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Chat message form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} 
              className="mt-6 flex items-center gap-3 border-t border-hairline pt-4"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Wefella healthcare concierge..."
                className="flex-grow text-[15px] font-body bg-canvas border-hairline rounded-none h-12 focus-visible:ring-primary focus-visible:border-primary"
                aria-label="Wefella Input"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-12 w-12 rounded-none bg-primary text-on-primary hover:bg-primary-active transition-colors"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive A2UI Canvas & Document Scanners */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dynamic Interactive Card Container */}
          <div className="border border-hairline bg-canvas p-6 rounded-none relative shadow-sm min-h-[300px] flex flex-col justify-between">
            <div className="border-b border-hairline pb-4 mb-4 flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-[1.5px] text-primary flex items-center gap-1.5">
                <Activity className="h-4 w-4 animate-pulse" /> A2UI Interactive Canvas
              </span>
              <span className="text-[12px] font-light text-muted">Generated by Gemini</span>
            </div>

            {/* A2UI Component Renderer */}
            <div className="flex-grow flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {activeUi ? (
                  <motion.div
                    key={activeUi.type}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    
                    {/* A2UI Component 1: Profile Creation Form */}
                    {activeUi.type === 'profile-form' && (
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <h2 className="text-[20px] font-bold text-ink">{activeUi.props.title || "Configure Shield Profile"}</h2>
                          <p className="text-[13px] font-light text-muted">Fill out your base credentials to activate coverage.</p>
                        </div>
                        <div className="space-y-3 pt-2">
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold uppercase tracking-[1px] text-body">Full Name</label>
                            <Input
                              required
                              value={profileName}
                              onChange={(e) => setProfileName(e.target.value)}
                              placeholder="e.g., John Doe"
                              className="rounded-none border-hairline focus-visible:ring-primary"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[12px] font-bold uppercase tracking-[1px] text-body">Age</label>
                              <Input
                                required
                                type="number"
                                value={profileAge}
                                onChange={(e) => setProfileAge(e.target.value)}
                                placeholder="e.g., 34"
                                className="rounded-none border-hairline"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[12px] font-bold uppercase tracking-[1px] text-body">Insurance</label>
                              <Input
                                required
                                value={profileInsurance}
                                onChange={(e) => setProfileInsurance(e.target.value)}
                                placeholder="e.g., BCBS, Aetna"
                                className="rounded-none border-hairline"
                              />
                            </div>
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="w-full mt-4 rounded-none bg-primary text-on-primary hover:bg-primary-active h-11"
                        >
                          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Consolidate Health Case"}
                        </Button>
                      </form>
                    )}

                    {/* A2UI Component 2: Multiple Choice Poll */}
                    {activeUi.type === 'poll' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-[18px] font-bold text-ink">{activeUi.props.question}</h3>
                          <p className="text-[13px] font-light text-muted">Click an option to execute a guided scan.</p>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                          {activeUi.props.options?.map((option: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => {
                                handleSendMessage(option);
                                // If they clicked pdf scanner, open file uploader
                                if (option.includes("PDF") && fileInputRef.current) {
                                  fileInputRef.current.click();
                                }
                              }}
                              className="w-full text-left p-4 border border-hairline bg-canvas hover:border-primary transition-colors text-[14px] font-normal text-ink rounded-none flex items-center justify-between group"
                            >
                              <span>{option}</span>
                              <ChevronRight className="h-4 w-4 text-muted group-hover:text-primary transition-transform group-hover:translate-x-1" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* A2UI Component 3: Binary Yes/No Choice */}
                    {activeUi.type === 'yes-no' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-[18px] font-bold text-ink">{activeUi.props.question}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <Button
                            onClick={() => handleSendMessage("Yes")}
                            variant="default"
                            className="rounded-none bg-primary text-on-primary hover:bg-primary-active h-11"
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() => handleSendMessage("No")}
                            variant="outline"
                            className="rounded-none border-hairline hover:bg-surface-soft h-11"
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* A2UI Component 4: Digital Insurance Shield Card */}
                    {activeUi.type === 'insurance-card' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-[18px] font-bold text-ink">Brainsty Healthcare Shield</h3>
                          <p className="text-[13px] font-light text-muted">Consolidated member coverage active on Firestore.</p>
                        </div>
                        
                        {/* Interactive Digital Shield Card */}
                        <div className="relative overflow-hidden p-6 bg-gradient-to-r from-[#4A90E2] to-[#9013FE] text-white rounded-none border border-transparent flex flex-col justify-between h-[200px] shadow-md">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold uppercase tracking-[1.5px] opacity-75">Member Shield Card</span>
                              <h4 className="text-[20px] font-bold font-display leading-tight">{activeUi.props.name || "John Doe"}</h4>
                            </div>
                            <BrainstyLogo className="h-8 w-8 text-white opacity-85" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-left">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-[1px] opacity-60 block">Member ID</span>
                              <span className="text-[14px] font-bold font-code">{activeUi.props.memberId || "BRN-881571"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-[1px] opacity-60 block">Group ID</span>
                              <span className="text-[14px] font-bold font-code">{activeUi.props.groupNumber || "GR-9002"}</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-white/20 pt-2 flex justify-between items-center text-[10px]">
                            <span className="font-light tracking-[0.5px]">PROVIDER: {activeUi.props.insurance || "BCBS"} (AGE: {activeUi.props.age})</span>
                            <span className="bg-canvas text-primary font-bold px-2 py-0.5 tracking-[1px] uppercase rounded-none">{activeUi.props.status || "SHIELD ACTIVE"}</span>
                          </div>
                        </div>

                        {/* Reset button to do a new check */}
                        <Button
                          onClick={() => setActiveUi({
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
                          })}
                          variant="outline"
                          className="w-full rounded-none border-hairline hover:bg-surface-soft"
                        >
                          Modify Shield Options
                        </Button>
                      </div>
                    )}

                  </motion.div>
                ) : (
                  <div className="text-center py-8 text-muted">
                    <Info className="h-8 w-8 mx-auto mb-2 text-muted-soft" />
                    <p className="text-[14px] font-light">Interactive canvas is idle. Send a message to Wefella to begin.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Generative PDF Uploader and Thumbnail Card */}
          <div className="border border-hairline bg-canvas p-6 rounded-none">
            <h3 className="text-[13px] font-bold uppercase tracking-[1.5px] text-muted mb-4">Medical Document Scanner</h3>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />

            {/* Standard Trigger Box when no file is active */}
            {uploadProgress === -1 ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border border-dashed border-hairline bg-canvas hover:border-primary transition-all duration-300 rounded-none flex flex-col items-center justify-center gap-3 group"
              >
                <div className="h-12 w-12 rounded-full border border-hairline bg-surface-soft flex items-center justify-center text-muted group-hover:text-primary transition-colors">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <span className="text-[15px] font-bold text-ink block group-hover:text-primary transition-colors">Scan Plan Details or Bill</span>
                  <span className="text-[12px] font-light text-muted">Upload a medical invoice or benefits PDF</span>
                </div>
              </button>
            ) : (
              /* A2UI Generative Card for Uploading and Document Thumbnail */
              <div className="space-y-4">
                <div className="border border-hairline p-4 bg-surface-soft flex items-center gap-4 rounded-none">
                  {/* Visual Document Thumbnail Icon */}
                  <div className="h-14 w-12 bg-canvas border border-hairline flex flex-col justify-between p-2 shadow-sm rounded-none relative">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="text-[8px] font-bold text-primary font-code leading-none">PDF</span>
                    {uploadProgress >= 100 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-canvas rounded-full text-success">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="flex-grow space-y-1 overflow-hidden">
                    <span className="text-[14px] font-bold text-ink block truncate">{pdfName}</span>
                    <span className="text-[12px] font-light text-muted block">{pdfSize}</span>
                  </div>
                </div>

                {/* Progress Bar (Visible while scanning) */}
                {uploadProgress < 100 ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-[1.5px] text-primary">
                      <span>Analyzing Document...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-soft rounded-none overflow-hidden border border-hairline">
                      <div 
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Scan completed check */
                  <div className="flex items-center justify-between text-[12px] font-bold uppercase tracking-[1px] text-success">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> SCAN COMPLETE
                    </span>
                    <button 
                      onClick={() => { setUploadProgress(-1); setPdfName(''); }}
                      className="text-[11px] text-muted hover:text-primary transition-colors uppercase tracking-[1px]"
                    >
                      Clear Scan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
