import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContent, PageContent } from "@/context/ContentContext";

// Config defining which fields are editable for each page
const PAGE_CONFIG: Record<string, { title: string; fields: { key: string; label: string; type: 'text' | 'textarea' }[] }> = {
  about: {
    title: "About Us",
    fields: [
      { key: "story", label: "Our Story", type: "textarea" },
      { key: "mission", label: "Our Mission", type: "textarea" },
      { key: "vision", label: "Our Vision", type: "textarea" },
      { key: "founder_note", label: "Founder's Note", type: "textarea" },
    ]
  },
  contact: {
    title: "Contact Us",
    fields: [
      { key: "intro", label: "Intro Text", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "email", label: "Email Address", type: "text" },
      { key: "phone", label: "Phone Number", type: "text" },
    ]
  },
  home_highlights: {
    title: "Home Highlights",
    fields: [
      { key: "offers_title", label: "Offers - Title", type: "text" },
      { key: "offers_description", label: "Offers - Description", type: "textarea" },
      { key: "combos_title", label: "Combos - Title", type: "text" },
      { key: "combos_description", label: "Combos - Description", type: "textarea" },
      { key: "new_arrivals_title", label: "New Arrivals - Title", type: "text" },
      { key: "new_arrivals_description", label: "New Arrivals - Description", type: "textarea" },
    ]
  }
};

const AdminContent = () => {
  const { contents, updateContent } = useContent();
  const [activeTab, setActiveTab] = useState<string>("about");
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Load initial data when tab changes or contents load
  const loadData = (slug: string) => {
    const page = contents.find(p => p.slug === slug);
    if (page) {
      setFormData(page.sections);
    } else {
      setFormData({});
    }
  };

  // Sync when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    loadData(value);
  };

  // Sync when contents context changes (initial load)
  useState(() => {
    loadData(activeTab);
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      Object.entries(formData).forEach(([key, value]) => {
        updateContent(activeTab, key, value);
      });
      toast.success(`${PAGE_CONFIG[activeTab].title} updated successfully`);
    } catch (error) {
      toast.error("Failed to save content");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Management</h1>
          <p className="text-slate-600 mt-1">Edit website text content</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            {Object.keys(PAGE_CONFIG).map((slug) => (
              <TabsTrigger key={slug} value={slug} className="capitalize">
                {slug}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(PAGE_CONFIG).map(([slug, config]) => (
            <TabsContent key={slug} value={slug}>
              <Card>
                <CardHeader>
                  <CardTitle>{config.title}</CardTitle>
                  <CardDescription>
                    Update the textual content for the {config.title} page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {config.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium mb-2 text-slate-700">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={formData[field.key] || ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="w-full p-3 border border-slate-300 rounded-md font-sans text-sm min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      ) : (
                        <Input
                          value={formData[field.key] || ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} className="min-w-[150px]">
                      Save Changes
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
