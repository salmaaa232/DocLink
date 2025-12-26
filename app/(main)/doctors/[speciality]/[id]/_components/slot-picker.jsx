"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ChevronRight, Clock } from "lucide-react";
import { useState } from "react";

export function SlotPicker({ days, onSelectSlot }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const firstDayWithSlots =
    days.find((day) => day.slots.length > 0)?.date || days[0]?.date;
  const [activeTab, setActiveTab] = useState(firstDayWithSlots);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start gap-2 overflow-x-auto bg-muted/40 p-1">
          {days.map((day) => {
            const disabled = day.slots.length === 0;

            return (
              <TabsTrigger
                key={day.date}
                value={day.date}
                disabled={disabled}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <span className="text-muted-foreground">
                  {format(new Date(day.date), "MMM d")}
                </span>
                <span className="text-muted-foreground">
                  {format(new Date(day.date), "EEE")}
                </span>

                {!disabled && (
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {day.slots.length}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {days.map((day) => (
          <TabsContent key={day.date} value={day.date} className="pt-4">
            {day.slots.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No available slots for this day.
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  {day.displayDate}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {day.slots.map((slot) => {
                    const isSelected =
                      selectedSlot?.startTime === slot.startTime;

                    return (
                      <Card
                        key={slot.startTime}
                        onClick={() => setSelectedSlot(slot)}
                        className={`cursor-pointer border transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:border-primary/40"
                        }`}
                      >
                        <CardContent className="flex items-center gap-2 p-3">
                          <Clock
                            className={`h-4 w-4 ${
                              isSelected
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              isSelected
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {format(new Date(slot.startTime), "h:mm a")}
                          </span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end pt-2">
        <Button
          onClick={() => selectedSlot && onSelectSlot(selectedSlot)}
          disabled={!selectedSlot}
          className="gap-2"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
