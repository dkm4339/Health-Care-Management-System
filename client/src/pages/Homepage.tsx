import { Video, MessageCircle, Calendar, Shield, Search, Clock, CheckCircle, Star } from 'lucide-react';
import { Link } from 'wouter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import DoctorCard from '../components/DoctorCard';
import { featuredDoctors } from '../mock/doctors';
import { testimonials } from '../mock/testimonials';

export default function Homepage() {
  const features = [
    {
      icon: Video,
      title: "Video Consultations",
      description: "Connect with certified doctors through secure video calls from the comfort of your home.",
      bgColor: "bg-blue-50"
    },
    {
      icon: MessageCircle,
      title: "Instant Chat",
      description: "Get quick medical advice through our instant messaging platform with real-time responses.",
      bgColor: "bg-green-50"
    },
    {
      icon: Calendar,
      title: "Easy Appointment Booking",
      description: "Schedule appointments with your preferred doctors at convenient times that work for you.",
      bgColor: "bg-purple-50"
    },
    {
      icon: Shield,
      title: "Secure Medical Records",
      description: "Your medical data is encrypted and stored securely with HIPAA-compliant protection.",
      bgColor: "bg-red-50"
    }
  ];

  const steps = [
    {
      icon: Search,
      title: "Find a Doctor",
      description: "Browse through our network of certified healthcare professionals and specialists."
    },
    {
      icon: Clock,
      title: "Book Slot or Start Chat",
      description: "Choose your preferred consultation method - video call, chat, or in-person appointment."
    },
    {
      icon: CheckCircle,
      title: "Consult & Get Prescription",
      description: "Receive professional medical advice and digital prescriptions instantly."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Consult Doctors Anytime, Anywhere
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Book appointments, chat, or video call with certified doctors instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/doctors">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
                    Find Doctors
                  </button>
                </Link>
                <Link href="/appointment-booking">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg">
                    Book Appointment
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md h-80 bg-blue-500 rounded-lg flex items-center justify-center text-blue-200">
                <span className="text-lg font-medium">Hero Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Smart Health Care?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience healthcare like never before with our comprehensive digital platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started with healthcare in just three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="relative">
                  <div className="absolute -top-8 -left-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Featured Doctors
            </h2>
            <p className="text-xl text-gray-600">
              Consult with top-rated healthcare professionals
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id.toString()} doctor={doctor} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/doctors">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                View All Doctors
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from people who trust us with their health
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.feedback}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gray-500 text-xs">Avatar</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Healthcare Journey Today!
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of patients who trust Smart Health Care for their medical needs
          </p>
          <Link href="/login">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
              Sign Up Now
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}