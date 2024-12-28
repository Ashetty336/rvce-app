import Link from 'next/link';

export default function FeatureCard({ title, description, icon, href }) {
  return (
    <Link href={href}>
      <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </Link>
  );
} 