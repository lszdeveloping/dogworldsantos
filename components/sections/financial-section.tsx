"use client";

import { useState } from "react";
import {
  DollarSign,
  Plus,
  Search,
  Edit,
  Trash2,
  MessageCircle,
  Check,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { Dog, Payment, PaymentStatus } from "@/lib/types";
import { formatDateBR } from "@/lib/utils";

interface FinancialSectionProps {
  dogs: Dog[];
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
}

export function FinancialSection({
  dogs,
  payments,
  setPayments,
}: FinancialSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({
    dogId: "",
    service: "",
    value: 0,
    dueDate: "",
    status: "Pendente" as PaymentStatus,
    paymentMethod: "",
  });

  // Calculate stats
  const totalToReceive = payments
    .filter((p) => p.status === "Pendente" || p.status === "Em atraso")
    .reduce((acc, p) => acc + p.value, 0);
  const totalPaid = payments
    .filter((p) => p.status === "Pago")
    .reduce((acc, p) => acc + p.value, 0);
  const totalPending = payments
    .filter((p) => p.status === "Pendente")
    .reduce((acc, p) => acc + p.value, 0);
  const totalOverdue = payments
    .filter((p) => p.status === "Em atraso")
    .reduce((acc, p) => acc + p.value, 0);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        dogId: payment.dogId,
        service: payment.service,
        value: payment.value,
        dueDate: payment.dueDate,
        status: payment.status,
        paymentMethod: payment.paymentMethod || "",
      });
    } else {
      setEditingPayment(null);
      setFormData({
        dogId: "",
        service: "",
        value: 0,
        dueDate: "",
        status: "Pendente",
        paymentMethod: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const dog = dogs.find((d) => d.id === formData.dogId);
    if (editingPayment) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editingPayment.id
            ? {
                ...p,
                ...formData,
                tutorName: dog?.tutorName || p.tutorName,
              }
            : p
        )
      );
    } else {
      const newPayment: Payment = {
        id: Date.now().toString(),
        dogId: formData.dogId,
        tutorName: dog?.tutorName || "",
        service: formData.service,
        value: formData.value,
        dueDate: formData.dueDate,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
      };
      setPayments((prev) => [...prev, newPayment]);
    }
    setIsDialogOpen(false);
  };

  const handleMarkAsPaid = (paymentId: string) => {
    const today = new Date().toISOString().split("T")[0];
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? { ...p, status: "Pago" as PaymentStatus, paymentDate: today }
          : p
      )
    );
  };

  const handleDelete = (paymentId: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== paymentId));
  };

  const handleWhatsAppReminder = (payment: Payment) => {
    const dog = dogs.find((d) => d.id === payment.dogId);
    const message = `Olá, ${payment.tutorName}! Tudo bem? Estamos passando para lembrar sobre a cobrança referente ao serviço do ${dog?.name || "seu pet"}, no valor de R$ ${payment.value.toLocaleString("pt-BR")}, com vencimento em ${formatDateBR(payment.dueDate)}.`;
    const phone = dog?.tutorPhone.replace(/\D/g, "") || "";
    window.open(
      `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-700";
      case "Pendente":
        return "bg-amber-100 text-amber-700";
      case "Em atraso":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
            <p className="text-sm text-muted-foreground">
              Cobranças e pagamentos
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="size-4" />
          Nova Cobrança
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                <DollarSign className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total a receber</p>
                <p className="text-xl font-bold">
                  R$ {totalToReceive.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagos</p>
                <p className="text-xl font-bold">
                  R$ {totalPaid.toLocaleString("pt-BR")}
                </p>
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
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-xl font-bold">
                  R$ {totalPending.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-red-100">
                <TrendingDown className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em atraso</p>
                <p className="text-xl font-bold">
                  R$ {totalOverdue.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por tutor ou serviço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Cão
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Tutor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Serviço/Plano
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Vencimento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Pagamento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const dog = dogs.find((d) => d.id === payment.dogId);
                  return (
                    <tr key={payment.id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {dog?.name.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {dog?.name || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{payment.tutorName}</td>
                      <td className="px-4 py-3 text-sm">{payment.service}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        R$ {payment.value.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDateBR(payment.dueDate)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={getStatusColor(payment.status)}
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDateBR(payment.paymentDate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {payment.status !== "Pago" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0"
                              onClick={() => handleMarkAsPaid(payment.id)}
                            >
                              <Check className="size-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0"
                            onClick={() => handleOpenDialog(payment)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          {payment.status !== "Pago" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0"
                              onClick={() => handleWhatsAppReminder(payment)}
                            >
                              <MessageCircle className="size-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0 text-destructive"
                            onClick={() => handleDelete(payment.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? "Editar Cobrança" : "Nova Cobrança"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Cão</label>
              <Select
                value={formData.dogId}
                onValueChange={(value) =>
                  setFormData({ ...formData, dogId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Serviço/Plano</label>
              <Input
                value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
                placeholder="Ex: Hospedagem Mensal"
              />
            </div>
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
              <label className="text-sm font-medium">Vencimento</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value: PaymentStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Em atraso">Em atraso</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Forma de pagamento</label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Cartão de Crédito">
                      Cartão de Crédito
                    </SelectItem>
                    <SelectItem value="Cartão de Débito">
                      Cartão de Débito
                    </SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="Boleto">Boleto</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingPayment ? "Salvar Alterações" : "Criar Cobrança"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
