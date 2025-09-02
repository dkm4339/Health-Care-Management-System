import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, GraduationCap, Clock, CheckCircle } from 'lucide-react';

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    education?: string;
    experience?: number;
    rating: number;
    reviewCount: number;
    isAvailable: boolean;
  };
  onBookAppointment: (doctorId: string) => void;
}

export default function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 10);
    const hasHalfStar = (rating % 10) >= 5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" data-testid={`card-doctor-${doctor.id}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="" alt={doctor.name} />
            <AvatarFallback className="text-lg font-semibold">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground" data-testid={`text-doctor-name-${doctor.id}`}>
              {doctor.name}
            </h3>
            <p className="text-primary font-medium" data-testid={`text-specialty-${doctor.id}`}>
              {doctor.specialty}
            </p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {renderStars(doctor.rating)}
              </div>
              <span className="text-sm text-muted-foreground ml-2" data-testid={`text-rating-${doctor.id}`}>
                {(doctor.rating / 10).toFixed(1)} ({doctor.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {doctor.education && (
            <div className="flex items-center text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4 mr-2" />
              <span data-testid={`text-education-${doctor.id}`}>{doctor.education}</span>
            </div>
          )}
          {doctor.experience && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              <span data-testid={`text-experience-${doctor.id}`}>{doctor.experience} years experience</span>
            </div>
          )}
          <div className="flex items-center text-sm text-secondary">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span data-testid={`text-availability-${doctor.id}`}>
              {doctor.isAvailable ? 'Available today' : 'Next available: Tomorrow'}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={() => onBookAppointment(doctor.id)}
          className="w-full"
          data-testid={`button-book-appointment-${doctor.id}`}
        >
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
}
