import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import DoctorCard from '@/components/DoctorCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserRound } from 'lucide-react';
import { useLocation } from 'wouter';

export default function DoctorList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [, setLocation] = useLocation();

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['/api/doctors'],
  });

  const handleBookAppointment = (doctorId: string) => {
    setLocation(`/appointment-booking?doctorId=${doctorId}`);
  };

  const filteredDoctors = Array.isArray(doctors) ? doctors.filter((doctor: any) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !specialtyFilter || specialtyFilter === 'all' || doctor.specialty.toLowerCase() === specialtyFilter.toLowerCase();
    return matchesSearch && matchesSpecialty;
  }) : [];

  const specialties = Array.isArray(doctors) ? Array.from(new Set(doctors.map((doctor: any) => doctor.specialty))) : [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType="patient" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Find Doctors" 
          subtitle="Browse and book appointments with our specialists"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-doctors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-48" data-testid="select-specialty-filter">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty: string) => (
                  <SelectItem key={specialty} value={specialty.toLowerCase()}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <UserRound className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No doctors found</h3>
              <p className="text-muted-foreground" data-testid="text-no-doctors">
                {searchQuery || specialtyFilter ? 'Try adjusting your search criteria' : 'No doctors are available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor: any) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
