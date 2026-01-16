"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function SubmitButton() {
  const [isSaving, setIsSaving] = React.useState(false);
  return (
    <Button type="submit" className="w-full" disabled={isSaving}>
      {isSaving ? "Sending..." : "Send reset link"}
    </Button>
  );
}

export function ForgotPasswordForm() {
  // const { appContext } = useSelector((o) => o.appState);
  const [email, setEmail] = React.useState("");

  return (
    <Card className="border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription className="text-pretty">
          Enter your email and we’ll send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="text-sm">
        <span className="text-muted-foreground">Remembered your password?</span>
        <Link
          href={`/${"appContext?.merchant.tenantCode"}/login`}
          className="ml-2 text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
