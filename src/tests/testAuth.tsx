//src/tests/TestAuth.tsx

import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'

function TestAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    // Check active session and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignInWithEmail = async () => {
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email: 'test@example.com' // Replace with input field value in real implementation
    })
    
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for the login link!')
    }
  }

  const handleSignInWithGoogle = async () => {
    setMessage('')
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Google sign in error:', error)
        setMessage(`Error: ${error.message}`)
      } else {
        console.log('Google sign in data:', data)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setMessage(`Error: ${err.message}`)
    }
  }

  const handleSignOut = async () => {
    setMessage('')
    const { error } = await supabase.auth.signOut()
    if (error) setMessage(`Error: ${error.message}`)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h1>Supabase Auth Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Current Status</h2>
        <p>Authenticated: {session ? '✅' : '❌'}</p>
        {session && (
          <div>
            <p>User ID: {session.user.id}</p>
            <p>Email: {session.user.email}</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {!session ? (
          <>
            <button onClick={handleSignInWithEmail}>
              Test Sign In with Email
            </button>
            <button onClick={handleSignInWithGoogle}>
              Test Sign In with Google
            </button>
          </>
        ) : (
          <button onClick={handleSignOut}>
            Sign Out
          </button>
        )}
      </div>

      {message && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e9' }}>
          {message}
        </div>
      )}
    </div>
  )
}

export default TestAuth