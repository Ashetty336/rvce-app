import SignupForm from '../components/SignupForm';
import Link from 'next/link';

export default function SignUp() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">Sign Up</h1>
          <p className="text-gray-400 mb-6">Create your RV Central account</p>
          
          <SignupForm />
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link href="/" className="text-purple-400 hover:text-purple-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 