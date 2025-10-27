import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
        <p className="text-gray-300">Start building amazing applications today</p>
      </div>
      <SignUp
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'glass border border-electric-500/20 shadow-2xl',
          },
        }}
      />
    </div>
  );
}
