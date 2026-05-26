export interface CollectionConfig {
  table: string;
  columns: Record<string, string>;
  optionalFields?: string[];
  orderBy?: string;
  ascending?: boolean;
  legacyLocalStorageKey?: string;
}

export const collectionConfigs = {
  dogs: {
    table: "dogs",
    columns: {
      id: "id",
      name: "name",
      breed: "breed",
      size: "size",
      birthDate: "birth_date",
      tutorName: "tutor_name",
      tutorPhone: "tutor_phone",
      service: "service",
      plan: "plan",
      monthlyValue: "monthly_value",
      observations: "observations",
      vaccinesUpToDate: "vaccines_up_to_date",
      vaccineExpiryDate: "vaccine_expiry_date",
      photoUrl: "photo_url",
    },
    optionalFields: ["photoUrl"],
    orderBy: "name",
    ascending: true,
    legacyLocalStorageKey: "dogworld_dogs",
  },
  presences: {
    table: "presences",
    columns: {
      id: "id",
      dogId: "dog_id",
      date: "date",
      status: "status",
      checkInTime: "check_in_time",
      checkOutTime: "check_out_time",
      observations: "observations",
    },
    optionalFields: ["checkInTime", "checkOutTime", "observations"],
    orderBy: "date",
    ascending: false,
    legacyLocalStorageKey: "dogworld_presences",
  },
  payments: {
    table: "payments",
    columns: {
      id: "id",
      dogId: "dog_id",
      tutorName: "tutor_name",
      service: "service",
      value: "value",
      dueDate: "due_date",
      status: "status",
      paymentMethod: "payment_method",
      paymentDate: "payment_date",
    },
    optionalFields: ["paymentMethod", "paymentDate"],
    orderBy: "due_date",
    ascending: false,
    legacyLocalStorageKey: "dogworld_payments",
  },
  groomingAppointments: {
    table: "grooming_appointments",
    columns: {
      id: "id",
      dogId: "dog_id",
      clientName: "client_name",
      tutorName: "tutor_name",
      tutorPhone: "tutor_phone",
      service: "service",
      date: "date",
      time: "time",
      value: "value",
      observations: "observations",
      status: "status",
      isRegisteredDog: "is_registered_dog",
    },
    optionalFields: ["dogId", "observations"],
    orderBy: "date",
    ascending: true,
    legacyLocalStorageKey: "dogworld_grooming",
  },
  servicePrices: {
    table: "service_prices",
    columns: {
      id: "id",
      name: "name",
      description: "description",
      category: "category",
      value: "value",
      unit: "unit",
      isActive: "is_active",
    },
    orderBy: "category",
    ascending: true,
    legacyLocalStorageKey: "dogworld_services",
  },
  alerts: {
    table: "alerts",
    columns: {
      id: "id",
      type: "type",
      dogId: "dog_id",
      dogName: "dog_name",
      tutorName: "tutor_name",
      description: "description",
      date: "date",
      priority: "priority",
      resolved: "resolved",
    },
    optionalFields: ["dogId", "dogName", "tutorName"],
    orderBy: "date",
    ascending: false,
    legacyLocalStorageKey: "dogworld_alerts",
  },
} satisfies Record<string, CollectionConfig>;

export type CollectionName = keyof typeof collectionConfigs;

export function toSupabaseRow<T extends { id: string }>(
  config: CollectionConfig,
  item: T
) {
  const source = item as Record<string, unknown>;

  return Object.entries(config.columns).reduce<Record<string, unknown>>(
    (row, [field, column]) => {
      row[column] = source[field] ?? null;
      return row;
    },
    {}
  );
}

export function fromSupabaseRow<T>(config: CollectionConfig, row: Record<string, unknown>) {
  const optionalFields = new Set(config.optionalFields ?? []);

  return Object.entries(config.columns).reduce<Record<string, unknown>>(
    (item, [field, column]) => {
      const value = row[column];

      if ((value === null || value === undefined) && optionalFields.has(field)) {
        return item;
      }

      item[field] = value;
      return item;
    },
    {}
  ) as T;
}

export function getCollectionChanges<T extends { id: string }>(
  config: CollectionConfig,
  previousItems: T[],
  nextItems: T[]
) {
  const previousById = new Map(previousItems.map((item) => [item.id, item]));
  const nextById = new Map(nextItems.map((item) => [item.id, item]));
  const removedIds = previousItems
    .filter((item) => !nextById.has(item.id))
    .map((item) => item.id);
  const changedRows = nextItems
    .filter((item) => {
      const previous = previousById.get(item.id);
      return !previous || rowSignature(config, previous) !== rowSignature(config, item);
    })
    .map((item) => toSupabaseRow(config, item));

  return { changedRows, removedIds };
}

function rowSignature<T extends { id: string }>(config: CollectionConfig, item: T) {
  return JSON.stringify(toSupabaseRow(config, item));
}
