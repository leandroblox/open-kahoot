'use client';

import { Users, Zap } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import ActionCard from '@/components/ActionCard';
import FeatureGrid from '@/components/FeatureGrid';

export default function Home() {
  const features = [
    {
      emoji: '⚡',
      title: 'Real-time',
      description: 'Instant synchronization across all devices'
    },
    {
      emoji: '🏆',
      title: 'Competitive', 
      description: 'Faster answers earn more points'
    },
    {
      emoji: '🎯',
      title: 'Custom Quizzes',
      description: 'Create your own questions and answers'
    }
  ];

  return (
    <PageLayout gradient="home" showLogo={false}>
      <Hero title="Open Kahoot!" />
      
      {/* Action Cards */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <ActionCard
          href="/join"
          icon={Zap}
          variant="join"
          title="Join Game"
          description="Enter a game pin to join an existing quiz and compete with other players"
          buttonText="Join Game →"
        />
        <ActionCard
          href="/host"
          icon={Users}
          variant="host"
          title="Host Game"
          description="Create your own quiz with custom questions and let players join with a game pin"
          buttonText="Create Game →"
        />
      </div>

      {/* <FeatureGrid features={features} /> */}
      
      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-16 text-center space-y-4">
        <div className="text-white/60 text-sm">
          <p>
            This project is not affiliated with, endorsed by, or connected to Kahoot! AS or any of its subsidiaries.
            Kahoot! is a trademark of Kahoot! AS.
          </p>
        </div>
        
        <div className="text-white/80">
          <a 
            href="https://github.com/soleilvermeil/open-kahoot-next-ai-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
