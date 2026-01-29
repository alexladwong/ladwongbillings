"use client";
import Link from "next/link";

import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
  PortalLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import React from "react";
import { Badge } from "./ui/badge";

const menuItems = [
  { name: "Features", href: "#" },
  { name: "Solution", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
];

interface Plan {
  key: string;
}

interface EntitlementsData {
  data?: {
    plans?: Plan[];
  };
}

export function Navbar() {
  const [entitlementsData, setEntitlementsData] =
    useState<EntitlementsData | null>(null);

  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  React.useEffect(() => {
    const fetchEntitlements = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await fetch("/api/billing", {
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            setEntitlementsData(data);
          }
        } catch (error) {
          console.error("Error fetching entitlements:", error);
        }
      }
    };

    fetchEntitlements();
  }, [isAuthenticated, user]);

  const hasEntitlement = (entitlementKey: string): boolean => {
    if (!entitlementsData?.data?.plans) return false;
    return entitlementsData.data.plans.some(
      (plan: Plan) => plan.key === entitlementKey
    );
  };

  return (
    <header>
      <nav className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
        <div className="m-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <h1 className="text-2xl font-bold">
                  Ladwong<span className="text-primary">Billing</span>
                </h1>
              </Link>

              <button className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:pr-4">
                <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {isLoading ? null : (
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                  {user ? (
                    <>
                      <Badge>
                        {hasEntitlement("pro")
                          ? "pro"
                          : hasEntitlement("team")
                          ? "team"
                          : hasEntitlement("free")
                          ? "free"
                          : null}
                      </Badge>
                      <PortalLink
                        className={buttonVariants({
                          size: "sm",
                        })}
                      >
                        <span>Dashboard</span>
                      </PortalLink>
                      <LogoutLink
                        className={buttonVariants({
                          size: "sm",
                          variant: "outline",
                        })}
                      >
                        <span>Logout</span>
                      </LogoutLink>
                    </>
                  ) : (
                    <>
                      <LoginLink
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        <span>Login</span>
                      </LoginLink>

                      <RegisterLink
                        className={buttonVariants({
                          variant: "default",
                          size: "sm",
                        })}
                      >
                        <span>Sign Up</span>
                      </RegisterLink>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
