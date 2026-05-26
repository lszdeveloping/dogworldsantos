"use client";

import {
  Home,
  Dog,
  CalendarCheck,
  DollarSign,
  Scissors,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { subDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  getHostedDogRows,
  getPresenceEventRows,
  type HostedDogRow,
} from "@/lib/dashboard-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  Dog as DogType,
  Presence,
  Payment,
  GroomingAppointment,
  Alert,
} from "@/lib/types";

interface DashboardSectionProps {
  dogs: DogType[];
  presences: Presence[];
  payments: Payment[];
  groomingAppointments: GroomingAppointment[];
  alerts: Alert[];
  onNavigate: (section: string) => void;
}


export function DashboardSection({
  dogs,
  presences,
  payments,
  groomingAppointments,
  alerts,
  onNavigate,
}: DashboardSectionProps) {
  const today = new Date().toISOString().split("T")[0];

  // Calculate stats
  const dogsHosted = dogs.filter(
    (d) => d.service === "Hospedagem" || d.service === "Ambos"
  ).length;
  const todayCheckIns = presences.filter(
    (p) => p.date === today && p.checkInTime
  ).length;
  const todayGrooming = groomingAppointments.filter(
    (g) => g.date === today
  ).length;
  const pendingPayments = payments.filter(
    (p) => p.status === "Pendente" || p.status === "Em atraso"
  );
  const monthlyRevenue = payments
    .filter((p) => p.status === "Pago")
    .reduce((acc, p) => acc + p.value, 0);
  const activeAlerts = alerts.filter((a) => !a.resolved).length;

  // Weekly occupancy from real presence data
  const weeklyOccupancyData = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    const dayPresences = presences.filter(
      (p) => p.date === dateStr && p.checkInTime
    ).length;
    const occupancy =
      dogs.length > 0 ? Math.round((dayPresences / dogs.length) * 100) : 0;
    return {
      day: format(d, "EEE", { locale: ptBR }),
      occupancy,
    };
  });

  // Today's services
  const todayServices = groomingAppointments
    .filter((g) => g.date === today)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 4);

  const hostedDogs = getHostedDogRows(dogs, presences, today);
  const todayPresenceEvents = getPresenceEventRows(dogs, presences, today);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Home className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            VisÃ£o geral do seu hotel de cÃ£es
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Home className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  CÃ£es hospedados
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{dogsHosted}</span>
                </div>
                <p className="text-xs text-muted-foreground">ocupaÃ§Ã£o atual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                <CalendarCheck className="size-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-ins hoje</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{todayCheckIns}</span>
                </div>
                <p className="text-xs text-muted-foreground">hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/10">
                <Scissors className="size-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Banhos agendados
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{todayGrooming}</span>
                </div>
                <p className="text-xs text-muted-foreground">hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-600/10">
                <DollarSign className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita do mÃªs</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    R$ {monthlyRevenue.toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">pagamentos recebidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Occupancy Chart */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">
              OcupaÃ§Ã£o semanal
            </CardTitle>
            <select className="rounded-md border border-border bg-background px-3 py-1 text-sm">
              <option>Esta semana</option>
              <option>Semana passada</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyOccupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "OcupaÃ§Ã£o"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e5e5",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#166534"
                    strokeWidth={3}
                    dot={{ fill: "#166534", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#166534" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Today's Services */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              PrÃ³ximos serviÃ§os de hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {todayServices.map((service) => {
              const dog = dogs.find((d) => d.id === service.dogId);
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {service.clientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{service.time}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {service.service}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      service.status === "Realizado"
                        ? "default"
                        : service.status === "Em andamento"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      service.status === "Em andamento"
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        : ""
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Atalhos rÃ¡pidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => onNavigate("presence")}
            >
              <CalendarCheck className="size-5 text-primary" />
              <span className="text-xs">Novo Check-in</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => onNavigate("grooming")}
            >
              <Scissors className="size-5 text-primary" />
              <span className="text-xs">Agendar ServiÃ§o</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => onNavigate("financial")}
            >
              <DollarSign className="size-5 text-primary" />
              <span className="text-xs">Registrar Pagamento</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => onNavigate("dogs")}
            >
              <Dog className="size-5 text-primary" />
              <span className="text-xs">Ver Todos os CÃ£es</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => onNavigate("alerts")}
            >
              <AlertTriangle className="size-5 text-primary" />
              <span className="text-xs">Ver Alertas</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hosted Dogs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">
              CÃ£es hospedados
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary"
              onClick={() => onNavigate("dogs")}
            >
              Ver todos
              <ArrowUpRight className="ml-1 size-3" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 overflow-x-auto p-0 px-4 pb-4 sm:px-6">
            <div className="grid min-w-[420px] grid-cols-4 gap-2 border-b pb-2 text-xs font-medium text-muted-foreground">
              <span>CÃ£o</span>
              <span>Tutor</span>
              <span>RaÃ§a</span>
              <span>Status</span>
            </div>
            {hostedDogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhum cÃ£o com hospedagem cadastrado.
                </p>
                <Button size="sm" variant="outline" onClick={() => onNavigate("dogs")}>
                  Cadastrar cÃ£o
                </Button>
              </div>
            ) : (
              hostedDogs.map((dog) => (
                <div
                  key={dog.id}
                  className="grid min-w-[420px] grid-cols-4 items-center gap-2 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {dog.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{dog.name}</span>
                  </div>
                  <span className="truncate text-muted-foreground">
                    {dog.tutorFirstName}
                  </span>
                  <span className="truncate text-muted-foreground">
                    {dog.breed}
                  </span>
                  <Badge
                    variant="outline"
                    className={`w-fit ${getHostedStatusColor(dog.status)}`}
                  >
                    {dog.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Presence - Entries and Exits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">
              PresenÃ§a - Entradas e SaÃ­das
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary"
              onClick={() => onNavigate("presence")}
            >
              Ver todos
              <ArrowUpRight className="ml-1 size-3" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 overflow-x-auto p-0 px-4 pb-4 sm:px-6">
            <div className="grid min-w-[420px] grid-cols-4 gap-2 border-b pb-2 text-xs font-medium text-muted-foreground">
              <span>CÃ£o</span>
              <span>Evento</span>
              <span>HorÃ¡rio</span>
              <span>Status</span>
            </div>
            {todayPresenceEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhuma entrada ou saída registrada hoje.
                </p>
                <Button size="sm" variant="outline" onClick={() => onNavigate("presence")}>
                  Fazer check-in
                </Button>
              </div>
            ) : (
              todayPresenceEvents.map((presence) => (
                <div
                  key={presence.id}
                  className="grid min-w-[420px] grid-cols-4 items-center gap-2 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {presence.dogName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{presence.dogName}</span>
                  </div>
                  <span className="text-muted-foreground">{presence.event}</span>
                  <span className="text-muted-foreground">{presence.time}</span>
                  <Badge
                    variant="outline"
                    className={
                      presence.status === "Presente"
                        ? "bg-green-100 text-green-700"
                        : presence.status === "Saiu"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-amber-100 text-amber-700"
                    }
                  >
                    {presence.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">
              Financeiro - Resumo
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary"
              onClick={() => onNavigate("financial")}
            >
              Ver detalhes
              <ArrowUpRight className="ml-1 size-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Receita</p>
                <p className="text-lg font-bold">
                  R$ {monthlyRevenue.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground">pagamentos recebidos</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PendÃªncias</p>
                <p className="text-lg font-bold">
                  R$ {pendingPayments.reduce((a, p) => a + p.value, 0).toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-primary">
                  {pendingPayments.length} faturas
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pago</p>
                <p className="text-lg font-bold">
                  R$ {payments.filter((p) => p.status === "Pago").reduce((a, p) => a + p.value, 0).toLocaleString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em atraso</p>
                <p className="text-lg font-bold text-red-600">
                  R$ {payments.filter((p) => p.status === "Em atraso").reduce((a, p) => a + p.value, 0).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getHostedStatusColor(status: HostedDogRow["status"]) {
  switch (status) {
    case "Presente":
      return "bg-green-100 text-green-700";
    case "Saiu":
      return "bg-gray-100 text-gray-700";
    case "Aguardando":
      return "bg-amber-100 text-amber-700";
    case "Sem check-in":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-primary/10 text-primary";
  }
}
