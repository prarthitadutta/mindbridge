"use client";
import { useState } from "react";

type Mode = null | "chat" | "breathe";
type Message = { from: string; text: string };

export default function SOSModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "support", text: "Hi, I am here with you. You are not alone. What is on your mind?" }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: message }]);
    setMessage("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "support", text: "Thank you for sharing. I hear you. Can you tell me more about what you are feeling?" }
      ]);
    }, 1000);
  };

  const closeModal = () => { setOpen(false); setMode(null); };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-3 rounded-full shadow-lg transition animate-pulse"
        >
          🆘 Need Help Now
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">
              ✕
            </button>

            {mode === null && (
              <div className="text-center">
                <div className="text-4xl mb-3">💙</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">You are not alone</h2>
                <p className="text-gray-500 text-sm mb-6">We are here for you. How would you like support?</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setMode("chat")}
                    className="bg-[#4A90D9] text-white font-semibold py-4 rounded-2xl hover:bg-[#357ABD] transition"
                  >
                    💬 Chat with someone
                  </button>
                  <button
                    onClick={() => window.location.href = "tel:9152987821"}
                    className="bg-[#7B5EA7] text-white font-semibold py-4 rounded-2xl hover:bg-[#6347A0] transition"
                  >
                    📞 Call iCall: 9152987821
                  </button>
                  <button
                    onClick={() => setMode("breathe")}
                    className="bg-[#f0fff7] text-green-700 font-semibold py-4 rounded-2xl hover:bg-green-50 transition border border-green-200"
                  >
                    🌿 Breathe with me
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-4">All conversations are private and confidential</p>
              </div>
            )}

            {mode === "chat" && (
              <div className="flex flex-col h-96">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setMode(null)} className="text-gray-400 hover:text-gray-600 text-sm">←</button>
                  <h2 className="font-semibold text-gray-800">Support Chat</h2>
                  <span className="ml-auto text-xs text-green-500 font-medium">● Online</span>
                </div>
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`text-sm px-4 py-2 rounded-2xl max-w-xs ${m.from === "user" ? "bg-[#4A90D9] text-white" : "bg-gray-100 text-gray-700"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type how you are feeling..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                  />
                  <button onClick={sendMessage} className="bg-[#4A90D9] text-white px-4 py-2 rounded-xl hover:bg-[#357ABD] transition text-sm font-medium">
                    Send
                  </button>
                </div>
              </div>
            )}

            {mode === "breathe" && (
              <div className="text-center py-4">
                <button onClick={() => setMode(null)} className="text-gray-400 hover:text-gray-600 text-sm mb-4 block">← Back</button>
                <div className="text-5xl mb-6 animate-pulse">🌿</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Breathe with me</h2>
                <p className="text-gray-500 text-sm mb-6">Follow this pattern to calm your nervous system</p>
                <div className="bg-[#f0fff7] rounded-2xl p-5 text-left flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👃</span>
                    <div>
                      <p className="font-medium text-gray-700 text-sm">Breathe IN — 4 seconds</p>
                      <p className="text-xs text-gray-400">Slowly through your nose</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏸️</span>
                    <div>
                      <p className="font-medium text-gray-700 text-sm">Hold — 4 seconds</p>
                      <p className="text-xs text-gray-400">Hold your breath gently</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💨</span>
                    <div>
                      <p className="font-medium text-gray-700 text-sm">Breathe OUT — 6 seconds</p>
                      <p className="text-xs text-gray-400">Slowly through your mouth</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">Repeat 4 to 5 times. You are doing great. 💙</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}