"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TopBar } from "@/components/layout/top-bar";
import {
  MessageSquare,
  Mail,
  Send,
  Phone,
  Paperclip,
  ChevronLeft,
  Search,
  MoreHorizontal,
  Check,
  CheckCheck,
  Clock,
  Car,
  FileText,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = "sms" | "email";
type MessageDirection = "outbound" | "inbound";
type MessageType = "message" | "system";

interface Message {
  id: string;
  type: MessageType;
  direction?: MessageDirection;
  body: string;
  timestamp: Date;
  read?: boolean;
  delivered?: boolean;
}

interface Thread {
  id: string;
  customerId: string;
  customerName: string;
  vehicle: string;
  workOrderId: string;
  channel: Channel;
  messages: Message[];
  unread: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const today = new Date("2026-07-08T12:00:00");
const yd = (h: number, m: number) =>
  new Date(`2026-07-07T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);
const td = (h: number, m: number) =>
  new Date(`2026-07-08T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);
const daysAgo = (days: number, h: number, m: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  d.setHours(h, m, 0, 0);
  return d;
};

const THREADS: Thread[] = [
  {
    id: "T-001",
    customerId: "C-001",
    customerName: "Marcus Reid",
    vehicle: "2019 Ford F-150",
    workOrderId: "WO-1042",
    channel: "sms",
    unread: 2,
    messages: [
      {
        id: "m1",
        type: "message",
        direction: "inbound",
        body: "Hey, just checking in — is my truck ready yet? Hoping to pick it up before 5.",
        timestamp: yd(9, 14),
        read: true,
      },
      {
        id: "m2",
        type: "message",
        direction: "outbound",
        body: "Hi Marcus! Your F-150 is still on the lift — we found the rear brake pads are also worn down to about 20%. We'd recommend replacing them while we have it up. Want us to go ahead?",
        timestamp: yd(9, 32),
        delivered: true,
        read: true,
      },
      {
        id: "m3",
        type: "system",
        body: "Estimate #E-042 sent for approval — $284.00",
        timestamp: yd(9, 33),
      },
      {
        id: "m4",
        type: "message",
        direction: "inbound",
        body: "Yeah go ahead. How long will the extra work add?",
        timestamp: yd(9, 47),
        read: true,
      },
      {
        id: "m5",
        type: "message",
        direction: "outbound",
        body: "About 45 extra minutes. Should have you out by 2:30 PM at the latest.",
        timestamp: yd(9, 52),
        delivered: true,
        read: true,
      },
      {
        id: "m6",
        type: "system",
        body: "Work order WO-1042 status updated to In Progress",
        timestamp: yd(10, 5),
      },
      {
        id: "m7",
        type: "message",
        direction: "inbound",
        body: "Perfect. Thanks!",
        timestamp: yd(10, 8),
        read: true,
      },
      {
        id: "m8",
        type: "message",
        direction: "inbound",
        body: "Any update? It's almost 3 PM.",
        timestamp: td(8, 22),
        read: false,
      },
      {
        id: "m9",
        type: "message",
        direction: "inbound",
        body: "Also — what's the total going to be?",
        timestamp: td(8, 23),
        read: false,
      },
    ],
  },
  {
    id: "T-002",
    customerId: "C-002",
    customerName: "Sarah Chen",
    vehicle: "2021 Tesla Model 3",
    workOrderId: "WO-1041",
    channel: "email",
    unread: 0,
    messages: [
      {
        id: "m1",
        type: "message",
        direction: "outbound",
        body: "Hi Sarah,\n\nThank you for bringing your Tesla Model 3 in today. After completing the brake inspection, we found that your front brake pads are at approximately 3mm — well within safe range. No immediate action needed.\n\nWe did notice minor surface rust on the rotors, which is normal for electric vehicles that rely heavily on regenerative braking. We'd recommend a brake flush within the next 6 months.\n\nYour vehicle is ready for pickup anytime today.\n\nBest,\nFleetFlow Auto",
        timestamp: daysAgo(2, 14, 10),
        delivered: true,
        read: true,
      },
      {
        id: "m2",
        type: "system",
        body: "Work order WO-1041 status updated to Complete",
        timestamp: daysAgo(2, 14, 11),
      },
      {
        id: "m3",
        type: "message",
        direction: "inbound",
        body: "Thank you so much! That's a relief. I'll swing by around 5:30 to grab it. Is there anything I need to bring?",
        timestamp: daysAgo(2, 15, 2),
        read: true,
      },
      {
        id: "m4",
        type: "message",
        direction: "outbound",
        body: "Hi Sarah,\n\nJust your photo ID and the card on file works great. We'll have everything ready at the front desk.\n\nSee you at 5:30!\n\nFleetFlow Auto",
        timestamp: daysAgo(2, 15, 18),
        delivered: true,
        read: true,
      },
      {
        id: "m5",
        type: "system",
        body: "Payment of $189.00 collected — Invoice #INV-2041 paid in full",
        timestamp: daysAgo(2, 17, 44),
      },
    ],
  },
  {
    id: "T-003",
    customerId: "C-003",
    customerName: "David Torres",
    vehicle: "2018 Chevy Tahoe",
    workOrderId: "WO-1040",
    channel: "sms",
    unread: 1,
    messages: [
      {
        id: "m1",
        type: "message",
        direction: "inbound",
        body: "Morning — did you get a chance to run the diagnostic on the Tahoe? It's been stalling at idle.",
        timestamp: daysAgo(1, 8, 5),
        read: true,
      },
      {
        id: "m2",
        type: "message",
        direction: "outbound",
        body: "Good morning David! We're running it now. Initial codes are pointing to the MAF sensor and a vacuum leak. We'll know more by noon.",
        timestamp: daysAgo(1, 8, 31),
        delivered: true,
        read: true,
      },
      {
        id: "m3",
        type: "system",
        body: "Diagnostic report attached to WO-1040",
        timestamp: daysAgo(1, 12, 2),
      },
      {
        id: "m4",
        type: "message",
        direction: "outbound",
        body: "Update: confirmed MAF sensor failure + cracked intake boot. Total repair estimate is $620 including parts and labor. Want me to send the full estimate?",
        timestamp: daysAgo(1, 12, 15),
        delivered: true,
        read: true,
      },
      {
        id: "m5",
        type: "message",
        direction: "inbound",
        body: "Yeah send it over. Is this covered under anything?",
        timestamp: daysAgo(1, 12, 44),
        read: true,
      },
      {
        id: "m6",
        type: "system",
        body: "Estimate #E-043 sent for approval — $620.00",
        timestamp: daysAgo(1, 12, 46),
      },
      {
        id: "m7",
        type: "message",
        direction: "inbound",
        body: "Approved. Go ahead and order the parts.",
        timestamp: td(7, 52),
        read: false,
      },
    ],
  },
  {
    id: "T-004",
    customerId: "C-004",
    customerName: "Priya Nair",
    vehicle: "2022 Honda CR-V",
    workOrderId: "WO-1038",
    channel: "sms",
    unread: 0,
    messages: [
      {
        id: "m1",
        type: "message",
        direction: "inbound",
        body: "Hi! I'd like to schedule an oil change for my CR-V. What's your earliest availability?",
        timestamp: daysAgo(3, 10, 22),
        read: true,
      },
      {
        id: "m2",
        type: "message",
        direction: "outbound",
        body: "Hi Priya! We have a slot open this Thursday at 9 AM or Friday at 2 PM. Which works better for you?",
        timestamp: daysAgo(3, 10, 45),
        delivered: true,
        read: true,
      },
      {
        id: "m3",
        type: "message",
        direction: "inbound",
        body: "Thursday at 9 AM works perfectly!",
        timestamp: daysAgo(3, 11, 3),
        read: true,
      },
      {
        id: "m4",
        type: "message",
        direction: "outbound",
        body: "Perfect — booked! You'll get a reminder the day before. Is there anything else you'd like us to check while we have it?",
        timestamp: daysAgo(3, 11, 12),
        delivered: true,
        read: true,
      },
      {
        id: "m5",
        type: "message",
        direction: "inbound",
        body: "Maybe a tire pressure check? The TPMS light came on last week.",
        timestamp: daysAgo(3, 11, 20),
        read: true,
      },
      {
        id: "m6",
        type: "message",
        direction: "outbound",
        body: "Absolutely, we'll check and top off all four tires at no extra charge. See you Thursday!",
        timestamp: daysAgo(3, 11, 28),
        delivered: true,
        read: true,
      },
      {
        id: "m7",
        type: "system",
        body: "Appointment confirmed — Thu Jul 5, 9:00 AM",
        timestamp: daysAgo(3, 11, 29),
      },
    ],
  },
  {
    id: "T-005",
    customerId: "C-005",
    customerName: "Tom Walsh",
    vehicle: "2020 RAM 1500",
    workOrderId: "WO-1035",
    channel: "email",
    unread: 1,
    messages: [
      {
        id: "m1",
        type: "message",
        direction: "outbound",
        body: "Hi Tom,\n\nYour RAM 1500 is ready for pickup. We completed the transmission fluid flush, replaced the cabin air filter, and performed a full multi-point inspection. Everything else looks great — tires have even wear and brakes are at 60%.\n\nTotal due: $415.00. You can pay at pickup or we can email an invoice if you'd prefer to pay online.\n\nThanks,\nFleetFlow Auto",
        timestamp: daysAgo(4, 16, 30),
        delivered: true,
        read: true,
      },
      {
        id: "m2",
        type: "system",
        body: "Work order WO-1035 status updated to Complete",
        timestamp: daysAgo(4, 16, 31),
      },
      {
        id: "m3",
        type: "message",
        direction: "inbound",
        body: "Can you email me the invoice? I'll pay online tonight — I work nights so I won't make it in before close.",
        timestamp: daysAgo(4, 17, 5),
        read: true,
      },
      {
        id: "m4",
        type: "system",
        body: "Invoice #INV-2035 emailed to twalsh@construx.com",
        timestamp: daysAgo(4, 17, 9),
      },
      {
        id: "m5",
        type: "message",
        direction: "outbound",
        body: "Hi Tom,\n\nInvoice sent! The link is valid for 7 days. Once payment is confirmed we'll hold the vehicle until you can pick it up.\n\nFleetFlow Auto",
        timestamp: daysAgo(4, 17, 10),
        delivered: true,
        read: true,
      },
      {
        id: "m6",
        type: "message",
        direction: "inbound",
        body: "Quick question — does the invoice include the multi-point inspection? My fleet manager needs an itemized receipt.",
        timestamp: td(9, 41),
        read: false,
      },
    ],
  },
  {
    id: "T-006",
    customerId: "C-006",
    customerName: "Jennifer Okafor",
    vehicle: "2023 Kia Telluride",
    workOrderId: "WO-1039",
    channel: "sms",
    unread: 0,
    messages: [
      {
        id: "m1",
        type: "message",
        direction: "inbound",
        body: "Is there any way to get my car in today? My AC stopped working and it's supposed to be 104° this weekend.",
        timestamp: daysAgo(2, 7, 55),
        read: true,
      },
      {
        id: "m2",
        type: "message",
        direction: "outbound",
        body: "Hi Jennifer! We just had a cancellation at 11 AM — can you make that work?",
        timestamp: daysAgo(2, 8, 3),
        delivered: true,
        read: true,
      },
      {
        id: "m3",
        type: "message",
        direction: "inbound",
        body: "Yes!! Absolutely. Thank you so much!",
        timestamp: daysAgo(2, 8, 7),
        read: true,
      },
      {
        id: "m4",
        type: "system",
        body: "Appointment confirmed — Jul 6, 11:00 AM · WO-1039 created",
        timestamp: daysAgo(2, 8, 9),
      },
      {
        id: "m5",
        type: "message",
        direction: "outbound",
        body: "Update: your AC compressor has failed. Refrigerant was also low, likely from a slow leak at the high-side port. Full repair estimate is $890. Want us to proceed?",
        timestamp: daysAgo(2, 13, 20),
        delivered: true,
        read: true,
      },
      {
        id: "m6",
        type: "message",
        direction: "inbound",
        body: "Yes please. I need it working before Friday.",
        timestamp: daysAgo(2, 13, 35),
        read: true,
      },
      {
        id: "m7",
        type: "system",
        body: "Estimate #E-044 approved — $890.00 · Parts ordered",
        timestamp: daysAgo(2, 13, 37),
      },
      {
        id: "m8",
        type: "message",
        direction: "outbound",
        body: "Parts arriving tomorrow morning. Targeting completion by Thursday EOD — you're all set for the weekend!",
        timestamp: daysAgo(2, 13, 50),
        delivered: true,
        read: true,
      },
      {
        id: "m9",
        type: "system",
        body: "Payment of $890.00 collected — Invoice #INV-2039 paid in full",
        timestamp: daysAgo(1, 16, 22),
      },
      {
        id: "m10",
        type: "message",
        direction: "outbound",
        body: "Your Telluride is ready! AC is ice cold — tested at 38°F at the vent. Come pick it up anytime before 6 PM. Thanks Jennifer!",
        timestamp: daysAgo(1, 16, 25),
        delivered: true,
        read: true,
      },
      {
        id: "m11",
        type: "message",
        direction: "inbound",
        body: "You all are the best. On my way!",
        timestamp: daysAgo(1, 17, 1),
        read: true,
      },
    ],
  },
];

const QUICK_REPLIES = [
  "Your vehicle is ready for pickup!",
  "We're still waiting on parts — estimated arrival tomorrow.",
  "Can we get you scheduled for a follow-up appointment?",
  "Your estimate has been sent — please review and approve at your convenience.",
  "Thank you for choosing FleetFlow Auto! We appreciate your business.",
  "Our technician will call you shortly with an update.",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  "from-blue-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
];

function getInitials(name: string) {
  const parts = name.split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function avatarGradient(index: number) {
  return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatThreadDate(date: Date) {
  const now = new Date("2026-07-08T12:00:00");
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return formatTime(date);
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateSeparator(date: Date) {
  const now = new Date("2026-07-08T12:00:00");
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getLastMessage(thread: Thread) {
  const last = [...thread.messages].reverse().find((m) => m.type === "message");
  return last ?? thread.messages[thread.messages.length - 1];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatBadgeProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function StatBadge({ label, value, icon: Icon, color, bg }: StatBadgeProps) {
  return (
    <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 min-w-0">
      <div className={`${bg} p-2 rounded-lg shrink-0`}>
        <Icon className={`size-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-white/40 font-medium leading-tight truncate">{label}</p>
        <p className="text-lg font-bold text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

interface ThreadItemProps {
  thread: Thread;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function ThreadItem({ thread, index, isActive, onClick }: ThreadItemProps) {
  const last = getLastMessage(thread);
  const preview =
    last.type === "system"
      ? last.body
      : (last.direction === "outbound" ? "You: " : "") + last.body;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3.5 flex items-start gap-3 transition-colors rounded-lg relative
        ${isActive
          ? "bg-primary/15 border-l-2 border-primary pl-[10px]"
          : "hover:bg-white/5 border-l-2 border-transparent"
        }`}
    >
      {/* Avatar */}
      <div
        className={`size-10 rounded-xl bg-gradient-to-br ${avatarGradient(index)} flex items-center justify-center shrink-0 mt-0.5`}
      >
        <span className="text-xs font-bold text-white">{getInitials(thread.customerName)}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm font-semibold text-white truncate">{thread.customerName}</span>
          <span className="text-[10px] text-white/35 shrink-0">{formatThreadDate(last.timestamp)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {thread.channel === "sms" ? (
            <MessageSquare className="size-3 text-blue-400 shrink-0" />
          ) : (
            <Mail className="size-3 text-violet-400 shrink-0" />
          )}
          <p className="text-[11px] text-white/40 truncate leading-tight">{preview}</p>
        </div>
      </div>

      {/* Unread badge */}
      {thread.unread > 0 && (
        <span className="size-4 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-1">
          {thread.unread}
        </span>
      )}
    </button>
  );
}

interface MessageBubbleProps {
  message: Message;
  customerName: string;
  customerIndex: number;
}

function MessageBubble({ message, customerName, customerIndex }: MessageBubbleProps) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center py-1">
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1">
          <Zap className="size-3 text-amber-400 shrink-0" />
          <span className="text-[11px] text-white/40">{message.body}</span>
        </div>
      </div>
    );
  }

  const isOutbound = message.direction === "outbound";

  return (
    <div className={`flex items-end gap-2.5 ${isOutbound ? "flex-row-reverse" : "flex-row"}`}>
      {/* Customer avatar — inbound only */}
      {!isOutbound && (
        <div
          className={`size-7 rounded-lg bg-gradient-to-br ${avatarGradient(customerIndex)} flex items-center justify-center shrink-0 mb-0.5`}
        >
          <span className="text-[10px] font-bold text-white">{getInitials(customerName)}</span>
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[72%] ${isOutbound ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words
            ${isOutbound
              ? "gradient-blue text-white rounded-br-sm"
              : "glass-card text-white/90 rounded-bl-sm"
            }`}
        >
          {message.body}
        </div>

        {/* Timestamp + status */}
        <div className={`flex items-center gap-1 ${isOutbound ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-white/30">{formatTime(message.timestamp)}</span>
          {isOutbound && (
            message.read ? (
              <CheckCheck className="size-3 text-primary" />
            ) : message.delivered ? (
              <CheckCheck className="size-3 text-white/30" />
            ) : (
              <Check className="size-3 text-white/30" />
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Thread List Panel ────────────────────────────────────────────────────────

interface ThreadListProps {
  threads: Thread[];
  activeId: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (id: string) => void;
}

function ThreadList({ threads, activeId, search, onSearchChange, onSelect }: ThreadListProps) {
  const filtered = threads.filter((t) =>
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-white/8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations…"
            className="w-full h-9 pl-9 pr-3 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-1.5 py-2 space-y-0.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <MessageSquare className="size-8 mb-2 opacity-40" />
            <p className="text-xs">No conversations found</p>
          </div>
        ) : (
          filtered.map((thread, i) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              index={THREADS.indexOf(thread)}
              isActive={thread.id === activeId}
              onClick={() => onSelect(thread.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Message View Panel ───────────────────────────────────────────────────────

interface MessageViewProps {
  thread: Thread;
  threadIndex: number;
  onBack: () => void;
  composeValue: string;
  onComposeChange: (v: string) => void;
  onSend: () => void;
  activeChannel: Channel;
  onChannelChange: (c: Channel) => void;
  showQuickReplies: boolean;
  onToggleQuickReplies: () => void;
  onQuickReply: (text: string) => void;
}

function MessageView({
  thread,
  threadIndex,
  onBack,
  composeValue,
  onComposeChange,
  onSend,
  activeChannel,
  onChannelChange,
  showQuickReplies,
  onToggleQuickReplies,
  onQuickReply,
}: MessageViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread.messages]);

  // Auto-resize textarea
  const handleComposeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onComposeChange(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  // Group messages by day for date separators
  const messagesWithSeparators: Array<{ type: "separator"; label: string } | { type: "message"; message: Message }> = [];
  let lastDate: Date | null = null;

  for (const msg of thread.messages) {
    if (!lastDate || !isSameDay(lastDate, msg.timestamp)) {
      messagesWithSeparators.push({ type: "separator", label: formatDateSeparator(msg.timestamp) });
      lastDate = msg.timestamp;
    }
    messagesWithSeparators.push({ type: "message", message: msg });
  }

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="border-b border-white/8 px-4 py-3 flex items-center gap-3 shrink-0">
        {/* Back button — mobile only */}
        <button
          onClick={onBack}
          className="md:hidden text-white/50 hover:text-white transition-colors shrink-0"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Customer avatar */}
        <div
          className={`size-9 rounded-xl bg-gradient-to-br ${avatarGradient(threadIndex)} flex items-center justify-center shrink-0`}
        >
          <span className="text-xs font-bold text-white">{getInitials(thread.customerName)}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">{thread.customerName}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-white/40">
              <Car className="size-3" />
              {thread.vehicle}
            </span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1 text-[11px] text-primary/70">
              <FileText className="size-3" />
              {thread.workOrderId}
            </span>
          </div>
        </div>

        {/* Channel toggle */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => onChannelChange("sms")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeChannel === "sms"
                ? "bg-blue-500/20 text-blue-400"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <MessageSquare className="size-3" />
            SMS
          </button>
          <button
            onClick={() => onChannelChange("email")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeChannel === "email"
                ? "bg-violet-500/20 text-violet-400"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Mail className="size-3" />
            Email
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button className="size-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <Phone className="size-4" />
          </button>
          <button className="size-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>

      {/* Message thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messagesWithSeparators.map((item, i) => {
          if (item.type === "separator") {
            return (
              <div key={`sep-${i}`} className="flex items-center gap-3 py-1">
                <div className="flex-1 border-t border-white/6" />
                <span className="text-[10px] text-white/30 shrink-0 font-medium">{item.label}</span>
                <div className="flex-1 border-t border-white/6" />
              </div>
            );
          }
          return (
            <MessageBubble
              key={item.message.id}
              message={item.message}
              customerName={thread.customerName}
              customerIndex={threadIndex}
            />
          );
        })}
      </div>

      {/* Quick replies */}
      {showQuickReplies && (
        <div className="border-t border-white/8 px-4 py-3 flex flex-wrap gap-2">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => onQuickReply(reply)}
              className="text-[11px] bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/10 text-white/60 hover:text-white rounded-full px-3 py-1.5 transition-colors text-left"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Compose area */}
      <div className="border-t border-white/8 px-4 py-3 shrink-0">
        <div className="flex items-end gap-2">
          {/* Attachment */}
          <button className="size-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors shrink-0 mb-0.5">
            <Paperclip className="size-4" />
          </button>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={composeValue}
              onChange={handleComposeChange}
              onKeyDown={handleKeyDown}
              placeholder={activeChannel === "sms" ? "Type an SMS…" : "Type an email…"}
              rows={1}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3.5 py-2.5 resize-none focus:outline-none focus:border-primary/50 transition-colors leading-relaxed"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
            <span className="absolute bottom-2 right-3 text-[9px] text-white/20 select-none hidden sm:block">
              ⌘↵ to send
            </span>
          </div>

          {/* Quick replies toggle */}
          <button
            onClick={onToggleQuickReplies}
            className={`size-8 flex items-center justify-center rounded-lg transition-colors shrink-0 mb-0.5 ${
              showQuickReplies
                ? "bg-primary/20 text-primary"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
            title="Quick replies"
          >
            <Zap className="size-4" />
          </button>

          {/* Send */}
          <button
            onClick={onSend}
            disabled={!composeValue.trim()}
            className="gradient-blue glow-blue-sm text-white size-9 rounded-xl flex items-center justify-center shrink-0 mb-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunicationsPage() {
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>("T-001");
  const [search, setSearch] = useState("");
  const [composeValue, setComposeValue] = useState("");
  const [activeChannel, setActiveChannel] = useState<Channel>("sms");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  // Mobile: true = show thread list, false = show message view
  const [showMobileList, setShowMobileList] = useState(true);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;
  const activeThreadIndex = threads.findIndex((t) => t.id === activeThreadId);

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);
  const activeCount = threads.filter((t) => t.unread > 0 || getLastMessage(t).timestamp > daysAgo(2, 0, 0)).length;

  const handleSelectThread = useCallback((id: string) => {
    setActiveThreadId(id);
    setShowMobileList(false);
    setComposeValue("");
    setShowQuickReplies(false);
    // Mark thread as read
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              unread: 0,
              messages: t.messages.map((m) => ({ ...m, read: true })),
            }
          : t
      )
    );
    // Set channel to thread's default
    const thread = threads.find((t) => t.id === id);
    if (thread) setActiveChannel(thread.channel);
  }, [threads]);

  const handleSend = useCallback(() => {
    if (!composeValue.trim() || !activeThreadId) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      type: "message",
      direction: "outbound",
      body: composeValue.trim(),
      timestamp: new Date("2026-07-08T12:00:00"),
      delivered: false,
      read: false,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId ? { ...t, messages: [...t.messages, newMsg] } : t
      )
    );
    setComposeValue("");
    setShowQuickReplies(false);
  }, [composeValue, activeThreadId]);

  const handleQuickReply = useCallback((text: string) => {
    setComposeValue(text);
    setShowQuickReplies(false);
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Communications"
        subtitle="Two-way customer messaging — SMS & Email"
        actions={
          <button className="gradient-blue glow-blue-sm text-white font-medium text-sm h-8 px-3 rounded-lg flex items-center gap-1.5">
            <MessageSquare className="size-3.5" />
            New Message
          </button>
        }
      />

      {/* Stats bar */}
      <div className="border-b border-white/8 px-4 sm:px-6 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBadge
            label="Unread Messages"
            value={totalUnread}
            icon={MessageSquare}
            color="text-blue-400"
            bg="bg-blue-500/10"
          />
          <StatBadge
            label="Active Threads"
            value={activeCount}
            icon={Clock}
            color="text-emerald-400"
            bg="bg-emerald-500/10"
          />
          <StatBadge
            label="Avg Response Time"
            value="18 min"
            icon={Zap}
            color="text-amber-400"
            bg="bg-amber-500/10"
          />
          <StatBadge
            label="Messages Sent Today"
            value="34"
            icon={Send}
            color="text-violet-400"
            bg="bg-violet-500/10"
          />
        </div>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — always visible on md+, toggled on mobile */}
        <div
          className={`
            w-full md:w-80 lg:w-[320px] border-r border-white/8 flex flex-col shrink-0
            ${showMobileList ? "flex" : "hidden"} md:flex
          `}
        >
          <ThreadList
            threads={threads}
            activeId={activeThreadId}
            search={search}
            onSearchChange={setSearch}
            onSelect={handleSelectThread}
          />
        </div>

        {/* Right pane */}
        <div
          className={`
            flex-1 flex flex-col min-w-0
            ${!showMobileList ? "flex" : "hidden"} md:flex
          `}
        >
          {activeThread ? (
            <MessageView
              thread={activeThread}
              threadIndex={activeThreadIndex}
              onBack={() => setShowMobileList(true)}
              composeValue={composeValue}
              onComposeChange={setComposeValue}
              onSend={handleSend}
              activeChannel={activeChannel}
              onChannelChange={setActiveChannel}
              showQuickReplies={showQuickReplies}
              onToggleQuickReplies={() => setShowQuickReplies((v) => !v)}
              onQuickReply={handleQuickReply}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-3">
              <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <MessageSquare className="size-8 opacity-50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/50">No conversation selected</p>
                <p className="text-xs mt-1">Choose a thread from the left to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
