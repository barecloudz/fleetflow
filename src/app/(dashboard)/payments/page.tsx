"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  MoreHorizontal,
  Plus,
  CreditCard,
} from "lucide-react";

type InvoiceStatus = "Paid" | "Pending" | "Overdue";

interface Invoice {
  id: string;
  customer: string;
  workOrder: string;
  services: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
}

const invoices: Invoice[] = [
  { id: "INV-2048", customer: "Marcus Reid", workOrder: "WO-1042", services: "Oil Change, Tire Rotation", amount: 189, dueDate: "Jul 10, 2026", status: "Pending" },
  { id: "INV-2047", customer: "Sarah Chen", workOrder: "WO-1041", services: "Brake Inspection, Pad Replacement", amount: 520, dueDate: "Jul 5, 2026", status: "Overdue" },
  { id: "INV-2046", customer: "David Torres", workOrder: "WO-1040", services: "Full Engine Diagnostic", amount: 340, dueDate: "Jul 8, 2026", status: "Paid" },
  { id: "INV-2045", customer: "Priya Nair", workOrder: "WO-1039", services: "AC Service, Recharge", amount: 275, dueDate: "Jul 2, 2026", status: "Paid" },
  { id: "INV-2044", customer: "Tom Walsh", workOrder: "WO-1038", services: "Transmission Service", amount: 890, dueDate: "Jun 30, 2026", status: "Overdue" },
  { id: "INV-2043", customer: "Lisa Park", workOrder: "WO-1037", services: "Coolant Flush, Thermostat", amount: 310, dueDate: "Jul 12, 2026", status: "Pending" },
  { id: "INV-2042", customer: "James Ortega", workOrder: "WO-1036", services: "Wheel Alignment, Balance", amount: 145, dueDate: "Jul 3, 2026", status: "Paid" },
  { id: "INV-2041", customer: "Nina Brooks", workOrder: "WO-1035", services: "Battery Replacement", amount: 215, dueDate: "Jul 6, 2026", status: "Paid" },
  { id: "INV-2040", customer: "Kevin Shaw", workOrder: "WO-1034", services: "Full Detail, Wax", amount: 180, dueDate: "Jul 15, 2026", status: "Pending" },
  { id: "INV-2039", customer: "Rachel Green", workOrder: "WO-1033", services: "Suspension Inspection", amount: 420, dueDate: "Jun 28, 2026", status: "Overdue" },
  { id: "INV-2038", customer: "Chris Martin", workOrder: "WO-1032", services: "Timing Belt, Water Pump", amount: 1240, dueDate: "Jul 1, 2026", status: "Paid" },
  { id: "INV-2037", customer: "Amy Johnson", workOrder: "WO-1031", services: "Spark Plugs, Air Filter", amount: 195, dueDate: "Jul 9, 2026", status: "Pending" },
];

const statusStyle: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Pending: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Overdue: "bg-red-500/15 text-red-400 border-red-500/20",
};

const stats = [
  { label: "Total Collected MTD", value: "$38,420", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Outstanding", value: "$12,840", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Overdue", value: "$3,200", icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
  { label: "Avg Invoice", value: "$486", icon: Clock, color: "text-violet-400", bg: "bg-violet-500/10" },
];

function InvoiceTable({ data }: { data: Invoice[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/6">
            <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Invoice</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Customer</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wide hidden md:table-cell">Work Order</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wide hidden lg:table-cell">Services</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Amount</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wide hidden md:table-cell">Due Date</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((inv) => (
            <tr key={inv.id} className="hover:bg-white/3 transition-colors group">
              <td className="px-4 py-3.5">
                <span className="font-mono text-xs text-primary/80">{inv.id}</span>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm font-medium text-white">{inv.customer}</span>
              </td>
              <td className="px-4 py-3.5 hidden md:table-cell">
                <span className="font-mono text-xs text-white/50">{inv.workOrder}</span>
              </td>
              <td className="px-4 py-3.5 hidden lg:table-cell">
                <span className="text-xs text-white/50 truncate max-w-[200px] block">{inv.services}</span>
              </td>
              <td className="px-4 py-3.5 text-right">
                <span className="text-sm font-semibold text-white">${inv.amount.toLocaleString()}</span>
              </td>
              <td className="px-4 py-3.5 hidden md:table-cell">
                <span className="text-xs text-white/50">{inv.dueDate}</span>
              </td>
              <td className="px-4 py-3.5">
                <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyle[inv.status]}`}>
                  {inv.status}
                </Badge>
              </td>
              <td className="px-4 py-3.5">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 text-white/30 hover:text-white hover:bg-white/8 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="size-4" /></Button>} />
                  <DropdownMenuContent align="end" className="glass-card border-white/10 text-white/80 text-sm">
                    <DropdownMenuItem className="hover:bg-white/8 cursor-pointer">View Invoice</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/8 cursor-pointer">Send Reminder</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/8 cursor-pointer text-emerald-400">Mark Paid</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/8 cursor-pointer">Download PDF</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-16 text-center text-white/30 text-sm">No invoices found.</div>
      )}
    </div>
  );
}

export default function PaymentsPage() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const paid = invoices.filter((i) => i.status === "Paid");
  const pending = invoices.filter((i) => i.status === "Pending");
  const overdue = invoices.filter((i) => i.status === "Overdue");

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Payments"
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />Record Payment</Button>} />
            <SheetContent className="glass-card border-white/10 text-white w-full sm:max-w-md">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-white flex items-center gap-2">
                  <CreditCard className="size-4 text-primary" />
                  Record Payment
                </SheetTitle>
                <SheetDescription className="text-white/40 text-sm">
                  Log a new payment against a work order.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Customer</Label>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select customer…" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10 text-white">
                      {["Marcus Reid", "Sarah Chen", "David Torres", "Priya Nair", "Tom Walsh"].map((c) => (
                        <SelectItem key={c} value={c} className="hover:bg-white/8">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Work Order</Label>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select work order…" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10 text-white">
                      {["WO-1042", "WO-1041", "WO-1040", "WO-1039", "WO-1038"].map((wo) => (
                        <SelectItem key={wo} value={wo} className="hover:bg-white/8">{wo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Amount ($)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Payment Method</Label>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select method…" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10 text-white">
                      {["Cash", "Card", "Check", "Financing"].map((m) => (
                        <SelectItem key={m} value={m.toLowerCase()} className="hover:bg-white/8">{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Date</Label>
                  <Input
                    type="date"
                    className="bg-white/5 border-white/10 text-white"
                    defaultValue="2026-07-08"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Notes</Label>
                  <Input
                    placeholder="Optional notes…"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              <SheetFooter className="pt-4 flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 border border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                  onClick={() => setSheetOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gradient-blue glow-blue-sm text-white"
                  onClick={() => setSheetOpen(false)}
                >
                  Record Payment
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="glass-card border-white/8">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-white/50 font-medium">{s.label}</p>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                  </div>
                  <div className={`${s.bg} p-2.5 rounded-xl`}>
                    <s.icon className={`size-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invoice Table */}
        <Card className="glass-card border-white/8">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold text-white">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <Tabs defaultValue="all">
              <div className="px-5 pb-0">
                <TabsList className="bg-white/5 border border-white/8 h-8">
                  <TabsTrigger value="all" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    All ({invoices.length})
                  </TabsTrigger>
                  <TabsTrigger value="paid" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                    Paid ({paid.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                    Pending ({pending.length})
                  </TabsTrigger>
                  <TabsTrigger value="overdue" className="text-xs data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                    Overdue ({overdue.length})
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="mt-0"><InvoiceTable data={invoices} /></TabsContent>
              <TabsContent value="paid" className="mt-0"><InvoiceTable data={paid} /></TabsContent>
              <TabsContent value="pending" className="mt-0"><InvoiceTable data={pending} /></TabsContent>
              <TabsContent value="overdue" className="mt-0"><InvoiceTable data={overdue} /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
