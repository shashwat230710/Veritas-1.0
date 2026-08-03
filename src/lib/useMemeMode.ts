import { useState, useEffect } from "react";

export function useMemeMode() {
  const [memeMode, setMemeModeState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("veritas_meme_mode") === "true";
  });

  useEffect(() => {
    const handleStorage = () => {
      setMemeModeState(localStorage.getItem("veritas_meme_mode") === "true");
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("veritas_meme_mode_changed", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("veritas_meme_mode_changed", handleStorage);
    };
  }, []);

  const setMemeMode = (enabled: boolean) => {
    setMemeModeState(enabled);
    localStorage.setItem("veritas_meme_mode", String(enabled));
    window.dispatchEvent(new Event("veritas_meme_mode_changed"));
  };

  return { memeMode, setMemeMode };
}
