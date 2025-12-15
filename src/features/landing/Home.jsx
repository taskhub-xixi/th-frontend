import Link from "next/link";
import Features from "@/features/landing/components/Features";
import Footer from "@/features/landing/components/Footer";
import { HeroHeader } from "@/features/landing/components/Header";
import { Button } from "@/components/ui/button";
import About from "@/features/landing/components/About";
// import { LogoCloud } from "../logo-cloud"; // hapus sementara

export default function Home() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section>
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-32 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              {/* Judul */}
              <h1 className="text-balance text-5xl font-medium md:text-6xl">TaskHub</h1>

              {/* Deskripsi */}
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg">
                Platform micro-jobs terpercaya yang menghubungkan pencari kerja dengan pemberi
                kerja. Mulai cari atau tawarkan pekerjaan hari ini!
              </p>
              {/* Buttons */}
              <div className="mt-12">
                <div className="flex items-center justify-center gap-4">
                  <Button asChild className="rounded-lg" size="default" variant="default">
                    <Link href="/register">Get Started</Link>
                  </Button>

                  {/* Tombol kedua - bisa disesuaikan */}
                  <Button asChild className="rounded-lg" size="lg" variant="ghost">
                    <Link href="/register">Browse Jobs</Link>
                  </Button>
                </div>

                {/* Mock Card */}
                <div
                  aria-hidden
                  className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left"
                >
                  <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                    <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] before:opacity-50" />
                  </div>
                  <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                    <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                      <AppComponent />
                      <div className="bg-muted rounded-[1rem] p-4 pb-16 dark:bg-white/5" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <LogoCloud /> */}
      </main>
      <section aria-label="Features section" className="scroll-mt-20" id="features">
        <Features />
      </section>
      <section aria-label="about section" className="scroll-mt-20" id="about">
        <About />
      </section>
      <Footer />
    </>
  );
}

const AppComponent = () => {
  return (
    <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
      <div className="flex items-center gap-1.5 text-orange-400">
        <svg
          className="size-5"
          height="1em"
          viewBox="0 0 32 32"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none">
            <path
              d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"
              fill="#ff6723"
            />
            <path
              d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"
              fill="#ffb02e"
            />
          </g>
        </svg>
        <div className="text-sm font-medium">.</div>
      </div>

      <div className="space-y-3">
        <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">.</div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="space-x-1">
              {/* <span className="text-foreground align-baseline text-xl font-medium">8,081</span>*/}
              {/* <span className="text-muted-foreground text-xs">Steps/day</span>*/}
            </div>
            {/* <div className="flex h-5 items-center rounded bg-gradient-to-l from-emerald-400 to-indigo-600 px-2 text-xs text-white"></div>*/}
          </div>

          <div className="space-y-1">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-xl font-medium">.</span>
              <span className="text-muted-foreground text-xs">.</span>
            </div>
            <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded px-2 text-xs dark:bg-white/20">
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
