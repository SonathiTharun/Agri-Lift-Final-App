import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Clock,
  DollarSign,
  FileText,
  Shield
} from "lucide-react";
import { GlassCard } from "@/components/market/GlassCard";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "What documents are required for an agricultural loan?",
    answer: "Typically, you'll need: Aadhaar card, PAN card, land ownership documents, income proof, bank statements for the last 6 months, passport-size photographs, and crop cultivation details.",
    category: "Documentation",
    tags: ["documents", "requirements", "application"]
  },
  {
    id: "2",
    question: "How long does the loan approval process take?",
    answer: "The approval process usually takes 7-15 working days, depending on the bank and completeness of your documentation. Some banks offer faster processing for existing customers.",
    category: "Process",
    tags: ["approval", "timeline", "processing"]
  },
  {
    id: "3",
    question: "What is the maximum loan amount I can get?",
    answer: "Loan amounts vary by bank and loan type. Typically, crop loans can go up to ₹3 lakhs without collateral, while equipment loans can go up to ₹1 crore with proper collateral.",
    category: "Amount",
    tags: ["maximum", "limit", "amount"]
  },
  {
    id: "4",
    question: "Are there any government subsidies available?",
    answer: "Yes, various government schemes offer interest subsidies and support. These include PM-KISAN, Kisan Credit Card scheme, and state-specific agricultural loan schemes.",
    category: "Subsidies",
    tags: ["government", "subsidy", "schemes"]
  },
  {
    id: "5",
    question: "What happens if I can't repay the loan on time?",
    answer: "Banks typically offer restructuring options during natural calamities or crop failures. It's important to communicate with your bank early if you anticipate repayment issues.",
    category: "Repayment",
    tags: ["repayment", "default", "restructuring"]
  },
  {
    id: "6",
    question: "Can I get a loan without land ownership documents?",
    answer: "Some banks offer loans to tenant farmers with proper tenancy agreements. Kisan Credit Cards can also be issued to tenant farmers in some states.",
    category: "Eligibility",
    tags: ["tenant", "ownership", "eligibility"]
  }
];

const categories = ["All", "Documentation", "Process", "Amount", "Subsidies", "Repayment", "Eligibility"];

export const LoanFAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Documentation": return <FileText className="h-4 w-4" />;
      case "Process": return <Clock className="h-4 w-4" />;
      case "Amount": return <DollarSign className="h-4 w-4" />;
      case "Subsidies": return <Shield className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600">Find answers to common questions about agricultural loans</p>
      </div>

      {/* Search and Filters */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-foliage/10 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category !== "All" && getCategoryIcon(category)}
                <span className={category !== "All" ? "ml-1" : ""}>{category}</span>
              </Badge>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No FAQs Found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
          </GlassCard>
        ) : (
          filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <GlassCard className="overflow-hidden hover:bg-white/95 transition-all duration-200">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-foliage/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(faq.category)}
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {faq.question}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="border-t pt-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6 text-center bg-gradient-to-r from-foliage/10 to-blue-500/10">
          <HelpCircle className="h-8 w-8 text-foliage mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Our loan experts are here to help you with personalized guidance.
          </p>
          <div className="flex justify-center gap-3">
            <Badge className="bg-foliage hover:bg-foliage-dark cursor-pointer px-4 py-2">
              📞 Call Support
            </Badge>
            <Badge className="bg-blue-500 hover:bg-blue-600 cursor-pointer px-4 py-2">
              💬 Live Chat
            </Badge>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
