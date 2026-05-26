import { describe, expect, it } from "vitest";
import {
  collectionConfigs,
  fromSupabaseRow,
  getCollectionChanges,
  toSupabaseRow,
} from "../lib/supabase-data";
import type { Dog, Payment } from "../lib/types";

describe("Supabase data mapping", () => {
  it("maps a dog between app fields and database columns", () => {
    const dog: Dog = {
      id: "dog-1",
      name: "Thor",
      breed: "Golden",
      size: "Grande",
      birthDate: "2022-01-02",
      tutorName: "Ana Santos",
      tutorPhone: "(13) 99999-1111",
      service: "Creche",
      plan: "Mensal",
      monthlyValue: 1200,
      observations: "Calmo",
      vaccinesUpToDate: true,
      vaccineExpiryDate: "2026-12-01",
    };

    const row = toSupabaseRow(collectionConfigs.dogs, dog);

    expect(row).toEqual({
      id: "dog-1",
      name: "Thor",
      breed: "Golden",
      size: "Grande",
      birth_date: "2022-01-02",
      tutor_name: "Ana Santos",
      tutor_phone: "(13) 99999-1111",
      service: "Creche",
      plan: "Mensal",
      monthly_value: 1200,
      observations: "Calmo",
      vaccines_up_to_date: true,
      vaccine_expiry_date: "2026-12-01",
      photo_url: null,
    });

    expect(fromSupabaseRow<Dog>(collectionConfigs.dogs, row)).toEqual(dog);
  });

  it("keeps optional payment fields undefined when database values are null", () => {
    const payment: Payment = {
      id: "payment-1",
      dogId: "dog-1",
      tutorName: "Ana Santos",
      service: "Creche Mensal",
      value: 1200,
      dueDate: "2026-06-05",
      status: "Pendente",
    };

    const row = toSupabaseRow(collectionConfigs.payments, payment);

    expect(row.payment_method).toBeNull();
    expect(row.payment_date).toBeNull();
    expect(fromSupabaseRow<Payment>(collectionConfigs.payments, row)).toEqual(payment);
  });

  it("detects changed rows and deleted ids", () => {
    const previous: Payment[] = [
      {
        id: "payment-1",
        dogId: "dog-1",
        tutorName: "Ana Santos",
        service: "Creche Mensal",
        value: 1200,
        dueDate: "2026-06-05",
        status: "Pendente",
      },
      {
        id: "payment-2",
        dogId: "dog-2",
        tutorName: "Bruno Lima",
        service: "Banho",
        value: 90,
        dueDate: "2026-06-06",
        status: "Pendente",
      },
    ];
    const next: Payment[] = [
      {
        ...previous[0],
        status: "Pago",
        paymentMethod: "PIX",
        paymentDate: "2026-06-05",
      },
    ];

    const changes = getCollectionChanges(collectionConfigs.payments, previous, next);

    expect(changes.removedIds).toEqual(["payment-2"]);
    expect(changes.changedRows).toEqual([
      {
        id: "payment-1",
        dog_id: "dog-1",
        tutor_name: "Ana Santos",
        service: "Creche Mensal",
        value: 1200,
        due_date: "2026-06-05",
        status: "Pago",
        payment_method: "PIX",
        payment_date: "2026-06-05",
      },
    ]);
  });
});
