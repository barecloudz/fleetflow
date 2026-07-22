import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import OnboardingWizard from "@/components/onboarding/onboarding-wizard";
import ChangePasswordModal from "@/components/onboarding/change-password-modal";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const mustChangePassword = user?.user_metadata?.must_change_password === true

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
      {mustChangePassword ? <ChangePasswordModal /> : <OnboardingWizard />}
    </SidebarProvider>
  );
}
