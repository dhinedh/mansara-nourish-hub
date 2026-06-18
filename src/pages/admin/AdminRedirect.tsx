// src/pages/admin/AdminRedirect.tsx
// Admin access has been moved to the CRM Portal.
// This page redirects admins/dealers to https://crm.mansarafoods.com

import { useEffect, useState } from "react";
import { ExternalLink, ShieldAlert, ArrowRight } from "lucide-react";

const CRM_PORTAL_URL = "https://crm.mansarafoods.com";

export default function AdminRedirect() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = CRM_PORTAL_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-md w-full">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/logo.png" alt="Mansara Foods" className="h-8 w-auto object-contain opacity-90" />
            <span className="text-white font-bold text-lg tracking-wide">Mansara Foods</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Admin Access Moved
          </h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            The admin panel has been consolidated into the{" "}
            <span className="text-rose-400 font-semibold">Mansara CRM Portal</span>.
            All admins and dealers must log in from there.
          </p>

          {/* Redirect info */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 mb-6">
            <p className="text-slate-400 text-xs mb-1">Redirecting you to</p>
            <p className="text-white font-mono text-sm font-semibold truncate">
              {CRM_PORTAL_URL}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < 5 - countdown ? "bg-rose-500" : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-400 text-xs">
                in {countdown}s
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href={CRM_PORTAL_URL}
            className="group flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-rose-900/30 hover:shadow-rose-900/50 mb-3"
          >
            <span>Go to CRM Portal Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="/"
            className="flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors py-2"
          >
            ← Back to Mansara Foods Store
          </a>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs mt-6 flex items-center justify-center gap-1.5">
          <ExternalLink className="w-3 h-3" />
          Customers: Please use the{" "}
          <a href="/login" className="text-slate-400 hover:text-white underline underline-offset-2">
            store login
          </a>
        </p>
      </div>
    </div>
  );
}
