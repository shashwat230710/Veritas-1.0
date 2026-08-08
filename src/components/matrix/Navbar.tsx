import React, { useState } from "react";
import { Search, Menu, Sun, Moon, User, ChevronDown, Radio, Sparkles, Shield, X, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenSearch: () => void;
  onOpenChatDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenChatDrawer,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");

  const navCategories = [
    "HOME",
    "CULTURE",
    "ECONOMY",
    "POLITICS",
    "SCIENCE",
    "TECHNOLOGY",
    "TRAVEL",
    "WORLD",
    "ABOUT",
    "CONTACT",
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-slate-800/80 text-white select-none transition-all">
      {/* Top Editorial Header (Exact Reference Match to Daily News) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-slate-900">
        {/* Left Action Buttons: Hamburger & Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Center Title Branding (Daily News / Truth Engine) */}
        <div className="text-center group cursor-pointer" onClick={() => onSelectCategory("HOME")}>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase drop-shadow-md group-hover:text-slate-200 transition-colors">
            Daily News
          </h1>
          <p className="text-[0.68rem] tracking-widest text-slate-400 font-serif italic pt-0.5">
            All voices matter • AI Truth Engine Matrix
          </p>
        </div>

        {/* Right CTA Actions: Sign In & Subscribe Now Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenChatDrawer}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <User className="h-4 w-4 text-orange-400" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onOpenChatDrawer}
            className="bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-white/10 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Subscribe Now
          </button>
        </div>
      </div>

      {/* Sub-Navigation Categories Bar (Search Icon + Links + Language Dropdown) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        {/* Search Icon Trigger */}
        <button
          onClick={onOpenSearch}
          className="p-1.5 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
          title="Search articles & verify claims (Ctrl+K)"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Categories List */}
        <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar flex-1 justify-start md:justify-center">
          {navCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={cn(
                  "relative py-1 text-xs font-mono font-bold tracking-wider transition-colors whitespace-nowrap uppercase cursor-pointer",
                  isActive ? "text-white font-extrabold" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {cat}
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-sm shadow-cyan-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Language Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white cursor-pointer shrink-0">
          <span>{selectedLang}</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-800 bg-[#090d16] p-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              {navCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "text-left py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-colors",
                    activeCategory === cat
                      ? "bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40"
                      : "text-slate-300 hover:bg-slate-800"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
