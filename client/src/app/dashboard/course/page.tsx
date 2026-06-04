'use client';

import StatsHeader from '../../../components/dashboard/StatsHeader';
import SkillTree from '../../../components/dashboard/SkillTree';

export default function DashboardPage() {
  return (
    // Unified spacing with a transition wrapper to prevent sudden snapping when switching modes
    <div className="container mx-auto px-6 sm:px-8 py-8 max-w-4xl text-foreground transition-colors duration-300">
      
      {/* Top Bar Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-4 border-b border-border pb-6 transition-colors duration-300">
        <div>
          {/* Swapped hardcoded text-slate-900 to dynamic text-foreground */}
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Current Path
          </h1>
          {/* Swapped text-slate-500 to dynamic text-muted-foreground */}
          <p className="text-sm text-muted-foreground mt-1">
            Master the basics of Data Structures
          </p>
        </div>
        
        {/* Note: Ensure internal elements of StatsHeader use bg-card, text-foreground, and border-border */}
        <StatsHeader />
      </div>

      {/* The Game Map Container */}
      <div className="w-full">
        {/* Note: Ensure SkillTree internal SVG assets or absolute nodes use theme states or current-color strokes */}
        <SkillTree />
      </div>
    </div>
  );
}