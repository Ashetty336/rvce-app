'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';

const linkCategories = {
  academic: {
    title: 'Academic',
    icon: '📚',
    description: 'Access academic portals and resources',
    links: [
      {
        title: 'SAP Portal',
        url: 'https://fes-prd1.rvei.edu.in:4430/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html',
        description: 'Access your academic records and attendance'
      },
      {
        title: 'RVCE Official Website',
        url: 'https://www.rvce.edu.in/',
        description: 'Official college website'
      },
      {
        title: 'Notes and Question Papers',
        url: 'https://developer1010x.github.io/KnotesCentral/',
        description: 'Access course materials and assignments'
      }
    ]
  },
  socials: {
    title: 'Social Media',
    icon: '🌐',
    description: 'Connect with the RVCE community',
    links: [
      {
        title: 'RVCE Reddit',
        url: 'https://www.reddit.com/r/rvce/',
        description: 'Join the RVCE community on Reddit'
      },
      {
        title: 'RVCE Discord',
        url: 'https://discord.gg/rvce',
        description: 'Connect with students on Discord'
      },
      {
        title: 'RVCE Telegram',
        url: 'https://t.me/rvce_official',
        description: 'Official RVCE Telegram channel'
      }
    ]
  },
  clubs: {
    title: 'Clubs & Activities',
    icon: '🎨',
    description: 'Explore student clubs and organizations',
    links: [
      {
        title: '8th Mile (Cultural Club)',
        url: 'https://instagram.com/8thmile.rvce',
        description: 'RVCE Cultural Club'
      },
      {
        title: 'Ashwa Racing',
        url: 'https://instagram.com/ashwaracing',
        description: 'Formula Student Team'
      },
      {
        title: 'Astra Robotics',
        url: 'https://www.instagram.com/astra_robotics/?hl=en',
        description: 'Robotics Club'
      },
    
    ]
  }
};

function CategoryCard({ title, icon, description, links }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-800 p-6 rounded-lg cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{icon}</span>
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 pt-4">
          {links.map((link) => (
            <Link 
              key={link.title} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-700 p-4 rounded hover:bg-gray-600 transition-colors">
                <h4 className="text-white font-medium mb-1">{link.title}</h4>
                <p className="text-gray-400 text-sm">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function QuickLinksPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center"
        >
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">Quick Links</h1>
          <p className="text-gray-300 text-xl">Access all your important RVCE resources in one place</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {Object.entries(linkCategories).map(([key, category]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CategoryCard {...category} />
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 