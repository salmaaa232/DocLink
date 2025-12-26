"use client";

import { requestPayout } from "@/actions/payout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  Coins,
  CreditCard,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DoctorEarnings({ earnings, payouts = [] }) {
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");

  const {
    thisMonthEarnings = 0,
    completedAppointments = 0,
    averageEarningsPerMonth = 0,
    availableCredits = 0,
    availablePayout = 0,
  } = earnings;

  const { loading, data, fn: submitPayoutRequest } = useFetch(requestPayout);

  const pendingPayout = payouts.find(
    (payout) => payout.status === "PROCESSING"
  );

  const handlePayoutRequest = async (e) => {
    e.preventDefault();

    if (!paypalEmail) {
      toast.error("PayPal email is required");
      return;
    }

    const formData = new FormData();
    formData.append("paypalEmail", paypalEmail);

    await submitPayoutRequest(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowPayoutDialog(false);
      setPaypalEmail("");
      toast.success("Payout request submitted successfully!");
    }
  }, [data]);

  const platformFee = availableCredits * 2;

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label: "Available Credits",
            value: availableCredits,
            sub: `$${availablePayout.toFixed(2)} available for payout`,
            icon: Coins,
          },
          {
            label: "This Month",
            value: `$${thisMonthEarnings.toFixed(2)}`,
            icon: TrendingUp,
          },
          {
            label: "Total Appointments",
            value: completedAppointments,
            sub: "completed",
            icon: Calendar,
          },
          {
            label: "Avg / Month",
            value: `$${averageEarningsPerMonth.toFixed(2)}`,
            icon: BarChart3,
          },
        ].map((item, i) => (
          <Card key={i} className="border border-border bg-background">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-bold text-foreground">
                  {item.value}
                </p>
                {item.sub && (
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                )}
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <item.icon className="h-6 w-6 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payout Management */}
      <Card className="border border-border bg-background">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
            Payout Management
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-foreground">
                Available for Payout
              </h3>
              {pendingPayout ? (
                <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
                  PROCESSING
                </Badge>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Available
                </Badge>
              )}
            </div>

            {pendingPayout ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Pending Credits</p>
                    <p className="font-medium text-foreground">
                      {pendingPayout.credits}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pending Amount</p>
                    <p className="font-medium text-foreground">
                      ${pendingPayout.netAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PayPal Email</p>
                    <p className="font-medium text-foreground text-xs">
                      {pendingPayout.paypalEmail}
                    </p>
                  </div>
                </div>

                <Alert className="mt-4 bg-background border border-border">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Your payout request is being processed. Payment will be sent
                    once approved by an admin.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Available Credits</p>
                    <p className="font-medium text-foreground">
                      {availableCredits}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payout Amount</p>
                    <p className="font-medium text-foreground">
                      ${availablePayout.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Platform Fee</p>
                    <p className="font-medium text-foreground">
                      ${platformFee.toFixed(2)}
                    </p>
                  </div>
                </div>

                {availableCredits > 0 && (
                  <Button
                    onClick={() => setShowPayoutDialog(true)}
                    className="w-full mt-4 bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Request Payout for All Credits
                  </Button>
                )}
              </>
            )}
          </div>

          <Alert className="bg-background border border-border">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              You earn $8 per credit. Platform fee is $2 per credit. Payouts are
              processed via PayPal.
            </AlertDescription>
          </Alert>

          {payouts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">
                Payout History
              </h3>
              {payouts.slice(0, 5).map((payout) => (
                <div
                  key={payout.id}
                  className="flex justify-between p-3 rounded-md bg-muted border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {format(new Date(payout.createdAt), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {payout.credits} credits • $
                      {payout.netAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payout.paypalEmail}
                    </p>
                  </div>
                  <Badge
                    className={
                      payout.status === "PROCESSED"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                    }
                  >
                    {payout.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent className="bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Request Payout
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Request payout for all your available credits
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePayoutRequest} className="space-y-4">
            <div className="bg-muted p-4 rounded-lg border border-border space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available credits</span>
                <span className="text-foreground">{availableCredits}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-foreground">Net payout</span>
                <span className="text-emerald-600">
                  ${availablePayout.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypalEmail">PayPal Email</Label>
              <Input
                id="paypalEmail"
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPayoutDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  "Request Payout"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
