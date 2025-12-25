import { useState } from "react";
import { Save, Upload, Globe, Mail, Shield, Bell } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "ShopMate",
    siteDescription: "Your trusted e-commerce platform",
    contactEmail: "admin@shopmate.com",
    supportEmail: "support@shopmate.com",
    currency: "INR",
    taxRate: 13,
    shippingFee: 50,
    freeShippingThreshold: 1000,
    enableNotifications: true,
    enableReviews: true,
    enableWishlist: true,
    maintenanceMode: false
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your store settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            General Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Contact Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Pricing Settings */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Pricing Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Tax Rate (%)</label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.shippingFee}
                onChange={(e) => handleInputChange('shippingFee', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Feature Settings
          </h2>
          <div className="space-y-4">
            {[
              { key: 'enableNotifications', label: 'Enable Notifications' },
              { key: 'enableReviews', label: 'Enable Product Reviews' },
              { key: 'enableWishlist', label: 'Enable Wishlist' },
              { key: 'maintenanceMode', label: 'Maintenance Mode' }
            ].map((feature) => (
              <div key={feature.key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">{feature.label}</label>
                <button
                  onClick={() => handleInputChange(feature.key, !settings[feature.key])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[feature.key] ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[feature.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;