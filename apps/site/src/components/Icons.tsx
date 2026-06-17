import type { SVGProps } from "react";

function BaseIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props} />;
}

export function TrailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M6 18c3-4 5-6 10-12" />
      <path d="M5 9h4v4" />
      <path d="M15 15h4v4" />
    </BaseIcon>
  );
}

export function FailureIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 9l6 6" />
      <path d="M15 9l-6 6" />
    </BaseIcon>
  );
}

export function QuirkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M8 3h8" />
      <path d="M10 3v7l-4 7a2 2 0 0 0 1.8 3h8.4A2 2 0 0 0 18 17l-4-7V3" />
      <path d="M9 14h6" />
    </BaseIcon>
  );
}

export function ActionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h10" />
      <path d="M11 6l6 6-6 6" />
    </BaseIcon>
  );
}

export function PortableIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="5" width="7" height="14" rx="2" />
      <rect x="13" y="9" width="7" height="10" rx="2" />
      <path d="M8 8h0" />
      <path d="M16 12h0" />
    </BaseIcon>
  );
}

export function FreshnessIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M12 4a8 8 0 1 1-7.4 11" />
      <path d="M4 4v5h5" />
      <path d="M12 8v4l3 2" />
    </BaseIcon>
  );
}
