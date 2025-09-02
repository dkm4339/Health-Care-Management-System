import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import DoctorCard from '@/components/DoctorCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserRound } from 'lucide-react';
import { useLocation } from 'wouter';
import { featuredDoctors } from '@/mock/doctors';

export default function DoctorList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Try to fetch from API if user is authenticated, otherwise use mock data
  const { data: apiDoctors, isLoading } = useQuery({
    queryKey: ['/api/doctors'],
    enabled: !!user, // Only fetch if user is authenticated
  });

  // Use API data if available, otherwise fall back to mock data
  const doctors = apiDoctors || featuredDoctors;

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

  // If user is not authenticated, show public version
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Doctors</h1>
            <p className="text-xl text-gray-600">Browse and book appointments with our specialists</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-doctors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-specialty-filter">
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

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <UserRound className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No doctors found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor: any) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Ready to book an appointment?</p>
            <button 
              onClick={() => setLocation('/login')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login to Book Appointment
            </button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Authenticated user version
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
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
