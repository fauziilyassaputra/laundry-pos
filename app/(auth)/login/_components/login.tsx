"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constant";
import {
  loginSchemaForm,
  loginSchemaType,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM,
  );
  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    startTransition(() => {
      loginAction(formData);
    });
  });

  useEffect(() => {
    if (loginState.status == "error") {
      toast.error("Login failed", {
        description: loginState.errors?._form?.[0],
      });
      startTransition(() => {
        loginAction(null);
      });
    }
  }, [loginState]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>please login to access all features</CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FieldGroup>
            <FormInput
              name="email"
              form={form}
              label="Email"
              placeHolder="Insert email here"
              type="email"
            />
            <FormInput
              name="password"
              form={form}
              label="password"
              placeHolder="Insert password here"
              type="password"
            />
          </FieldGroup>
          <Button type="submit">
            {isPendingLogin ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
