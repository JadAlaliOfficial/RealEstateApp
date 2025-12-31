import React from 'react';
import { Button } from '@/components/ui/button';

interface TabNavigationProps {
  activeTab: 'offers' | 'renewals' | 'both';
  onTabChange: (tab: 'offers' | 'renewals' | 'both') => void;
}

const TABS = [
  { label: 'Offers', value: 'offers' },
  { label: 'Renewals', value: 'renewals' },
  { label: 'Both', value: 'both' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mt-4 flex gap-2">
      {TABS.map(tab => (
        <Button
          key={tab.value}
          variant={activeTab === tab.value ? 'default' : 'outline'}
          onClick={() => onTabChange(tab.value as any)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};
