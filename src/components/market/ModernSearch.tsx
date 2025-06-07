
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, X, TrendingUp, Clock, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'trending';
  count?: number;
}

const mockSuggestions: SearchSuggestion[] = [
  { id: "1", text: "Organic Fertilizer", type: "trending", count: 234 },
  { id: "2", text: "Tomato Seeds", type: "product" },
  { id: "3", text: "Irrigation Systems", type: "category", count: 45 },
  { id: "4", text: "NPK Fertilizer", type: "trending", count: 189 },
];

const recentSearches = ["Pesticides", "Wheat Seeds", "Drip Irrigation"];

interface ModernSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const ModernSearch = ({ onSearch, placeholder = "Search products, categories..." }: ModernSearchProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = mockSuggestions.filter(s => 
    s.text.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const startVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setQuery("Organic fertilizer");
      setIsListening(false);
    }, 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={inputRef}>
      <motion.div
        className={`relative backdrop-blur-md bg-white/20 border rounded-2xl transition-all duration-300 ${
          isFocused ? 'border-foliage/50 shadow-lg shadow-foliage/20' : 'border-white/30'
        }`}
        animate={{ scale: isFocused ? 1.02 : 1 }}
      >
        <div className="flex items-center px-4 py-3">
          <Search className="h-5 w-5 text-gray-600 mr-3" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-gray-800 placeholder:text-gray-500"
          />
          
          <div className="flex items-center gap-2">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  onSearch("");
                }}
                className="h-8 w-8 p-0 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={startVoiceSearch}
              className={`h-8 w-8 p-0 hover:bg-white/20 ${isListening ? 'text-red-500' : ''}`}
            >
              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/20"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuggestions && (isFocused || query) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 backdrop-blur-md bg-white/95 border border-white/30 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {query && filteredSuggestions.length > 0 && (
              <div className="p-3 border-b border-gray-200/50">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Suggestions
                </h4>
                {filteredSuggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion.id}
                    onClick={() => handleSearch(suggestion.text)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-foliage/10 transition-colors flex items-center justify-between group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-gray-800">{suggestion.text}</span>
                    <div className="flex items-center gap-2">
                      {suggestion.count && (
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.count}
                        </Badge>
                      )}
                      <Badge 
                        variant={suggestion.type === 'trending' ? 'default' : 'outline'} 
                        className="text-xs"
                      >
                        {suggestion.type}
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
            
            {!query && recentSearches.length > 0 && (
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Recent Searches
                </h4>
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-foliage/10 transition-colors text-gray-600"
                    whileHover={{ x: 5 }}
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
