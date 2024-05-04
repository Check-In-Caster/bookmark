"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { checkPassword } from "./actions";

const PasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["preview-password"]);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const isValidPassword = await checkPassword(password);
    if (isValidPassword) {
      setCookie("preview-password", password, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      toast("Wrong password!");
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <Image
        src="/assets/logos/logo.png"
        alt="logo"
        width={80}
        height={80}
        priority
      />
      <h1 className="mt-8 pb-10 text-3xl font-semibold">Password Required</h1>

      <form className="my-10 flex flex-col gap-y-2" onSubmit={handleSubmit}>
        <Input
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="min-w-64 border-[#7bb353] focus-visible:ring-[#7bb353]"
        />
        <Button className="bg-[#7bb353]" type="submit" disabled={loading}>
          Submit
        </Button>
      </form>
    </main>
  );
};

export default PasswordPage;
