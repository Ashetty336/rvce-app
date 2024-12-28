import LoginForm from './components/LoginForm';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
          <p className="text-gray-400 mb-6">Enter your account details</p>
          
          <LoginForm />
          
          <div className="mt-4">
            <p className="text-gray-400">
              <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300">
                Forgot Password?
              </Link>
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 