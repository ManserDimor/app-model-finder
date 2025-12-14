import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { DemoModeBanner } from "@/components/ui/demo-mode-banner";
import { registerSchema, getFirstError } from "@/lib/validation";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = registerSchema.safeParse({ username, email, password });
    if (!result.success) {
      const fieldErrors: { username?: string; email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as "username" | "email" | "password";
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({ title: getFirstError(result.error), variant: "destructive" });
      return;
    }

    const success = register(username, email, password);
    if (success) {
      toast({ title: "Demo account created successfully!" });
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DemoModeBanner />
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">S</span>
            </div>
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Sign up to start watching and uploading (Demo Mode)</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="YourUsername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must be 6+ characters with uppercase, lowercase, and number
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">
                Create demo account
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
