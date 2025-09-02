import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Video } from 'lucide-react';

interface AppointmentCardProps {
  appointment: {
    id: string;
    doctorName?: string;
    patientName?: string;
    specialty?: string;
    appointmentDate: string;
    appointmentType: string;
    status: string;
  };
  userRole: 'patient' | 'doctor';
  onStartChat: (appointmentId: string) => void;
  onStartVideoCall: (appointmentId: string) => void;
}

export default function AppointmentCard({ appointment, userRole, onStartChat, onStartVideoCall }: AppointmentCardProps) {
  const displayName = userRole === 'patient' ? appointment.doctorName : appointment.patientName;
  const displayRole = userRole === 'patient' ? appointment.specialty : 'Patient';
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg mb-4 last:mb-0" data-testid={`card-appointment-${appointment.id}`}>
      <Avatar className="w-12 h-12">
        <AvatarImage src="" alt={displayName} />
        <AvatarFallback>
          {displayName?.split(' ').map(n => n[0]).join('') || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-medium text-foreground" data-testid={`text-name-${appointment.id}`}>
          {displayName}
        </h4>
        <p className="text-sm text-muted-foreground" data-testid={`text-role-${appointment.id}`}>
          {displayRole}
        </p>
        <p className="text-sm text-primary font-medium" data-testid={`text-time-${appointment.id}`}>
          {formatTime(appointment.appointmentDate)}
        </p>
      </div>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onStartChat(appointment.id)}
          data-testid={`button-chat-${appointment.id}`}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Chat
        </Button>
        <Button 
          size="sm" 
          onClick={() => onStartVideoCall(appointment.id)}
          data-testid={`button-video-${appointment.id}`}
        >
          <Video className="w-4 h-4 mr-1" />
          Video
        </Button>
      </div>
    </div>
  );
}
