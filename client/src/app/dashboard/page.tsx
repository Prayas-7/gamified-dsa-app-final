import HomeDashboard from '../../components/dashboard/HomeDashboard';

// If you are using an auth library like NextAuth or Clerk, you might get the user here
// import { currentUser } from '@clerk/nextjs'; 

export default async function DashboardPage() {
  // 1. (Optional) Fetch user progress from your database here
  // const userData = await getUserProgress(); 
  
  return (
    // Swapped hardcoded light bg-slate-50 for your semantic background token
    <main className="min-h-screen w-full bg-background transition-colors duration-300">
      
      {/* 2. Render the Main Dashboard View */}
      {/* Note: HomeDashboard will now safely render its inner elements using bg-card and text-foreground */}
      <HomeDashboard />
      
    </main>
  );
}