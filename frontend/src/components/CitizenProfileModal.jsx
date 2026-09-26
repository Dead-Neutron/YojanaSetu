"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, LogOut, CheckCircle2, Save, Sliders, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
];

const OCCUPATIONS = [
  "Farmer", "Student", "Construction / Unorganized Worker", "Artisan",
  "Fisherman", "Entrepreneur / MSME", "All Citizens"
];

const GENDERS = ["Female", "Male", "Transgender", "All"];
const CASTES = ["General", "OBC", "SC", "ST", "EWS"];

export default function CitizenProfileModal({ isOpen, onClose }) {
  const router = useRouter();
  const { user, logout, updateDemographics } = useAuth();

  // Initialize with user's saved demographics, or empty string for first-time citizens
  const [state, setState] = useState(user?.demographics?.state || "");
  const [occupation, setOccupation] = useState(user?.demographics?.occupation || "");
  const [gender, setGender] = useState(user?.demographics?.gender || "");
  const [caste, setCaste] = useState(user?.demographics?.caste || "");
  const [age, setAge] = useState(user?.demographics?.age ?? "");
  const [isSaved, setIsSaved] = useState(false);

  // Sync state whenever modal opens or user demographics load/change from DB
  useEffect(() => {
    if (isOpen) {
      setState(user?.demographics?.state || "");
      setOccupation(user?.demographics?.occupation || "");
      setGender(user?.demographics?.gender || "");
      setCaste(user?.demographics?.caste || "");
      setAge(user?.demographics?.age ?? "");
    }
  }, [isOpen, user?.demographics]);

  if (!isOpen || !user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    await updateDemographics({
      state: state || null,
      occupation: occupation || null,
      gender: gender || null,
      caste: caste || null,
      age: age ? parseInt(age, 10) : null,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 z-[90] flex items-center justify-center p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citizen-profile-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900/95 border border-white/[0.12] rounded-3xl max-w-lg w-full text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-2xl"
      >
        {/* Modal Header */}
        <div className="bg-slate-850 p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="citizen-profile-title" className="text-xl font-extrabold text-slate-50 tracking-tight">
                  {user.name}
                </h2>
                <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  <Shield className="w-3 h-3" />
                  Verified Citizen
                </span>
              </div>
              <span className="text-xs text-amber-400/90 font-medium">
                {user.email || user.sub}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
          <div className="bg-slate-800/50 border border-white/[0.06] rounded-2xl p-4 flex items-start gap-3">
            <Sliders className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Your demographic profile securely persists in the national database to pre-filter welfare schemes in the search portal and provide precise AI recommendations.
            </p>
          </div>

          <div className="space-y-4">
            {/* State Selection */}
            <div>
              <label htmlFor="profile-state" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                State of Residence
              </label>
              <select
                id="profile-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-white/[0.1] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-slate-300">-- Select State of Residence --</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-slate-100">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Occupation Selection */}
            <div>
              <label htmlFor="profile-occupation" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Occupation
              </label>
              <select
                id="profile-occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-white/[0.1] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-slate-300">-- Select Primary Occupation --</option>
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ} className="bg-slate-900 text-slate-100">
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender & Age row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="profile-gender" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  id="profile-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 bg-slate-800/80 border border-white/[0.1] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900 text-slate-300">-- Select Gender --</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g} className="bg-slate-900 text-slate-100">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="profile-age" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Age
                </label>
                <input
                  id="profile-age"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 35"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 bg-slate-800/80 border border-white/[0.1] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none placeholder-slate-400"
                />
              </div>
            </div>

            {/* Social / Caste Category */}
            <div>
              <label htmlFor="profile-caste" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Social / Caste Category
              </label>
              <select
                id="profile-caste"
                value={caste}
                onChange={(e) => setCaste(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-white/[0.1] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-slate-300">-- Select Category / Caste --</option>
                {CASTES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-100">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Recommendations Navigation Callout */}
          {(state || user?.demographics?.state) && (
            <div className="bg-slate-800/60 border border-amber-500/25 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Ready to see your eligible welfare schemes?
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/recommendations");
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Schemes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Action Buttons (Solid Fills, Borderless, No Multi-Stop Gradients) */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-red-500/40 text-red-300 hover:text-white hover:bg-red-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out to Guest</span>
            </button>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Demographic Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
