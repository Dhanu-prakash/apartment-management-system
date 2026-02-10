import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getNotices, setNotices } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { toast } from "sonner";

export default function PostNotice() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const notices = getNotices();
    const newNotice = { id: `n${Date.now()}`, title: title.trim(), content: content.trim(), postedBy: user!.id, postedByName: user!.name, createdAt: new Date().toISOString() };
    setNotices([newNotice, ...notices]);
    setTitle(""); setContent("");
    toast.success("Notice posted successfully");
  };

  return (
    <Card className="shadow-sm max-w-2xl">
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Post a Notice</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handlePost} className="space-y-4">
          <div className="space-y-1.5"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notice title" required /></div>
          <div className="space-y-1.5"><Label>Content</Label><Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your notice..." rows={4} required /></div>
          <Button type="submit"><Bell className="w-4 h-4 mr-2" /> Post Notice</Button>
        </form>
      </CardContent>
    </Card>
  );
}
