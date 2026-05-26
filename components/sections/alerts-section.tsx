"use client";

import { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Calendar,
  DollarSign,
  Syringe,
  Clock,
  Check,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Alert, AlertPriority, AlertType } from "@/lib/types";
import { formatDateBR } from "@/lib/utils";

interface AlertsSectionProps {
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
}

const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case "vacina_vencida":
    case "vacina_proxima":
      return <Syringe className="size-5" />;
    case "cobranca_atrasada":
    case "pagamento_pendente":
      return <DollarSign className="size-5" />;
    case "checkout_pendente":
      return <Clock className="size-5" />;
    case "agendamento_hoje":
      return <Calendar className="size-5" />;
    default:
      return <AlertTriangle className="size-5" />;
  }
};

const getAlertTypeLabel = (type: AlertType) => {
  switch (type) {
    case "vacina_vencida":
      return "Vacina Vencida";
    case "vacina_proxima":
      return "Vacina Próxima";
    case "cobranca_atrasada":
      return "Cobrança em Atraso";
    case "pagamento_pendente":
      return "Pagamento Pendente";
    case "checkout_pendente":
      return "Check-out Pendente";
    case "agendamento_hoje":
      return "Agendamento Hoje";
    default:
      return type;
  }
};

const getPriorityColor = (priority: AlertPriority) => {
  switch (priority) {
    case "alta":
      return "bg-red-100 text-red-700 border-red-200";
    case "média":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "baixa":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "";
  }
};

const getIconColor = (priority: AlertPriority) => {
  switch (priority) {
    case "alta":
      return "bg-red-100 text-red-600";
    case "média":
      return "bg-amber-100 text-amber-600";
    case "baixa":
      return "bg-blue-100 text-blue-600";
    default:
      return "";
  }
};

export function AlertsSection({ alerts, setAlerts }: AlertsSectionProps) {
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showResolved, setShowResolved] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesPriority =
      priorityFilter === "all" || alert.priority === priorityFilter;
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    const matchesResolved = showResolved ? true : !alert.resolved;
    return matchesPriority && matchesType && matchesResolved;
  });

  const handleResolve = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  // Stats
  const activeAlerts = alerts.filter((a) => !a.resolved);
  const highPriorityCount = activeAlerts.filter(
    (a) => a.priority === "alta"
  ).length;
  const mediumPriorityCount = activeAlerts.filter(
    (a) => a.priority === "média"
  ).length;
  const lowPriorityCount = activeAlerts.filter(
    (a) => a.priority === "baixa"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
            <p className="text-sm text-muted-foreground">
              Notificações importantes do sistema
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
                <p className="text-sm text-muted-foreground">Alertas ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{highPriorityCount}</p>
                <p className="text-sm text-muted-foreground">Prioridade alta</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
                <AlertTriangle className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mediumPriorityCount}</p>
                <p className="text-sm text-muted-foreground">
                  Prioridade média
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                <AlertTriangle className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lowPriorityCount}</p>
                <p className="text-sm text-muted-foreground">
                  Prioridade baixa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="média">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="vacina_vencida">Vacina Vencida</SelectItem>
              <SelectItem value="vacina_proxima">Vacina Próxima</SelectItem>
              <SelectItem value="cobranca_atrasada">
                Cobrança em Atraso
              </SelectItem>
              <SelectItem value="pagamento_pendente">
                Pagamento Pendente
              </SelectItem>
              <SelectItem value="checkout_pendente">
                Check-out Pendente
              </SelectItem>
              <SelectItem value="agendamento_hoje">Agendamento Hoje</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant={showResolved ? "default" : "outline"}
          size="sm"
          onClick={() => setShowResolved(!showResolved)}
        >
          {showResolved ? "Ocultar resolvidos" : "Mostrar resolvidos"}
        </Button>
      </div>

      {/* Alerts List */}
      <div className="flex flex-col gap-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                <Check className="size-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum alerta encontrado
              </h3>
              <p className="text-sm text-muted-foreground">
                {showResolved
                  ? "Não há alertas com os filtros selecionados"
                  : "Todos os alertas foram resolvidos!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={
                alert.resolved
                  ? "border-green-200 bg-green-50/50 opacity-60"
                  : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex size-12 items-center justify-center rounded-lg ${getIconColor(
                        alert.priority
                      )}`}
                    >
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {getAlertTypeLabel(alert.type)}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(alert.priority)}
                        >
                          {alert.priority}
                        </Badge>
                        {alert.resolved && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-700"
                          >
                            Resolvido
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        {alert.dogName && (
                          <span>
                            <strong>Cão:</strong> {alert.dogName}
                          </span>
                        )}
                        {alert.tutorName && (
                          <span>
                            <strong>Tutor:</strong> {alert.tutorName}
                          </span>
                        )}
                        <span>
                          <strong>Data:</strong>{" "}
                          {formatDateBR(alert.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleResolve(alert.id)}
                    >
                      <Check className="size-4" />
                      Resolver
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
