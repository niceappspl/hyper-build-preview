import React from 'react';
import { DEFAULT_DEVICE_CONFIG } from '../config/DeviceConfig';

// Tylko najprostszy interfejs z wymaganymi propami
interface MusicAppProps {
  containerStyle?: React.CSSProperties;
  showLoginScreen?: boolean;
}

// Komponent muzyczny - ULTRA PROSTY
const MusicApp: React.FC<MusicAppProps> = ({ containerStyle }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      background: '#1a2234',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      paddingTop: '48px',
      ...containerStyle
    }}>
      {/* Header Section - zwiększony margines od góry */}
      <div style={{ marginTop: '40px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, marginRight: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ 
              width: 2, 
              height: i === 1 ? 14 : 8, 
              backgroundColor: '#e67e22', 
              marginLeft: i > 0 ? 3 : 0,
              borderRadius: 9999
            }} />
          ))}
        </div>
        <span style={{ fontWeight: 'bold', fontSize: 14, color: 'white' }}>SoundSync</span>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        marginBottom: '20px'
      }}>
        {/* Title Block */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#e67e22', margin: '0 0 4px 0' }}>
            Music Simplified
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', margin: 0, padding: '0 10px' }}>
            All your favorite songs in one place
          </p>
        </div>

        {/* Featured Content */}
        <div style={{ borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 12, margin: '0 0 25px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 6, 
              backgroundColor: '#e67e22', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: 10,
              flexShrink: 0
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" style={{ width: 16, height: 16 }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 8, letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', margin: '0 0 2px 0' }}>
                FEATURED PLAYLIST
              </p>
              <h3 style={{ fontSize: 12, fontWeight: '600', color: 'white', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Today's Top Hits
              </h3>
              <p style={{ fontSize: 9, color: 'rgba(255, 255, 255, 0.6)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Fresh music delivered daily
              </p>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div style={{ marginTop: 'auto' }}>
          <button style={{ 
            width: '100%', 
            backgroundColor: '#e67e22', 
            color: 'white', 
            fontWeight: 500, 
            padding: '10px 0', 
            borderRadius: 30, 
            fontSize: 13, 
            marginBottom: 10, 
            border: 'none'
          }}>
            Sign up free
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
            <div style={{ flexGrow: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
            <span style={{ padding: '0 8px', color: 'rgba(255, 255, 255, 0.4)', fontSize: 10 }}>or</span>
            <div style={{ flexGrow: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
          </div>
          
          <button style={{ 
            width: '100%', 
            backgroundColor: 'rgba(255, 255, 255, 0.07)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            color: 'white', 
            fontWeight: 400, 
            padding: '8px 0', 
            borderRadius: 30, 
            fontSize: 12, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 15
          }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14, marginRight: 6 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <button style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 11, background: 'none', border: 'none', padding: 0 }}>
              Already have an account? <span style={{ color: '#e67e22', fontWeight: 500 }}>Log in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Statyczna właściwość dla kompatybilności z istniejącym kodem
(MusicApp as any).deviceConfig = DEFAULT_DEVICE_CONFIG;

export default MusicApp; 