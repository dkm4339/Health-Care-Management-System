import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserRound, Users, Calendar, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/services/api';

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['/api/doctors'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  const deleteDoctorMutation = useMutation({
    mutationFn: async (doctorId: string) => {
      return apiRequest('DELETE', `/api/doctors/${doctorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Success",
        description: "Doctor removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove doctor",
        variant: "destructive",
      });
    },
  });

  const handleRemoveDoctor = (doctorId: string) => {
    if (window.confirm('Are you sure you want to remove this doctor?')) {
      deleteDoctorMutation.mutate(doctorId);
    }
  };

  const handleAddDoctor = () => {
    // This could open a modal or navigate to a form
    toast({
      title: "Feature Coming Soon",
      description: "Add doctor functionality will be implemented",
    });
  };

  const handleEditDoctor = (doctorId: string) => {
    // This could open a modal or navigate to an edit form
    toast({
      title: "Feature Coming Soon",
      description: "Edit doctor functionality will be implemented",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType="admin" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Admin Dashboard" 
          subtitle="System management and oversight"
        >
          <Button onClick={handleAddDoctor} data-testid="button-add-doctor">
            <UserRound className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </Header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <UserRound className="text-primary w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Total Doctors</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-total-doctors">
                      {(stats as any)?.totalDoctors || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Users className="text-secondary w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-total-patients">
                      {(stats as any)?.totalPatients || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-accent rounded-lg">
                    <Calendar className="text-accent-foreground w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Today's Appointments</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-today-appointments">
                      {(stats as any)?.todayAppointments || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="text-destructive w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Pending Issues</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-pending-issues">
                      {(stats as any)?.pendingIssues || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Doctor Management Table */}
          <Card>
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Doctor Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {doctorsLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="animate-pulse flex items-center">
                            <div className="rounded-full bg-muted h-10 w-10"></div>
                            <div className="ml-4 space-y-2">
                              <div className="h-4 bg-muted rounded w-32"></div>
                              <div className="h-3 bg-muted rounded w-24"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20 animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-16 animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-12 animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></td>
                      </tr>
                    ))
                  ) : Array.isArray(doctors) && doctors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <UserRound className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground" data-testid="text-no-doctors">No doctors registered</p>
                      </td>
                    </tr>
                  ) : (
                    Array.isArray(doctors) ? doctors.map((doctor: any) => (
                      <tr key={doctor.id} data-testid={`row-doctor-${doctor.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="" alt={doctor.name} />
                              <AvatarFallback>
                                {doctor.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-foreground" data-testid={`text-doctor-name-${doctor.id}`}>
                                {doctor.name}
                              </div>
                              <div className="text-sm text-muted-foreground" data-testid={`text-doctor-email-${doctor.id}`}>
                                {doctor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" data-testid={`text-specialty-${doctor.id}`}>
                          {doctor.specialty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={doctor.isAvailable ? "default" : "secondary"}
                            className={doctor.isAvailable ? "bg-secondary/10 text-secondary" : ""}
                            data-testid={`badge-status-${doctor.id}`}
                          >
                            <span className={`status-dot ${doctor.isAvailable ? 'status-online' : 'status-away'} mr-1`}></span>
                            {doctor.isAvailable ? 'Active' : 'Away'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" data-testid={`text-experience-${doctor.id}`}>
                          {doctor.experience} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditDoctor(doctor.id)}
                            className="text-primary hover:text-primary/80 mr-3"
                            data-testid={`button-edit-${doctor.id}`}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveDoctor(doctor.id)}
                            className="text-destructive hover:text-destructive/80"
                            disabled={deleteDoctorMutation.isPending}
                            data-testid={`button-remove-${doctor.id}`}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    )) : null
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
