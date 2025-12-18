import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

const AdminContent = () => {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase.from("content_pages").select("*");
      if (error) throw error;
      setPages(data || []);
      if (data && data.length > 0) {
        setEditingPage(data[0]);
      }
    } catch (error: any) {
      toast.error("Failed to fetch content pages");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingPage) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("content_pages")
        .update({
          title: editingPage.title,
          content: editingPage.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingPage.id);

      if (error) throw error;
      toast.success("Content updated successfully");
      fetchPages();
    } catch (error: any) {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Management</h1>
          <p className="text-slate-600 mt-1">Edit website pages and content</p>
        </div>

        <Tabs defaultValue={pages[0]?.id || ""} className="space-y-4">
          <TabsList>
            {pages.map((page) => (
              <TabsTrigger key={page.id} value={page.id}>
                {page.slug}
              </TabsTrigger>
            ))}
          </TabsList>

          {pages.map((page) => (
            <TabsContent key={page.id} value={page.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                  <CardDescription>
                    Last updated: {new Date(page.updated_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Page Title</label>
                    <Input
                      value={page.title}
                      onChange={(e) =>
                        editingPage?.id === page.id &&
                        setEditingPage({ ...editingPage, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                      value={page.content}
                      onChange={(e) =>
                        editingPage?.id === page.id &&
                        setEditingPage({ ...editingPage, content: e.target.value })
                      }
                      className="w-full p-3 border border-slate-300 rounded-md font-mono text-sm"
                      rows={15}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingPage(page);
                        handleSave();
                      }}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
