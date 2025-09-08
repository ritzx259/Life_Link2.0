'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserDashboard from '@/components/ui/user-dashboard';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user authentication and fetch user data
    const checkAuth = async () => {
      try {
        // Fetch the current user session data
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!sessionResponse.ok) {
          throw new Error('Authentication failed');
        }
        
        const sessionData = await sessionResponse.json();
        
        if (sessionData && sessionData.user) {
          const userData = sessionData.user;
          
          // Fetch detailed user data based on user type
          try {
            const endpoint = userData.type === 'hospital' 
              ? `/api/hospitals/${userData.id}` 
              : `/api/donors/${userData.id}`;
              
            const detailResponse = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              setUser({ ...userData, ...detailData });
            } else {
              // If detailed data fetch fails, still use basic user data
              setUser(userData);
            }
          } catch (detailError) {
            console.error('Error fetching detailed user data:', detailError);
            setUser(userData);
          }
        } else {
          // No valid session found
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Redirect to login if not authenticated
  // In a real app, this would check for a valid session
  const handleLogin = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-red-600 border-r-red-600 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
          <button 
            onClick={handleLogin}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return <UserDashboard userType={user.type as 'donor' | 'hospital'} userData={user} />;
}