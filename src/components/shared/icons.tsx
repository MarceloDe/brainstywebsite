import type { SVGProps } from "react";

export function BrainstyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="brain-gradient" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="#9013FE" />
        </linearGradient>
      </defs>
      <path 
        d="M26.9999 6.24875C26.9999 5.25375 26.2624 4.375 25.3124 4.1875L16.4374 2.34375C16.1524 2.28438 15.8474 2.28438 15.5624 2.34375L6.68741 4.1875C5.73741 4.375 4.99991 5.25375 4.99991 6.24875V14.25C4.99991 22.375 14.3124 29.3125 15.6562 30.0188C15.8624 30.1375 16.1374 30.1375 16.3436 30.0188C17.6874 29.3125 26.9999 22.375 26.9999 14.25V6.24875Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M16 8V24" 
        stroke="url(#brain-gradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M16 12C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20" 
        stroke="url(#brain-gradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M16 8C13.7909 8 12 9.79086 12 12C12 14.2091 13.7909 16 16 16" 
        stroke="url(#brain-gradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M16 20C13.7909 20 12 21.7909 12 24" 
        stroke="url(#brain-gradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TranslateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      <path d="m5 12 5-5"/>
      <path d="m10 12-5-5"/>
    </svg>
  );
}

export function IntegrateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 20v-4"/>
      <path d="M12 10V4"/>
      <path d="m4.93 19.07 3.53-3.53"/>
      <path d="m15.54 8.46 3.53-3.53"/>
      <path d="M4 12H2"/>
      <path d="M10 12H8"/>
      <path d="M16 12h-2"/>
      <path d="M22 12h-2"/>
      <path d="m4.93 4.93 3.53 3.53"/>
      <path d="m15.54 15.54 3.53 3.53"/>
      <path d="M12 2v2"/>
      <path d="M12 16h0"/>
    </svg>
  );
}


export function DeliveryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
      <path d="M12 12h.01"/>
    </svg>
  );
}
