"use client";

import { useState } from "react";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Home,
  Scissors,
  Dog,
  Car,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { ServicePrice, ServiceUnit } from "@/lib/types";

interface ServicesSectionProps {
  servicePrices: ServicePrice[];
  setServicePrices: React.Dispatch<React.SetStateAction<ServicePrice[]>>;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Hospedagem":
      return <Home className="size-6" />;
    case "Banho":
    case "Tosa":
      return <Scissors className="size-6" />;
    case "Creche":
    case "Adestramento":
      return <Dog className="size-6" />;
    case "Transporte":
      return <Car className="size-6" />;
    default:
      return <Package className="size-6" />;
  }
};

export function ServicesSection({
  servicePrices,
  setServicePrices,
}: ServicesSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePrice | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    value: 0,
    unit: "avulso" as ServiceUnit,
    isActive: true,
  });

  // Group by category
  const categories = Array.from(
    new Set(servicePrices.map((s) => s.category))
  );

  const handleOpenDialog = (service?: ServicePrice) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        category: service.category,
        value: service.value,
        unit: service.unit,
        isActive: service.isActive,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        value: 0,
        unit: "avulso",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingService) {
      setServicePrices((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? { ...s, ...formData } : s
        )
      );
    } else {
      const newService: ServicePrice = {
        id: Date.now().toString(),
        ...formData,
      };
      setServicePrices((prev) => [...prev, newService]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (serviceId: string) => {
    setServicePrices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const handleToggleActive = (serviceId: string) => {
    setServicePrices((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const getUnitLabel = (unit: ServiceUnit) => {
    switch (unit) {
      case "diária":
        return "por dia";
      case "mensalidade":
        return "por mês";
      case "pacote":
        return "pacote";
      case "avulso":
        return "avulso";
      case "sessão":
        return "por sessão";
      default:
        return unit;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Serviços & Preços
            </h1>
            <p className="text-sm text-muted-foreground">
              Tabela de valores de referência
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="size-4" />
          Novo Serviço
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {servicePrices.map((service) => (
          <Card
            key={service.id}
            className={service.isActive ? "" : "opacity-50"}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {getCategoryIcon(service.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => handleOpenDialog(service)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 text-destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    R$ {service.value.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getUnitLabel(service.unit)}
                  </p>
                </div>
                <Badge
                  variant={service.isActive ? "default" : "secondary"}
                  className={
                    service.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : ""
                  }
                >
                  {service.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Lista completa de serviços
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Serviço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Unidade
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
                {servicePrices.map((service) => (
                  <tr key={service.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{service.name}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-sm text-muted-foreground">
                      {service.description}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{service.category}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      R$ {service.value.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getUnitLabel(service.unit)}
                    </td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={service.isActive}
                        onCheckedChange={() => handleToggleActive(service.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0"
                          onClick={() => handleOpenDialog(service)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-destructive"
                          onClick={() => handleDelete(service.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Nome do serviço</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Banho Completo"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição do serviço..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                      <SelectItem value="Creche">Creche</SelectItem>
                      <SelectItem value="Banho">Banho</SelectItem>
                      <SelectItem value="Tosa">Tosa</SelectItem>
                      <SelectItem value="Adestramento">Adestramento</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                      <SelectItem value="Extras">Extras</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Unidade</label>
                <Select
                  value={formData.unit}
                  onValueChange={(value: ServiceUnit) =>
                    setFormData({ ...formData, unit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="diária">Diária</SelectItem>
                      <SelectItem value="mensalidade">Mensalidade</SelectItem>
                      <SelectItem value="pacote">Pacote</SelectItem>
                      <SelectItem value="avulso">Avulso</SelectItem>
                      <SelectItem value="sessão">Sessão</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Valor (R$)</label>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: Number(e.target.value) })
                }
                placeholder="0"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Serviço ativo</p>
                <p className="text-sm text-muted-foreground">
                  Disponível para agendamento
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingService ? "Salvar Alterações" : "Criar Serviço"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
