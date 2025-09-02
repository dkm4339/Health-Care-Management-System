import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/services/api';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
        emergencyPhone: user.emergencyPhone || '',
        medicalHistory: user.medicalHistory || '',
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      return apiRequest('PUT', '/api/profile', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
        emergencyPhone: user.emergencyPhone || '',
        medicalHistory: user.medicalHistory || '',
      });
      setHasChanges(false);
    }
  };

  const handleChangePhoto = () => {
    // In a real implementation, this would open a file picker
    toast({
      title: "Feature Coming Soon",
      description: "Photo upload functionality will be implemented",
    });
  };

  const getSidebarType = () => {
    if (user?.role === 'patient') return 'patient';
    if (user?.role === 'doctor') return 'doctor';
    return 'admin';
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={getSidebarType()} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Profile Settings" 
          subtitle="Manage your personal information"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture & Basic Info */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarImage src="" alt={`${user?.firstName} ${user?.lastName}`} />
                        <AvatarFallback className="text-2xl">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        onClick={handleChangePhoto}
                        data-testid="button-change-photo"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground" data-testid="text-user-name">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-muted-foreground" data-testid="text-user-email">
                      {user?.email}
                    </p>
                    <p className="text-sm text-primary font-medium mt-2">
                      {user?.role === 'patient' && 'Patient ID: #P12345'}
                      {user?.role === 'doctor' && 'Doctor ID: #D12345'}
                      {user?.role === 'admin' && 'Admin ID: #A12345'}
                    </p>
                    
                    <div className="mt-6 space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Role: </span>
                        <span className="font-medium capitalize" data-testid="text-user-role">
                          {user?.role}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Member since: </span>
                        <span className="font-medium" data-testid="text-member-since">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                      {hasChanges && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCancel}
                            data-testid="button-cancel-changes"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSave}
                            disabled={updateProfileMutation.isPending}
                            data-testid="button-save-changes"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            data-testid="input-first-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            data-testid="input-last-name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          data-testid="input-email"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            data-testid="input-phone"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            data-testid="input-date-of-birth"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Enter your address"
                          className="h-20 resize-none"
                          data-testid="textarea-address"
                        />
                      </div>
                      
                      {user?.role === 'patient' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="emergencyContact">Emergency Contact</Label>
                              <Input
                                id="emergencyContact"
                                type="text"
                                value={formData.emergencyContact}
                                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                                placeholder="Emergency contact name"
                                data-testid="input-emergency-contact"
                              />
                            </div>
                            <div>
                              <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                              <Input
                                id="emergencyPhone"
                                type="tel"
                                value={formData.emergencyPhone}
                                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                                placeholder="+1 (555) 987-6543"
                                data-testid="input-emergency-phone"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="medicalHistory">Medical History</Label>
                            <Textarea
                              id="medicalHistory"
                              value={formData.medicalHistory}
                              onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                              placeholder="Brief medical history, allergies, current medications..."
                              className="h-24 resize-none"
                              data-testid="textarea-medical-history"
                            />
                          </div>
                        </>
                      )}
                      
                      {!hasChanges && (
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleSave}
                            disabled={updateProfileMutation.isPending}
                            data-testid="button-save-profile"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
