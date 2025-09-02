import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Monitor, Phone, MessageCircle, Volume2 } from 'lucide-react';
import { useLocation } from 'wouter';

export default function VideoCall() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');
  const [startTime] = useState(Date.now());

  // Update call duration
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would interact with WebRTC to mute/unmute the microphone
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // In a real implementation, this would interact with WebRTC to turn camera on/off
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // In a real implementation, this would use getDisplayMedia() for screen sharing
  };

  const handleEndCall = () => {
    // In a real implementation, this would close the WebRTC connection
    setLocation('/chat');
  };

  const handleOpenChat = () => {
    setLocation('/chat');
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Video Call Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="status-dot status-online"></span>
            <span className="text-white font-medium" data-testid="text-call-participant">
              Dr. Sarah Johnson
            </span>
          </div>
          <span className="text-gray-300 text-sm" data-testid="text-call-duration">
            {callDuration}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-300 text-sm">Consultation in progress</span>
        </div>
      </div>
      
      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        {/* Remote Video (Doctor) - Main View */}
        <div className="w-full h-full relative bg-gray-800 flex items-center justify-center">
          {/* Placeholder for remote video stream */}
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold">SJ</span>
              </div>
              <h3 className="text-xl font-semibold">Dr. Sarah Johnson</h3>
              <p className="text-blue-200">Cardiology Specialist</p>
            </div>
          </div>
          
          {/* Local Video (Patient) - Picture in Picture */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
            {isVideoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm">You</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Video Call Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-gray-800/90 backdrop-blur-sm rounded-full px-6 py-3">
              <Button
                variant="ghost"
                size="icon"
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={handleToggleMute}
                data-testid="button-toggle-mute"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${
                  !isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={handleToggleVideo}
                data-testid="button-toggle-video"
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${
                  isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={handleScreenShare}
                data-testid="button-screen-share"
              >
                <Monitor className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                data-testid="button-volume-settings"
              >
                <Volume2 className="w-5 h-5" />
              </Button>
              
              <Button
                variant="destructive"
                size="icon"
                className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                onClick={handleEndCall}
                data-testid="button-end-call"
              >
                <Phone className="w-5 h-5 transform rotate-180" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                onClick={handleOpenChat}
                data-testid="button-open-chat"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Call Info */}
          <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <span className="status-dot status-online"></span>
              <span className="text-white text-sm font-medium" data-testid="text-connection-status">
                Connection: Excellent
              </span>
            </div>
          </div>
          
          {/* Mute Indicator */}
          {isMuted && (
            <div className="absolute top-20 left-4 bg-red-600/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <MicOff className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium" data-testid="text-mute-indicator">
                  You are muted
                </span>
              </div>
            </div>
          )}
          
          {/* Screen Share Indicator */}
          {isScreenSharing && (
            <div className="absolute top-4 right-60 bg-blue-600/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium" data-testid="text-screen-share-indicator">
                  Sharing screen
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
