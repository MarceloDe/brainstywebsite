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
    "hero.headline": "Your Healthcare Costs Shouldn't Be a Mystery",
    "hero.sub": "Brainsty is an AI concierge that works for YOU — not insurers, not providers. Know your real costs before you pay. Prevent surprise bills before they arrive. Optimize your benefits before open enrollment ends.",
    "hero.cta": "Get Early Access",
    "hero.tagline": "Independent. White-label. No ties to any insurer or provider.",

    // Why Different Section
    "why.headline": "Why Brainsty Is Different",
    "why.card1.title": "100% Independent — White Label",
    "why.card1.body": "Brainsty has zero association with insurers, providers, or health services companies. We work for you. Period. No hidden incentives. No sponsored recommendations.",
    "why.card2.title": "Always On, Always Watching",
    "why.card2.body": "Not a chatbot you visit. A continuous guardian — monitoring your plan, tracking regulatory changes, flagging billing errors, and optimizing your benefits 24/7.",
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
    "emp.f5": "Multilingual support (English, Spanish, Portuguese)"
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
    "hero.headline": "Los costos de su atención médica no deberían ser un misterio",
    "hero.sub": "Brainsty es un conserje de IA que trabaja para USTED, no para aseguradoras ni proveedores. Conozca sus costos reales antes de pagar. Evite facturas sorpresa antes de que lleguen. Optimice sus beneficios antes de que termine la inscripción abierta.",
    "hero.cta": "Obtener Acceso Temprano",
    "hero.tagline": "Independiente. Marca blanca. Sin vínculos con ninguna aseguradora o proveedor.",

    // Why Different Section
    "why.headline": "Por Qué Brainsty es Diferente",
    "why.card1.title": "100% Independiente — Marca Blanca",
    "why.card1.body": "Brainsty no tiene ninguna asociación con aseguradoras, proveedores ni compañías de servicios de salud. Trabajamos para usted. Punto. Sin incentivos ocultos. Sin recomendaciones patrocinadas.",
    "why.card2.title": "Siempre Activo, Siempre Vigilando",
    "why.card2.body": "No es un chatbot que visitas ocasionalmente. Es un guardián continuo que monitorea tu plan, rastrea cambios regulatorios, alerta sobre errores de facturación y optimiza tus beneficios 24/7.",
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
    "emp.f5": "Soporte multilingüe (inglés, español, portugués)"
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
    "hero.headline": "Os custos de sua saúde não deveriam ser um mistério",
    "hero.sub": "Brainsty é um concierge de IA que trabalha para VOCÊ — não para seguradoras nem prestadores de serviços. Saiba seus custos reais antes de pagar. Previna cobranças surpresa antes que elas cheguem. Otimize seus benefícios antes do término do período de adesão.",
    "hero.cta": "Obter Acesso Antecipado",
    "hero.tagline": "Independente. Marca branca. Sem vínculos com nenhuma seguradora ou prestador.",

    // Why Different Section
    "why.headline": "Por Que a Brainsty é Diferente",
    "why.card1.title": "100% Independente — Marca Branca",
    "why.card1.body": "A Brainsty tem associação zero com seguradoras, prestadores ou empresas de serviços de saúde. Nós trabalhamos para você. Ponto final. Sem incentivos ocultos. Sem recomendações patrocinadas.",
    "why.card2.title": "Sempre Ativo, Sempre Vigilante",
    "why.card2.body": "Não é um chatbot que você visita ocasionalmente. É um guardião contínuo — monitorando seu plano, acompanhando mudanças regulatórias, sinalizando erros de faturamento e otimizando seus benefícios 24/7.",
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
    "emp.f5": "Suporte multilíngue (inglês, espanhol, português)"
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
