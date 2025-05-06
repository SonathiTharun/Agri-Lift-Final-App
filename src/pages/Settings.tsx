
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/components/LanguageContext';
import { Check, User, Bell, Globe, Shield, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('account');
  
  // Sample user data
  const [userData, setUserData] = useState({
    name: 'Raj Patel',
    email: 'raj.patel@example.com',
    phone: '+91 98765 43210',
    address: 'Plot 123, Main Street, Mumbai, India'
  });
  
  // Sample notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    marketingEmails: false,
    orderUpdates: true,
    weatherAlerts: true,
    cropAdvisories: true
  });
  
  const handleSaveAccount = () => {
    toast({
      title: "Account Updated",
      description: "Your account information has been updated successfully.",
    });
  };
  
  const handleToggleNotification = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof notificationSettings]
    }));
    
    toast({
      description: `Notification preference updated`,
    });
  };
  
  // Fix: Explicitly type the lang parameter as Language type
  const handleChangeLanguage = (lang: 'en' | 'hi' | 'ta' | 'te') => {
    setLanguage(lang);
    
    toast({
      description: `Language changed to ${lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : lang === 'ta' ? 'தமிழ்' : 'తెలుగు'}`,
    });
  };

  return (
    <Layout>
      <WeatherWidget />
      
      <main className="container mx-auto px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-soil-dark mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Card>
                <CardContent className="p-3">
                  <nav className="flex flex-col items-start space-y-1 w-full">
                    <button 
                      onClick={() => setActiveTab('account')}
                      className={`w-full flex items-center justify-start px-3 py-2 rounded-md ${activeTab === 'account' ? 'bg-foliage-light/20' : 'hover:bg-gray-100'}`}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </button>
                    <button 
                      onClick={() => setActiveTab('notifications')}
                      className={`w-full flex items-center justify-start px-3 py-2 rounded-md ${activeTab === 'notifications' ? 'bg-foliage-light/20' : 'hover:bg-gray-100'}`}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </button>
                    <button 
                      onClick={() => setActiveTab('language')}
                      className={`w-full flex items-center justify-start px-3 py-2 rounded-md ${activeTab === 'language' ? 'bg-foliage-light/20' : 'hover:bg-gray-100'}`}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Language
                    </button>
                    <button 
                      onClick={() => setActiveTab('privacy')}
                      className={`w-full flex items-center justify-start px-3 py-2 rounded-md ${activeTab === 'privacy' ? 'bg-foliage-light/20' : 'hover:bg-gray-100'}`}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Privacy
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Card>
                {activeTab === 'account' && (
                  <div>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={userData.name} 
                          onChange={e => setUserData({...userData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={userData.email} 
                          onChange={e => setUserData({...userData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={userData.phone} 
                          onChange={e => setUserData({...userData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={userData.address} 
                          onChange={e => setUserData({...userData, address: e.target.value})}
                        />
                      </div>
                      <div className="pt-2">
                        <Button onClick={handleSaveAccount}>Save Changes</Button>
                      </div>
                    </CardContent>
                  </div>
                )}
                
                {activeTab === 'notifications' && (
                  <div>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Control what notifications you receive</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.email}
                          onCheckedChange={() => handleToggleNotification('email')}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">SMS Notifications</Label>
                          <p className="text-sm text-gray-500">Receive updates via text message</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.sms}
                          onCheckedChange={() => handleToggleNotification('sms')}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Marketing Emails</Label>
                          <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.marketingEmails}
                          onCheckedChange={() => handleToggleNotification('marketingEmails')}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Order Updates</Label>
                          <p className="text-sm text-gray-500">Get notified about your order status</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.orderUpdates}
                          onCheckedChange={() => handleToggleNotification('orderUpdates')}
                        />
                      </div>
                    </CardContent>
                  </div>
                )}
                
                {activeTab === 'language' && (
                  <div>
                    <CardHeader>
                      <CardTitle>Language Settings</CardTitle>
                      <CardDescription>Choose your preferred language</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div 
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${language === 'en' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'}`}
                        onClick={() => handleChangeLanguage('en')}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold">E</div>
                            <div>
                              <h3 className="font-medium">English</h3>
                              <p className="text-sm text-gray-500">English (United States)</p>
                            </div>
                          </div>
                          {language === 'en' && <Check className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>
                      
                      <div 
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${language === 'hi' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'}`}
                        onClick={() => handleChangeLanguage('hi')}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">हि</div>
                            <div>
                              <h3 className="font-medium">हिंदी</h3>
                              <p className="text-sm text-gray-500">Hindi</p>
                            </div>
                          </div>
                          {language === 'hi' && <Check className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>
                      
                      <div 
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${language === 'ta' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'}`}
                        onClick={() => handleChangeLanguage('ta')}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-bold">த</div>
                            <div>
                              <h3 className="font-medium">தமிழ்</h3>
                              <p className="text-sm text-gray-500">Tamil</p>
                            </div>
                          </div>
                          {language === 'ta' && <Check className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>
                      
                      <div 
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${language === 'te' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'}`}
                        onClick={() => handleChangeLanguage('te')}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">తె</div>
                            <div>
                              <h3 className="font-medium">తెలుగు</h3>
                              <p className="text-sm text-gray-500">Telugu</p>
                            </div>
                          </div>
                          {language === 'te' && <Check className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                )}
                
                {activeTab === 'privacy' && (
                  <div>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Manage your data and privacy preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Data Collection</Label>
                          <p className="text-sm text-gray-500">Allow us to collect usage data to improve service</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Location Services</Label>
                          <p className="text-sm text-gray-500">Share your location for better recommendations</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="pt-4">
                        <Button variant="outline" className="w-full">Download My Data</Button>
                      </div>
                      <div className="pt-2">
                        <Button variant="destructive" className="w-full">Delete My Account</Button>
                      </div>
                    </CardContent>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Settings;
