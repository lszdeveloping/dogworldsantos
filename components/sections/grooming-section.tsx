"use client";

import { useState } from "react";
import {
  Scissors,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  Clock,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type {
  Dog,
  GroomingAppointment,
  GroomingService,
  GroomingStatus,
  Payment,
} from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GroomingSectionProps {
  dogs: Dog[];
  groomingAppointments: GroomingAppointment[];
  setGroomingAppointments: React.Dispatch<
    React.SetStateAction<GroomingAppointment[]>
  >;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
}

export function GroomingSection({
  dogs,
  groomingAppointments,
  setGroomingAppointments,
  payments,
  setPayments,
}: GroomingSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<GroomingAppointment | null>(null);
  const [isRegisteredDog, setIsRegisteredDog] = useState(true);
  const [formData, setFormData] = useState({
    dogId: "",
    clientName: "",
    tutorName: "",
    tutorPhone: "",
    service: "Banho" as GroomingService,
    date: "",
    time: "",
    value: 0,
    observations: "",
    status: "Agendado" as GroomingStatus,
  });

  const today = new Date().toISOString().split("T")[0];

  const filteredAppointments = groomingAppointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.tutorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group by date
  const groupedAppointments = filteredAppointments.reduce((groups, apt) => {
    const date = apt.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(apt);
    return groups;
  }, {} as Record<string, GroomingAppointment[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedAppointments).sort();

  const handleOpenDialog = (appointment?: GroomingAppointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setIsRegisteredDog(appointment.isRegisteredDog);
      setFormData({
        dogId: appointment.dogId || "",
        clientName: appointment.clientName,
        tutorName: appointment.tutorName,
        tutorPhone: appointment.tutorPhone,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        value: appointment.value,
        observations: appointment.observations || "",
        status: appointment.status,
      });
    } else {
      setEditingAppointment(null);
      setIsRegisteredDog(true);
      setFormData({
        dogId: "",
        clientName: "",
        tutorName: "",
        tutorPhone: "",
        service: "Banho",
        date: today,
        time: "",
        value: 0,
        observations: "",
        status: "Agendado",
      });
    }
    setIsDialogOpen(true);
  };

  const handleDogSelect = (dogId: string) => {
    const dog = dogs.find((d) => d.id === dogId);
    if (dog) {
      setFormData({
        ...formData,
        dogId,
        clientName: dog.name,
        tutorName: dog.tutorName,
        tutorPhone: dog.tutorPhone,
      });
    }
  };

  const handleSave = () => {
    if (editingAppointment) {
      setGroomingAppointments((prev) =>
        prev.map((apt) =>
          apt.id === editingAppointment.id
            ? {
                ...apt,
                ...formData,
                isRegisteredDog,
                dogId: isRegisteredDog ? formData.dogId : undefined,
              }
            : apt
        )
      );
    } else {
      const newAppointment: GroomingAppointment = {
        id: Date.now().toString(),
        ...formData,
        isRegisteredDog,
        dogId: isRegisteredDog ? formData.dogId : undefined,
      };
      setGroomingAppointments((prev) => [...prev, newAppointment]);
    }
    setIsDialogOpen(false);
  };

  const handleMarkAsCompleted = (appointmentId: string) => {
    const appointment = groomingAppointments.find(
      (apt) => apt.id === appointmentId
    );
    if (!appointment) return;

    // Update appointment status
    setGroomingAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, status: "Realizado" as GroomingStatus }
          : apt
      )
    );

    // Create a payment record for the grooming service
    const newPayment: Payment = {
      id: `grooming-${Date.now()}`,
      dogId: appointment.dogId || "",
      tutorName: appointment.tutorName,
      service: `Banho e Tosa - ${appointment.service}`,
      value: appointment.value,
      dueDate: today,
      status: "Pago",
      paymentMethod: "PIX",
      paymentDate: today,
    };
    setPayments((prev) => [...prev, newPayment]);
  };

  const handleDelete = (appointmentId: string) => {
    setGroomingAppointments((prev) =>
      prev.filter((apt) => apt.id !== appointmentId)
    );
  };

  const getStatusColor = (status: GroomingStatus) => {
    switch (status) {
      case "Agendado":
        return "bg-blue-100 text-blue-700";
      case "Em andamento":
        return "bg-amber-100 text-amber-700";
      case "Realizado":
        return "bg-green-100 text-green-700";
      case "Cancelado":
        return "bg-gray-100 text-gray-500";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Scissors className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Banho & Tosa</h1>
            <p className="text-sm text-muted-foreground">
              Agendamentos de serviços
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="size-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou tutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Agendado">Agendados</SelectItem>
              <SelectItem value="Em andamento">Em andamento</SelectItem>
              <SelectItem value="Realizado">Realizados</SelectItem>
              <SelectItem value="Cancelado">Cancelados</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments by Date */}
      <div className="flex flex-col gap-6">
        {sortedDates.map((date) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <h3 className="font-semibold">
                {date === today
                  ? "Hoje"
                  : format(new Date(date + "T12:00:00"), "EEEE, dd 'de' MMMM", {
                      locale: ptBR,
                    })}
              </h3>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Horário
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Pet
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Tutor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Serviço
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Valor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedAppointments[date]
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((apt) => (
                          <tr key={apt.id} className="border-b last:border-0">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 font-medium">
                                <Clock className="size-3 text-muted-foreground" />
                                {apt.time}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="size-9">
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {apt.clientName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-medium">
                                    {apt.clientName}
                                  </span>
                                  {!apt.isRegisteredDog && (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 text-xs"
                                    >
                                      Avulso
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {apt.tutorName}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">{apt.service}</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              R$ {apt.value.toLocaleString("pt-BR")}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={getStatusColor(apt.status)}
                              >
                                {apt.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {apt.status === "Agendado" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-8 p-0"
                                    onClick={() => {
                                      setGroomingAppointments((prev) =>
                                        prev.map((a) =>
                                          a.id === apt.id
                                            ? {
                                                ...a,
                                                status:
                                                  "Em andamento" as GroomingStatus,
                                              }
                                            : a
                                        )
                                      );
                                    }}
                                  >
                                    <Clock className="size-4 text-amber-600" />
                                  </Button>
                                )}
                                {(apt.status === "Agendado" ||
                                  apt.status === "Em andamento") && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-8 p-0"
                                    onClick={() =>
                                      handleMarkAsCompleted(apt.id)
                                    }
                                  >
                                    <Check className="size-4 text-green-600" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0"
                                  onClick={() => handleOpenDialog(apt)}
                                >
                                  <Edit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0 text-destructive"
                                  onClick={() => handleDelete(apt.id)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            {/* Client Type Toggle */}
            <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Cão cadastrado</p>
                <p className="text-sm text-muted-foreground">
                  Selecionar um cão já cadastrado no sistema
                </p>
              </div>
              <Switch
                checked={isRegisteredDog}
                onCheckedChange={setIsRegisteredDog}
              />
            </div>

            {isRegisteredDog ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Selecionar cão</label>
                <Select
                  value={formData.dogId}
                  onValueChange={handleDogSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {dogs.map((dog) => (
                        <SelectItem key={dog.id} value={dog.id}>
                          {dog.name} - {dog.tutorName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome do pet</label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="Ex: Max"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Nome do tutor</label>
                    <Input
                      value={formData.tutorName}
                      onChange={(e) =>
                        setFormData({ ...formData, tutorName: e.target.value })
                      }
                      placeholder="Ex: Maria Silva"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      value={formData.tutorPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, tutorPhone: e.target.value })
                      }
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Serviço</label>
              <Select
                value={formData.service}
                onValueChange={(value: GroomingService) =>
                  setFormData({ ...formData, service: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Banho">Banho</SelectItem>
                    <SelectItem value="Tosa">Tosa</SelectItem>
                    <SelectItem value="Banho + Tosa">Banho + Tosa</SelectItem>
                    <SelectItem value="Tosa Higiênica">
                      Tosa Higiênica
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Data</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Horário</label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Valor</label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: GroomingStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Agendado">Agendado</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Realizado">Realizado</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                value={formData.observations}
                onChange={(e) =>
                  setFormData({ ...formData, observations: e.target.value })
                }
                placeholder="Observações sobre o serviço..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingAppointment ? "Salvar Alterações" : "Criar Agendamento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
