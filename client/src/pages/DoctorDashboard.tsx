import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import AppointmentCard from '@/components/AppointmentCard';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function DoctorDashboard() {
  const [, setLocation] = useLocation();

  const { data: todayAppointments, isLoading } = useQuery({
    queryKey: ['/api/appointments/today'],
  });

  const handleStartChat = (appointmentId: string) => {
    setLocation('/chat');
  };

  const handleStartVideoCall = (appointmentId: string) => {
    setLocation('/video-call');
  };

  const completedAppointments = Array.isArray(todayAppointments) ? todayAppointments.filter((apt: any) => apt.status === 'completed').length : 0;
  const totalAppointments = Array.isArray(todayAppointments) ? todayAppointments.length : 0;
  const remainingAppointments = totalAppointments - completedAppointments;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType="doctor" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Doctor Dashboard" 
          subtitle="Manage your patients and appointments"
        >
          <div className="flex items-center space-x-2">
            <span className="status-dot status-online"></span>
            <span className="text-sm text-secondary font-medium" data-testid="text-status">Online</span>
          </div>
        </Header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Today's Appointments</h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-today-date">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse flex space-x-4 p-4">
                          <div className="rounded-full bg-muted h-12 w-12"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : Array.isArray(todayAppointments) && todayAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground" data-testid="text-no-appointments">No appointments today</p>
                    </div>
                  ) : (
                    Array.isArray(todayAppointments) ? todayAppointments.map((appointment: any) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        userRole="doctor"
                        onStartChat={handleStartChat}
                        onStartVideoCall={handleStartVideoCall}
                      />
                    )) : null
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Stats */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Today's Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Appointments</span>
                      <span className="text-sm font-medium text-foreground" data-testid="text-total-appointments">
                        {totalAppointments}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="text-sm font-medium text-secondary" data-testid="text-completed-appointments">
                        {completedAppointments}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className="text-sm font-medium text-primary" data-testid="text-remaining-appointments">
                        {remainingAppointments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Patient Messages</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3" data-testid="message-preview-1">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" alt="Emma Wilson" />
                        <AvatarFallback>EW</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Emma Wilson</p>
                        <p className="text-xs text-muted-foreground">Thank you for the consultation...</p>
                      </div>
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <div className="flex items-center space-x-3" data-testid="message-preview-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" alt="David Lee" />
                        <AvatarFallback>DL</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">David Lee</p>
                        <p className="text-xs text-muted-foreground">Question about medication...</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
