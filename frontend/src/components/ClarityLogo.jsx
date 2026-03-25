function ClarityLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="clarity-logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c6af7" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill="url(#clarity-logo-grad)" />
      <path d="M14 5.5L6.5 13h15L14 5.5z" fill="white" />
      <path d="M6.5 13L14 22.5 21.5 13H6.5z" fill="white" fillOpacity="0.5" />
    </svg>
  );
}

export default ClarityLogo;
