import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Hand, Check, X, Users, MessageSquare, Circle,
  Search, Settings, Play, ChevronRight, Mic, Video, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Editor from "@monaco-editor/react";
import api from "@/lib/axios";

const studentNames = [
  "Aarav", "Vivaan", "Aditya", "Diya", "Saanvi", "Ishaan", "Anaya", "Reyansh", "Myra", "Ayaan",
  "Kavya", "Arjun", "Aanya", "Krish", "Pari", "Vihaan", "Sara", "Atharv", "Riya", "Dev",
  "Tara", "Kabir", "Mira", "Yash", "Anika", "Rudra", "Avni", "Rohan", "Ira", "Aryan",
  "Zara", "Veer", "Inaya", "Shaurya", "Nia", "Karan", "Pia", "Laksh", "Aisha", "Aarush",
  "Kiara", "Reyaan", "Siya", "Advait", "Misha", "Ranveer", "Kyra", "Ayush", "Anvi", "Vihana",
  "Naira", "Aarit", "Nyra", "Hriday", "Eva", "Parth", "Ahaana", "Ojas", "Riaan", "Tanya",
];

const mentorNames = ["Prof. Sharma", "Dr. Mehta", "Anjali M.", "Rahul K.", "Priya S."];

type QueueItem = { id: string; name: string; topic: string; t: number };

const initialQueue: QueueItem[] = [
  { id: "q1", name: "Saanvi", topic: "Why does my recursion stack overflow?", t: Date.now() - 120000 },
  { id: "q2", name: "Ishaan", topic: "Confused about merge step in mergeSort", t: Date.now() - 60000 },
  { id: "q3", name: "Diya", topic: "Time complexity of slice() inside loop?", t: Date.now() - 20000 },
];

const codeLines = [
  { t: "// Today's lab: implement mergeSort", c: "text-editor-comment" },
  { t: "function mergeSort(arr) {", k: ["function"] },
  { t: "  if (arr.length <= 1) return arr;", k: ["if", "return"] },
  { t: "  const mid = Math.floor(arr.length / 2);", k: ["const"] },
  { t: "  const left = mergeSort(arr.slice(0, mid));", k: ["const"] },
  { t: "  const right = mergeSort(arr.slice(mid));", k: ["const"] },
  { t: "  return merge(left, right);", k: ["return"] },
  { t: "}", k: [] },
  { t: "" },
  { t: "function merge(left, right) {", k: ["function"] },
  { t: "  const result = [];", k: ["const"] },
  { t: "  let i = 0, j = 0;", k: ["let"] },
  { t: "  while (i < left.length && j < right.length) {", k: ["while"] },
  { t: "    // TODO: students complete this", c: "text-editor-comment" },
  { t: "  }", k: [] },
  { t: "  return [...result, ...left.slice(i), ...right.slice(j)];", k: ["return"] },
  { t: "}", k: [] },
];

const colorize = (line: string, keys: string[] = []) => {
  if (!line) return <>&nbsp;</>;
  const tokens = line.split(/(\s+|[(){}\[\],;.])/);
  return tokens.map((tok, i) => {
    if (keys.includes(tok)) return <span key={i} className="text-editor-keyword">{tok}</span>;
    if (/^\d+$/.test(tok)) return <span key={i} className="text-editor-num">{tok}</span>;
    if (/^(Math|console|merge|mergeSort|slice|floor|push)$/.test(tok)) return <span key={i} className="text-editor-fn">{tok}</span>;
    return <span key={i}>{tok}</span>;
  });
};

const Session = () => {
  const navigate = useNavigate();
  const { code = "MNT-DEMO1" } = useParams();
  const role: "mentor" | "student" = code.startsWith("MNT") ? "mentor" : "student";
  const username = localStorage.getItem("username") || "User";

  const [queue, setQueue] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [tab, setTab] = useState<"participants" | "queue" | "chat">("queue");
  const [search, setSearch] = useState("");
  const [editorContent, setEditorContent] = useState("// Welcome to Virtual Coding Lab\n\nfunction startCoding() {\n  console.log('Collaboration is live!');\n}\n\nstartCoding();");
  const [output, setOutput] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://virtuallab-1atg.onrender.com';
    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      client.subscribe(`/topic/session/${code}`, (message) => {
        const data = JSON.parse(message.body);
        if (data.senderId !== username) {
          setEditorContent(data.content);
        }
      });
      client.subscribe(`/topic/queue/${code}`, (message) => {
        setQueue(JSON.parse(message.body));
      });
      client.subscribe(`/topic/chat/${code}`, (message) => {
        setChatMessages((prev) => [...prev, JSON.parse(message.body)]);
      });
    };

    client.activate();
    stompClientRef.current = client;

    // Fetch initial queue and chat
    api.get(`/queue/session/${code}`).then(res => setQueue(res.data)).catch(console.error);
    api.get(`/chat/session/${code}`).then(res => setChatMessages(res.data)).catch(console.error);

    return () => {
      client.deactivate();
    };
  }, [code, username]);

  const handleEditorChange = (value: string | undefined) => {
    const val = value || "";
    setEditorContent(val);
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: `/app/session/${code}/sync`,
        body: JSON.stringify({
          sessionCode: code,
          content: val,
          senderId: username
        })
      });
    }
  };

  const filteredStudents = studentNames.filter((n) => n.toLowerCase().includes(search.toLowerCase()));
  const queuePosition = useMemo(() => Math.floor(Math.random() * 3) + 4, []);

  const raiseDoubt = async () => {
    const topics = ["Question on the loop condition", "Stuck on merge logic", "Index out of bounds?", "Can we review time complexity?"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    try {
      await api.post('/queue/request', { sessionCode: code, username, topic });
      toast.success("Doubt raised — mentor will be with you shortly!");
    } catch (e) {
      toast.error("Failed to raise doubt.");
    }
  };

  const resolveDoubt = async (id: string) => {
    try {
      await api.put(`/queue/resolve/${id}`);
      toast.success("Doubt resolved");
    } catch (e) {
      toast.error("Failed to resolve doubt.");
    }
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !stompClientRef.current?.connected) return;
    
    stompClientRef.current.publish({
      destination: `/app/session/${code}/chat`,
      body: JSON.stringify({ senderId: username, content: chatInput.trim() })
    });
    setChatInput("");
  };

  const runCode = () => {
    setOutput([`$ running code...`]);
    try {
      const logs: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        originalConsoleLog(...args);
      };
      
      const execute = new Function(editorContent);
      execute();
      
      console.log = originalConsoleLog;
      
      setOutput([`$ running code...`, ...logs, `✓ Execution finished successfully`]);
      toast.success("Code executed!");
    } catch (err: any) {
      setOutput([`$ running code...`, `✖ Error: ${err.message}`]);
      toast.error("Execution failed.");
    }
  };

  const handleEndSession = async () => {
    if (role === "mentor") {
      try {
        const res = await api.get(`/session/${code}/analytics`);
        setAnalytics(res.data);
        setShowAnalytics(true);
      } catch (e) {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-editor-bg overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between h-12 px-4 bg-card border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-primary">
              <Code2 className="h-3 w-3 text-primary-foreground" />
            </span>
            VCL
          </Link>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs font-mono text-muted-foreground">{code}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${role === "mentor" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
            {role}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Circle className="h-2 w-2 fill-success text-success animate-pulse" />
          <span>Live · {studentNames.length + mentorNames.length} connected</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon"><Mic className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={handleEndSession}><LogOut className="h-4 w-4" /></Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] overflow-hidden">
        {/* Editor */}
        <div className="flex flex-col bg-editor-bg overflow-hidden">
          {/* File tabs */}
          <div className="flex items-center bg-card/60 border-b border-border h-9 px-1">
            <div className="flex items-center gap-2 px-3 h-full bg-editor-bg border-r border-border text-xs">
              <Code2 className="h-3 w-3 text-editor-fn" /> mergeSort.js
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </div>
            <div className="flex items-center gap-2 px-3 h-full text-xs text-muted-foreground">
              README.md
            </div>
            <div className="ml-auto flex items-center gap-2 pr-3">
              <Button variant="hero" size="sm" onClick={runCode}>
                <Play className="h-3 w-3" /> Run
              </Button>
            </div>
          </div>

          {/* Code area */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={editorContent}
              onChange={handleEditorChange}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          {/* Terminal */}
          <div className="border-t border-border bg-card/60 h-32 flex flex-col">
            <div className="flex items-center gap-3 h-8 px-3 border-b border-border text-xs">
              <span className="text-foreground font-semibold">Terminal</span>
              <span className="text-muted-foreground">Output</span>
              <span className="text-muted-foreground">Problems</span>
            </div>
            <div className="flex-1 px-3 py-2 font-mono text-xs text-editor-comment overflow-auto">
              {output.length === 0 ? (
                <div><span className="text-editor-fn">$</span> <span className="inline-block w-2 h-3 bg-foreground animate-pulse align-middle" /></div>
              ) : (
                output.map((line, i) => (
                  <div key={i} className={line.includes("✖") ? "text-destructive" : line.includes("✓") ? "text-success" : "text-foreground"}>
                    {line.startsWith("$") ? <><span className="text-editor-fn">$</span> {line.replace("$ ", "")}</> : line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="border-l border-border bg-card/40 flex flex-col overflow-hidden">
          <div className="flex border-b border-border">
            {([
              { id: "queue", label: "Queue", icon: Hand, count: queue.length },
              { id: "chat", label: "Chat", icon: MessageSquare, count: chatMessages.length },
              { id: "participants", label: "People", icon: Users, count: studentNames.length + mentorNames.length },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
                <span className="text-xs px-1.5 py-0.5 rounded bg-secondary">{t.count}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {tab === "queue" ? (
                <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-3">
                  {role === "student" && (
                    <Button onClick={raiseDoubt} variant="hero" size="lg" className="w-full animate-pulse-glow">
                      <Hand className="h-4 w-4" /> Raise Doubt
                    </Button>
                  )}
                  {role === "mentor" && (
                    <div className="text-xs text-muted-foreground mb-2">
                      Students waiting · resolve in order
                    </div>
                  )}

                  {queue.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      <Check className="h-8 w-8 mx-auto mb-2 text-success" />
                      No doubts in queue 🎉
                    </div>
                  )}

                  {queue.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass rounded-xl p-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`grid h-8 w-8 place-items-center rounded-lg flex-shrink-0 text-xs font-bold ${idx === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-secondary"}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{item.username}</span>
                            <span className="text-[10px] text-muted-foreground">{Math.max(1, Math.round((Date.now() - new Date(item.createdAt).getTime()) / 60000))}m</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.topic}</p>
                          {role === "mentor" && (
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="hero" className="h-7 text-xs" onClick={() => resolveDoubt(item.id)}>
                                <Check className="h-3 w-3" /> Resolve
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs">
                                <ChevronRight className="h-3 w-3" /> Skip
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {role === "student" && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      Estimated wait: ~{queuePosition} mins
                    </div>
                  )}
                </motion.div>
              ) : tab === "chat" ? (
                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        No messages yet. Say hi! 👋
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.senderId === username ? "items-end" : "items-start"}`}>
                        <span className="text-[10px] text-muted-foreground mb-1">{msg.senderId}</span>
                        <div className={`px-3 py-2 text-sm ${msg.senderId === username ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" : "bg-secondary rounded-2xl rounded-tl-sm"}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border mt-auto">
                    <form onSubmit={sendChatMessage} className="flex gap-2">
                      <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="h-9" />
                      <Button type="submit" size="sm" variant="hero">Send</Button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="people" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search people…"
                      className="pl-9 h-9 bg-secondary/50"
                    />
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                    Mentors · {mentorNames.length}
                  </div>
                  <div className="space-y-1 mb-4">
                    {mentorNames.map((n) => <PersonRow key={n} name={n} role="mentor" />)}
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                    Students · {filteredStudents.length}
                  </div>
                  <div className="space-y-1">
                    {filteredStudents.map((n) => <PersonRow key={n} name={n} role="student" />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {showAnalytics && analytics && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass gradient-border rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
              <h2 className="font-display text-2xl font-bold mb-6 text-center">Session Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-muted-foreground">Session Duration</span>
                  <span className="font-bold">{analytics.durationMinutes} mins</span>
                </div>
                <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-muted-foreground">Total Doubts Raised</span>
                  <span className="font-bold">{analytics.totalDoubts}</span>
                </div>
                <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-muted-foreground">Total Chat Messages</span>
                  <span className="font-bold">{analytics.totalMessages}</span>
                </div>
              </div>
              <Button asChild variant="hero" className="w-full mt-8">
                <Link to="/dashboard">End Session</Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PersonRow = ({ name, role }: { name: string; role: "mentor" | "student" }) => {
  const initial = name[0];
  const online = Math.random() > 0.15;
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
      <div className="relative">
        <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${role === "mentor" ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
          {initial}
        </div>
        <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-card ${online ? "bg-success" : "bg-muted-foreground"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">{name}</div>
        <div className="text-[10px] text-muted-foreground capitalize">{role}</div>
      </div>
    </div>
  );
};

export default Session;
