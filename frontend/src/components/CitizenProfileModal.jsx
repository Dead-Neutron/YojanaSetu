"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
      className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citizen-profile-title"
    >
      <div className="bg-[#1A365D] border border-[#23487A] rounded-2xl max-w-lg w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#122844] p-6 border-b border-[#23487A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B] text-[#171717] font-black text-lg flex items-center justify-center shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="citizen-profile-title" className="text-lg font-black text-white">
                  {user.name}
                </h2>
                <span className="inline-flex items-center gap-1 bg-[#059669]/20 text-[#34D399] border border-[#059669]/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  <Shield className="w-3 h-3" />
                  Verified Citizen
                </span>
              </div>
              <span className="text-xs text-slate-300 font-medium">
                {user.email || user.sub}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-[#23487A] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
          <div className="bg-[#0B1E36] border border-[#23487A] rounded-xl p-3.5 flex items-start gap-2.5">
            <Sliders className="w-4 h-4 text-[#00A3C4] shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Your demographic profile is securely saved in the database. It pre-filters welfare schemes in the search portal and tunes the voice assistant for personalized eligibility matching.
            </p>
          </div>

          <div className="space-y-4">
            {/* State Selection */}
            <div>
              <label htmlFor="profile-state" className="block text-xs font-bold text-slate-300 uppercase mb-1">
                State of Residence
              </label>
              <select
                id="profile-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 bg-[#122844] border border-[#23487A] rounded-xl text-sm font-semibold text-white focus:border-[#00A3C4] focus:outline-none"
              >
                <option value="">-- Select State of Residence --</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Occupation Selection */}
            <div>
              <label htmlFor="profile-occupation" className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Primary Occupation
              </label>
              <select
                id="profile-occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full p-2.5 bg-[#122844] border border-[#23487A] rounded-xl text-sm font-semibold text-white focus:border-[#00A3C4] focus:outline-none"
              >
                <option value="">-- Select Primary Occupation --</option>
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender & Age row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="profile-gender" className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Gender
                </label>
                <select
                  id="profile-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 bg-[#122844] border border-[#23487A] rounded-xl text-sm font-semibold text-white focus:border-[#00A3C4] focus:outline-none"
                >
                  <option value="">-- Select Gender --</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="profile-age" className="block text-xs font-bold text-slate-300 uppercase mb-1">
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
                  className="w-full p-2.5 bg-[#122844] border border-[#23487A] rounded-xl text-sm font-semibold text-white focus:border-[#00A3C4] focus:outline-none placeholder-slate-500"
                />
              </div>
            </div>

            {/* Social / Caste Category */}
            <div>
              <label htmlFor="profile-caste" className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Social / Caste Category
              </label>
              <select
                id="profile-caste"
                value={caste}
                onChange={(e) => setCaste(e.target.value)}
                className="w-full p-2.5 bg-[#122844] border border-[#23487A] rounded-xl text-sm font-semibold text-white focus:border-[#00A3C4] focus:outline-none"
              >
                <option value="">-- Select Category / Caste --</option>
                {CASTES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Recommendations Navigation Callout */}
          {(state || user?.demographics?.state) && (
            <div className="bg-[#0B1E36] border border-[#00A3C4]/30 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
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
                className="text-xs text-[#F59E0B] hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Schemes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
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
              className="bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#171717]" />
                  <span>Preferences Saved to Database!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Demographic Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
