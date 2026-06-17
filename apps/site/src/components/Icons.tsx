import type { SVGProps } from "react";

function BaseIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" {...props} />;
}

export function TrailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M5 17.5c2.8-1 4.9-3.2 6.3-6.6 1.2-3 3.3-5 7.7-6.4" />
      <path d="M15 4h4v4" />
      <circle cx="6" cy="18" r="2.25" />
    </BaseIcon>
  );
}

export function FailureIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3.8 20 18a1 1 0 0 1-.87 1.5H4.87A1 1 0 0 1 4 18L12 3.8Z" />
      <path d="M12 9v4.4" />
      <path d="M12 17h.01" />
    </BaseIcon>
  );
}

export function QuirkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <rect x="5" y="5" width="14" height="14" rx="3" />
      <path d="M10 9v6" />
      <path d="M14 12h.01" />
      <path d="M16 9v6" />
    </BaseIcon>
  );
}

export function ActionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 12H16" />
      <path d="m11.5 7.5 4.5 4.5-4.5 4.5" />
      <path d="M6 7.5h2.5" />
      <path d="M6 16.5h5" />
    </BaseIcon>
  );
}

export function PortableIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="6" width="8" height="12" rx="2" />
      <rect x="13" y="9" width="7" height="9" rx="2" />
      <path d="M8 9h0" />
      <path d="M16.5 12h0" />
    </BaseIcon>
  );
}

export function FreshnessIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M20 7.5V4h-3.5" />
      <path d="M19 12a7 7 0 1 1-2.05-4.95L20 10.1" />
      <path d="M12 8.4v3.8l2.6 1.5" />
    </BaseIcon>
  );
}

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </BaseIcon>
  );
}

export function OrbitIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M4.7 9.8c2.3-3.9 6.8-5.4 11.8-3.7" />
      <path d="M7.4 18.2c-2.6-3.7-2.4-8.4.7-12.3" />
      <path d="M18.5 14.6c-2 4.1-6.2 5.9-11.4 4.8" />
    </BaseIcon>
  );
}

export function LedgerStackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M6 7.5h12" />
      <path d="M6 12h12" />
      <path d="M6 16.5h8" />
      <rect x="4" y="4.5" width="16" height="15" rx="3" />
    </BaseIcon>
  );
}

export function TerminalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="5" width="17" height="14" rx="3" />
      <path d="m7.5 10 2.8 2-2.8 2" />
      <path d="M12.8 14H16.5" />
    </BaseIcon>
  );
}
