import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { calculators } from "@/lib/calculators/registry";
import { getCategory } from "@/lib/calculators/categories";
import { cn } from "@/lib/utils";
import type { CalculatorDef } from "@/lib/calculators/types";

interface Props {
  variant?: "hero" | "compact";
  placeholder?: string;
  className?: string;
  maxResults?: number;
}

function scoreCalc(calc: CalculatorDef, q: string): number {
  const name = calc.name.toLowerCase();
  const cat = getCategory(calc.category)?.name.toLowerCase() ?? "";
  const desc = (calc.shortDescription + " " + calc.description).toLowerCase();
  const kw = calc.keywords.join(" ").toLowerCase();
  if (name.startsWith(q)) return 100;
  if (name.includes(q)) return 80;
  if (kw.includes(q)) return 60;
  if (cat.includes(q)) return 40;
  if (desc.includes(q)) return 20;
  return 0;
}

export function CalculatorSearch({
  variant = "hero",
  placeholder = "Rechner suchen …",
  className,
  maxResults = 8,
}: Props) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return calculators
      .map((c) => ({ calc: c, score: scoreCalc(c, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map((r) => r.calc);
  }, [query, maxResults]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const showDropdown = open && query.trim().length > 0;

  const goTo = (slug: string) => {
    setOpen(false);
    setQuery("");
    navigate({ to: "/rechner/$slug", params: { slug } });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) {
      if (e.key === "Escape") inputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = results[activeIndex];
      if (c) goTo(c.slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-border bg-background/80 shadow-sm backdrop-blur transition-colors focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20",
          isHero ? "px-4 py-3" : "px-3 py-2",
        )}
      >
        <Search
          aria-hidden
          className={cn("shrink-0 text-muted-foreground", isHero ? "h-5 w-5" : "h-4 w-4")}
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && results[activeIndex]
              ? `${listboxId}-opt-${activeIndex}`
              : undefined
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Rechner durchsuchen"
          className={cn(
            "w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none",
            isHero ? "text-base" : "text-sm",
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Suche zurücksetzen"
            className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-popover p-2 shadow-lg"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Keine Rechner gefunden für „{query}“.
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {results.map((calc, i) => {
                const cat = getCategory(calc.category);
                const active = i === activeIndex;
                return (
                  <li key={calc.slug}>
                    <Link
                      id={`${listboxId}-opt-${i}`}
                      role="option"
                      aria-selected={active}
                      to="/rechner/$slug"
                      params={{ slug: calc.slug }}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                        active ? "bg-surface-muted" : "hover:bg-surface-muted",
                      )}
                    >
                      <span
                        aria-hidden
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-muted text-base"
                      >
                        {cat?.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-medium text-foreground">
                            {calc.name}
                          </span>
                          {cat && (
                            <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              {cat.name}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {calc.shortDescription}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}