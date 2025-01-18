import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Error signing in with Google. Please try again.');
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {!session ? (
        <Login onLogin={handleGoogleSignIn} />
      ) : (
        <Profile session={session} />
      )}
    </div>
  );
}

export default App;