import { useEffect, useState, type PropsWithChildren } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@shared/infrastructure/supabase/client';
import { useAuthStore } from '../store/authStore';
import { SupabaseAuthRepository } from '../../infrastructure/repositories/SupabaseAuthRepository';

const authRepo = new SupabaseAuthRepository();

export function AuthProvider({ children }: PropsWithChildren) {
  const { user, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const currentUser = await authRepo.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
        setIsReady(true); // ← marcar listo después del primer check
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isReady) return; // ← no navegar hasta que esté listo

    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [user, segments, isReady]);

  return <>{children}</>;
}