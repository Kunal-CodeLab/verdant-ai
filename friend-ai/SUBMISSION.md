---
title: AllergyGuard — Decentralized Dietary Safety & Recipe Transformation Engine (Built for a Friend)
published: true
tags: devchallenge, weekendchallenge, hf26challenge, gemma
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

## What I Built

Shared living arrangements create significant friction when one roommate manages severe immunological food sensitivities. My roommate Rahul lives with severe Celiac disease and anaphylactic tree-nut allergies. Commercial cooking platforms routinely make naive recommendations—such as suggesting almond meal as a direct wheat substitute, which introduces a life-threatening anaphylactic vector.

**AllergyGuard** is an edge-native, open-source culinary safety assistant engineered specifically for Rahul. It accepts conventional culinary recipes and utilizes open-weight AI (**Google Gemma 2**) to compute functional, chemistry-matched hypoallergenic replacements—preserving authentic texture, lipid mouthfeel, and savoriness without adverse immunological triggers.

### Core Capabilities:
1. **Recipe Formulation Engine:** Automatically isolates gliadin, bovine casein, and nut antigen vectors in culinary manifests and computes safe, drop-in structural equivalents.
2. **Industrial Nomenclature Inspector:** Parses commercial packaged food labels against a 40+ token lexicon covering hidden wheat derivatives (E1400-E1450 modified starches, maltodextrin origins), whey fractions, and tree-nut derivatives.
3. **Hands-Free Kitchen Speech:** Uses the Web Speech API to provide audio narration during cooking, allowing users to prepare dishes without touching mobile displays with messy hands.
4. **Gemma 2 Culinary Intelligence:** Explains advanced food science concepts, including psyllium hydrocolloid viscoelasticity and nut-free seed lipid emulsification.

---

## Demo

- **Application Architecture:** Clean single-page application built on a dark slate and amber design system with zero third-party telemetry.
- **Hands-Free Integration:** Audio playback enables seamless kitchen workflow execution.
- **Edge Deployment:** Operates completely client-side in the browser with 100% offline reliability.

---

## Code

The source code is licensed under the MIT License and hosted on GitHub:

{% github https://github.com/Kunal-CodeLab/allergy-guard %}

### Quick Start:
```bash
git clone https://github.com/Kunal-CodeLab/allergy-guard.git
cd allergy-guard
# Open index.html directly in any web browser. Zero build dependencies.
```

---

## How I Built It

- **Open-Weight AI Model:** **Google Gemma 2** provides culinary biochemistry reasoning and hypoallergenic ingredient formulation.
- **Client Implementation:** Vanilla HTML5, modern CSS3 variables, and ES6+ JavaScript.
- **Speech Synthesis:** Native Web Speech API for voice-driven kitchen assistance.
- **Zero Data Exfiltration:** Operates 100% client-side with zero telemetry or tracking.

---

## Why Does Open Innovation Matter?

Dietary safety and medical food accommodations should never be restricted behind paywalled APIs or compromised by intermittent network connectivity. Open-weight models like **Google Gemma 2** make it possible to run private, life-saving dietary safety applications 100% offline, anywhere in the world, without recurring API costs.

---

## Prize Categories

- **Best Use of Gemma:** Implements Google's open-weight **Gemma 2** architecture to solve everyday dietary safety and culinary accessibility challenges.
