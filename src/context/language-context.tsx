"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "es" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header & Navigation
    "nav.howItWorks": "How It Works",
    "nav.yourShield": "Your Shield",
    "nav.whyBrainsty": "Why Brainsty",
    "nav.forEmployers": "For Employers",
    "nav.cognitiveAi": "Cognitive AI",
    "nav.wefellaChat": "Wefella Chat",
    "nav.curatedResearch": "Curated Research",
    "nav.intelligenceMap": "Intelligence Map",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.logout": "Log out",

    // Hero Section
    "hero.headline": "End the Mystery. Know the Truth Behind Every Bill.",
    "hero.sub": "Brainsty is an autonomous health agent that works for YOU — not insurers, not providers. It guards your money, makes every price clear, and stops surprise bills before they reach you.",
    "hero.cta": "Put Brainsty to Work",
    "hero.tagline": "Independent. White-label. No ties to any insurer or provider.",

    // Why Different Section
    "why.headline": "Why Brainsty Is Different",
    "why.card1.title": "100% Independent — White Label",
    "why.card1.body": "Brainsty has zero association with insurers, providers, or health services companies. We work for you. Period. No hidden incentives. No sponsored recommendations.",
    "why.card2.title": "It Acts Before You Ask",
    "why.card2.body": "Not a chatbot you visit. An autonomous agent that watches your plan, your bills, and your benefits 24/7 — catching savings and killing surprise charges before they reach you.",
    "why.card3.title": "Real Data, Not Estimates",
    "why.card3.body": "Powered by 5 billion+ actual negotiated rates from hospital transparency data, government databases, and regulatory filings. You see what things REALLY cost.",
    "why.card4.title": "Speaks Your Language",
    "why.card4.body": "Available in English, Spanish, and Portuguese. Because healthcare confusion shouldn't have a language barrier.",

    // Employers Section
    "emp.headline": "Give Your Team a Healthcare Advantage",
    "emp.sub": "Brainsty integrates as a white-label solution for your organization. Reduce benefits administration burden, improve employee satisfaction, and lower claims costs — all while empowering your team with real healthcare intelligence.",
    "emp.cta": "Request Employer Demo",
    "emp.f1": "White-label branding — your logo, your colors, your people",
    "emp.f2": "Per-employee-per-month pricing — predictable, scalable",
    "emp.f3": "Benefits consultant partnership program",
    "emp.f4": "HIPAA-compliant architecture",
    "emp.f5": "Multilingual support (English, Spanish, Portuguese)",

    // Video Sections
    "video1.title": "Real-Time Healthcare Navigation",
    "video1.desc": "Watch the agent navigate hospital billing, map real negotiated rates, and surface the truth in milliseconds.",
    "video2.title": "Independent Benefits Optimizer",
    "video2.desc": "See the agent scan regulatory filings and insurance plans — flagging errors and optimizing your benefits while you sleep."
  },
  es: {
    // Header & Navigation
    "nav.howItWorks": "Cómo Funciona",
    "nav.yourShield": "Tu Escudo",
    "nav.whyBrainsty": "Por Qué Brainsty",
    "nav.forEmployers": "Para Empleadores",
    "nav.cognitiveAi": "IA Cognitiva",
    "nav.wefellaChat": "Chat Wefella",
    "nav.curatedResearch": "Investigación",
    "nav.intelligenceMap": "Mapa de Inteligencia",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    "nav.logout": "Cerrar sesión",

    // Hero Section
    "hero.headline": "Acaba con el Misterio. Conoce la Verdad Detrás de Cada Factura.",
    "hero.sub": "Brainsty es un agente de salud autónomo que trabaja para USTED, no para aseguradoras ni proveedores. Protege tu dinero, hace que cada precio sea claro y detiene las facturas sorpresa antes de que te lleguen.",
    "hero.cta": "Pon a Brainsty a Trabajar",
    "hero.tagline": "Independiente. Marca blanca. Sin vínculos con ninguna aseguradora o proveedor.",

    // Why Different Section
    "why.headline": "Por Qué Brainsty es Diferente",
    "why.card1.title": "100% Independiente — Marca Blanca",
    "why.card1.body": "Brainsty no tiene ninguna asociación con aseguradoras, proveedores ni compañías de servicios de salud. Trabajamos para usted. Punto. Sin incentivos ocultos. Sin recomendaciones patrocinadas.",
    "why.card2.title": "Actúa Antes de que Preguntes",
    "why.card2.body": "No es un chatbot que visitas. Es un agente autónomo que vigila tu plan, tus facturas y tus beneficios 24/7 — capturando ahorros y eliminando cargos sorpresa antes de que te lleguen.",
    "why.card3.title": "Datos Reales, No Estimaciones",
    "why.card3.body": "Respaldado por más de 5 mil millones de tarifas negociadas reales de datos de transparencia hospitalaria, bases de datos gubernamentales y archivos regulatorios. Ves lo que las cosas REALMENTE cuestan.",
    "why.card4.title": "Habla Tu Idioma",
    "why.card4.body": "Disponible en inglés, español y portugués. Porque la confusión sobre la atención médica no debería tener una barrera idiomática.",

    // Employers Section
    "emp.headline": "Dé a su Equipo una Ventaja en Salud",
    "emp.sub": "Brainsty se integra como una solución de marca blanca para su organización. Reduzca la carga de administración de beneficios, mejore la satisfacción de los empleados y disminuya los costos de reclamaciones, todo mientras empodera a su equipo con inteligencia de salud real.",
    "emp.cta": "Solicitar Demo de Empleador",
    "emp.f1": "Marca blanca: su logotipo, sus colores, su gente",
    "emp.f2": "Precios por empleado al mes: predecibles y escalables",
    "emp.f3": "Programa de asociación para consultores de beneficios",
    "emp.f4": "Arquitectura que cumple con HIPAA",
    "emp.f5": "Soporte multilingüe (inglés, español, portugués)",

    // Video Sections
    "video1.title": "Navegación de Salud en Tiempo Real",
    "video1.desc": "Mira al agente navegar la facturación hospitalaria, mapear tarifas reales negociadas y revelar la verdad en milisegundos.",
    "video2.title": "Optimizador de Beneficios Independiente",
    "video2.desc": "Mira al agente escanear documentos regulatorios y planes de seguro — señalando errores y optimizando tus beneficios mientras duermes."
  },
  pt: {
    // Header & Navigation
    "nav.howItWorks": "Como Funciona",
    "nav.yourShield": "Seu Escudo",
    "nav.whyBrainsty": "Por Que Brainsty",
    "nav.forEmployers": "Para Empregadores",
    "nav.cognitiveAi": "IA Cognitiva",
    "nav.wefellaChat": "Chat Wefella",
    "nav.curatedResearch": "Pesquisa Curada",
    "nav.intelligenceMap": "Mapa de Inteligência",
    "nav.login": "Entrar",
    "nav.signup": "Cadastrar-se",
    "nav.logout": "Sair",

    // Hero Section
    "hero.headline": "Acabe com o Mistério. Conheça a Verdade Por Trás de Cada Conta.",
    "hero.sub": "A Brainsty é um agente de saúde autônomo que trabalha por VOCÊ — não pelas seguradoras nem pelos prestadores de serviços. Ele guarda seu dinheiro, torna cada preço claro e impede contas surpresa antes que cheguem até você.",
    "hero.cta": "Coloque a Brainsty para Trabalhar",
    "hero.tagline": "Independente. Marca branca. Sem vínculos com nenhuma seguradora ou prestador.",

    // Why Different Section
    "why.headline": "Por Que a Brainsty é Diferente",
    "why.card1.title": "100% Independente — Marca Branca",
    "why.card1.body": "A Brainsty tem associação zero com seguradoras, prestadores ou empresas de serviços de saúde. Nós trabalhamos para você. Ponto final. Sem incentivos ocultos. Sem recomendações patrocinadas.",
    "why.card2.title": "Ele Age Antes de Você Pedir",
    "why.card2.body": "Não é um chatbot que você visita. É um agente autônomo que vigia seu plano, suas contas e seus benefícios 24/7 — capturando economias e eliminando cobranças surpresa antes que cheguem até você.",
    "why.card3.title": "Dados Reais, Não Estimativas",
    "why.card3.body": "Alimentado por mais de 5 bilhões de tarifas reais acordadas a partir de dados de transparência hospitalar, bancos de dados governamentais e registros regulatórios. Você vê o que as coisas REALMENTE custam.",
    "why.card4.title": "Fala a Sua Língua",
    "why.card4.body": "Disponível em inglês, espanhol e português. Porque a confusão com a saúde não deve ter barreira linguística.",

    // Employers Section
    "emp.headline": "Dê à sua Equipe uma Vantagem na Saúde",
    "emp.sub": "A Brainsty se integra como uma solução de marca branca para a sua organização. Reduza a carga administrativa de benefícios, melhore a satisfação dos colaboradores e diminua os custos com sinistros — tudo isso enquanto capacita sua equipe com inteligência de saúde real.",
    "emp.cta": "Solicitar Demo para Empregadores",
    "emp.f1": "Marca branca — seu logotipo, suas cores, sua equipe",
    "emp.f2": "Preço por funcionário por mês — previsível e escalável",
    "emp.f3": "Programa de parceria para consultores de benefícios",
    "emp.f4": "Arquitetura em conformidade com a HIPAA",
    "emp.f5": "Suporte multilíngue (inglês, espanhol, português)",

    // Video Sections
    "video1.title": "Navegação em Saúde em Tempo Real",
    "video1.desc": "Veja o agente navegar pela cobrança hospitalar, mapear tarifas reais negociadas e revelar a verdade em milissegundos.",
    "video2.title": "Otimizador de Benefícios Independente",
    "video2.desc": "Veja o agente analisar documentos regulatórios e planos de seguro — sinalizando erros e otimizando seus benefícios enquanto você dorme."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("brainsty_lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "es" || savedLang === "pt")) {
      setLanguageState(savedLang);
    } else {
      // Check system language
      const sysLang = navigator.language.substring(0, 2);
      if (sysLang === "es") {
        setLanguageState("es");
      } else if (sysLang === "pt") {
        setLanguageState("pt");
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("brainsty_lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
