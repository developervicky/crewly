"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import React from "react";

const Home = () => {
  const { status } = useSession();

  if (status === "authenticated") {
    redirect(`/crew`);
  } else if (status === "loading") {
    return null;
  }

  return (
    <>
      <div className="relative h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 border-2 border-stone-500 p-4 rounded-xl">
          <h1 className="text-2xl font-semibold tracking-wide">crewly</h1>
          <p className="font-extralight">
            The best way to connect with your crews
          </p>
          <Button
            onClick={() => {
              signIn("google", { redirectTo: "/crew" });
            }}
          >
            <FaGoogle className="mr-2" />
            Google
          </Button>
        </div>
        <div className="absolute bottom-4 right-4">
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default Home;
