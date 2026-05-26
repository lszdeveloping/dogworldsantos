export type ServiceType = "Creche" | "Hospedagem" | "Ambos";
export type GroomingService = "Banho" | "Tosa" | "Banho + Tosa" | "Tosa Higiênica";
export type PaymentStatus = "Pago" | "Pendente" | "Em atraso";
export type PresenceStatus = "Aguardando" | "Presente" | "Saiu";
export type GroomingStatus = "Agendado" | "Em andamento" | "Realizado" | "Cancelado";
export type AlertPriority = "baixa" | "média" | "alta";
export type AlertType = "vacina_vencida" | "vacina_proxima" | "cobranca_atrasada" | "pagamento_pendente" | "checkout_pendente" | "agendamento_hoje";
export type ServiceUnit = "diária" | "mensalidade" | "pacote" | "avulso" | "sessão";

export interface Dog {
  id: string;
  name: string;
  breed: string;
  size: "Pequeno" | "Médio" | "Grande";
  birthDate: string;
  tutorName: string;
  tutorPhone: string;
  service: ServiceType;
  plan: string;
  monthlyValue: number;
  observations: string;
  vaccinesUpToDate: boolean;
  vaccineExpiryDate: string;
  photoUrl?: string;
}

export interface Presence {
  id: string;
  dogId: string;
  date: string;
  status: PresenceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  observations?: string;
}

export interface Payment {
  id: string;
  dogId: string;
  tutorName: string;
  service: string;
  value: number;
  dueDate: string;
  status: PaymentStatus;
  paymentMethod?: string;
  paymentDate?: string;
}

export interface GroomingAppointment {
  id: string;
  dogId?: string;
  clientName: string;
  tutorName: string;
  tutorPhone: string;
  service: GroomingService;
  date: string;
  time: string;
  value: number;
  observations?: string;
  status: GroomingStatus;
  isRegisteredDog: boolean;
}

export interface ServicePrice {
  id: string;
  name: string;
  description: string;
  category: string;
  value: number;
  unit: ServiceUnit;
  isActive: boolean;
}

export interface Alert {
  id: string;
  type: AlertType;
  dogId?: string;
  dogName?: string;
  tutorName?: string;
  description: string;
  date: string;
  priority: AlertPriority;
  resolved: boolean;
}
