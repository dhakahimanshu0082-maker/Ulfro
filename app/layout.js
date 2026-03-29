import './globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Ulfro — Any Task, Anytime, Anywhere',
  description: 'Get any task done or earn money by helping others — no professional skills required. Delhi\'s easiest task marketplace.',
  keywords: 'ulfro, task marketplace, delhi, earn money, gig work, task help',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                background: '#1a1a1a',
                color: '#fff',
                fontSize: '0.88rem',
                fontFamily: 'DM Sans, sans-serif',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
