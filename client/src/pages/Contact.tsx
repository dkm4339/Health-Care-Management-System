import { useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock, Send, X, HelpCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to help you navigate our healthcare platform. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  const quickHelp = [
    "How do I book an appointment?",
    "How do I find a doctor?",
    "What are your consultation types?",
    "How do I create an account?",
    "What are your operating hours?",
    "How much do consultations cost?"
  ];

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      text: currentMessage,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simple bot responses based on keywords
    setTimeout(() => {
      let botResponse = "";
      const msg = currentMessage.toLowerCase();
      
      if (msg.includes('book') || msg.includes('appointment')) {
        botResponse = "To book an appointment: 1) Click 'Find Doctors' from the homepage 2) Browse our specialists 3) Click 'Book Appointment' on your preferred doctor 4) Login or create an account 5) Select your preferred date and time. Need help with any specific step?";
      } else if (msg.includes('doctor') || msg.includes('find')) {
        botResponse = "You can find doctors by clicking 'Doctors' in the navigation menu. Use the search bar to find doctors by name or specialty, or filter by medical specialties like Cardiology, Dermatology, etc.";
      } else if (msg.includes('account') || msg.includes('login') || msg.includes('sign')) {
        botResponse = "To create an account, click 'Login' in the top right corner, then select 'Sign Up'. You can register as a Patient or Doctor. Fill in your details and you'll be ready to use our platform!";
      } else if (msg.includes('cost') || msg.includes('price') || msg.includes('fee')) {
        botResponse = "Consultation fees vary by doctor and consultation type. Video consultations typically range from $50-150, while chat consultations are usually $25-75. Exact pricing is shown when you select a doctor.";
      } else if (msg.includes('hours') || msg.includes('time') || msg.includes('available')) {
        botResponse = "Our platform is available 24/7! Doctors set their own availability hours. You can see available time slots when booking with each doctor. Emergency consultations are available round the clock.";
      } else if (msg.includes('video') || msg.includes('chat') || msg.includes('consultation')) {
        botResponse = "We offer: 📹 Video Consultations - Face-to-face meetings with doctors 💬 Instant Chat - Text-based consultations 📅 Scheduled Appointments - Book for later 🚨 Emergency Consultations - Immediate care when needed";
      } else {
        botResponse = "I'd be happy to help! You can ask me about booking appointments, finding doctors, creating accounts, consultation types, or anything else about using our healthcare platform. What would you like to know?";
      }

      const botMessage = {
        id: chatMessages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setCurrentMessage('');
  };

  const handleQuickHelp = (question: string) => {
    setCurrentMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our support team or find answers to your questions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">24/7 Emergency Support</p>
                <p className="text-2xl font-semibold text-blue-600 mb-4">1-800-HEALTH</p>
                <p className="text-sm text-gray-500">For urgent medical concerns, call our emergency hotline</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">General Inquiries</p>
                <p className="text-lg font-semibold text-green-600 mb-2">support@smarthealthcare.com</p>
                <p className="text-gray-600 mb-2">Technical Support</p>
                <p className="text-lg font-semibold text-green-600 mb-4">tech@smarthealthcare.com</p>
                <p className="text-sm text-gray-500">Response time: 2-4 hours during business hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Office Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">Smart Health Care HQ</p>
                  <p className="text-gray-600">123 Medical Center Drive</p>
                  <p className="text-gray-600">Healthcare City, HC 12345</p>
                  <p className="text-gray-600">United States</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Emergency support available 24/7
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input placeholder="Your first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input placeholder="Your last name" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input placeholder="What can we help you with?" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-32"
                  />
                </div>
                
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Assist Chat Widget */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 border">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              <span className="font-semibold">Healthcare Assistant</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Help Options */}
          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Quick Help:</p>
            <div className="flex flex-wrap gap-1">
              {quickHelp.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickHelp(question)}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask me anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}