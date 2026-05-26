import { describe, expect, it } from "vitest";
import {
  getHostedDogRows,
  getPresenceEventRows,
} from "../lib/dashboard-data";
import type { Dog, Presence } from "../lib/types";

const dogs: Dog[] = [
  {
    id: "dog-1",
    name: "Thor",
    breed: "Golden",
    size: "Grande",
    birthDate: "2021-01-01",
    tutorName: "Ana Santos",
    tutorPhone: "13999990000",
    service: "Hospedagem",
    plan: "Hotel",
    monthlyValue: 1200,
    observations: "",
    vaccinesUpToDate: true,
    vaccineExpiryDate: "2026-12-01",
  },
  {
    id: "dog-2",
    name: "Luna",
    breed: "Spitz",
    size: "Pequeno",
    birthDate: "2022-02-02",
    tutorName: "Bruno Lima",
    tutorPhone: "13999991111",
    service: "Creche",
    plan: "Dia",
    monthlyValue: 300,
    observations: "",
    vaccinesUpToDate: true,
    vaccineExpiryDate: "2026-12-01",
  },
  {
    id: "dog-3",
    name: "Mel",
    breed: "SRD",
    size: "Médio",
    birthDate: "2023-03-03",
    tutorName: "Carla Souza",
    tutorPhone: "13999992222",
    service: "Ambos",
    plan: "Completo",
    monthlyValue: 1500,
    observations: "",
    vaccinesUpToDate: true,
    vaccineExpiryDate: "2026-12-01",
  },
];

const presences: Presence[] = [
  {
    id: "presence-1",
    dogId: "dog-1",
    date: "2026-05-25",
    status: "Saiu",
    checkInTime: "08:10",
    checkOutTime: "17:30",
  },
  {
    id: "presence-2",
    dogId: "dog-3",
    date: "2026-05-25",
    status: "Presente",
    checkInTime: "09:00",
  },
  {
    id: "presence-3",
    dogId: "dog-3",
    date: "2026-05-24",
    status: "Saiu",
    checkInTime: "08:00",
    checkOutTime: "16:00",
  },
];

describe("dashboard data helpers", () => {
  it("returns hosted dog rows with today's presence status", () => {
    expect(getHostedDogRows(dogs, presences, "2026-05-25")).toEqual([
      {
        id: "dog-3",
        name: "Mel",
        tutorFirstName: "Carla",
        breed: "SRD",
        status: "Presente",
      },
      {
        id: "dog-1",
        name: "Thor",
        tutorFirstName: "Ana",
        breed: "Golden",
        status: "Saiu",
      },
    ]);
  });

  it("returns separate check-in and check-out events ordered by latest time", () => {
    expect(getPresenceEventRows(dogs, presences, "2026-05-25")).toEqual([
      {
        id: "presence-1-out",
        dogName: "Thor",
        event: "Saída",
        time: "17:30",
        status: "Saiu",
      },
      {
        id: "presence-2-in",
        dogName: "Mel",
        event: "Entrada",
        time: "09:00",
        status: "Presente",
      },
      {
        id: "presence-1-in",
        dogName: "Thor",
        event: "Entrada",
        time: "08:10",
        status: "Saiu",
      },
    ]);
  });
});
