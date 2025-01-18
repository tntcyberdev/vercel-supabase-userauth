import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface ProfileProps {
  session: Session;
}

const Profile = ({ session }: ProfileProps) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [originalUsername, setOriginalUsername] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const { user } = session;

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!profile) {
        // Generate a unique username from email
        const baseUsername = user.email?.split('@')[0];
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              username: baseUsername,
              updated_at: new Date().toISOString(),
            },
          ])
          .single();

        if (insertError) throw insertError;
        
        setUsername(baseUsername);
        setOriginalUsername(baseUsername);
      } else {
        setUsername(profile.username);
        setOriginalUsername(profile.username);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't update if username hasn't changed
    if (username === originalUsername) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { user } = session;

      // First check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single();

      if (existingUser) {
        setError('This username is already taken. Please choose another one.');
        return;
      }

      const updates = {
        id: user.id,
        username,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      setOriginalUsername(username);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      if (error.code === '23505') {
        setError('This username is already taken. Please choose another one.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card border shadow" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="bi bi-person-circle fs-1 text-primary mb-3 d-block"></i>
            <h2 className="fs-3 fw-bold mb-2">Profile Settings</h2>
            <p className="text-muted">{session.user.email}</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={updateProfile}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text">@</span>
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-grow-1"
                disabled={loading || username === originalUsername}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;