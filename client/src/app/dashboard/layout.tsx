import Sidebar from '../../components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      
      {/* CHANGE: Removed 'pl-64' and replaced with 'md:pl-64'.
          This ensures 0 padding on mobile and 256px padding only on desktop.
      */}
      <main className="md:pl-64 min-h-screen relative transition-all duration-300">
        
        {/* Background Gradient - Responsive opacity for light/dark mode */}
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 dark:from-indigo-900/20 via-background to-background" />
        
        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}