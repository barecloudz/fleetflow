"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
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
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Megaphone,
  Mail,
  MessageSquare,
  Send,
  TrendingUp,
  Users,
  Clock,
  ToggleLeft,
  ToggleRight,
  Plus,
  BarChart2,
  Zap,
  Calendar,
  Target,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CampaignStatus = "Active" | "Scheduled" | "Completed" | "Draft";
type CampaignChannel = "SMS" | "Email";
type AutomationStatus = "Active" | "Paused" | "Draft";

interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  audience: string;
  status: CampaignStatus;
  sent: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  date: string;
}

interface Automation {
  id: string;
  name: string;
  trigger: string;
  channel: CampaignChannel;
  status: AutomationStatus;
  sentThisMonth: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialCampaigns: Campaign[] = [
  {
    id: "CMP-001",
    name: "Summer AC Service Promo",
    channel: "Email",
    audience: "All active customers",
    status: "Completed",
    sent: 1842,
    opened: 54,
    clicked: 12,
    unsubscribed: 3,
    date: "Jun 15, 2026",
  },
  {
    id: "CMP-002",
    name: "Oil Change Reminder Blast",
    channel: "SMS",
    audience: "Customers due for oil change",
    status: "Completed",
    sent: 634,
    opened: 91,
    clicked: 34,
    unsubscribed: 1,
    date: "Jun 28, 2026",
  },
  {
    id: "CMP-003",
    name: "July 4th Special Offer",
    channel: "Email",
    audience: "All active customers",
    status: "Scheduled",
    sent: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0,
    date: "Jul 3, 2026",
  },
  {
    id: "CMP-004",
    name: "Win-Back: 90-Day Inactive",
    channel: "SMS",
    audience: "Inactive 90+ days",
    status: "Active",
    sent: 218,
    opened: 78,
    clicked: 22,
    unsubscribed: 5,
    date: "Jul 1, 2026",
  },
  {
    id: "CMP-005",
    name: "New Customer Welcome Series",
    channel: "Email",
    audience: "New customers",
    status: "Active",
    sent: 97,
    opened: 68,
    clicked: 29,
    unsubscribed: 0,
    date: "Jul 5, 2026",
  },
  {
    id: "CMP-006",
    name: "VIP Loyalty Appreciation",
    channel: "Email",
    audience: "VIP customers",
    status: "Draft",
    sent: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0,
    date: "—",
  },
  {
    id: "CMP-007",
    name: "Fall Tire Swap Reminder",
    channel: "SMS",
    audience: "All active customers",
    status: "Scheduled",
    sent: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0,
    date: "Sep 15, 2026",
  },
];

const automations: Automation[] = [
  {
    id: "AUTO-001",
    name: "Appointment Reminder",
    trigger: "24 hours before scheduled appointment",
    channel: "SMS",
    status: "Active",
    sentThisMonth: 47,
  },
  {
    id: "AUTO-002",
    name: "Post-Service Follow-up",
    trigger: "3 days after service completed",
    channel: "Email",
    status: "Active",
    sentThisMonth: 31,
  },
  {
    id: "AUTO-003",
    name: "Deferred Service Reminder",
    trigger: "30 days after service was declined",
    channel: "SMS",
    status: "Active",
    sentThisMonth: 18,
  },
  {
    id: "AUTO-004",
    name: "Oil Change Reminder",
    trigger: "90 days after last service visit",
    channel: "SMS",
    status: "Active",
    sentThisMonth: 52,
  },
  {
    id: "AUTO-005",
    name: "Inactive Customer Win-back",
    trigger: "90 days since last visit",
    channel: "Email",
    status: "Paused",
    sentThisMonth: 0,
  },
  {
    id: "AUTO-006",
    name: "Birthday Greeting",
    trigger: "Customer's birthday",
    channel: "SMS",
    status: "Draft",
    sentThisMonth: 0,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const campaignStatusStyle: Record<CampaignStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Scheduled: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Completed: "bg-white/10 text-white/50 border-white/10",
  Draft: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

const automationStatusStyle: Record<AutomationStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Paused: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Draft: "bg-white/10 text-white/50 border-white/10",
};

const channelStyle: Record<CampaignChannel, string> = {
  SMS: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Email: "bg-sky-500/15 text-sky-400 border-sky-500/20",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}

function StatCard({ icon: Icon, label, value, color, bg }: StatCardProps) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-4">
      <div className={`${bg} p-2.5 rounded-xl shrink-0`}>
        <Icon className={`size-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/40 font-medium leading-tight">{label}</p>
        <p className="text-xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Campaign Card ────────────────────────────────────────────────────────────

interface CampaignCardProps {
  campaign: Campaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const isScheduled = campaign.status === "Scheduled";
  const isDraft = campaign.status === "Draft";
  const showMetrics = campaign.sent > 0;

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-4 hover:border-white/14 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-semibold text-white leading-tight">{campaign.name}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              className={`text-[9px] font-medium border px-1.5 py-0 rounded-full ${channelStyle[campaign.channel]}`}
            >
              {campaign.channel === "SMS" ? (
                <MessageSquare className="size-2.5 mr-0.5 inline" />
              ) : (
                <Mail className="size-2.5 mr-0.5 inline" />
              )}
              {campaign.channel}
            </Badge>
            <Badge
              className={`text-[9px] font-medium border px-1.5 py-0 rounded-full ${campaignStatusStyle[campaign.status]}`}
            >
              {campaign.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Audience */}
      <div className="flex items-center gap-2 text-[11px] text-white/50">
        <Target className="size-3 shrink-0 text-white/30" />
        <span>{campaign.audience}</span>
      </div>

      {/* Metrics */}
      {showMetrics ? (
        <div className="grid grid-cols-4 gap-2 border-t border-white/6 pt-3.5">
          <div className="text-center">
            <p className="text-sm font-semibold text-white">{campaign.sent.toLocaleString()}</p>
            <p className="text-[10px] text-white/35">Sent</p>
          </div>
          <div className="text-center border-l border-white/6">
            <p className="text-sm font-semibold text-white">{campaign.opened}%</p>
            <p className="text-[10px] text-white/35">Opened</p>
          </div>
          <div className="text-center border-l border-white/6">
            <p className="text-sm font-semibold text-white">{campaign.clicked}%</p>
            <p className="text-[10px] text-white/35">Clicked</p>
          </div>
          <div className="text-center border-l border-white/6">
            <p className="text-sm font-semibold text-white">{campaign.unsubscribed}</p>
            <p className="text-[10px] text-white/35">Unsub</p>
          </div>
        </div>
      ) : (
        <div className="border-t border-white/6 pt-3.5">
          <p className="text-[11px] text-white/25 italic text-center">
            {isDraft ? "Not yet sent" : `Scheduled for ${campaign.date}`}
          </p>
        </div>
      )}

      {/* Date row */}
      {showMetrics && (
        <div className="flex items-center gap-1.5 text-[11px] text-white/35 -mt-1">
          <Calendar className="size-3 shrink-0 text-white/25" />
          <span>Sent {campaign.date}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {isScheduled ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-7 text-[11px] text-white/50 hover:text-white hover:bg-white/8 border border-white/8 hover:border-white/15 transition-colors"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-7 text-[11px] text-red-400/70 hover:text-red-400 hover:bg-red-500/8 border border-white/8 hover:border-red-500/20 transition-colors"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-7 text-[11px] text-primary/70 hover:text-primary hover:bg-primary/10 border border-primary/15 hover:border-primary/30 transition-colors gap-1"
            >
              <BarChart2 className="size-3" />
              View Report
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-7 text-[11px] text-white/50 hover:text-white hover:bg-white/8 border border-white/8 hover:border-white/15 transition-colors"
            >
              Duplicate
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Automation Row ───────────────────────────────────────────────────────────

interface AutomationRowProps {
  automation: Automation;
  onToggle: (id: string) => void;
}

function AutomationRow({ automation, onToggle }: AutomationRowProps) {
  const isActive = automation.status === "Active";
  const isPaused = automation.status === "Paused";
  const isToggleable = isActive || isPaused;

  return (
    <div className="flex items-center gap-4 py-4 px-5 border-b border-white/6 last:border-0 hover:bg-white/2 transition-colors group">
      {/* Toggle */}
      <button
        onClick={() => isToggleable && onToggle(automation.id)}
        className={`shrink-0 transition-colors ${isToggleable ? "cursor-pointer" : "cursor-default opacity-40"}`}
        aria-label={isActive ? "Pause automation" : "Resume automation"}
      >
        {isActive ? (
          <ToggleRight className="size-6 text-emerald-400" />
        ) : (
          <ToggleLeft className="size-6 text-white/25" />
        )}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="text-sm font-semibold text-white">{automation.name}</p>
          <Badge
            className={`text-[9px] font-medium border px-1.5 py-0 rounded-full ${automationStatusStyle[automation.status]}`}
          >
            {automation.status}
          </Badge>
          <Badge
            className={`text-[9px] font-medium border px-1.5 py-0 rounded-full ${channelStyle[automation.channel]}`}
          >
            {automation.channel === "SMS" ? (
              <MessageSquare className="size-2.5 mr-0.5 inline" />
            ) : (
              <Mail className="size-2.5 mr-0.5 inline" />
            )}
            {automation.channel}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/40">
          <Zap className="size-3 shrink-0 text-white/25" />
          <span>{automation.trigger}</span>
        </div>
      </div>

      {/* Sent this month */}
      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-sm font-semibold text-white">{automation.sentThisMonth}</p>
        <p className="text-[10px] text-white/35">sent / mo</p>
      </div>

      {/* Edit */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-[11px] px-3 text-white/40 hover:text-white hover:bg-white/8 border border-white/8 hover:border-white/15 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
      >
        Edit
      </Button>
    </div>
  );
}

// ─── New Campaign Form ────────────────────────────────────────────────────────

interface NewCampaignFormProps {
  onSubmit: (c: Campaign) => void;
  onClose: () => void;
}

function NewCampaignForm({ onSubmit, onClose }: NewCampaignFormProps) {
  const [name, setName]         = useState("");
  const [channel, setChannel]   = useState<CampaignChannel>("Email");
  const [audience, setAudience] = useState("");
  const [subject, setSubject]   = useState("");
  const [body, setBody]         = useState("");
  const [schedule, setSchedule] = useState<"now" | "later">("now");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");

  const fieldClass =
    "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-9 text-sm";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !audience || !body) return;

    const dateLabel =
      schedule === "now"
        ? "Jul 8, 2026"
        : schedDate
        ? new Date(schedDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—";

    onSubmit({
      id: `CMP-${String(Math.floor(Math.random() * 900) + 100)}`,
      name,
      channel,
      audience:
        audience === "all"
          ? "All active customers"
          : audience === "due"
          ? "Customers due for oil change"
          : audience === "inactive"
          ? "Inactive 90+ days"
          : audience === "new"
          ? "New customers"
          : "VIP customers",
      status: schedule === "now" ? "Active" : "Scheduled",
      sent: schedule === "now" ? 0 : 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      date: dateLabel,
    });
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Campaign Name <span className="text-red-400">*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Oil Change Promo"
            required
            className={fieldClass}
          />
        </div>

        {/* Channel toggle */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Channel
          </Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setChannel("Email")}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border text-sm font-medium transition-colors ${
                channel === "Email"
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/8"
              }`}
            >
              <Mail className="size-3.5" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setChannel("SMS")}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border text-sm font-medium transition-colors ${
                channel === "SMS"
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-400"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/8"
              }`}
            >
              <MessageSquare className="size-3.5" />
              SMS
            </button>
          </div>
        </div>

        {/* Audience */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Audience <span className="text-red-400">*</span>
          </Label>
          <Select value={audience} onValueChange={(v) => v && setAudience(v)} required>
            <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
              <SelectValue placeholder="Select audience…" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10 text-white">
              <SelectItem value="all" className="hover:bg-white/8">All Customers</SelectItem>
              <SelectItem value="due" className="hover:bg-white/8">Due for Service</SelectItem>
              <SelectItem value="inactive" className="hover:bg-white/8">Inactive 90+ Days</SelectItem>
              <SelectItem value="new" className="hover:bg-white/8">New Customers</SelectItem>
              <SelectItem value="vip" className="hover:bg-white/8">VIP Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subject (email only) */}
        {channel === "Email" && (
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
              Subject Line
            </Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Your vehicle is due for service!"
              className={fieldClass}
            />
          </div>
        )}

        {/* Message body */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            {channel === "SMS" ? "Message" : "Body"}{" "}
            <span className="text-red-400">*</span>
          </Label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              channel === "SMS"
                ? "Hi {first_name}! Your vehicle is due for an oil change. Book now at…"
                : "Write your email body here…"
            }
            rows={5}
            required
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none focus:border-primary/50 transition-colors"
          />
          {channel === "SMS" && (
            <p className="text-[10px] text-white/25">
              {body.length}/160 characters
            </p>
          )}
        </div>

        {/* Schedule */}
        <div className="space-y-2">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Send Time
          </Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSchedule("now")}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border text-sm font-medium transition-colors ${
                schedule === "now"
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/8"
              }`}
            >
              <Send className="size-3.5" />
              Send Now
            </button>
            <button
              type="button"
              onClick={() => setSchedule("later")}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border text-sm font-medium transition-colors ${
                schedule === "later"
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/8"
              }`}
            >
              <Clock className="size-3.5" />
              Schedule
            </button>
          </div>
          {schedule === "later" && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-white/40">Date</Label>
                <Input
                  type="date"
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-white/40">Time</Label>
                <Input
                  type="time"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-white/25">
          <span className="text-red-400">*</span> Required fields
        </p>
      </div>

      <SheetFooter className="border-t border-white/8 p-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="flex-1 text-white/60 hover:text-white hover:bg-white/5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 gradient-blue glow-blue-sm text-white font-medium"
          disabled={!name || !audience || !body}
        >
          {schedule === "now" ? "Launch Campaign" : "Schedule Campaign"}
        </Button>
      </SheetFooter>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["All", "Active", "Scheduled", "Completed", "Draft"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [automationList, setAutomationList] = useState<Automation[]>(automations);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  function handleAddCampaign(c: Campaign) {
    setCampaigns((prev) => [c, ...prev]);
  }

  function handleToggleAutomation(id: string) {
    setAutomationList((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          status: a.status === "Active" ? "Paused" : "Active",
        };
      })
    );
  }

  const filteredCampaigns =
    statusFilter === "All"
      ? campaigns
      : campaigns.filter((c) => c.status === statusFilter);

  // Stats
  const completedCampaigns = campaigns.filter((c) => c.status === "Completed");
  const totalSentThisMonth = completedCampaigns.reduce((s, c) => s + c.sent, 0);
  const avgOpenRate =
    completedCampaigns.length > 0
      ? Math.round(
          completedCampaigns.reduce((s, c) => s + c.opened, 0) /
            completedCampaigns.length
        )
      : 0;
  const avgClickRate =
    completedCampaigns.length > 0
      ? Math.round(
          completedCampaigns.reduce((s, c) => s + c.clicked, 0) /
            completedCampaigns.length
        )
      : 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Marketing"
        subtitle="SMS & Email campaigns"
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  size="sm"
                  className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"
                >
                  <Plus className="size-3.5" />
                  New Campaign
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]"
              showCloseButton={false}
            >
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <Megaphone className="size-4 text-primary" />
                  New Campaign
                </SheetTitle>
                <p className="text-xs text-white/40 mt-0.5">
                  Send an SMS or email campaign to your customers.
                </p>
              </SheetHeader>
              <NewCampaignForm
                onSubmit={handleAddCampaign}
                onClose={() => setSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <Tabs defaultValue="campaigns">
          <TabsList className="bg-white/5 border border-white/8 h-9 mb-6">
            <TabsTrigger
              value="campaigns"
              className="text-xs gap-1.5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Megaphone className="size-3.5" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger
              value="automations"
              className="text-xs gap-1.5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Zap className="size-3.5" />
              Automations
            </TabsTrigger>
          </TabsList>

          {/* ── Campaigns Tab ─────────────────────────────────────────── */}
          <TabsContent value="campaigns" className="mt-0 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                icon={Send}
                label="Total Sent This Month"
                value={totalSentThisMonth.toLocaleString()}
                color="text-blue-400"
                bg="bg-blue-500/10"
              />
              <StatCard
                icon={TrendingUp}
                label="Avg Open Rate"
                value={`${avgOpenRate}%`}
                color="text-emerald-400"
                bg="bg-emerald-500/10"
              />
              <StatCard
                icon={BarChart2}
                label="Avg Click Rate"
                value={`${avgClickRate}%`}
                color="text-violet-400"
                bg="bg-violet-500/10"
              />
              <StatCard
                icon={Users}
                label="Revenue Attributed"
                value="$8,420"
                color="text-amber-400"
                bg="bg-amber-500/10"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {STATUS_FILTERS.map((f) => {
                const count =
                  f === "All"
                    ? campaigns.length
                    : campaigns.filter((c) => c.status === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`h-7 px-3 rounded-lg text-xs font-medium border transition-colors ${
                      statusFilter === f
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : "bg-white/5 border-white/8 text-white/50 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {f}
                    <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Campaign grid */}
            {filteredCampaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-white/30">
                <Megaphone className="size-10 mb-3 opacity-40" />
                <p className="text-sm">No campaigns found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Automations Tab ───────────────────────────────────────── */}
          <TabsContent value="automations" className="mt-0 space-y-6">
            {/* Automation stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                icon={Zap}
                label="Active Automations"
                value={automationList.filter((a) => a.status === "Active").length.toString()}
                color="text-emerald-400"
                bg="bg-emerald-500/10"
              />
              <StatCard
                icon={Send}
                label="Sent This Month"
                value={automationList
                  .reduce((s, a) => s + a.sentThisMonth, 0)
                  .toString()}
                color="text-blue-400"
                bg="bg-blue-500/10"
              />
              <StatCard
                icon={Clock}
                label="Paused"
                value={automationList.filter((a) => a.status === "Paused").length.toString()}
                color="text-amber-400"
                bg="bg-amber-500/10"
              />
              <StatCard
                icon={Target}
                label="Drafts"
                value={automationList.filter((a) => a.status === "Draft").length.toString()}
                color="text-white/40"
                bg="bg-white/5"
              />
            </div>

            {/* Automation list */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/6 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Trigger-Based Automations</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[11px] px-3 text-white/50 hover:text-white hover:bg-white/8 border border-white/8 gap-1"
                >
                  <Plus className="size-3" />
                  New Automation
                </Button>
              </div>
              {automationList.map((automation) => (
                <AutomationRow
                  key={automation.id}
                  automation={automation}
                  onToggle={handleToggleAutomation}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
