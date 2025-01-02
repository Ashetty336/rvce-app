import LoginForm from './components/LoginForm';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Login</h1>
            <p className="text-gray-400">Enter your account details</p>
          </div>
          
          <LoginForm />
          
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Welcome Banner */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <Image
          src="/students.png"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        
      </div>
    </div>
  );
} 