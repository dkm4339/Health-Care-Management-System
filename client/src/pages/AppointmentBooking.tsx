import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, CheckCircle, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/services/api';

export default function AppointmentBooking() {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [notes, setNotes] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get doctorId from URL params if provided
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctorId');
    if (doctorId) {
      setSelectedDoctorId(doctorId);
    }
  }, []);

  const { data: doctors } = useQuery({
    queryKey: ['/api/doctors'],
  });

  const selectedDoctor = Array.isArray(doctors) ? doctors.find((doctor: any) => doctor.id === selectedDoctorId) : undefined;

  const bookAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return apiRequest('POST', '/api/appointments', appointmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });
      setLocation('/patient');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      });
    },
  });

  const handleBooking = () => {
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a doctor, date, and time",
        variant: "destructive",
      });
      return;
    }

    const appointmentDate = new Date(`${selectedDate} ${selectedTime}`);
    
    bookAppointmentMutation.mutate({
      doctorId: selectedDoctorId,
      appointmentDate: appointmentDate.toISOString(),
      appointmentType,
      notes,
    });
  };

  const availableTimes = [
    '09:00', '10:30', '14:30', '15:30', '16:00'
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType="patient" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Book Appointment" 
          subtitle="Schedule your consultation"
        >
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/doctors')}
            data-testid="button-close"
          >
            <X className="w-5 h-5" />
          </Button>
        </Header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Doctor Selection & Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Select Doctor</h3>
                  
                  {!selectedDoctorId ? (
                    <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                      <SelectTrigger data-testid="select-doctor">
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(doctors) ? doctors.map((doctor: any) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </SelectItem>
                        )) : null}
                      </SelectContent>
                    </Select>
                  ) : selectedDoctor ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src="" alt={selectedDoctor.name} />
                          <AvatarFallback className="text-lg">
                            {selectedDoctor.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-xl font-semibold text-foreground" data-testid="text-selected-doctor-name">
                            {selectedDoctor.name}
                          </h4>
                          <p className="text-primary font-medium" data-testid="text-selected-doctor-specialty">
                            {selectedDoctor.specialty}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid="text-selected-doctor-education">
                            {selectedDoctor.education}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="status-dot status-online mr-2"></span>
                            <span className="text-sm text-secondary">Available</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedDoctorId('')}
                        data-testid="button-change-doctor"
                      >
                        Change Doctor
                      </Button>
                    </div>
                  ) : null}
                  
                  <div className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="appointmentType">Appointment Type</Label>
                      <Select value={appointmentType} onValueChange={setAppointmentType}>
                        <SelectTrigger data-testid="select-appointment-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="followup">Follow-up</SelectItem>
                          <SelectItem value="checkup">Regular Checkup</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Describe your symptoms or reason for visit..."
                        className="h-24 resize-none"
                        data-testid="textarea-notes"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Date & Time Selection */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Select Date & Time</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        data-testid="input-date"
                      />
                    </div>
                    
                    <div>
                      <Label>Available Times</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            data-testid={`button-time-${time}`}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleBooking}
                      className="w-full bg-secondary hover:bg-secondary/90"
                      disabled={bookAppointmentMutation.isPending || !selectedDoctorId || !selectedDate || !selectedTime}
                      data-testid="button-confirm-booking"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {bookAppointmentMutation.isPending ? 'Booking...' : 'Confirm Booking'}
                    </Button>
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
