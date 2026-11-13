'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Eye, EyeOff, Loader2, ServerCog } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { api } from '@/lib/api/client';
import { ApiError, getErrorMessage } from '@/lib/api/errors';
import { useLogin } from './hooks';

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginValues = z.infer<typeof loginSchema>;

/** Only allow same-site relative redirects (prevents open-redirect via ?next=). */
function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get('session') === 'expired';
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);
  const clearedStaleSession = useRef(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    // Clear a stale/expired cookie once, so the route guard doesn't keep letting it through.
    if (sessionExpired && !clearedStaleSession.current) {
      clearedStaleSession.current = true;
      api.post('/auth/logout').catch(() => undefined);
    }
  }, [sessionExpired]);

  useEffect(() => {
    // Warm up the API (free-tier hosts sleep when idle). If it's slow, tell the user why.
    const slow = setTimeout(() => setServerWaking(true), 1500);
    fetch('/api/v1/health')
      .catch(() => undefined)
      .finally(() => {
        clearTimeout(slow);
        setServerWaking(false);
      });
    return () => clearTimeout(slow);
  }, []);

  const onSubmit = form.handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: ({ admin }) => {
        toast.success(`Welcome back, ${admin.name}`);
        router.replace(safeNext(searchParams.get('next')));
        router.refresh();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 401) {
          form.setError('password', { message: ' ' });
          form.setError('email', { message: ' ' });
        }
      },
    });
  });

  const { errors, isSubmitting } = form.formState;
  const pending = login.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {sessionExpired && !login.isError && (
        <Notice tone="info" icon={AlertCircle}>
          Your session has ended. Please sign in again.
        </Notice>
      )}
      {serverWaking && (
        <Notice tone="info" icon={ServerCog}>
          Waking up the server — the first request can take up to a minute on the free hosting tier.
        </Notice>
      )}
      {login.isError && (
        <Notice tone="error" icon={AlertCircle}>
          {getErrorMessage(login.error, 'Unable to sign in. Please try again.')}
        </Notice>
      )}

      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="admin@doctortracker.app"
            aria-invalid={!!errors.email}
            className="h-10"
            {...form.register('email')}
          />
          <FieldError errors={errors.email?.message?.trim() ? [errors.email] : undefined} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className="h-10 pr-10"
              {...form.register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-lg outline-none focus-visible:ring-2"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldError errors={errors.password?.message?.trim() ? [errors.password] : undefined} />
        </Field>
      </FieldGroup>

      <Button type="submit" size="lg" className="h-10 w-full text-sm" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}

function Notice({
  tone,
  icon: Icon,
  children,
}: {
  tone: 'info' | 'error';
  icon: typeof AlertCircle;
  children: React.ReactNode;
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={
        tone === 'error'
          ? 'border-destructive/20 bg-destructive/5 text-destructive flex gap-2.5 rounded-lg border p-3 text-sm'
          : 'border-primary/20 bg-accent text-accent-foreground flex gap-2.5 rounded-lg border p-3 text-sm'
      }
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
