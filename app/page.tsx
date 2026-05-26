"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { LoginPage } from "@/components/auth/login-page";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { DashboardSection } from "@/components/sections/dashboard-section";
import { DogsSection } from "@/components/sections/dogs-section";
import { PresenceSection } from "@/components/sections/presence-section";
import { FinancialSection } from "@/components/sections/financial-section";
import { GroomingSection } from "@/components/sections/grooming-section";
import { ServicesSection } from "@/components/sections/services-section";
import { AlertsSection } from "@/components/sections/alerts-section";
import {
  initialDogs,
  initialPresences,
  initialPayments,
  initialGroomingAppointments,
  initialServicePrices,
  initialAlerts,
} from "@/lib/mock-data";
import type {
  Dog,
  Presence,
  Payment,
  GroomingAppointment,
  ServicePrice,
  Alert,
} from "@/lib/types";

function AppContent() {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  const [dogs, setDogs] = useLocalStorage<Dog[]>("dogworld_dogs", initialDogs);
  const [presences, setPresences] = useLocalStorage<Presence[]>("dogworld_presences", initialPresences);
  const [payments, setPayments] = useLocalStorage<Payment[]>("dogworld_payments", initialPayments);
  const [groomingAppointments, setGroomingAppointments] = useLocalStorage<GroomingAppointment[]>(
    "dogworld_grooming",
    initialGroomingAppointments
  );
  const [servicePrices, setServicePrices] = useLocalStorage<ServicePrice[]>("dogworld_services", initialServicePrices);
  const [alerts, setAlerts] = useLocalStorage<Alert[]>("dogworld_alerts", initialAlerts);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const activeAlertCount = alerts.filter((a) => !a.resolved).length;

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardSection
            dogs={dogs}
            presences={presences}
            payments={payments}
            groomingAppointments={groomingAppointments}
            alerts={alerts}
            onNavigate={setActiveSection}
          />
        );
      case "dogs":
        return <DogsSection dogs={dogs} setDogs={setDogs} />;
      case "presence":
        return (
          <PresenceSection
            dogs={dogs}
            presences={presences}
            setPresences={setPresences}
          />
        );
      case "financial":
        return (
          <FinancialSection
            dogs={dogs}
            payments={payments}
            setPayments={setPayments}
          />
        );
      case "grooming":
        return (
          <GroomingSection
            dogs={dogs}
            groomingAppointments={groomingAppointments}
            setGroomingAppointments={setGroomingAppointments}
            payments={payments}
            setPayments={setPayments}
          />
        );
      case "services":
        return (
          <ServicesSection
            servicePrices={servicePrices}
            setServicePrices={setServicePrices}
          />
        );
      case "alerts":
        return <AlertsSection alerts={alerts} setAlerts={setAlerts} />;
      default:
        return (
          <DashboardSection
            dogs={dogs}
            presences={presences}
            payments={payments}
            groomingAppointments={groomingAppointments}
            alerts={alerts}
            onNavigate={setActiveSection}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Header alertCount={activeAlertCount} onNewCheckIn={() => setActiveSection("presence")} />
      <main className="ml-64 min-h-screen pt-16">
        <div className="p-6">{renderSection()}</div>
      </main>
    </div>
  );
}

export default function HotelDoCaoPage() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
