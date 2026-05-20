"use client";
import { useState } from "react";
import Link from "next/link";
import SOSModal from "@/components/shared/SOSModal";
import { createClient } from "@/lib/supabase/client";

const topics = ["All", "Anxiety", "Depression", "Grief", "LGBTQ+", "Relationships", "Work Stress", "Self Care", "Addiction", "Students"];

const posts = [
  { id: 1, topic: "Anxiety", content: "Does anyone else feel anxious for no reason at all? Like everything is fine but your heart is racing and you can't explain why.", author: "Anonymous", time: "2 mins ago", likes: 14, replies: 6 },
  { id: 2, topic: "Self Care", content: "Small win today — I actually went for a walk after weeks of not leaving my room. It felt really good. Sharing for anyone who needs to hear that small steps count.", author: "Meera S.", time: "15 mins ago", likes: 42, replies: 11 },
  { id: 3, topic: "Work Stress", content: "I've been working 14 hour days for 3 months straight. I don't know how to stop. My manager expects it and I'm scared to say no. Anyone been through this?", author: "Anonymous", time: "1 hour ago", likes: 28, replies: 15 },
  { id: 4, topic: "Grief", content: "Lost my dad 6 months ago. People keep saying it gets easier but some days it really doesn't. Just wanted a place to say that out loud.", author: "Rohan K.", time: "2 hours ago", likes: 67, replies: 23 },
  { id: 5, topic: "LGBTQ+", content: "Coming out to my parents next week. Terrified but also tired of hiding. Any advice or just words of encouragement would mean the world.", author: "Anonymous", time: "3 hours ago", likes: 89, replies: 34 },
  { id: 6, topic: "Students", content: "Board exam pressure is killing me. I sleep 4 hours, study all day, and still feel like I'm not doing enough. Is this normal?", author: "Priya M.", time: "5 hours ago", likes: 55, replies: 19 },
];

export default function Community() {
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [isAnon, setIsAnon] = useState(true);
  const [localPosts, setLocalPosts] = useState(posts);
  const [liked, setLiked] = useState<number[]>([]);

  const filtered = selectedTopic === "All" ? localPosts : localPosts.filter((p) => p.topic === selectedTopic);

  const submitPost = async () => {
    if (!newPost.trim()) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("community_posts").insert({
        user_id: user.id,
        topic: selectedTopic === "All" ? "General" : selectedTopic,
        content: newPost,
        is_anonymous: isAnon,
      });
    }

    setLocalPosts((prev) => [{
      id: Date.now(),
      topic: selectedTopic === "All" ? "General" : selectedTopic,
      content: newPost,
      author: isAnon ? "Anonymous" : "You",
      time: "Just now",
      likes: 0,
      replies: 0,
    }, ...prev]);
    setNewPost("");
    setShowForm(false);
  };

  const toggleLike = (id: number) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#f7f0ff] to-[#f0fff7]">
      <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm shadow-sm">
        <Link href="/" className="text-2xl font-bold text-[#4A90D9]">
          Mind<span className="text-[#7B5EA7]">Bridge</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-[#4A90D9] transition">
          ← Dashboard
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Community</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#4A90D9] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#357ABD] transition"
          >
            + Share
          </button>
        </div>
        <p className="text-gray-500 mb-6">A safe, moderated space to share and support each other.</p>

        {showForm && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share what's on your mind... this is a safe space."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9] resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnon}
                  onChange={(e) => setIsAnon(e.target.checked)}
                  className="accent-[#4A90D9]"
                />
                Post anonymously
              </label>
              <button
                onClick={submitPost}
                className="bg-[#4A90D9] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#357ABD] transition"
              >
                Post
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap mb-6">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                selectedTopic === t
                  ? "bg-[#7B5EA7] text-white border-[#7B5EA7]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#7B5EA7]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {filtered.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-[#f0f7ff] text-[#4A90D9] px-2 py-0.5 rounded-full font-medium">{post.topic}</span>
                <span className="text-xs text-gray-400">{post.author} · {post.time}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1 text-xs transition ${liked.includes(post.id) ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
                >
                  {liked.includes(post.id) ? "❤️" : "🤍"} {post.likes + (liked.includes(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#4A90D9] transition">
                  💬 {post.replies} replies
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SOSModal />
    </main>
  );
}