import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Bell,
  Globe,
  Tractor,
  Building,
  Leaf,
  Users,
  Settings
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, isAuthenticated, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);

  // Initialize edit data when user data is available
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
        location: {
          address: user.location?.address || '',
          city: user.location?.city || '',
          state: user.location?.state || '',
          country: user.location?.country || 'India'
        },
        farmDetails: user.role === 'farmer' ? {
          farmName: user.farmDetails?.farmName || '',
          farmSize: user.farmDetails?.farmSize || '',
          farmType: user.farmDetails?.farmType || 'conventional',
          primaryCrops: user.farmDetails?.primaryCrops || [],
          experience: user.farmDetails?.experience || ''
        } : undefined,
        executiveDetails: user.role === 'executive' ? {
          department: user.executiveDetails?.department || '',
          position: user.executiveDetails?.position || '',
          employeeId: user.executiveDetails?.employeeId || ''
        } : undefined,
        preferences: {
          language: user.preferences?.language || 'en',
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? false,
            push: user.preferences?.notifications?.push ?? true
          },
          theme: user.preferences?.theme || 'light'
        }
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-700 font-medium">Loading Profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const validateForm = () => {
    const errors: string[] = [];

    // Validate name
    if (!editData.name || editData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    // Validate phone
    if (editData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(editData.phone)) {
      errors.push("Please enter a valid phone number");
    }

    // Validate email format if provided
    if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Validate location fields
    if (editData.location?.city && editData.location.city.trim().length < 2) {
      errors.push("City must be at least 2 characters long");
    }

    if (editData.location?.state && editData.location.state.trim().length < 2) {
      errors.push("State must be at least 2 characters long");
    }

    // Role-specific validation
    if (user.role === 'farmer' && editData.farmDetails) {
      if (editData.farmDetails.farmName && editData.farmDetails.farmName.trim().length < 2) {
        errors.push("Farm name must be at least 2 characters long");
      }
      if (editData.farmDetails.farmSize && editData.farmDetails.farmSize <= 0) {
        errors.push("Farm size must be greater than 0");
      }
      if (editData.farmDetails.experience && editData.farmDetails.experience < 0) {
        errors.push("Experience cannot be negative");
      }
    }

    if (user.role === 'executive' && editData.executiveDetails) {
      if (editData.executiveDetails.department && editData.executiveDetails.department.trim().length < 2) {
        errors.push("Department must be at least 2 characters long");
      }
      if (editData.executiveDetails.position && editData.executiveDetails.position.trim().length < 2) {
        errors.push("Position must be at least 2 characters long");
      }
    }

    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    try {
      await updateProfile(editData);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset edit data to original user data
    setEditData({
      name: user.name || '',
      phone: user.phone || '',
      location: {
        address: user.location?.address || '',
        city: user.location?.city || '',
        state: user.location?.state || '',
        country: user.location?.country || 'India'
      },
      farmDetails: user.role === 'farmer' ? {
        farmName: user.farmDetails?.farmName || '',
        farmSize: user.farmDetails?.farmSize || '',
        farmType: user.farmDetails?.farmType || 'conventional',
        primaryCrops: user.farmDetails?.primaryCrops || [],
        experience: user.farmDetails?.experience || ''
      } : undefined,
      executiveDetails: user.role === 'executive' ? {
        department: user.executiveDetails?.department || '',
        position: user.executiveDetails?.position || '',
        employeeId: user.executiveDetails?.employeeId || ''
      } : undefined,
      preferences: {
        language: user.preferences?.language || 'en',
        notifications: {
          email: user.preferences?.notifications?.email ?? true,
          sms: user.preferences?.notifications?.sms ?? false,
          push: user.preferences?.notifications?.push ?? true
        },
        theme: user.preferences?.theme || 'light'
      }
    });
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPEG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingPicture(true);

    try {
      const response = await apiService.uploadProfilePicture(file);

      // Update the user context with the new profile image
      // The updateProfile function from AuthContext should handle this
      await updateProfile({ profileImage: response.data.profileImageUrl });

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleIcon = (role: string) => {
    return role === 'farmer' ? <Tractor className="h-4 w-4" /> : <Building className="h-4 w-4" />;
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'farmer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback className="bg-green-600 text-white text-xl font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                        id="profile-picture-upload"
                        disabled={isUploadingPicture}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full bg-white dark:bg-gray-700 border-2 border-green-200 dark:border-green-600 hover:bg-green-50 dark:hover:bg-gray-600"
                        onClick={() => document.getElementById('profile-picture-upload')?.click()}
                        disabled={isUploadingPicture}
                      >
                        {isUploadingPicture ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
                        ) : (
                          <Camera className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1`}>
                            {getRoleIcon(user.role)}
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {user.verification}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!isEditing ? (
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSave}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button
                              onClick={handleCancel}
                              variant="outline"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                {user.role === 'farmer' ? <Tractor className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                {user.role === 'farmer' ? 'Farm Details' : 'Work Details'}
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{user.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {user.phone || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Account Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1`}>
                          {getRoleIcon(user.role)}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label>Verification Status</Label>
                      <Badge variant={user.verification === 'verified' ? 'default' : 'outline'}>
                        {user.verification}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(user.createdAt)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Last Login</Label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Total Logins</Label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {user.totalLogins || 0} times
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Location Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Textarea
                          id="address"
                          value={editData.location?.address}
                          onChange={(e) => setEditData({
                            ...editData,
                            location: {...editData.location, address: e.target.value}
                          })}
                          placeholder="Enter your address"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded min-h-[80px]">
                          {user.location?.address || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        {isEditing ? (
                          <Input
                            id="city"
                            value={editData.location?.city}
                            onChange={(e) => setEditData({
                              ...editData,
                              location: {...editData.location, city: e.target.value}
                            })}
                            placeholder="Enter your city"
                          />
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {user.location?.city || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        {isEditing ? (
                          <Input
                            id="state"
                            value={editData.location?.state}
                            onChange={(e) => setEditData({
                              ...editData,
                              location: {...editData.location, state: e.target.value}
                            })}
                            placeholder="Enter your state"
                          />
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {user.location?.state || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        {isEditing ? (
                          <Select
                            value={editData.location?.country}
                            onValueChange={(value) => setEditData({
                              ...editData,
                              location: {...editData.location, country: value}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="USA">United States</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="Australia">Australia</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {user.location?.country || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab - Role-specific information */}
            <TabsContent value="details" className="space-y-6">
              {user.role === 'farmer' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tractor className="h-5 w-5 text-green-600" />
                      Farm Details
                    </CardTitle>
                    <CardDescription>
                      Information about your farming operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farmName">Farm Name</Label>
                        {isEditing ? (
                          <Input
                            id="farmName"
                            value={editData.farmDetails?.farmName}
                            onChange={(e) => setEditData({
                              ...editData,
                              farmDetails: {...editData.farmDetails, farmName: e.target.value}
                            })}
                            placeholder="Enter your farm name"
                          />
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {user.farmDetails?.farmName || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="farmSize">Farm Size (acres)</Label>
                        {isEditing ? (
                          <Input
                            id="farmSize"
                            type="number"
                            value={editData.farmDetails?.farmSize}
                            onChange={(e) => setEditData({
                              ...editData,
                              farmDetails: {...editData.farmDetails, farmSize: Number(e.target.value)}
                            })}
                            placeholder="Enter farm size in acres"
                          />
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {user.farmDetails?.farmSize ? `${user.farmDetails.farmSize} acres` : 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="farmType">Farm Type</Label>
                        {isEditing ? (
                          <Select
                            value={editData.farmDetails?.farmType}
                            onValueChange={(value) => setEditData({
                              ...editData,
                              farmDetails: {...editData.farmDetails, farmType: value}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select farm type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="organic">Organic</SelectItem>
                              <SelectItem value="conventional">Conventional</SelectItem>
                              <SelectItem value="mixed">Mixed</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            {user.farmDetails?.farmType || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        {isEditing ? (
                          <Input
                            id="experience"
                            type="number"
                            value={editData.farmDetails?.experience}
                            onChange={(e) => setEditData({
                              ...editData,
                              farmDetails: {...editData.farmDetails, experience: Number(e.target.value)}
                            })}
                            placeholder="Years of farming experience"
                          />
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {user.farmDetails?.experience ? `${user.farmDetails.experience} years` : 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryCrops">Primary Crops</Label>
                      {isEditing ? (
                        <Textarea
                          id="primaryCrops"
                          value={editData.farmDetails?.primaryCrops?.join(', ')}
                          onChange={(e) => setEditData({
                            ...editData,
                            farmDetails: {
                              ...editData.farmDetails,
                              primaryCrops: e.target.value.split(',').map(crop => crop.trim()).filter(crop => crop)
                            }
                          })}
                          placeholder="Enter crops separated by commas (e.g., Rice, Wheat, Sugarcane)"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded min-h-[80px]">
                          {user.farmDetails?.primaryCrops?.length ?
                            user.farmDetails.primaryCrops.join(', ') :
                            'Not provided'
                          }
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-green-600" />
                      Executive Details
                    </CardTitle>
                    <CardDescription>
                      Information about your role and department
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        {isEditing ? (
                          <Input
                            id="department"
                            value={editData.executiveDetails?.department}
                            onChange={(e) => setEditData({
                              ...editData,
                              executiveDetails: {...editData.executiveDetails, department: e.target.value}
                            })}
                            placeholder="Enter your department"
                          />
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {user.executiveDetails?.department || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        {isEditing ? (
                          <Input
                            id="position"
                            value={editData.executiveDetails?.position}
                            onChange={(e) => setEditData({
                              ...editData,
                              executiveDetails: {...editData.executiveDetails, position: e.target.value}
                            })}
                            placeholder="Enter your position"
                          />
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {user.executiveDetails?.position || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        {isEditing ? (
                          <Input
                            id="employeeId"
                            value={editData.executiveDetails?.employeeId}
                            onChange={(e) => setEditData({
                              ...editData,
                              executiveDetails: {...editData.executiveDetails, employeeId: e.target.value}
                            })}
                            placeholder="Enter your employee ID"
                          />
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {user.executiveDetails?.employeeId || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Access Level</Label>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Shield className="h-3 w-3" />
                          {user.executiveDetails?.accessLevel || 'basic'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notification Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-green-600" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={editData.preferences?.notifications?.email}
                        onCheckedChange={(checked) => setEditData({
                          ...editData,
                          preferences: {
                            ...editData.preferences,
                            notifications: {
                              ...editData.preferences?.notifications,
                              email: checked
                            }
                          }
                        })}
                        disabled={!isEditing}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={editData.preferences?.notifications?.sms}
                        onCheckedChange={(checked) => setEditData({
                          ...editData,
                          preferences: {
                            ...editData.preferences,
                            notifications: {
                              ...editData.preferences?.notifications,
                              sms: checked
                            }
                          }
                        })}
                        disabled={!isEditing}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={editData.preferences?.notifications?.push}
                        onCheckedChange={(checked) => setEditData({
                          ...editData,
                          preferences: {
                            ...editData.preferences,
                            notifications: {
                              ...editData.preferences?.notifications,
                              push: checked
                            }
                          }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* General Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      General Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      {isEditing ? (
                        <Select
                          value={editData.preferences?.language}
                          onValueChange={(value) => setEditData({
                            ...editData,
                            preferences: {
                              ...editData.preferences,
                              language: value
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="mr">Marathi</SelectItem>
                            <SelectItem value="gu">Gujarati</SelectItem>
                            <SelectItem value="ta">Tamil</SelectItem>
                            <SelectItem value="te">Telugu</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {user.preferences?.language === 'en' ? 'English' :
                           user.preferences?.language === 'hi' ? 'Hindi' :
                           user.preferences?.language === 'mr' ? 'Marathi' :
                           user.preferences?.language === 'gu' ? 'Gujarati' :
                           user.preferences?.language === 'ta' ? 'Tamil' :
                           user.preferences?.language === 'te' ? 'Telugu' :
                           'English'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      {isEditing ? (
                        <Select
                          value={editData.preferences?.theme}
                          onValueChange={async (value) => {
                            // Update local edit data
                            setEditData({
                              ...editData,
                              preferences: {
                                ...editData.preferences,
                                theme: value
                              }
                            });
                            // Immediately apply theme change
                            await setTheme(value as 'light' | 'dark');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          {user.preferences?.theme === 'dark' ? 'Dark' : 'Light'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Security Information
                  </CardTitle>
                  <CardDescription>
                    View your account security details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        {user.status === 'active' && (
                          <span className="text-sm text-green-600">✓ Account is active</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Verification Status</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.verification === 'verified' ? 'default' : 'outline'}>
                          {user.verification}
                        </Badge>
                        {user.verification === 'verified' && (
                          <span className="text-sm text-green-600">✓ Email verified</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Last Login</Label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Total Logins</Label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {user.totalLogins || 0} times
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Security Actions</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Update Email
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Verify Phone
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
