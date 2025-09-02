import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import AppointmentCard from '@/components/AppointmentCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, UserRound, MessageCircle, CalendarPlus, FileText, Pill } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PatientDashboard() {
  const [, setLocation] = useLocation();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const handleStartChat = (appointmentId: string) => {
    setLocation('/chat');
  };

  const handleStartVideoCall = (appointmentId: string) => {
    setLocation('/video-call');
  };

  const handleBookAppointment = () => {
    setLocation('/appointment-booking');
  };

  const upcomingAppointments = Array.isArray(appointments) ? appointments.filter((apt: any) => 
    new Date(apt.appointmentDate) > new Date()
  ) : [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType="patient" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Dashboard" 
          subtitle="Welcome back, stay healthy!"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Calendar className="text-primary w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-upcoming-appointments">
                      {upcomingAppointments.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <UserRound className="text-secondary w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Available Doctors</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-active-doctors">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-accent rounded-lg">
                    <MessageCircle className="text-accent-foreground w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">New Messages</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-new-messages">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Appointments */}
            <Card>
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Upcoming Appointments</h3>
                <Button onClick={handleBookAppointment} data-testid="button-book-new">
                  Book New
                </Button>
              </div>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="animate-pulse flex space-x-4 p-4">
                        <div className="rounded-full bg-muted h-12 w-12"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground" data-testid="text-no-appointments">No upcoming appointments</p>
                    <Button className="mt-4" onClick={handleBookAppointment} data-testid="button-book-first">
                      Book Your First Appointment
                    </Button>
                  </div>
                ) : (
                  upcomingAppointments.map((appointment: any) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="patient"
                      onStartChat={handleStartChat}
                      onStartVideoCall={handleStartVideoCall}
                    />
                  ))
                )}
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3" data-testid="activity-item-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CalendarPlus className="text-primary w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Appointment booked with Dr. Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="activity-item-2">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <FileText className="text-secondary w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Lab results received from Dr. Michael Chen</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="activity-item-3">
                    <div className="p-2 bg-accent rounded-lg">
                      <Pill className="text-accent-foreground w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Prescription updated for ongoing treatment</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
