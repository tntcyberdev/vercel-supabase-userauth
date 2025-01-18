import { FC } from 'react'
import { supabase } from '../supabaseClient'
import { AuthError } from '@supabase/supabase-js'

const Auth: FC = () => {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    } catch (error) {
      const e = error as AuthError
      alert('Error signing in with Google: ' + e.message)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <h1 className="text-center mb-4">
              <i className="bi bi-shield-lock fs-2 d-block mb-2"></i>
              Welcome to Our App
            </h1>
            <p className="text-muted text-center mb-4">
              Please sign in with Google to continue
            </p>
            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
            >
              <i className="bi bi-google"></i>
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth