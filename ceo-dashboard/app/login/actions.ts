'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const redirectedFrom = String(formData.get('redirectedFrom') ?? '/today');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const params = new URLSearchParams({
      error: 'メールアドレスまたはパスワードが正しくありません',
      redirectedFrom,
    });
    redirect(`/login?${params.toString()}`);
  }

  redirect(redirectedFrom || '/today');
}
