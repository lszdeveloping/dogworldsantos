"use client";

import { useState } from "react";
import {
  Dog,
  Plus,
  Search,
  Edit,
  Eye,
  Calendar,
  DollarSign,
  MessageCircle,
  Trash2,
  X,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateBR } from "@/lib/utils";
import type { Dog as DogType, ServiceType, Presence, Payment, GroomingAppointment } from "@/lib/types";

interface DogsSectionProps {
  dogs: DogType[];
  setDogs: React.Dispatch<React.SetStateAction<DogType[]>>;
  presences: Presence[];
  payments: Payment[];
  groomingAppointments: GroomingAppointment[];
}

const emptyDog: Omit<DogType, "id"> = {
  name: "",
  breed: "",
  size: "Médio",
  birthDate: "",
  tutorName: "",
  tutorPhone: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  service: "Creche",
  plan: "",
  monthlyValue: 0,
  observations: "",
  medicalNotes: "",
  vaccinesUpToDate: true,
  vaccineExpiryDate: "",
};

export function DogsSection({ dogs, setDogs, presences, payments, groomingAppointments }: DogsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingDog, setEditingDog] = useState<DogType | null>(null);
  const [viewingDog, setViewingDog] = useState<DogType | null>(null);
  const [formData, setFormData] = useState<Omit<DogType, "id">>(emptyDog);

  const filteredDogs = dogs.filter(
    (dog) =>
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (dog?: DogType) => {
    if (dog) {
      setEditingDog(dog);
      setFormData({
        name: dog.name,
        breed: dog.breed,
        size: dog.size,
        birthDate: dog.birthDate,
        tutorName: dog.tutorName,
        tutorPhone: dog.tutorPhone,
        emergencyContactName: dog.emergencyContactName ?? "",
        emergencyContactPhone: dog.emergencyContactPhone ?? "",
        service: dog.service,
        plan: dog.plan,
        monthlyValue: dog.monthlyValue,
        observations: dog.observations,
        medicalNotes: dog.medicalNotes ?? "",
        vaccinesUpToDate: dog.vaccinesUpToDate,
        vaccineExpiryDate: dog.vaccineExpiryDate,
      });
    } else {
      setEditingDog(null);
      setFormData(emptyDog);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingDog) {
      setDogs((prev) =>
        prev.map((d) =>
          d.id === editingDog.id ? { ...d, ...formData } : d
        )
      );
    } else {
      const newDog: DogType = {
        ...formData,
        id: Date.now().toString(),
      };
      setDogs((prev) => [...prev, newDog]);
    }
    setIsDialogOpen(false);
    setFormData(emptyDog);
    setEditingDog(null);
  };

  const handleDelete = (id: string) => {
    setDogs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleWhatsApp = (dog: DogType) => {
    const message = `Olá, ${dog.tutorName}! Tudo bem? Aqui é do DogWorld. Gostaríamos de falar sobre o ${dog.name}.`;
    const phone = dog.tutorPhone.replace(/\D/g, "");
    window.open(
      `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Dog className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cães</h1>
            <p className="text-sm text-muted-foreground">
              Cadastro e gestão de clientes
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="size-4" />
          Novo Cão
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, tutor ou raça..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Dogs Table */}
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
                    Raça
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Tutor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Telefone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Serviço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Plano
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Vacinas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDogs.map((dog) => (
                  <tr key={dog.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {dog.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{dog.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {dog.breed}
                    </td>
                    <td className="px-4 py-3 text-sm">{dog.tutorName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {dog.tutorPhone}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{dog.service}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{dog.plan}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      R$ {dog.monthlyValue.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={dog.vaccinesUpToDate ? "default" : "destructive"}
                        className={
                          dog.vaccinesUpToDate
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : ""
                        }
                      >
                        {dog.vaccinesUpToDate ? "Em dia" : "Vencida"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0"
                          onClick={() => {
                            setViewingDog(dog);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0"
                          onClick={() => handleOpenDialog(dog)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0"
                          onClick={() => handleWhatsApp(dog)}
                        >
                          <MessageCircle className="size-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-destructive"
                          onClick={() => handleDelete(dog.id)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDog ? "Editar Cão" : "Novo Cão"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Nome do cão</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Thor"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Raça</label>
              <Input
                value={formData.breed}
                onChange={(e) =>
                  setFormData({ ...formData, breed: e.target.value })
                }
                placeholder="Ex: Golden Retriever"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Porte</label>
              <Select
                value={formData.size}
                onValueChange={(value: "Pequeno" | "Médio" | "Grande") =>
                  setFormData({ ...formData, size: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Pequeno">Pequeno</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Grande">Grande</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Data de nascimento</label>
              <Input
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
              />
            </div>
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
              <label className="text-sm font-medium">Telefone/WhatsApp</label>
              <Input
                value={formData.tutorPhone}
                onChange={(e) =>
                  setFormData({ ...formData, tutorPhone: e.target.value })
                }
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Contato de emergência</label>
              <Input
                value={formData.emergencyContactName ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactName: e.target.value })
                }
                placeholder="Nome do contato"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Telefone de emergência</label>
              <Input
                value={formData.emergencyContactPhone ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactPhone: e.target.value })
                }
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Serviço contratado</label>
              <Select
                value={formData.service}
                onValueChange={(value: ServiceType) =>
                  setFormData({ ...formData, service: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Creche">Creche</SelectItem>
                    <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                    <SelectItem value="Ambos">Ambos</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Plano contratado</label>
              <Select
                value={formData.plan}
                onValueChange={(value) =>
                  setFormData({ ...formData, plan: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diário">Diário</SelectItem>
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Mensal">Mensal</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Valor mensal</label>
              <Input
                type="number"
                value={formData.monthlyValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyValue: Number(e.target.value),
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Data de vencimento da vacina
              </label>
              <Input
                type="date"
                value={formData.vaccineExpiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, vaccineExpiryDate: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-medium">Observações médicas</label>
              <Textarea
                value={formData.medicalNotes ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, medicalNotes: e.target.value })
                }
                placeholder="Dieta especial, medicamentos, alergias..."
                rows={2}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-medium">Observações gerais</label>
              <Textarea
                value={formData.observations}
                onChange={(e) =>
                  setFormData({ ...formData, observations: e.target.value })
                }
                placeholder="Informações adicionais sobre o cão..."
                rows={2}
              />
            </div>
            <div className="flex flex-col gap-3 rounded-lg border p-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Vacinas em dia</p>
                <p className="text-sm text-muted-foreground">
                  O cão está com todas as vacinas atualizadas
                </p>
              </div>
              <Switch
                checked={formData.vaccinesUpToDate}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, vaccinesUpToDate: checked })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingDog ? "Salvar Alterações" : "Cadastrar Cão"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cão</DialogTitle>
          </DialogHeader>
          {viewingDog && (
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="bg-primary/10 text-xl text-primary">
                    {viewingDog.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{viewingDog.name}</h3>
                  <p className="text-muted-foreground">{viewingDog.breed} - {viewingDog.size}</p>
                </div>
              </div>

              <Tabs defaultValue="info">
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">Dados</TabsTrigger>
                  <TabsTrigger value="presence" className="flex-1">Presenças</TabsTrigger>
                  <TabsTrigger value="payments" className="flex-1">Pagamentos</TabsTrigger>
                  <TabsTrigger value="grooming" className="flex-1">Banhos</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-4">
                  <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-4">
                    <div><p className="text-xs text-muted-foreground">Tutor</p><p className="font-medium text-sm">{viewingDog.tutorName}</p></div>
                    <div><p className="text-xs text-muted-foreground">Telefone</p><p className="font-medium text-sm">{viewingDog.tutorPhone}</p></div>
                    {viewingDog.emergencyContactName && (
                      <div><p className="text-xs text-muted-foreground">Emergência</p><p className="font-medium text-sm">{viewingDog.emergencyContactName}</p></div>
                    )}
                    {viewingDog.emergencyContactPhone && (
                      <div><p className="text-xs text-muted-foreground">Tel. Emergência</p><p className="font-medium text-sm">{viewingDog.emergencyContactPhone}</p></div>
                    )}
                    <div><p className="text-xs text-muted-foreground">Serviço</p><p className="font-medium text-sm">{viewingDog.service}</p></div>
                    <div><p className="text-xs text-muted-foreground">Plano</p><p className="font-medium text-sm">{viewingDog.plan}</p></div>
                    <div><p className="text-xs text-muted-foreground">Valor Mensal</p><p className="font-medium text-sm">R$ {viewingDog.monthlyValue.toLocaleString("pt-BR")}</p></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Vacinas</p>
                      <Badge variant={viewingDog.vaccinesUpToDate ? "default" : "destructive"} className={viewingDog.vaccinesUpToDate ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                        {viewingDog.vaccinesUpToDate ? "Em dia" : "Vencida"}
                      </Badge>
                    </div>
                  </div>
                  {viewingDog.medicalNotes && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">Obs. médicas</p>
                      <p className="mt-1 text-sm">{viewingDog.medicalNotes}</p>
                    </div>
                  )}
                  {viewingDog.observations && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">Obs. gerais</p>
                      <p className="mt-1 text-sm">{viewingDog.observations}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="presence" className="mt-4">
                  <div className="flex flex-col gap-2">
                    {presences.filter((p) => p.dogId === viewingDog.id).length === 0 ? (
                      <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma presença registrada.</p>
                    ) : (
                      presences
                        .filter((p) => p.dogId === viewingDog.id)
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((p) => (
                          <div key={p.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="size-4 text-muted-foreground" />
                              <span>{formatDateBR(p.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {p.checkInTime && <span>Entrada {p.checkInTime}</span>}
                              {p.checkOutTime && <span>· Saída {p.checkOutTime}</span>}
                              <Badge variant="outline" className="text-xs">{p.status}</Badge>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                  <div className="flex flex-col gap-2">
                    {payments.filter((p) => p.dogId === viewingDog.id).length === 0 ? (
                      <p className="py-6 text-center text-sm text-muted-foreground">Nenhum pagamento registrado.</p>
                    ) : (
                      payments
                        .filter((p) => p.dogId === viewingDog.id)
                        .sort((a, b) => b.dueDate.localeCompare(a.dueDate))
                        .map((p) => (
                          <div key={p.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="size-4 text-muted-foreground" />
                              <span>{p.service}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">R$ {p.value.toLocaleString("pt-BR")}</span>
                              <Badge variant="outline" className={p.status === "Pago" ? "border-green-300 text-green-700" : p.status === "Em atraso" ? "border-red-300 text-red-700" : "border-amber-300 text-amber-700"}>
                                {p.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="grooming" className="mt-4">
                  <div className="flex flex-col gap-2">
                    {groomingAppointments.filter((g) => g.dogId === viewingDog.id).length === 0 ? (
                      <p className="py-6 text-center text-sm text-muted-foreground">Nenhum banho/tosa registrado.</p>
                    ) : (
                      groomingAppointments
                        .filter((g) => g.dogId === viewingDog.id)
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((g) => (
                          <div key={g.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="size-4 text-muted-foreground" />
                              <span>{formatDateBR(g.date)} {g.time}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground">{g.service}</span>
                              <span className="font-medium">R$ {g.value.toLocaleString("pt-BR")}</span>
                              <Badge variant="outline" className="text-xs">{g.status}</Badge>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
