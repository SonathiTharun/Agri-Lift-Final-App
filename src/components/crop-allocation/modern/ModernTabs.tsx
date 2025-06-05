
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ModernTabsProps {
  tabs: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const ModernTabs: React.FC<ModernTabsProps> = ({ 
  tabs, 
  defaultValue, 
  onValueChange 
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const handleValueChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleValueChange} className="w-full">
      <TabsList className="grid w-full bg-white/20 backdrop-blur-sm border border-white/30 p-1 rounded-2xl shadow-lg" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-700"
          >
            {tab.icon && <span className="text-sm">{tab.icon}</span>}
            <span className="font-medium">{tab.label}</span>
            {activeTab === tab.value && (
              <motion.div
                className="absolute inset-0 bg-white rounded-xl shadow-md"
                layoutId="activeTab"
                transition={{ type: "spring", duration: 0.3 }}
                style={{ zIndex: -1 }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-6 focus-visible:outline-none"
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {tab.content}
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ModernTabs;
