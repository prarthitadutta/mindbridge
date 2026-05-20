"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import toast from "react-hot-toast";

type Message = {
  id: string;
  booking_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
};

type Booking = {
  id: string;
  therapist_name: string;
  date: string;
  time: string;
  status: string;
  user_id: string;
};

export default function Chat() {
  const { bookingId } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel(`chat-${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUser(user);

    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();
    setBooking(bookingData);

    const { data: messagesData } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });
    setMessages(messagesData || []);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    setSending(true);

    const { error } = await supabase.from("messages").insert({
      booking_id: bookingId,
      sender_id: currentUser.id,
      sender_name: currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "User",
      content: newMessage.trim(),
    });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading chat...</div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Booking not found</p>
          <Link href="/dashboard" className="text-[#4A90D9] hover:underline text-sm mt-2 block">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (booking.status !== "confirmed") {
    return (
      <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-3xl p-8 shadow-sm max-w-sm">
          <p className="text-4xl mb-4">⏳</p>
          <h2 className="font-bold text-gray-800 text-lg mb-2">Chat not available yet</h2>
          <p className="text-gray-500 text-sm mb-4">
            Chat opens once your therapist confirms the session. Current status:{" "}
            <span className="font-semibold text-amber-600">{booking.status}</span>
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-[#4A90D9] text-white font-semibold px-6 py-2 rounded-full text-sm hover:bg-[#357ABD] transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdf6f0] flex flex-col">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition">
            ←
          </Link>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A90D9] to-[#7B5EA7] flex items-center justify-center text-white font-bold">
            {booking.therapist_name?.charAt(0) || "T"}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{booking.therapist_name}</p>
            <p className="text-xs text-green-500 font-medium">● Session confirmed</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">
            {new Date(booking.date).toLocaleDateString("en-IN", {
              day: "numeric", month: "short",
            })} at {booking.time}
          </p>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-gray-500 text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => {
              const isMe = m.sender_id === currentUser?.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    {!isMe && (
                      <p className="text-xs text-gray-400 ml-1">{m.sender_name}</p>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-[#4A90D9] text-white rounded-br-sm"
                          : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                    <p className="text-xs text-gray-300 mx-1">
                      {new Date(m.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            rows={1}
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9] resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
            className="bg-[#4A90D9] text-white p-3 rounded-2xl hover:bg-[#357ABD] transition disabled:opacity-50 flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}