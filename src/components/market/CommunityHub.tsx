import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, BookOpen, Award, ThumbsUp, MessageCircle, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/LanguageContext";
import { GlassCard } from "./GlassCard";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: 'farmer' | 'expert' | 'vendor';
    reputation: number;
  };
  category: string;
  likes: number;
  replies: number;
  views: number;
  timeAgo: string;
  tags: string[];
  isAnswered?: boolean;
}

interface Expert {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  rating: number;
  consultations: number;
  isOnline: boolean;
  price: number;
}

const mockPosts: ForumPost[] = [
  {
    id: "1",
    title: "Best practices for organic tomato farming in monsoon season",
    content: "I'm planning to start organic tomato cultivation during the upcoming monsoon. What are the key considerations for soil preparation and pest management?",
    author: {
      name: "Rajesh Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      role: "farmer",
      reputation: 245
    },
    category: "Crop Management",
    likes: 23,
    replies: 8,
    views: 156,
    timeAgo: "2 hours ago",
    tags: ["organic", "tomato", "monsoon", "pest-control"],
    isAnswered: true
  },
  {
    id: "2",
    title: "Soil pH testing methods - Digital vs Traditional",
    content: "Looking for recommendations on reliable soil pH testing methods. Should I invest in a digital pH meter or stick with traditional testing kits?",
    author: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      role: "farmer",
      reputation: 189
    },
    category: "Soil Health",
    likes: 15,
    replies: 12,
    views: 89,
    timeAgo: "4 hours ago",
    tags: ["soil-testing", "pH", "equipment"],
    isAnswered: false
  },
  {
    id: "3",
    title: "Smart irrigation systems - ROI analysis",
    content: "Has anyone calculated the return on investment for smart irrigation systems? I'm considering upgrading from traditional sprinklers.",
    author: {
      name: "Dr. Amit Patel",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      role: "expert",
      reputation: 892
    },
    category: "Technology",
    likes: 34,
    replies: 18,
    views: 234,
    timeAgo: "6 hours ago",
    tags: ["irrigation", "smart-farming", "ROI", "technology"],
    isAnswered: true
  }
];

const mockExperts: Expert[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    specialization: "Soil Science & Nutrition",
    rating: 4.9,
    consultations: 156,
    isOnline: true,
    price: 500
  },
  {
    id: "2",
    name: "Prof. Ravi Krishnan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    specialization: "Crop Protection & IPM",
    rating: 4.8,
    consultations: 203,
    isOnline: false,
    price: 750
  },
  {
    id: "3",
    name: "Dr. Maria Garcia",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    specialization: "Sustainable Agriculture",
    rating: 4.9,
    consultations: 89,
    isOnline: true,
    price: 600
  }
];

export const CommunityHub = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'forum' | 'experts' | 'knowledge'>('forum');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'expert': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'vendor': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
  };

  const ForumPost = ({ post, index }: { post: ForumPost; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <GlassCard className="p-6 hover:bg-white/5 transition-colors cursor-pointer">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white hover:text-green-400 transition-colors">
                {post.title}
              </h3>
              {post.isAnswered && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Award className="w-3 h-3 mr-1" />
                  Answered
                </Badge>
              )}
            </div>
            
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.content}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-white/20 text-gray-400">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-white">{post.author.name}</span>
                  <Badge className={getRoleColor(post.author.role)}>
                    {post.author.role}
                  </Badge>
                  <span>• {post.author.reputation} rep</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.timeAgo}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {post.likes}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {post.replies}
                </div>
                <div className="flex items-center gap-1">
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  const ExpertCard = ({ expert, index }: { expert: Expert; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <GlassCard className="p-6 text-center">
        <div className="relative mb-4">
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
            expert.isOnline ? 'bg-green-500' : 'bg-gray-500'
          }`} />
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-1">{expert.name}</h3>
        <p className="text-gray-300 text-sm mb-3">{expert.specialization}</p>
        
        <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-yellow-400" />
            {expert.rating}
          </div>
          <div>{expert.consultations} consultations</div>
        </div>
        
        <div className="text-xl font-bold text-green-400 mb-4">
          ₹{expert.price}/session
        </div>
        
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!expert.isOnline}
        >
          {expert.isOnline ? 'Book Consultation' : 'Currently Offline'}
        </Button>
      </GlassCard>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Users className="w-8 h-8" />
            {t('marketplace.communityHub')}
          </h2>
          <p className="text-gray-300">{t('marketplace.communityDescription')}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'forum' ? 'default' : 'outline'}
          onClick={() => setActiveTab('forum')}
          className="border-white/20"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Forum
        </Button>
        <Button
          variant={activeTab === 'experts' ? 'default' : 'outline'}
          onClick={() => setActiveTab('experts')}
          className="border-white/20"
        >
          <Award className="w-4 h-4 mr-2" />
          Expert Consultations
        </Button>
        <Button
          variant={activeTab === 'knowledge' ? 'default' : 'outline'}
          onClick={() => setActiveTab('knowledge')}
          className="border-white/20"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Knowledge Base
        </Button>
      </div>

      {/* Forum Tab */}
      {activeTab === 'forum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Latest Discussions
              </Badge>
              <Badge variant="outline" className="border-white/20 text-gray-300">
                {mockPosts.length} Active Topics
              </Badge>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              New Discussion
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockPosts.map((post, index) => (
              <ForumPost key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Experts Tab */}
      {activeTab === 'experts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Available Experts
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                {mockExperts.filter(e => e.isOnline).length} Online
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockExperts.map((expert, index) => (
              <ExpertCard key={expert.id} expert={expert} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <GlassCard className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Knowledge Base</h3>
            <p className="text-gray-300 mb-4">
              Comprehensive guides, tutorials, and resources for modern farming
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              Browse Articles
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
