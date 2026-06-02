# Personal Portfolio — Ram Saran Venkatasalapathy

**Live Site:** [my-portfolio-lyart-eta-81.vercel.app](https://my-portfolio-lyart-eta-81.vercel.app)

---

## Overview

This project is a personal portfolio site built to represent my work, skills, and experience as a CS student at Oregon State University. Rather than following a conventional hero-image-and-cards layout, the site is designed around a terminal/shell interface aesthetic. The hero section simulates a zsh terminal session where commands like `whoami`, `cat about.txt`, `skills --top`, and `projects --count` are executed in sequence to introduce who I am — a format that feels natural to how developers actually think and work.

The motivation behind this design was to build something that communicates technical personality before a recruiter even reads a single word. Most portfolio sites look the same. This one is built to feel like it was made by someone who actually spends time in a terminal.

---

## Design Philosophy

The core idea was to treat the portfolio itself as a project — not a formality. Every design decision was made deliberately. The dark theme, monospaced fonts, and syntax-colored skill tags all reinforce a consistent aesthetic that reflects the kind of work I do: backend systems, data pipelines, and full-stack applications where function drives form.

The terminal widget on the hero is not a gimmick — it is the introduction. It replaces the standard "Hi, I'm Ram, I build things" paragraph with something interactive and memorable. The commands map directly to real information: role, skills, current experience, project count, and availability status.

---

## Objectives

The primary goal was to build a portfolio that stands on its own as a demonstration of front-end capability while remaining fast, accessible, and easy to maintain. Secondary goals included deploying with a clean CI/CD pipeline through Vercel, keeping the codebase modular enough to extend as my projects grow, and ensuring the site reads well on both desktop and mobile without sacrificing the terminal aesthetic.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Deployment | Vercel |
| Version Control | GitHub |

---

## Project Structure
my-portfolio/
├── app/               # Next.js App Router — pages and layouts
├── public/            # Static assets (images, icons, fonts)
├── next.config.ts     # Next.js configuration
├── tailwind.config    # Tailwind theme and plugin config
├── postcss.config.mjs # PostCSS setup
└── tsconfig.json      # TypeScript configuration

---

## Featured Projects

**Stacksense** is a multi-agent GitHub repository analyzer built with Next.js and TypeScript. It takes a repository URL as input and uses multiple AI agents in sequence to analyze code structure, identify patterns, and surface actionable insights about the codebase.

**CryptoSentinel** is a real-time cryptocurrency monitoring dashboard that tracks price movements, volume changes, and market signals across multiple assets. Built to handle live data streams with a clean, responsive interface.

**Log Data Pipeline** is an automated log ingestion and processing system designed to collect, parse, and store structured log data at scale. The project focuses on reliability and throughput, with a modular architecture that makes it straightforward to add new data sources.

