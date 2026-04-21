import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>please login to access all features</CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardFooter></CardFooter>
    </Card>
  );
}
