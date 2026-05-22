import { supabase } from "../../../../shared/infrastructure/supabase/client";
import { User } from "../../domain/entities/User";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class SupabaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) throw error;

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", data.user.id)
      .single();

    return {
      id: data.user.id,
      email: data.user.email!,
      username: profile?.username ?? "",
      avatarUrl: profile?.avatar_url ?? undefined,
    };
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Supabase puede retornar null en data.user si requiere confirmación de email
    const userId = data.user?.id;
    if (!userId) throw new Error("No se pudo crear el usuario");

    // Verificar si el perfil ya existe antes de insertar
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: userId, username });
      if (profileError) throw new Error(profileError.message);
    }

    return { 
      id: userId, 
      email: data.user?.email ?? email, 
      username 
    };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    return {
      id: user.id,
      email: user.email!,
      username: profile?.username ?? "",
      avatarUrl: profile?.avatar_url ?? undefined,
    };
  }
}