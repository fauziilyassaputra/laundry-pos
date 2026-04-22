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
import { INITIAL_LOGIN_FORM } from "@/constants/auth-constant";
import {
  loginSchemaForm,
  loginSchemaType,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";

export default function Login() {
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  // const [loginState, loginActionState, isPendingLogin] = useActionState();

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(data);
  });
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
          <Button type="submit">Login</Button>
        </form>
      </CardContent>
    </Card>
  );
}
