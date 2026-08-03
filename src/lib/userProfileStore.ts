import { useState } from "react";

export interface UserProfileState {
  name: string;
  handle: string;
  email: string;
  role: string;
  avatarUrl: string;
  verified: boolean;
}

export const CARTOON_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=VeritasCyber",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Shadow",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/micah/svg?seed=Alex",
  "https://api.dicebear.com/7.x/bottts/svg?seed=GamerPro",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80",
];

const DEFAULT_PROFILE: UserProfileState = {
  name: "Veritas Cyber Analyst",
  handle: "@veritas_analyst",
  email: "analyst@veritas.news",
  role: "Verified Truth Analyst • Tier 1",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=VeritasCyber",
  verified: true,
};

export function useUserProfile() {
  const [profile, setProfileState] = useState<UserProfileState>(() => {
    if (typeof window === "undefined") return DEFAULT_PROFILE;
    try {
      const saved = localStorage.getItem("veritas_user_profile");
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const updateProfile = (patch: Partial<UserProfileState>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem("veritas_user_profile", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return { profile, updateProfile };
}
