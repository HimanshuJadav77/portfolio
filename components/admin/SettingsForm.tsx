"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Plus, Trash2, Check, AlertCircle, Loader2, Cpu, Eye } from "lucide-react";
import { SiteSettings, TelemetryItem } from "@/types/site";

interface SettingsFormProps {
  initialSettings: SiteSettings | null;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    siteName: initialSettings?.siteName || "Himanshu Jadav",
    tagline: initialSettings?.tagline || "Software Engineer — Building Systems That Move Data",
    heroStatement: initialSettings?.heroStatement || "I BUILD SYSTEMS THAT MOVE DATA.",
    telemetry: initialSettings?.telemetry || [
      { label: "REGION", value: "IN-WEST" },
      { label: "STACK", value: "FLUTTER + NODE + NEXT" },
      { label: "SYS_STATUS", value: "OPTIMAL" },
      { label: "UPTIME", value: "99.98%" },
    ],
    maintenanceMode: Boolean(initialSettings?.maintenanceMode),
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTelemetryChange = (index: number, field: keyof TelemetryItem, value: string) => {
    setFormData((prev) => {
      const nextTelemetry = [...prev.telemetry];
      nextTelemetry[index] = { ...nextTelemetry[index], [field]: value };
      return { ...prev, telemetry: nextTelemetry };
    });
  };

  const handleAddTelemetry = () => {
    setFormData((prev) => ({
      ...prev,
      telemetry: [...prev.telemetry, { label: "METRIC", value: "VALUE" }],
    }));
  };

  const handleRemoveTelemetry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      telemetry: prev.telemetry.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update settings");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground mb-1.5">ADMIN / SETTINGS</p>
        <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">Settings</h1>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm"
        >
          <Check className="w-5 h-5 shrink-0" />
          <span>Site settings saved to Firestore successfully!</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Branding Card */}
        <div className="border border-border rounded-lg p-6 space-y-6 bg-card">
          <h2 className="font-display text-lg font-medium text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            General Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="set-name" className="label-field">Site Name / Logo Text</label>
              <input
                id="set-name"
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="set-tagline" className="label-field">SEO Meta Tagline</label>
              <input
                id="set-tagline"
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="set-hero" className="label-field">
              Cinematic Hero Statement (Displayed in Main Hero)
            </label>
            <input
              id="set-hero"
              type="text"
              required
              value={formData.heroStatement}
              onChange={(e) => setFormData({ ...formData, heroStatement: e.target.value })}
              className="input-field font-display text-lg tracking-tight"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-black/40 border border-border/30">
            <p className="caption text-muted-foreground mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" />
              HERO STATEMENT PREVIEW
            </p>
            <p className="heading-3 font-light text-foreground text-center py-4">
              {formData.heroStatement || "I BUILD SYSTEMS THAT MOVE DATA."}
            </p>
          </div>
        </div>

        {/* Telemetry HUD Card */}
        <div className="border border-border rounded-lg p-6 space-y-6 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-medium text-foreground flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                Live Telemetry Indicators
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Monitored telemetry badges displayed in the footer and technical widgets.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTelemetry}
              className="btn-outline px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD METRIC
            </button>
          </div>

          <div className="space-y-4">
            {formData.telemetry.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl bg-card border border-border/30"
              >
                <div className="sm:w-1/3">
                  <label htmlFor={`tele-label-${index}`} className="sr-only">Label</label>
                  <input
                    id={`tele-label-${index}`}
                    type="text"
                    placeholder="LABEL (e.g. REGION)"
                    value={item.label}
                    onChange={(e) => handleTelemetryChange(index, "label", e.target.value)}
                    className="input-field text-xs font-mono uppercase"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor={`tele-val-${index}`} className="sr-only">Value</label>
                  <input
                    id={`tele-val-${index}`}
                    type="text"
                    placeholder="VALUE (e.g. US-EAST / 99.9%)"
                    value={item.value}
                    onChange={(e) => handleTelemetryChange(index, "value", e.target.value)}
                    className="input-field text-xs font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTelemetry(index)}
                  className="p-2 rounded-lg hover:bg-error/10 text-muted-foreground hover:text-error transition-colors self-end sm:self-auto"
                  aria-label={`Remove telemetry item ${item.label}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Mode Card */}
        <div className="border border-border rounded-lg p-6 space-y-4 bg-card flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-medium text-foreground">Maintenance Mode</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Temporarily show a maintenance notice to public visitors while allowing admin access.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.maintenanceMode}
              onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary min-w-[160px] cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                SAVING...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                SAVE SETTINGS
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
