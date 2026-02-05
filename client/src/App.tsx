import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthenticatedSurgeon } from "./lib/hospitalAPI";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

// Page imports
import SurgeonAuthPage from "@/pages/SurgeonAuthPage";
import MainControlPanel from "@/pages/MainControlPanel";
import CasesManagementPage from "@/pages/CasesManagementPage";
import CaseProfilePage from "@/pages/CaseProfilePage";
import DischargedRecordsPage from "@/pages/DischargedRecordsPage";
import BulletinBoardPage from "@/pages/BulletinBoardPage";
import MetricsDisplayPage from "@/pages/MetricsDisplayPage";
import NotFound from "@/pages/not-found";

// Custom hook for access verification with unique pattern
function useAccessVerification() {
  const { data: surgeonData, isLoading: verifying } = useAuthenticatedSurgeon();
  const [, navigateTo] = useLocation();
  const [accessState, setAccessState] = useState<'verifying' | 'granted' | 'denied'>('verifying');

  useEffect(() => {
    if (!verifying) {
      setAccessState(surgeonData ? 'granted' : 'denied');
      if (!surgeonData) {
        navigateTo('/auth');
      }
    }
  }, [surgeonData, verifying, navigateTo]);

  return { accessState, surgeonData };
}

// Custom access boundary with unique UI
function AccessBoundary({ children }: { children: React.ReactNode }) {
  const { accessState } = useAccessVerification();

  if (accessState === 'verifying') {
    return (
      <div className="w-full h-screen bg-gradient-to-tl from-indigo-100 via-blue-50 to-cyan-100 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 border-8 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-28 h-28 border-8 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-24 h-24 border-8 border-transparent border-r-indigo-600 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">مستشفى جامعة بني سويف</h2>
        <p className="text-gray-600">قسم الجراحة العامة</p>
      </div>
    );
  }

  return accessState === 'granted' ? <>{children}</> : null;
}

// Main app structure with custom pattern
function HospitalRegistryApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen" dir="rtl">
          <Switch>
            <Route path="/auth" component={SurgeonAuthPage} />
            <Route path="/">
              <AccessBoundary><MainControlPanel /></AccessBoundary>
            </Route>
            <Route path="/cases">
              <AccessBoundary><CasesManagementPage /></AccessBoundary>
            </Route>
            <Route path="/case/:caseId">
              <AccessBoundary><CaseProfilePage /></AccessBoundary>
            </Route>
            <Route path="/discharged">
              <AccessBoundary><DischargedRecordsPage /></AccessBoundary>
            </Route>
            <Route path="/bulletin">
              <AccessBoundary><BulletinBoardPage /></AccessBoundary>
            </Route>
            <Route path="/metrics">
              <AccessBoundary><MetricsDisplayPage /></AccessBoundary>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default HospitalRegistryApp;
