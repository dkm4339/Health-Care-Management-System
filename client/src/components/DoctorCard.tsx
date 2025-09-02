import { Star } from 'lucide-react';
import { Link } from 'wouter';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  if (!doctor) return null;

  const renderStars = (rating: number) => {
    const safeRating = Math.max(0, Math.min(5, rating || 0));
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <Star className="w-4 h-4 fill-yellow-200 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-gray-600 ml-1">({doctor?.reviewCount || 0})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="text-center">
        {/* Doctor Avatar */}
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Doctor Image</span>
        </div>
        
        {/* Doctor Info */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{doctor?.name || 'Unknown Doctor'}</h3>
        <p className="text-blue-600 font-medium mb-2">{doctor?.specialty || 'General Medicine'}</p>
        <p className="text-gray-600 text-sm mb-3">{doctor?.experience || 'N/A'} experience</p>
        
        {/* Rating */}
        <div className="mb-4">
          {renderStars(doctor?.rating || 0)}
        </div>
        
        {/* Book Button */}
        <Link href="/appointment-booking">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Book Appointment
          </button>
        </Link>
      </div>
    </div>
  );
}