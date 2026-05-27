"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
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
  const dataEnabled = Boolean(user);

  const [dogs, setDogs, dogsState] = useSupabaseCollection<Dog>(
    "dogs",
    initialDogs,
    dataEnabled
  );
  const [presences, setPresences, presencesState] = useSupabaseCollection<Presence>(
    "presences",
    initialPresences,
    dataEnabled
  );
  const [payments, setPayments, paymentsState] = useSupabaseCollection<Payment>(
    "payments",
    initialPayments,
    dataEnabled
  );
  const [
    groomingAppointments,
    setGroomingAppointments,
    groomingAppointmentsState,
  ] = useSupabaseCollection<GroomingAppointment>(
    "groomingAppointments",
    initialGroomingAppointments,
    dataEnabled
  );
  const [servicePrices, setServicePrices, servicePricesState] = useSupabaseCollection<ServicePrice>(
    "servicePrices",
    initialServicePrices,
    dataEnabled
  );
  const [alerts, setAlerts, alertsState] = useSupabaseCollection<Alert>(
    "alerts",
    initialAlerts,
    dataEnabled
  );
  const dataStates = [
    dogsState,
    presencesState,
    paymentsState,
    groomingAppointmentsState,
    servicePricesState,
    alertsState,
  ];
  const dataLoading = dataStates.some((state) => state.loading);
  const dataError = dataStates.find((state) => state.error)?.error;

  if (loading || (user && dataLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  if (dataError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-lg border border-destructive/30 bg-card p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">
            Nao foi possivel carregar os dados
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Confira se o arquivo supabase/schema.sql ja foi executado no SQL
            Editor do Supabase.
          </p>
          <p className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            {dataError}
          </p>
        </div>
      </div>
    );
  }

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
        return (
          <DogsSection
            dogs={dogs}
            setDogs={setDogs}
            presences={presences}
            payments={payments}
            groomingAppointments={groomingAppointments}
          />
        );
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
      <main className="min-h-screen pb-24 pt-20 lg:ml-64 lg:pb-0">
        <div className="p-4 sm:p-6">{renderSection()}</div>
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
