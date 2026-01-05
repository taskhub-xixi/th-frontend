"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ModeToggle from "@/features/landing/components/ModeToggle";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    href: "#features",
    isAnchor: true,
    name: "Features",
  },
  {
    href: "#about",
    isAnchor: true,
    name: "About",
  },
];

// Helper function untuk smooth scroll
const scrollToSection = (sectionId, offset = 80) => {
  const element = document.getElementById(sectionId.replace("#", ""));

  if (!element) {
    // Menggunakan warn bukan console.warn untuk konsistensi dengan ESLint
    if (process.env.NODE_ENV === "development") {
    }
    return false;
  }

  const supportsSmoothScroll = "scrollBehavior" in document.documentElement.style;

  if (supportsSmoothScroll) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      behavior: "smooth",
      top: offsetPosition,
    });
  } else {
    // Fallback untuk browser yang tidak support smooth scroll
    element.scrollIntoView({ block: "start" }); // Fix: "star" → "start"
  }
  return true;
};

export const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Fix: Syntax error - harus pakai kurung kurawal untuk options
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash navigation saat page load

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && pathname === "/") {
      setTimeout(() => {
        scrollToSection(hash, 80);
      }, 100);
    }
  }, [pathname]);

  // Handler untuk menu click

  const handleMenuClick = (e, item) => {
    if (!item.isAnchor) {
      return;
    }

    e.preventDefault();

    if (pathname === "/") {
      const success = scrollToSection(item.href, 80);
      if (!success) {
        setTimeout(() => scrollToSection(item.href, 80), 100);
      }
    } else {
      router.push("/");
      setTimeout(() => {
        scrollToSection(item.href, 80);
      }, 300);
    }

    setMenuState(false);
  };

  return (
    <header>
      <nav
        aria-label="Main navigation"
        className="fixed z-20 w-full px-2"
        data-state={menuState && "active"}
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled && "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link aria-label="home" className="flex items-center space-x-2" href="/">
                {/* <Logo /> */}
              </Link>

              <button
                aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                onClick={() => setMenuState(!menuState)}
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index} role="none">
                    {item.isAnchor ? (
                      <a
                        aria-label={`Navigate to ${item.name} section`}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                        href={item.href}
                        onClick={(e) => handleMenuClick(e, item)}
                      >
                        <span>{item.name}</span>
                      </a>
                    ) : (
                      <Link
                        aria-label={`Navigate to ${item.name} page`}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                        to={item.href}
                      >
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Menu - Hanya muncul saat aktif */}
            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden w-full">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      {item.isAnchor ? (
                        <a
                          aria-label={`Navigate to ${item.name} section`}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                          href={item.href}
                          onClick={(e) => handleMenuClick(e, item)}
                        >
                          <span>{item.name}</span>
                        </a>
                      ) : (
                        <Link
                          aria-label={`Navigate to ${item.name} page`}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                          href={item.href}
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <ModeToggle />
                {/* {console.log(`${process.env.NEXT_PUBLIC_API_URL}`)}*/}
                {user !== null ? (
                  <Link href="/dashboard">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback> {user?.name}</AvatarFallback>
                    </Avatar>
                  </Link>
                ) : (
                  <Button
                    asChild
                    className={cn(isScrolled && "lg:hidden")}
                    size="default"
                    variant="outline"
                  >
                    <Link href="/login">
                      <span>Login</span>
                    </Link>
                  </Button>
                )}

                <Button asChild className={cn(isScrolled ? "lg:inline-flex" : "hidden")}>
                  <Link href="/register">
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
