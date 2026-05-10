"use client"

import { useState, useRef, useEffect, type SVGProps } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useInView, animate } from "framer-motion"

// Inline SVG icons (no lucide-react — avoids package export mismatches)

type IconProps = SVGProps<SVGSVGElement>

function strokeIconProps(props: IconProps) {
  const { className, children, ...rest } = props
  return {
    className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    children,
    ...rest,
  }
}

function IconMenu(props: IconProps) {
  return (
    <svg {...strokeIconProps(props)}>
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function IconX(props: IconProps) {
  return (
    <svg {...strokeIconProps(props)}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function IconGithub(props: IconProps) {
  const { className, ...rest } = props
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...rest}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function IconLinkedIn(props: IconProps) {
  const { className, ...rest } = props
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...rest}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconArrowUpRight(props: IconProps) {
  return (
    <svg {...strokeIconProps(props)}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}

// Fine noise tile (shared ambient grain)
const noiseDataUri = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

// ============================================================================
// FULL-PAGE BACKGROUND — dark desk aesthetic + subtle cinematic grade
// ============================================================================

function PremiumDeskBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 min-h-[100dvh] min-h-[100svh] bg-[#0a0a0a]" aria-hidden>
      <Image
        src="/bg-desk-premium.png"
        alt=""
        fill
        priority
        quality={100}
        unoptimized
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Soft vignette — depth without hiding the mug / notebook */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_45%,transparent_35%,rgba(0,0,0,0.5)_78%,rgba(0,0,0,0.72)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/[0.38]" />
    </div>
  )
}

// ============================================================================
// AMBIENT BACKDROP — very light grain only (no floating box shapes)
// ============================================================================

function AmbientBackdrop() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden bg-transparent" aria-hidden>
      <motion.div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: noiseDataUri }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -6, 4, 0],
                y: [0, 5, -4, 0],
              }
        }
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// ============================================================================
// NAVBAR
// ============================================================================

const navLinks = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`fixed left-0 right-0 top-0 z-50 h-16 border-b border-white/[0.08] px-6 transition-[background,backdrop-filter] duration-300 md:px-[80px] ${
        scrolled ? "bg-black/45 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="relative mx-auto flex h-full max-w-[1200px] items-center justify-between">
        <a
          href="#"
          aria-label="Back to top"
          className="group flex items-center gap-3 leading-none outline-none transition-opacity hover:opacity-90 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#4ade80]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span
            className="h-7 w-px shrink-0 bg-gradient-to-b from-[#4ade80] via-[#7eb8d4] to-transparent opacity-90 group-hover:opacity-100"
            aria-hidden
          />
          <span className="font-mono-accent text-[16px] tracking-[-0.02em] text-on-dark-body" style={{ fontWeight: 500 }}>
            ~/portfolio
          </span>
        </a>

        <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center md:flex">
          {navLinks.map((link, i) => (
            <li key={link.name} className="flex items-center gap-10">
              <a
                href={link.href}
                className="text-[17px] font-medium text-on-dark-body transition-colors duration-200 hover:text-white"
                style={{ fontWeight: 500 }}
              >
                {link.name}
              </a>
              {i < navLinks.length - 1 ? (
                <span className="select-none text-on-dark-label" aria-hidden>
                  ·
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="rounded-md border border-[#949aa6] bg-transparent px-5 py-2 text-[17px] font-medium text-white transition-colors duration-200 hover:border-[#8f909c]"
            style={{ fontWeight: 500 }}
          >
            Get in touch
          </a>
        </div>

        <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-2 text-white md:hidden" aria-label="Toggle menu">
          {isOpen ? <IconX className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 top-full z-[100] border-b border-white/[0.08] bg-black/75 px-6 py-6 backdrop-blur-lg md:px-[80px]"
        >
          <ul className="mx-auto flex max-w-[1200px] flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} onClick={() => setIsOpen(false)} className="text-[17px] font-medium text-on-dark-body hover:text-white" style={{ fontWeight: 500 }}>
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-block rounded-md border border-[#949aa6] px-5 py-2 text-[17px] text-white hover:border-[#8f909c]"
                style={{ fontWeight: 500 }}
              >
                Get in touch
              </a>
            </li>
          </ul>
        </motion.div>
      ) : null}
    </motion.header>
  )
}

function useScrollFadeIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(Boolean(reduceMotion))

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setVisible(true)
        observer.unobserve(el)
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reduceMotion])

  const scrollFadeClass = visible ? "scroll-fade-in scroll-fade-in--visible" : "scroll-fade-in"

  return { ref, scrollFadeClass }
}

// ============================================================================
// HERO
// ============================================================================

const heroSpecialtyPills = ["Backend Development", "REST APIs", "Python & Data"]

type HeroTerminalRespVariant = "whoami" | "plain" | "skills" | "projects" | "experience" | "awards" | "status"

type HeroTerminalScriptRow = { cmd: string; resp: string; variant: HeroTerminalRespVariant }

const HERO_TERMINAL_SCRIPT: readonly HeroTerminalScriptRow[] = [
  { cmd: "$ whoami", resp: "ram-saran-venkatasalapathy", variant: "whoami" },
  { cmd: "$ cat about.txt", resp: "CS Student @ Oregon State University", variant: "plain" },
  { cmd: "$ skills --top", resp: "python · javascript · fastapi · c++", variant: "skills" },
  { cmd: "$ projects --count", resp: "5 shipped · stacksense · cryptosentinel", variant: "projects" },
  { cmd: "$ experience --current", resp: "TA @ OSU · 250+ students mentored", variant: "experience" },
  { cmd: "$ awards --list", resp: "Dean's List · Honor Roll 2025", variant: "awards" },
  { cmd: "$ status", resp: "> open to internships ✓", variant: "status" },
]

const HERO_TERMINAL_CHAR_MS = 40
const HERO_TERMINAL_LINE_PAUSE_MS = 300

type HeroTerminalLine =
  | { kind: "command"; cmdBody: string }
  | { kind: "response"; text: string; variant: HeroTerminalRespVariant }

function heroTerminalCmdBody(cmd: string) {
  return cmd.replace(/^\$\s*/, "")
}

function HeroTerminalPrompt({ cmdBody }: { cmdBody: string }) {
  return (
    <span className="text-[17px] leading-[1.6]">
      <span className="text-on-dark-label">❯</span>
      <span className="text-on-dark-body"> {cmdBody}</span>
    </span>
  )
}

function HeroTerminalTypingPrompt({ partial }: { partial: string }) {
  if (partial.length === 0) return null
  return (
    <span className="text-[17px] leading-[1.6]">
      <span className="text-on-dark-label">❯</span>
      <span className="text-on-dark-body"> {partial}</span>
    </span>
  )
}

const HERO_TERMINAL_SKILL_COLORS = ["#a8d8a8", "#d4a84b", "#7eb8d4", "#c4a8d4"] as const

function HeroTerminalResponse({ text, variant }: { text: string; variant: HeroTerminalRespVariant }) {
  switch (variant) {
    case "whoami":
      return (
        <span
          className="inline-block bg-gradient-to-b from-white to-[#e8eaf0] bg-clip-text text-[17px] leading-[1.6] text-transparent"
          style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {text}
        </span>
      )
    case "skills": {
      const parts = text.split(" · ")
      return (
        <span className="text-[17px] leading-[1.6]">
          {parts.map((part, i) => (
            <span key={`${part}-${i}`}>
              {i > 0 ? <span className="text-on-dark-label"> · </span> : null}
              <span style={{ color: HERO_TERMINAL_SKILL_COLORS[i] ?? "rgba(255, 255, 255, 0.88)" }}>{part}</span>
            </span>
          ))}
        </span>
      )
    }
    case "projects": {
      const parts = text.split(" · ")
      return (
        <span className="text-[17px] leading-[1.6]">
          {parts.map((part, i) => (
            <span key={`${part}-${i}`}>
              {i > 0 ? <span className="text-on-dark-label"> · </span> : null}
              {i === 0 ? (
                <span className="font-bold text-[#e0e0e0]" style={{ fontWeight: 700 }}>
                  {part}
                </span>
              ) : (
                <span className="text-on-dark-body">{part}</span>
              )}
            </span>
          ))}
        </span>
      )
    }
    case "experience": {
      const segs = text.split("250+")
      if (segs.length === 1) {
        return <span className="text-[17px] leading-[1.6] text-on-dark-body">{text}</span>
      }
      return (
        <span className="text-[17px] leading-[1.6]">
          <span className="text-on-dark-body">{segs[0]}</span>
          <span className="text-[#e0e0e0]">250+</span>
          <span className="text-on-dark-body">{segs[1]}</span>
        </span>
      )
    }
    case "status":
      return (
        <span className="text-[17px] leading-[1.6] font-semibold text-[#4ade80]" style={{ fontWeight: 600 }}>
          {text}
        </span>
      )
    case "plain":
    case "awards":
    default:
      return (
        <span className="text-[17px] leading-[1.6] text-on-dark-body">{text}</span>
      )
  }
}

function HeroTerminal() {
  const reduceMotion = useReducedMotion()
  const [lines, setLines] = useState<HeroTerminalLine[]>([])
  const [typingPartial, setTypingPartial] = useState("")
  const [typingKind, setTypingKind] = useState<"command" | "response" | null>(null)
  const [typingVariant, setTypingVariant] = useState<HeroTerminalRespVariant>("plain")
  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      const staticLines: HeroTerminalLine[] = []
      for (const row of HERO_TERMINAL_SCRIPT) {
        staticLines.push({ kind: "command", cmdBody: heroTerminalCmdBody(row.cmd) })
        staticLines.push({ kind: "response", text: row.resp, variant: row.variant })
      }
      setLines(staticLines)
      setTypingPartial("")
      setTypingKind(null)
      setAllDone(true)
      return
    }

    let cancelled = false
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    const typeOut = async (full: string) => {
      for (let i = 0; i <= full.length; i++) {
        if (cancelled) return
        setTypingPartial(full.slice(0, i))
        if (i < full.length) await sleep(HERO_TERMINAL_CHAR_MS)
      }
    }

    ;(async () => {
      setLines([])
      setAllDone(false)
      setTypingPartial("")
      setTypingKind(null)

      for (const row of HERO_TERMINAL_SCRIPT) {
        const cmdBody = heroTerminalCmdBody(row.cmd)
        setTypingKind("command")
        setTypingVariant("plain")
        await typeOut(cmdBody)
        if (cancelled) return
        setLines((L) => [...L, { kind: "command", cmdBody }])
        setTypingPartial("")
        setTypingKind(null)
        await sleep(HERO_TERMINAL_LINE_PAUSE_MS)
        if (cancelled) return

        setTypingKind("response")
        setTypingVariant(row.variant)
        await typeOut(row.resp)
        if (cancelled) return
        setLines((L) => [...L, { kind: "response", text: row.resp, variant: row.variant }])
        setTypingPartial("")
        setTypingKind(null)
        setTypingVariant("plain")
        await sleep(HERO_TERMINAL_LINE_PAUSE_MS)
        if (cancelled) return
      }

      setAllDone(true)
    })()

    return () => {
      cancelled = true
    }
  }, [reduceMotion])

  const lineMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 3 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden border-y border-white/[0.09] bg-black/25"
    >
      <div className="relative z-[2] flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5 bg-black/20">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 shrink-0 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-3 w-3 shrink-0 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-3 w-3 shrink-0 rounded-full bg-[#28c840]" aria-hidden />
        </div>
        <span className="font-mono-accent pointer-events-none absolute left-1/2 -translate-x-1/2 text-[17px] text-on-dark-label" style={{ fontWeight: 400 }}>
          ~/ram-saran/portfolio
        </span>
        <span className="font-mono-accent text-[16px] text-on-dark-label" style={{ fontWeight: 400 }}>
          zsh
        </span>
      </div>

      <div className="relative z-[2] min-h-[320px] bg-transparent px-6 py-5">
        <div className="hero-terminal-scanlines pointer-events-none absolute inset-0 z-[1] opacity-90" aria-hidden />
        <div className="relative z-[2] space-y-1.5 font-mono-accent" style={{ fontWeight: 400 }}>
          {lines.map((line, i) => (
            <motion.div key={`${line.kind}-${i}-${line.kind === "command" ? line.cmdBody : line.text}`} {...lineMotion}>
              {line.kind === "command" ? (
                <p className="break-all">
                  <HeroTerminalPrompt cmdBody={line.cmdBody} />
                </p>
              ) : (
                <p className="break-all pl-5">
                  <HeroTerminalResponse text={line.text} variant={line.variant} />
                </p>
              )}
            </motion.div>
          ))}
          {typingKind === "command" && typingPartial.length > 0 ? (
            <motion.p className="break-all" {...lineMotion}>
              <HeroTerminalTypingPrompt partial={typingPartial} />
            </motion.p>
          ) : null}
          {typingKind === "response" && typingPartial.length > 0 ? (
            <motion.p
              className={`break-all pl-5 text-[17px] leading-[1.6] ${typingVariant === "status" ? "font-semibold text-[#4ade80]" : "text-on-dark-body"}`}
              style={typingVariant === "status" ? { fontWeight: 600 } : undefined}
              {...lineMotion}
            >
              {typingPartial}
            </motion.p>
          ) : null}
          {allDone ? (
            <p className="pl-5 text-[17px] leading-[1.6]">
              <span className="hero-terminal-cursor inline-block translate-y-px font-normal text-[#4ade80]">█</span>
            </p>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}

function Hero() {
  return (
    <section className="relative flex min-h-screen min-h-[100dvh] overflow-x-clip overflow-y-visible bg-transparent md:overflow-hidden">
      <div className="relative z-10 flex min-h-[100dvh] w-full flex-1 flex-col">
        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-14 px-6 pb-24 pt-[120px] lg:flex-row lg:items-center lg:gap-12 lg:pb-32 lg:pt-[104px] md:px-[80px]">
          {/* Copy column */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 inline-flex w-fit items-center gap-2.5 rounded-full border border-[#a0a5b2] bg-[#2a2b36] px-4 py-2"
            >
              <span className="hero-intern-dot h-[6px] w-[6px] shrink-0 rounded-full bg-[#00ff88]" aria-hidden />
              <span className="font-mono-accent text-[16px] tracking-[0.15em] text-on-dark-label" style={{ fontWeight: 500 }}>
                AVAILABLE FOR INTERNSHIPS
              </span>
            </motion.div>

            <div className="relative mb-2 w-full min-w-0 overflow-x-clip overflow-y-visible md:overflow-hidden">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[min(380px,50vw)] w-[min(520px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[200px]"
                style={{
                  opacity: 0.3,
                  background: "radial-gradient(circle at center, #4e4f5c 0%, transparent 68%)",
                }}
                aria-hidden
              />
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="font-display relative z-10 max-w-full text-balance text-white md:whitespace-nowrap"
                style={{
                  fontWeight: 900,
                  fontSize: "clamp(52px, 8vw, 110px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                }}
              >
                Ram Saran
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="font-display mb-8 text-[clamp(28px,3.8vw,52px)] tracking-[0.08em] text-[#f2f3f7]"
              style={{ fontWeight: 900 }}
            >
              Venkatasalapathy
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="font-mono-accent mb-10 max-w-xl text-[17px] uppercase leading-relaxed tracking-[0.12em] text-on-dark-body"
              style={{ fontWeight: 500 }}
            >
              CS STUDENT · BACKEND DEVELOPER · ASPIRING SOFTWARE ENGINEER
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.38 }}
              className="mb-10 flex flex-wrap gap-2"
            >
              {heroSpecialtyPills.map((label) => (
                <span
                  key={label}
                  className="font-mono-accent rounded-full border border-[#3d3e4a] bg-[#2a2b36] px-3 py-1.5 text-[17px] text-on-dark-pill"
                  style={{ fontWeight: 500 }}
                >
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.44 }}
              className="mb-10 flex flex-wrap items-center gap-0 text-[16px] text-on-dark-body"
              style={{ fontWeight: 400 }}
            >
              <span>5+ PROJECTS</span>
              <span className="mx-4 h-3 w-px shrink-0 bg-[#4e4f5c]" aria-hidden />
              <span>OREGON STATE</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.48 }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center rounded-md bg-white px-7 py-3 text-[16px] text-black transition-colors duration-200 hover:bg-[#e0e0e0]"
                style={{ fontWeight: 600 }}
              >
                Get in touch
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.62 }}
              className="mt-10 flex items-center gap-6 md:hidden"
            >
              <a
                href="https://github.com/ramsaran28"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-dark-body transition-colors hover:text-white"
                aria-label="GitHub"
              >
                <IconGithub className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/ram-saran-venkatasalapathy-osu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-dark-body transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <IconLinkedIn className="h-5 w-5" />
              </a>
            </motion.div>
          </div>

          {/* Terminal */}
          <div className="flex w-full min-w-0 flex-1 items-center justify-center lg:max-w-[min(560px,46vw)] lg:justify-end">
            <HeroTerminal />
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// ABOUT
// ============================================================================

const ABOUT_BIO_TEXT = `I'm Ram Saran Venkatasalapathy, a Computer Science undergraduate at Oregon State University with a passion for building things that actually work at scale. I specialize in backend development, REST APIs, and data pipelines — turning complex problems into clean, efficient solutions. From engineering AI-powered GitHub analyzers to building real-time crypto monitoring systems, I love working at the intersection of data and software. As a Teaching Assistant supporting 250+ students, I've learned that the best engineers don't just write code — they communicate it. I'm actively seeking internship opportunities where I can contribute, grow fast, and ship real products.`

const aboutStats = [
  { target: 250, suffix: "+", label: "STUDENTS MENTORED" },
  { target: 3, suffix: "+", label: "YEARS CODING" },
  { target: 5, suffix: "+", label: "PROJECTS SHIPPED" },
] as const

function StatCount({
  target,
  suffix,
  delaySec = 0,
}: {
  target: number
  suffix: string
  delaySec?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, target, {
      duration: 2,
      delay: delaySec,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    })
    return () => controls.stop()
  }, [isInView, target, delaySec])

  return (
    <span
      ref={ref}
      className="font-display block tabular-nums tracking-[-0.02em] text-white max-md:text-[clamp(28px,10vw,48px)] text-[48px]"
      style={{ fontWeight: 700 }}
    >
      {value}
      {suffix}
    </span>
  )
}

function AboutIntro() {
  return (
    <section
      id="about"
      className="relative border-y border-white/10 bg-transparent px-6 py-[120px] md:px-[80px]"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start lg:gap-x-20 lg:gap-y-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true, margin: "-80px" }}
          className="lg:max-w-xl"
        >
          <span
            className="font-mono-accent mb-8 block text-[16px] uppercase tracking-[0.2em] text-on-dark-label"
            style={{ fontWeight: 500 }}
          >
            ABOUT ME
          </span>
          <h2 className="font-display text-[clamp(28px,calc(5vw+14px),64px)] leading-[1.06] tracking-[-0.03em] text-white" style={{ fontWeight: 800 }}>
            I build backends
            <br />
            that scale.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col"
        >
          <p className="font-inter-about mb-12 max-w-xl text-[17px] max-md:text-[15px] leading-[1.85] text-on-dark-body" style={{ fontWeight: 400 }}>
            {ABOUT_BIO_TEXT}
          </p>

          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {aboutStats.map((stat, index) => (
              <div
                key={stat.label}
                className="border-t border-white/[0.08] py-8 pt-10"
              >
                <StatCount
                  target={stat.target}
                  suffix={stat.suffix}
                  delaySec={index * 0.12}
                />
                <p
                  className="font-mono-accent mt-4 text-[16px] uppercase leading-snug tracking-[0.15em] text-on-dark-label"
                  style={{ fontWeight: 500 }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="font-mono-accent rounded-full border border-[#3d3e4a] bg-transparent px-4 py-2 text-[17px] text-on-dark-pill" style={{ fontWeight: 500 }}>
              Oregon State University
            </span>
            <span className="font-mono-accent rounded-full border border-[#3d3e4a] bg-transparent px-4 py-2 text-[17px] text-on-dark-pill" style={{ fontWeight: 500 }}>
              Corvallis OR
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// MARQUEE
// ============================================================================

const marqueeSkills = [
  "PYTHON",
  "JAVASCRIPT",
  "FASTAPI",
  "BACKEND DEVELOPMENT",
  "REST APIs",
  "OREGON STATE",
  "OPEN TO INTERNSHIPS",
  "C++",
  "DATA STRUCTURES",
]

function Marquee() {
  const strip = [...marqueeSkills, ...marqueeSkills]

  return (
    <section className="relative overflow-hidden border-y border-white/[0.07] bg-transparent py-14 md:py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {strip.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="font-mono-accent mx-6 cursor-default text-[15px] uppercase tracking-[0.18em] text-on-dark-label transition-colors duration-300 hover:text-white md:mx-10 md:text-[16px]"
              style={{ fontWeight: 500 }}
            >
              {skill}
              <span className="ml-6 md:ml-10 text-on-dark-label">·</span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// ============================================================================
// PROJECTS
// ============================================================================

const projects = [
  {
    id: "stacksense" as const,
    number: "01",
    period: "May 2026",
    title: "Stacksense — AI-Powered GitHub Codebase Health Analyzer",
    description:
      "Engineered 4 parallel AI agents to analyze any public GitHub repo. Flagged 7 real vulnerabilities, returned Health Score 31/100 and Security Grade F. Supports 15+ languages with zero setup.",
    tags: ["AI", "NEXT.JS"],
    tech: ["Next.js 16", "TypeScript", "Meta Llama", "Groq API", "D3.js"],
    link: "https://github.com/ramsaran28",
    github: "https://github.com/ramsaran28",
  },
  {
    id: "cryptosentinel" as const,
    number: "02",
    period: "Apr 2026",
    title: "CryptoSentinel — AI-Powered Crypto Monitoring System",
    description:
      "Real-time crypto monitoring with live market APIs, automated price tracking and anomaly detection. Interactive dashboard with sentiment analysis and rule-based alerting.",
    tags: ["PYTHON", "FASTAPI"],
    tech: ["Python", "FastAPI", "Pandas", "Scikit-learn", "Plotly"],
    link: "https://github.com/ramsaran28",
    github: "https://github.com/ramsaran28",
  },
  {
    id: "log-pipeline" as const,
    number: "03",
    period: "Mar 2026",
    title: "Log Data Pipeline — Python · FastAPI · Pandas",
    description:
      "Data pipeline to ingest, process and store structured log data from CSV files. REST API with query-based filtering for real-time log analysis and modular ETL workflow.",
    tags: ["BACKEND", "DATA"],
    tech: ["Python", "FastAPI", "Pandas", "REST APIs", "Git"],
    link: "https://github.com/ramsaran28",
    github: "https://github.com/ramsaran28",
  },
]

type ProjectCardData = (typeof projects)[number]

const experienceCardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const experienceCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

function StacksenseMockup() {
  return (
    <div className="w-full max-w-[300px] space-y-5 py-1">
      <p className="font-mono-accent text-[17px] uppercase tracking-[0.14em] text-on-dark-label" style={{ fontWeight: 500 }}>
        stacksense preview
      </p>
      <p className="text-[16px] text-on-dark-body" style={{ fontWeight: 400 }}>
        Health Score
      </p>
      <p className="mt-1 font-display leading-none text-white" style={{ fontWeight: 400, fontSize: "48px" }}>
        31
        <span className="text-on-dark-label">/100</span>
      </p>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#a0a5b2]">
        <div className="h-full w-[31%] rounded-full bg-[#505050]" />
      </div>
      <p className="mt-6 text-[16px] text-on-dark-body" style={{ fontWeight: 400 }}>
        Security Grade
      </p>
      <p className="mt-1 font-display text-[40px] leading-none text-[#ff5f57]" style={{ fontWeight: 700 }}>
        F
      </p>
    </div>
  )
}

function FeaturedProjectCard({ featured }: { featured: ProjectCardData }) {
  const { ref, scrollFadeClass } = useScrollFadeIn()

  return (
    <article
      ref={ref}
      className={`${scrollFadeClass} group relative border-t border-white/[0.08] px-0 pb-14 pt-12 sm:pb-16 sm:pt-14`}
    >
      <span
        className="font-mono-accent absolute left-4 top-4 z-[2] hidden text-[17px] text-on-dark-label md:block md:left-6"
        style={{ fontWeight: 500 }}
      >
        {featured.number}
      </span>
      <span className="font-mono-accent absolute right-4 top-4 z-[2] hidden text-[16px] text-on-dark-label md:block" style={{ fontWeight: 500 }}>
        {featured.period}
      </span>
      <div className="relative z-[1] flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="min-w-0 flex-1 lg:pt-2">
          <div className="mb-4 flex flex-wrap gap-2 md:pt-14">
            {featured.tags.map((tag) => (
              <span key={tag} className="font-mono-accent border border-[#a0a5b2] px-2.5 py-1 text-[16px] uppercase tracking-[0.08em] text-on-dark-label" style={{ fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mb-4 max-w-full text-[clamp(28px,6vw+10px,34px)] text-white md:text-[22px]" style={{ fontWeight: 700 }}>
            {featured.title}
          </h3>
          <div
            className="font-mono-accent mb-4 flex flex-wrap items-center gap-4 text-[15px] text-on-dark-label md:hidden"
            style={{ fontWeight: 500 }}
            aria-label="Project meta"
          >
            <span>{featured.number}</span>
            <span className="text-white/25" aria-hidden>
              ·
            </span>
            <span>{featured.period}</span>
          </div>
          <p className="mb-6 max-w-2xl text-[17px] max-md:text-[15px] leading-[1.75] text-on-dark-desc" style={{ fontWeight: 400 }}>
            {featured.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {featured.tech.map((tech) => (
              <span key={tech} className="font-mono-accent border border-white/15 bg-transparent px-2.5 py-1.5 text-[16px] max-md:text-[15px] tracking-[0.06em] text-on-dark-pill" style={{ fontWeight: 500 }}>
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-6">
            <a href={featured.link} className="text-[17px] max-md:text-[15px] text-white transition-opacity hover:opacity-90" style={{ fontWeight: 500 }}>
              View project ↗
            </a>
            <a href={featured.github} className="text-[17px] max-md:text-[15px] text-on-dark-body transition-colors hover:text-white" style={{ fontWeight: 500 }}>
              GitHub →
            </a>
          </div>
        </div>
        <div className="relative z-[2] flex shrink-0 justify-center lg:justify-end lg:pt-2">
          <StacksenseMockup />
        </div>
      </div>
    </article>
  )
}

function ProjectGridCard({ project }: { project: ProjectCardData }) {
  const { ref, scrollFadeClass } = useScrollFadeIn()

  return (
    <div ref={ref} className={`${scrollFadeClass} relative h-full border-t border-white/[0.08] pt-12`}>
      <div className="relative z-[1] flex h-full flex-col pb-4">
        <span className="font-mono-accent absolute left-4 top-4 z-[2] hidden text-[17px] text-on-dark-label md:block" style={{ fontWeight: 500 }}>
          {project.number}
        </span>
        <span className="font-mono-accent absolute right-4 top-4 z-[2] hidden text-[16px] text-on-dark-label md:block" style={{ fontWeight: 500 }}>
          {project.period}
        </span>
        <div className="mb-4 flex flex-wrap gap-2 pt-0 md:pt-14">
          {project.tags.map((tag) => (
            <span key={tag} className="font-mono-accent border border-[#a0a5b2] px-2.5 py-1 text-[16px] uppercase tracking-[0.08em] text-on-dark-label" style={{ fontWeight: 500 }}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mb-4 max-w-full text-[clamp(28px,6vw+10px,34px)] text-white md:pr-0 md:text-[22px]" style={{ fontWeight: 700 }}>
          {project.title}
        </h3>
        <div
          className="font-mono-accent mb-4 flex flex-wrap items-center gap-4 text-[15px] text-on-dark-label md:hidden"
          style={{ fontWeight: 500 }}
          aria-label="Project meta"
        >
          <span>{project.number}</span>
          <span className="text-white/25" aria-hidden>
            ·
          </span>
          <span>{project.period}</span>
        </div>
        <p className="mb-6 flex-1 text-[17px] max-md:text-[15px] leading-[1.75] text-on-dark-desc" style={{ fontWeight: 400 }}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span key={tech} className="font-mono-accent border border-white/15 bg-transparent px-2.5 py-1.5 text-[16px] max-md:text-[15px] tracking-[0.06em] text-on-dark-pill" style={{ fontWeight: 500 }}>
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-6 border-t border-[#3d3e4a] pt-6">
          <a href={project.link} className="text-[17px] max-md:text-[15px] text-white transition-opacity hover:opacity-90" style={{ fontWeight: 500 }}>
            View project ↗
          </a>
          <a href={project.github} className="text-[17px] max-md:text-[15px] text-on-dark-body transition-colors hover:text-white" style={{ fontWeight: 500 }}>
            GitHub →
          </a>
        </div>
      </div>
    </div>
  )
}

function Projects() {
  const [featured, ...rest] = projects

  return (
    <section id="work" className="bg-transparent px-6 py-[120px] md:px-[80px]">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span
            className="font-mono-accent mb-4 block text-[16px] uppercase tracking-[0.2em] text-on-dark-label"
            style={{ fontWeight: 500 }}
          >
            SELECTED WORK
          </span>
          <h2
            className="font-display bg-gradient-to-b from-white to-[#9aa3b0] bg-clip-text text-transparent tracking-[-0.03em]"
            style={{ fontWeight: 900, fontSize: "clamp(28px, 14vw, 160px)", lineHeight: 0.95 }}
          >
            Work.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-8">
          <FeaturedProjectCard featured={featured} />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {rest.map((project) => (
              <ProjectGridCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/ramsaran28"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-accent inline-flex items-center rounded-xl bg-white/[0.07] px-5 py-3 text-[15px] uppercase tracking-[0.12em] text-on-dark-body transition-[transform,background-color,color] duration-200 ease-in-out motion-safe:hover:scale-[1.03] hover:bg-white/[0.16] hover:text-white"
            style={{ fontWeight: 500 }}
          >
            View All Projects on GitHub
            <IconArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="mt-24 w-full border-y border-white/[0.08] px-6 py-16 md:py-20"
      >
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-display text-[clamp(28px,calc(4vw+16px),32px)] italic text-on-dark-body">Interested in working together?</p>
          <p className="font-display mt-3 text-[clamp(28px,calc(5vw+14px),40px)] text-white md:text-[32px]" style={{ fontWeight: 700 }}>
            Let&apos;s build something great.
          </p>
          <a
            href="#contact"
            className="mt-10 inline-flex items-center rounded-md border border-[#a0a5b2] px-8 py-3 text-[17px] text-white transition-colors duration-200 hover:border-[#505050] max-md:text-[15px]"
            style={{ fontWeight: 500 }}
          >
            Start a conversation →
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ============================================================================
// SKILLS
// ============================================================================

const skillCategoryGroups = [
  { category: "Languages", skills: ["Python", "JavaScript", "C++", "Java", "SQL"] },
  { category: "Backend", skills: ["FastAPI", "REST APIs", "Backend Services", "Data Structures & Algorithms"] },
  { category: "Tools", skills: ["Git/GitHub", "Linux/UNIX", "Docker", "Secure Coding Practices"] },
  { category: "Cloud", skills: ["Google Cloud", "AWS"] },
] as const

function SkillBadge({ label }: { label: string }) {
  const { ref, scrollFadeClass } = useScrollFadeIn()

  return (
    <span
      ref={ref}
      className={`${scrollFadeClass} cursor-default rounded-lg border border-white/15 bg-transparent px-5 py-2.5 text-[16px] text-on-dark-pill transition-colors duration-200 hover:border-white/30 hover:text-white max-md:text-[15px]`}
      style={{ fontWeight: 600 }}
    >
      {label}
    </span>
  )
}

function Skills() {
  return (
    <section id="skills" className="relative overflow-x-clip overflow-y-visible bg-transparent px-6 py-[120px] md:px-[80px]">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span
            className="font-mono-accent mb-4 block text-[16px] uppercase tracking-[0.2em] text-on-dark-label"
            style={{ fontWeight: 500 }}
          >
            Expertise
          </span>
          <h2 className="font-display tracking-[-0.02em] text-white" style={{ fontWeight: 900, fontSize: "clamp(28px, 10vw + 12px, 100px)", lineHeight: 1.05 }}>
            Skills & Technologies
          </h2>
        </motion.div>

        <div className="space-y-12">
          {skillCategoryGroups.map((group) => (
            <div key={group.category}>
              <p
                className="font-mono-accent mb-5 text-[16px] uppercase tracking-[0.18em] text-on-dark-label"
                style={{ fontWeight: 500 }}
              >
                {group.category}
              </p>
              <div className="relative z-[1] flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <SkillBadge key={skill} label={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-16 border-t border-[#a0a5b2] pt-10"
        >
          <p
            className="font-mono-accent text-center text-[16px] uppercase tracking-[0.12em] text-on-dark-label"
            style={{ fontWeight: 500 }}
          >
            Focused on scalable backends, APIs, cloud platforms, and secure engineering practices.
          </p>
        </motion.div>
      </div>

      <div className="relative left-1/2 mt-20 w-screen max-w-[100vw] -translate-x-1/2 border-t border-white/[0.08] px-6 py-10 md:py-12">
        <p
          className="font-mono-accent text-center text-[17px] tracking-[0.15em] text-on-dark-label"
          style={{ fontWeight: 500 }}
        >
          PYTHON · JAVASCRIPT · C++ · FASTAPI · REST APIs · GIT · DOCKER · AWS · DATA STRUCTURES
        </p>
      </div>
    </section>
  )
}

// ============================================================================
// EXPERIENCE · EDUCATION · AWARDS
// ============================================================================

const premiumExperienceEntries = [
  {
    dateBadge: "2026–Present",
    company: "Oregon State University",
    role: "Undergraduate Teaching Assistant",
    description: "Supporting 250+ students in C++ programming",
    tags: ["C++", "Teaching", "Mentoring"],
  },
  {
    dateBadge: "2026–Present",
    company: "Hindu YUVA at OSU",
    role: "Event & Project Coordinator",
    description: "Campus event planning and community engagement",
    tags: ["Leadership", "Event Planning"],
  },
  {
    dateBadge: "2026–Present",
    company: "Orange Media Network OSU",
    role: "Reporter",
    description: "Writing 400–600 word news and feature stories",
    tags: ["Writing", "Journalism"],
  },
  {
    dateBadge: "2024",
    company: "Cogtis Technologies",
    role: "Student Intern",
    description: "Python projects with NLP, machine learning and data analysis",
    tags: ["Python", "NLP", "Machine Learning", "Data Analysis"],
  },
] as const

const certificationCards = [
  { issuer: "Salesforce", name: "CRM & Cloud Fundamentals", year: "Trailhead" },
  { issuer: "CodeGalatta", name: "C, C++, Python with Data Science & Java", year: "2024" },
  { issuer: "Cambridge Infotech", name: "Data Science with Python and R", year: "2024" },
  { issuer: "University of Leeds", name: "Managing Major Engineering Projects", year: "2024" },
] as const

const educationItems = [
  {
    degree: "B.S. Computer Science",
    school: "Oregon State University",
    period: "June 2024 – Present",
    detail: "Expected graduation June 2028",
  },
  {
    degree: "Diploma in Data Science",
    school: "Cambridge Infotech",
    period: "Feb 2024 – May 2024",
    detail: "",
  },
]

const awardsText =
  "Dean's List Fall 2025 Portland Community College · Honor Roll Fall 2025 Linn Benton Community College"

function ExperienceEducation() {
  return (
    <section id="experience" className="border-t border-white/10 bg-transparent px-6 py-[120px] md:px-[80px]">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span
            className="font-mono-accent mb-4 block text-[16px] uppercase tracking-[0.2em] text-on-dark-label"
            style={{ fontWeight: 500 }}
          >
            Background
          </span>
          <h2 className="font-display text-[clamp(28px,calc(5vw+14px),64px)] tracking-[-0.02em] text-white" style={{ fontWeight: 800 }}>
            Experience & Education
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3
            className="font-mono-accent mb-10 text-[16px] uppercase tracking-[0.2em] text-on-dark-label"
            style={{ fontWeight: 500 }}
          >
            Experience
          </h3>
          <motion.ul
            className="flex flex-col divide-y divide-white/[0.08]"
            variants={experienceCardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {premiumExperienceEntries.map((item) => (
              <motion.li key={`${item.company}-${item.role}`} variants={experienceCardVariants} className="group py-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <h4 className="text-[clamp(28px,calc(3vw+16px),32px)] leading-tight text-white md:text-[20px]" style={{ fontWeight: 700 }}>
                    {item.company}
                  </h4>
                  <span
                    className="font-mono-accent text-on-dark-pill w-fit shrink-0 border border-white/15 px-3 py-1 text-[17px]"
                    style={{ fontWeight: 500 }}
                  >
                    {item.dateBadge}
                  </span>
                </div>
                <p className="text-on-dark-body mt-2 text-[17px] max-md:text-[15px]" style={{ fontWeight: 600 }}>
                  {item.role}
                </p>
                <p className="text-on-dark-desc mt-3 text-[16px] max-md:text-[15px] leading-[1.7]" style={{ fontWeight: 400 }}>
                  {item.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-accent text-on-dark-pill border border-white/12 bg-transparent px-2.5 py-1 text-[16px]"
                      style={{ fontWeight: 500 }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="font-mono-accent mb-8 text-[16px] uppercase tracking-[0.2em] text-on-dark-label" style={{ fontWeight: 500 }}>
            Education
          </h3>
          <ul className="grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
            {educationItems.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <p className="mb-2 text-[clamp(28px,calc(3vw+18px),24px)] text-white md:text-xl" style={{ fontWeight: 700 }}>
                  {item.degree}
                </p>
                <p className="text-on-dark-body mb-3 text-[17px] max-md:text-[15px]" style={{ fontWeight: 400 }}>
                  {item.school}
                </p>
                <p className="font-mono-accent text-on-dark-label mb-2 text-[15px] uppercase tracking-[0.08em]" style={{ fontWeight: 500 }}>
                  {item.period}
                </p>
                {item.detail ? (
                  <p className="text-on-dark-desc text-[15px]" style={{ fontWeight: 400 }}>
                    {item.detail}
                  </p>
                ) : null}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="font-mono-accent mb-6 text-[16px] uppercase tracking-[0.2em] text-on-dark-label" style={{ fontWeight: 500 }}>
            Awards & Honors
          </h3>
          <p className="text-on-dark-body max-w-4xl text-[17px] max-md:text-[15px] leading-[1.8]" style={{ fontWeight: 400 }}>
            {awardsText}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="font-mono-accent mb-8 text-[16px] uppercase tracking-[0.2em] text-on-dark-label" style={{ fontWeight: 500 }}>
            Certifications
          </h3>
          <ul className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-8">
            {certificationCards.map((cert, index) => (
              <motion.li
                key={cert.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="flex flex-col py-2"
              >
                <p className="font-mono-accent text-on-dark-label text-[16px]" style={{ fontWeight: 500 }}>
                  {cert.issuer}
                </p>
                <p className="mt-3 flex-1 leading-snug text-white max-md:text-[clamp(28px,calc(2vw+20px),32px)] md:text-[17px]" style={{ fontWeight: 700 }}>
                  {cert.name}
                </p>
                <p className="text-on-dark-desc mt-4 text-[17px]" style={{ fontWeight: 400 }}>
                  {cert.year}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// CONTACT
// ============================================================================

const socialLinks = [
  { name: "GitHub", Icon: IconGithub, href: "https://github.com/ramsaran28" },
  { name: "LinkedIn", Icon: IconLinkedIn, href: "https://linkedin.com/in/ram-saran-venkatasalapathy-osu" },
]

function Contact() {
  return (
    <section id="contact" className="bg-transparent px-6 py-[120px] md:px-[80px]">
      <div className="mx-auto max-w-[1200px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[min(320px,50vw)] w-[min(720px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3d3e4a]/20 blur-[100px]"
            aria-hidden
          />
          <h2
            className="font-display relative z-[1] text-balance tracking-[-0.03em] text-white"
            style={{ fontWeight: 900, fontSize: "clamp(28px, calc(7vw + 10px), 96px)", lineHeight: 1.1 }}
          >
            Let&apos;s work together.
          </h2>

          <motion.a
            href="mailto:ramsaranvk42@gmail.com"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-on-dark-body relative z-[1] mt-10 inline-block text-[20px] underline-offset-4 transition-colors hover:text-white hover:underline max-md:break-all max-md:text-[15px]"
            style={{ fontWeight: 400 }}
          >
            ramsaranvk42@gmail.com
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative z-[1] mt-12 flex justify-center gap-5"
          >
            {socialLinks.map((social) => {
              const { Icon } = social
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#3d3e4a] transition-colors duration-200 hover:border-[#a0a5b2]"
                  aria-label={social.name}
                >
                  <Icon className="text-on-dark-body h-5 w-5 transition-colors duration-200 group-hover:text-white" />
                </a>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border-t border-white/[0.08] bg-transparent px-6 py-8 md:px-[80px]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono-accent text-on-dark-body text-[17px] max-md:text-[15px]" style={{ fontWeight: 500 }}>
          © 2026 Ram Saran Venkatasalapathy
        </p>
        <p className="font-mono-accent text-on-dark-body text-center text-[17px] max-md:text-[15px] sm:text-right" style={{ fontWeight: 500 }}>
          Built with Next.js & deployed on Vercel
        </p>
      </div>
    </motion.footer>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a]">
      <PremiumDeskBackground />
      <AmbientBackdrop />
      <Navbar />
      <div className="relative z-[10]">
        <Hero />
        <Marquee />
        <AboutIntro />
        <Projects />
        <Skills />
        <ExperienceEducation />
        <Contact />
        <SiteFooter />
      </div>
    </main>
  )
}
