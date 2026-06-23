export function BrandMark() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="brand-logo" 
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <rect width="24" height="24" rx="6" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1" />
      {/* Latch hook representing structured state flow and continuity */}
      <path 
        d="M7 6v9c0 1.657 1.343 3 3 3h7" 
        stroke="var(--accent)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx="7" cy="6" r="1.5" fill="var(--accent-hover)" />
      <path d="M12 10h5" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 14h5" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}