import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  UserRound, 
  MessageCircle, 
  Video, 
  User, 
  Users, 
  Calendar,
  BarChart3,
  LogOut,
  Heart
} from 'lucide-react';

interface SidebarProps {
  userType: 'patient' | 'doctor' | 'admin';
}

export default function Sidebar({ userType }: SidebarProps) {
  const { logout } = useAuth();
  const [location] = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { path: `/${userType}`, icon: LayoutDashboard, label: 'Dashboard' },
    ];

    if (userType === 'patient') {
      return [
        ...baseItems,
        { path: '/doctors', icon: UserRound, label: 'Find Doctors' },
        { path: '/chat', icon: MessageCircle, label: 'Chat' },
        { path: '/video-call', icon: Video, label: 'Video Call' },
        { path: '/profile', icon: User, label: 'Profile' },
      ];
    }

    if (userType === 'doctor') {
      return [
        ...baseItems,
        { path: '/patients', icon: Users, label: 'Patients' },
        { path: '/chat', icon: MessageCircle, label: 'Chat' },
        { path: '/video-call', icon: Video, label: 'Video Call' },
        { path: '/profile', icon: User, label: 'Profile' },
      ];
    }

    if (userType === 'admin') {
      return [
        ...baseItems,
        { path: '/manage-doctors', icon: UserRound, label: 'Manage Doctors' },
        { path: '/manage-users', icon: Users, label: 'Manage Users' },
        { path: '/appointments', icon: Calendar, label: 'Appointments' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();
  const portalName = userType.charAt(0).toUpperCase() + userType.slice(1) + ' Portal';

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Heart className="text-primary-foreground w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">HealthCare Pro</h2>
            <p className="text-sm text-muted-foreground">{portalName}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent text-foreground'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
