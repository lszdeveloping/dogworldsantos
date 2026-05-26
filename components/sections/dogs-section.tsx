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
import type { Dog as DogType, ServiceType } from "@/lib/types";

interface DogsSectionProps {
  dogs: DogType[];
  setDogs: React.Dispatch<React.SetStateAction<DogType[]>>;
}

const emptyDog: Omit<DogType, "id"> = {
  name: "",
  breed: "",
  size: "Médio",
  birthDate: "",
  tutorName: "",
  tutorPhone: "",
  service: "Creche",
  plan: "",
  monthlyValue: 0,
  observations: "",
  vaccinesUpToDate: true,
  vaccineExpiryDate: "",
};

export function DogsSection({ dogs, setDogs }: DogsSectionProps) {
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
        service: dog.service,
        plan: dog.plan,
        monthlyValue: dog.monthlyValue,
        observations: dog.observations,
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
    const message = `Olá, ${dog.tutorName}! Tudo bem? Aqui é do Hotel do Cão. Gostaríamos de falar sobre o ${dog.name}.`;
    const phone = dog.tutorPhone.replace(/\D/g, "");
    window.open(
      `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
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
      <div className="relative w-80">
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDog ? "Editar Cão" : "Novo Cão"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4">
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
              <Input
                value={formData.plan}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
                placeholder="Ex: Mensal Premium"
              />
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
            <div className="col-span-2 flex flex-col gap-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                value={formData.observations}
                onChange={(e) =>
                  setFormData({ ...formData, observations: e.target.value })
                }
                placeholder="Informações adicionais sobre o cão..."
                rows={3}
              />
            </div>
            <div className="col-span-2 flex items-center justify-between rounded-lg border p-4">
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Cão</DialogTitle>
          </DialogHeader>
          {viewingDog && (
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="bg-primary/10 text-xl text-primary">
                    {viewingDog.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{viewingDog.name}</h3>
                  <p className="text-muted-foreground">
                    {viewingDog.breed} - {viewingDog.size}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Tutor</p>
                  <p className="font-medium">{viewingDog.tutorName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="font-medium">{viewingDog.tutorPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Serviço</p>
                  <p className="font-medium">{viewingDog.service}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plano</p>
                  <p className="font-medium">{viewingDog.plan}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor Mensal</p>
                  <p className="font-medium">
                    R$ {viewingDog.monthlyValue.toLocaleString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vacinas</p>
                  <Badge
                    variant={
                      viewingDog.vaccinesUpToDate ? "default" : "destructive"
                    }
                    className={
                      viewingDog.vaccinesUpToDate
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : ""
                    }
                  >
                    {viewingDog.vaccinesUpToDate ? "Em dia" : "Vencida"}
                  </Badge>
                </div>
              </div>
              {viewingDog.observations && (
                <div>
                  <p className="text-xs text-muted-foreground">Observações</p>
                  <p className="mt-1 text-sm">{viewingDog.observations}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
