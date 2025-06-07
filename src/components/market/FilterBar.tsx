
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { motion } from "framer-motion";

interface FilterBarProps {
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const FilterBar = ({ 
  filterOpen, 
  setFilterOpen, 
  activeFilter, 
  setActiveFilter 
}: FilterBarProps) => {
  const filterButtons = [
    { id: "all", label: "All" },
    { id: "lab-grown-plants", label: "Plants" },
    { id: "seeds", label: "Seeds" },
    { id: "fertilizers", label: "Fertilizers" },
    { id: "pesticides", label: "Pesticides" },
    { id: "farming-tools", label: "Tools" }
  ];

  return (
    <motion.div 
      className="flex flex-wrap items-center justify-center gap-2 my-10 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="bg-white py-2 px-4 rounded-full shadow-md flex flex-wrap items-center justify-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`rounded-full border-gray-200 ${filterOpen ? 'bg-foliage text-white border-foliage' : ''}`}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter size={16} className="mr-1" /> Filters
        </Button>
        
        {filterButtons.map((btn) => (
          <Button
            key={btn.id}
            variant="outline"
            size="sm"
            className={`rounded-full border-gray-200 ${activeFilter === btn.id ? 'bg-foliage text-white border-foliage' : 'hover:bg-foliage/10'}`}
            onClick={() => setActiveFilter(btn.id)}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
