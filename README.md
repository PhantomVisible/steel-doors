# Kamal Steel Doors (KSD) 🚪✨

> Welcome to the official repository for the **Kamal Steel Doors** web platform. Designed to reflect the premium quality of Turkish steel doors, strong home security, and architectural elegance, based in Fès, Morocco.

![Kamal Steel Doors](https://steel-doors.vercel.app/assets/ksd.jpeg)

## 🌟 Overview

The KSD Web Platform is a highly immersive, modern, and performant Angular application. It showcases high-end security doors through rich interactive 3D elements and buttery-smooth scrolling animations while retaining critical accessibility, multi-language support, and SEO optimization.

## 🚀 Key Features

- **Interactive 3D Visuals:** A stunning 3D "Exploded Door" canvas built with modern WebGL tools to let users interact with the core structure and materials of the doors.
- **Cinematic Animations:** Powered by **GSAP (ScrollTrigger)** to ensure fluid, scroll-driven entrance animations, levitation effects, and parallax backgrounds across all pages.
- **Premium Aesthetics:** Sleek, high-contrast, modern UI crafted natively with **SCSS**.
- **Multilingual Support (i18n):** Full localization support for both **French** and **Arabic** (including RTL layout handling).
- **Responsive & Mobile-First:** Seamlessly adapts from desktop to mobile interfaces, with specifically tailored mobile rendering pipelines.
- **Production-Ready SEO & Social Shares:** Optimized metadata, Open Graph (OG) tags, and Twitter Cards to ensure brilliant previews on WhatsApp, Facebook, LinkedIn, and Twitter.

## 🛠️ Technology Stack

- **Framework:** [Angular (16+)](https://angular.io/)
- **Animations:** [GSAP](https://gsap.com/) & ScrollTrigger
- **3D Rendering:** [Three.js](https://threejs.org/)
- **Styling:** SCSS (Vanilla CSS architectures, Flexbox/Grid)
- **Deployment:** [Vercel](https://vercel.com/) ready

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18.x or later recommended)
- **Angular CLI** (`npm install -g @angular/cli`)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PhantomVisible/steel-doors.git
   cd steel-doors
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/` in your browser. The app will automatically reload if you change any of the source files.

## 🏗️ Build & Deployment

### Production Build

To build the project for production, run:
```bash
ng build --configuration production
```
The build artifacts will be stored in the `dist/` and/or `public/` directories, completely optimized for performance and ready for deployment.

### Vercel Deployment

This project is pre-configured and fully compatible with **Vercel**.
1. Connect this GitHub repository to your Vercel account.
2. Vercel will automatically detect the Angular framework structure and build the application without needing manual configurations.

## 📂 Project Highlights

* **Animation Service (`animation.service.ts`):** Centralizes all GSAP ScrollTrigger functionality, dynamic media queries, and 3D levitation logic.
* **About Component (`about.component.ts`):** Hosts the interactive canvas and parallax-driven cards highlighting core features.
* **Contact Component (`contact.component.ts`):** Streamlined action point equipped with a direct WhatsApp integration to facilitate rapid conversions.

---

*Crafted for premium security and sophisticated design.* 🛡️
