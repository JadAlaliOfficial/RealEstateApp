import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Optional category label; items with the same label are grouped together */
  category?: string;
};
