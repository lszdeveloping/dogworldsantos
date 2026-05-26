import type { Dog, Presence, PresenceStatus } from "./types";

export interface HostedDogRow {
  id: string;
  name: string;
  tutorFirstName: string;
  breed: string;
  status: PresenceStatus | "Sem check-in";
}

export interface PresenceEventRow {
  id: string;
  dogName: string;
  event: "Entrada" | "Saída";
  time: string;
  status: PresenceStatus;
}

export function getHostedDogRows(
  dogs: Dog[],
  presences: Presence[],
  date: string,
  limit = 5
): HostedDogRow[] {
  return dogs
    .filter((dog) => dog.service === "Hospedagem" || dog.service === "Ambos")
    .map((dog) => {
      const todayPresence = presences.find(
        (presence) => presence.dogId === dog.id && presence.date === date
      );
      const status: HostedDogRow["status"] = todayPresence?.status ?? "Sem check-in";

      return {
        id: dog.id,
        name: dog.name,
        tutorFirstName: dog.tutorName.split(" ")[0] || dog.tutorName,
        breed: dog.breed,
        status,
      };
    })
    .sort((a, b) => {
      const statusPriority = getHostedStatusPriority(a.status) - getHostedStatusPriority(b.status);
      return statusPriority || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function getPresenceEventRows(
  dogs: Dog[],
  presences: Presence[],
  date: string,
  limit = 5
): PresenceEventRow[] {
  const dogNames = new Map(dogs.map((dog) => [dog.id, dog.name]));

  return presences
    .filter((presence) => presence.date === date)
    .flatMap((presence) => {
      const dogName = dogNames.get(presence.dogId) ?? "Cão removido";
      const rows: PresenceEventRow[] = [];

      if (presence.checkInTime) {
        rows.push({
          id: `${presence.id}-in`,
          dogName,
          event: "Entrada",
          time: presence.checkInTime,
          status: presence.status,
        });
      }

      if (presence.checkOutTime) {
        rows.push({
          id: `${presence.id}-out`,
          dogName,
          event: "Saída",
          time: presence.checkOutTime,
          status: presence.status,
        });
      }

      return rows;
    })
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, limit);
}

function getHostedStatusPriority(status: HostedDogRow["status"]) {
  switch (status) {
    case "Presente":
      return 0;
    case "Aguardando":
      return 1;
    case "Saiu":
      return 2;
    case "Sem check-in":
      return 3;
    default:
      return 4;
  }
}
