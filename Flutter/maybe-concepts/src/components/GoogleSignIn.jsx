import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { isGoogleConfigured } from '../utils/googleAuth';
import './GoogleSignIn.css';

export default function GoogleSignIn() {
  const { loginWithGoogle } = useStore();
  const navigate = useNavigate();
  const configured = isGoogleConfigured();

  if (!configured) {
    return (
      <div className="google-setup">
        <p>Add your Google OAuth Client ID to <code>.env</code>:</p>
        <pre>VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com</pre>
        <p className="muted">
          Create one at{' '}
          <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">
            Google Cloud Console
          </a>
          {' '}(Web application · Authorized origins: <code>http://localhost:5173</code>)
        </p>
      </div>
    );
  }

  return (
    <div className="google-signin">
      <GoogleLogin
        onSuccess={(response) => {
          const result = loginWithGoogle(response.credential);
          if (result.ok) navigate('/account');
        }}
        onError={() => {
          // eslint-disable-next-line no-alert
          alert('Google sign-in failed. Check your Client ID and authorized origins.');
        }}
        theme="filled_black"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="320"
      />
    </div>
  );
}
