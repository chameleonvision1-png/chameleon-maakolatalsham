type P = { className?: string };
const base = "w-5 h-5";
const S = ({ className, children }: P & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className ?? base} aria-hidden>
    {children}
  </svg>
);

export const CartIcon = (p: P) => (
  <S {...p}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></S>
);
export const PinIcon = (p: P) => (
  <S {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></S>
);
export const PhoneIcon = (p: P) => (
  <S {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></S>
);
export const ClockIcon = (p: P) => (
  <S {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></S>
);
export const SearchIcon = (p: P) => (
  <S {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></S>
);
export const MenuIcon = (p: P) => (
  <S {...p}><path d="M3 6h18M3 12h18M3 18h18" /></S>
);
export const XIcon = (p: P) => (
  <S {...p}><path d="M18 6 6 18M6 6l12 12" /></S>
);
export const ArrowUpIcon = (p: P) => (
  <S {...p}><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" /></S>
);
export const PlusIcon = (p: P) => (
  <S {...p}><path d="M12 5v14M5 12h14" /></S>
);
export const MinusIcon = (p: P) => (
  <S {...p}><path d="M5 12h14" /></S>
);
export const TrashIcon = (p: P) => (
  <S {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></S>
);
export const ChevronIcon = (p: P) => (
  <S {...p}><path d="m15 18-6-6 6-6" /></S>
);
export const ChevronDownIcon = (p: P) => (
  <S {...p}><path d="m6 9 6 6 6-6" /></S>
);
export const FileTextIcon = (p: P) => (
  <S {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </S>
);
export const LinkIcon = (p: P) => (
  <S {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </S>
);
export const TagIcon = (p: P) => (
  <S {...p}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </S>
);
export const InstagramIcon = (p: P) => (
  <S {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </S>
);
export const TikTokIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.05.85.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7.15a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.96-.05v-4.32z" />
  </svg>
);
export const StarIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "w-4 h-4"} aria-hidden>
    <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
);
export const WhatsAppIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden>
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.6-8.4z" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <S {...p}><path d="M20 6 9 17l-5-5" /></S>
);
export const FireIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "w-3.5 h-3.5"} aria-hidden>
    <path d="M12 23c4.97 0 8-3.58 8-8.2 0-3.52-2.15-6.86-4.5-8.8-.35-.29-.88-.02-.85.43.09 1.32-.32 2.52-1.15 3.17-.28.22-.69.06-.74-.3-.35-2.67-1.88-5.28-4.16-6.99-.37-.28-.9-.01-.89.45.05 2.48-.95 4.65-2.55 6.44C3.38 11.2 2 13.78 2 16.5 2 20.36 6.48 23 12 23zm0-4c-2.21 0-4-1.57-4-3.5 0-1.32.72-2.5 1.88-3.35.25-.18.6-.01.62.3.05.78.52 1.42 1.15 1.68.25.1.52-.07.55-.34.14-1.17.85-2.2 1.92-2.77.28-.15.62.05.61.37-.04 1.12.42 2.13 1.27 2.86.64.55 1 1.35 1 2.25 0 1.93-1.79 3.5-5 3.5z" />
  </svg>
);
export const SparkleIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "w-3.5 h-3.5"} aria-hidden>
    <path d="M12 2L14.6 9.4 22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2z" />
  </svg>
);
export const UsersIcon = (p: P) => (
  <S {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></S>
);
export const NoteIcon = (p: P) => (
  <S {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></S>
);
export const GridIcon = (p: P) => (
  <S {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></S>
);
export const ListIcon = (p: P) => (
  <S {...p}><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /></S>
);
export const UtensilsIcon = (p: P) => (
  <S {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></S>
);
export const Cube3DIcon = (p: P) => (
  <S {...p}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </S>
);
export const PhotoIcon = (p: P) => (
  <S {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </S>
);
export const DownloadAppIcon = (p: P) => (
  <S {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </S>
);
export const ShareIosIcon = (p: P) => (
  <S {...p}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </S>
);
export const QrCodeIcon = (p: P) => (
  <S {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 19h2v2h-2zM19 14h2v2h-2z" />
  </S>
);
export const ShareNodesIcon = (p: P) => (
  <S {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </S>
);
export const CopyIcon = (p: P) => (
  <S {...p}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </S>
);
export const PrintIcon = (p: P) => (
  <S {...p}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" rx="1" />
  </S>
);
export const FacebookIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden>
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);
export const TelegramIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);
export const XSocialIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
export const ExternalLinkIcon = (p: P) => (
  <S {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </S>
);
export const BagIcon = CartIcon;
export const CloseIcon = XIcon;
export const QrIcon = QrCodeIcon;

