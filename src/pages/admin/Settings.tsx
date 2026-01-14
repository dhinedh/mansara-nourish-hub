import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { PermissionGate } from "@/components/PermissionGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSettings, updateSettings, changePassword, updateProfile } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Settings {
  website_name: string;
  contact_email: string;
  phone_number: string;
  address: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    website_name: "MANSARA Foods",
    contact_email: "contact@mansarafoods.com",
    phone_number: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  // Profile Update State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    loadSettings();
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      toast.success("Settings saved successfully");
    } catch (error: any) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const updateProfileDetails = async () => {
    setProfileLoading(true);
    try {
      const token = localStorage.getItem('mansara-token');
      if (!token) throw new Error("Not authenticated");

      await updateProfile(profileData, token);

      // Update local storage so refresh persists it immediately
      const storedUser = localStorage.getItem('mansara-user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        localStorage.setItem('mansara-user', JSON.stringify({ ...parsed, ...profileData }));
      }

      toast.success("Profile updated successfully. Please refresh to see changes.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const submitPasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('mansara-token');
      if (!token) throw new Error("Not authenticated");

      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, token);

      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Configure your website settings</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic website information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Website Name</label>
                  <Input
                    name="website_name"
                    value={settings.website_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <Input
                    name="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    name="phone_number"
                    value={settings.phone_number}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Input
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="pt-4">
                  <PermissionGate module="settings" requiredLevel="limited">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save General Settings"}
                    </Button>
                  </PermissionGate>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Facebook URL</label>
                  <Input
                    name="facebook_url"
                    value={settings.facebook_url || ""}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram URL</label>
                  <Input
                    name="instagram_url"
                    value={settings.instagram_url || ""}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Twitter URL</label>
                  <Input
                    name="twitter_url"
                    value={settings.twitter_url || ""}
                    onChange={handleChange}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="pt-4">
                  <PermissionGate module="settings" requiredLevel="limited">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save Social Settings"}
                    </Button>
                  </PermissionGate>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                {/* Profile Section */}
                <div className="space-y-4 pb-6 border-b">
                  <h3 className="text-lg font-medium">Profile Details</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">User ID</label>
                    <Input
                      value={user?.id || ""}
                      readOnly
                      className="bg-slate-50 text-slate-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="pt-2">
                    <Button onClick={updateProfileDetails} disabled={profileLoading}>
                      {profileLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <Input
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <Input
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password (min 6 chars)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="pt-4">
                    <Button onClick={submitPasswordChange} disabled={passwordLoading} variant="destructive">
                      {passwordLoading ? "Updating..." : "Change Password"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
