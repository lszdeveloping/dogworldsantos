"use client";

import { useState } from "react";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogIn,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Dog, Presence, PresenceStatus } from "@/lib/types";
import { format, addDays, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PresenceSectionProps {
  dogs: Dog[];
  presences: Presence[];
  setPresences: React.Dispatch<React.SetStateAction<Presence[]>>;
}

export function PresenceSection({
  dogs,
  presences,
  setPresences,
}: PresenceSectionProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"list" | "calendar">("list");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [observationDialog, setObservationDialog] = useState<{
    open: boolean;
    presenceId: string;
  }>({ open: false, presenceId: "" });
  const [observation, setObservation] = useState("");

  const dateString = format(selectedDate, "yyyy-MM-dd");

  const todayPresences = presences
    .filter((p) => p.date === dateString)
    .map((p) => {
      const dog = dogs.find((d) => d.id === p.dogId);
      return { ...p, dog };
    });

  // Get dogs that don't have a presence record for this date
  const dogsWithoutPresence = dogs.filter(
    (dog) =>
      !presences.some((p) => p.dogId === dog.id && p.date === dateString)
  );

  const handleCheckIn = (dogId: string, presenceId?: string) => {
    const now = format(new Date(), "HH:mm");
    if (presenceId) {
      setPresences((prev) =>
        prev.map((p) =>
          p.id === presenceId
            ? { ...p, status: "Presente" as PresenceStatus, checkInTime: now }
            : p
        )
      );
    } else {
      // Create new presence record
      const newPresence: Presence = {
        id: Date.now().toString(),
        dogId,
        date: dateString,
        status: "Presente",
        checkInTime: now,
      };
      setPresences((prev) => [...prev, newPresence]);
    }
  };

  const handleCheckOut = (presenceId: string) => {
    const now = format(new Date(), "HH:mm");
    setPresences((prev) =>
      prev.map((p) =>
        p.id === presenceId
          ? { ...p, status: "Saiu" as PresenceStatus, checkOutTime: now }
          : p
      )
    );
  };

  const handleRevertCheckout = (presenceId: string) => {
    setPresences((prev) =>
      prev.map((p) =>
        p.id === presenceId
          ? { ...p, status: "Presente" as PresenceStatus, checkOutTime: undefined }
          : p
      )
    );
  };

  const handleSaveObservation = () => {
    setPresences((prev) =>
      prev.map((p) =>
        p.id === observationDialog.presenceId
          ? { ...p, observations: observation }
          : p
      )
    );
    setObservationDialog({ open: false, presenceId: "" });
    setObservation("");
  };

  const goToToday = () => setSelectedDate(new Date());
  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));

  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  const datesWithPresence = Array.from(
    new Set(presences.filter((p) => p.checkInTime).map((p) => p.date))
  ).map((d) => new Date(d + "T12:00:00"));

  const getDayCount = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return presences.filter((p) => p.date === dateStr && p.checkInTime).length;
  };

  const getStatusColor = (status: PresenceStatus) => {
    switch (status) {
      case "Presente":
        return "bg-green-100 text-green-700";
      case "Saiu":
        return "bg-gray-100 text-gray-700";
      case "Aguardando":
        return "bg-amber-100 text-amber-700";
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
            <CalendarCheck className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Presença</h1>
            <p className="text-sm text-muted-foreground">
              Check-in e Check-out diário
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            Lista
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            Calendário
          </Button>
        </div>
      </div>

      {view === "calendar" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Agenda mensal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4 p-4 sm:flex-row">
            <Calendar
              mode="single"
              selected={selectedDate}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              locale={ptBR}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setView("list");
                }
              }}
              modifiers={{ hasPresence: datesWithPresence }}
              modifiersClassNames={{ hasPresence: "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-primary after:content-[''] relative" }}
              className="rounded-md border"
            />
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm font-medium text-muted-foreground">
                {format(calendarMonth, "MMMM yyyy", { locale: ptBR })}
              </p>
              <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto">
                {Array.from(
                  new Set(
                    presences
                      .filter((p) => p.checkInTime && p.date.startsWith(format(calendarMonth, "yyyy-MM")))
                      .map((p) => p.date)
                  )
                )
                  .sort((a, b) => a.localeCompare(b))
                  .map((date) => {
                    const count = presences.filter((p) => p.date === date && p.checkInTime).length;
                    return (
                      <button
                        key={date}
                        onClick={() => { setSelectedDate(new Date(date + "T12:00:00")); setView("list"); }}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted text-left"
                      >
                        <span>{format(new Date(date + "T12:00:00"), "dd/MM/yyyy - EEEE", { locale: ptBR })}</span>
                        <Badge variant="outline">{count} cão{count !== 1 ? "es" : ""}</Badge>
                      </button>
                    );
                  })}
                {presences.filter((p) => p.checkInTime && p.date.startsWith(format(calendarMonth, "yyyy-MM"))).length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">Nenhuma presença neste mês.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {view === "list" && (
      <>
      {/* Date Navigation */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousDay}>
              <ChevronLeft className="size-4" />
            </Button>
            <div className="min-w-0 text-center sm:min-w-48">
              <p className="text-lg font-semibold">
                {format(selectedDate, "EEEE", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={goToNextDay}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <Button variant={isToday ? "default" : "outline"} onClick={goToToday}>
            Hoje
          </Button>
        </CardContent>
      </Card>

      {/* Presence List */}
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
                    Serviço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Check-in
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Check-out
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
                {todayPresences.map((presence) => (
                  <tr key={presence.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {presence.dog?.name.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {presence.dog?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {presence.dog?.tutorName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{presence.dog?.service}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {presence.checkInTime ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="size-3 text-muted-foreground" />
                          {presence.checkInTime}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {presence.checkOutTime ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="size-3 text-muted-foreground" />
                          {presence.checkOutTime}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={getStatusColor(presence.status)}
                      >
                        {presence.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {presence.status === "Aguardando" && (
                          <Button
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                              handleCheckIn(presence.dogId, presence.id)
                            }
                          >
                            <LogIn className="size-3" />
                            Check-in
                          </Button>
                        )}
                        {presence.status === "Presente" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => handleCheckOut(presence.id)}
                          >
                            <LogOut className="size-3" />
                            Check-out
                          </Button>
                        )}
                        {presence.status === "Saiu" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                            onClick={() => handleRevertCheckout(presence.id)}
                          >
                            <LogIn className="size-3" />
                            Reverter
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setObservation(presence.observations || "");
                            setObservationDialog({
                              open: true,
                              presenceId: presence.id,
                            });
                          }}
                        >
                          Obs.
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Dogs without presence record */}
                {dogsWithoutPresence.map((dog) => (
                  <tr key={dog.id} className="border-b bg-muted/30 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            {dog.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-muted-foreground">
                          {dog.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {dog.tutorName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="opacity-50">
                        {dog.service}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">-</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">-</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-500"
                      >
                        Não registrado
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => handleCheckIn(dog.id)}
                      >
                        <LogIn className="size-3" />
                        Check-in
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                <LogIn className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {todayPresences.filter((p) => p.status === "Presente").length}
                </p>
                <p className="text-sm text-muted-foreground">Presentes agora</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {todayPresences.filter((p) => p.status === "Aguardando").length}
                </p>
                <p className="text-sm text-muted-foreground">Aguardando</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100">
                <LogOut className="size-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {todayPresences.filter((p) => p.status === "Saiu").length}
                </p>
                <p className="text-sm text-muted-foreground">Já saíram</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      </>
      )}

      {/* Observation Dialog */}
      <Dialog
        open={observationDialog.open}
        onOpenChange={(open) =>
          setObservationDialog({ ...observationDialog, open })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Observação do dia</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Adicione observações sobre o dia do pet..."
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  setObservationDialog({ open: false, presenceId: "" })
                }
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveObservation}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
