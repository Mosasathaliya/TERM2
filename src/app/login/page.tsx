"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber, password, acceptedTerms: accepted }),
      });
      if (resp.ok) {
        router.replace('/');
        return;
      }
      const data = await resp.json().catch(() => ({}));
      setError(data?.message || 'فشل تسجيل الدخول');
    } catch (e) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Speed of Mastery</CardTitle>
          <p className="text-center text-sm text-muted-foreground">تسجيل الدخول</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="id">رقم الهوية</Label>
              <Input id="id" inputMode="numeric" placeholder="أدخل رقم الهوية" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox id="terms" checked={accepted} onCheckedChange={(v) => setAccepted(Boolean(v))} />
              <Label htmlFor="terms" className="text-sm">أوافق على <a href="#" className="underline">الشروط والأحكام</a></Label>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={!accepted || loading}>
              {loading ? '...جاري الدخول' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}