import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, registerSchema, getFirstError } from "@/lib/validation";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, isAuthenticated, isLoading } = useAuth();
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [registerErrors, setRegisterErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as "email" | "password";
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setLoginErrors(fieldErrors);
      toast({ title: getFirstError(result.error), variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (error) {
      toast({ title: error.message || "Failed to sign in", variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterErrors({});
    
    const result = registerSchema.safeParse({ 
      username: registerUsername, 
      email: registerEmail, 
      password: registerPassword 
    });
    
    if (!result.success) {
      const fieldErrors: { username?: string; email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as "username" | "email" | "password";
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setRegisterErrors(fieldErrors);
      toast({ title: getFirstError(result.error), variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(registerEmail, registerPassword, registerUsername);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({ title: "This email is already registered. Please sign in instead.", variant: "destructive" });
      } else {
        toast({ title: error.message || "Failed to create account", variant: "destructive" });
      }
    } else {
      toast({ title: "Account created successfully!" });
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <span className="text-2xl font-bold text-primary-foreground">S</span>
          </div>
          <CardTitle className="text-2xl">Welcome to StreamTube</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-4" style={{ width: "calc(100% - 32px)" }}>
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={loginErrors.email ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {loginErrors.email && (
                    <p className="text-sm text-destructive">{loginErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={loginErrors.password ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {loginErrors.password && (
                    <p className="text-sm text-destructive">{loginErrors.password}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="YourUsername"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    className={registerErrors.username ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {registerErrors.username && (
                    <p className="text-sm text-destructive">{registerErrors.username}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className={registerErrors.email ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {registerErrors.email && (
                    <p className="text-sm text-destructive">{registerErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className={registerErrors.password ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {registerErrors.password && (
                    <p className="text-sm text-destructive">{registerErrors.password}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Must be 6+ characters with uppercase, lowercase, and number
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
