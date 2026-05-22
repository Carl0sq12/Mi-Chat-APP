declare const process: {
env: {
    readonly EXPO_PUBLIC_SUPABASE_URL: string;
    readonly EXPO_PUBLIC_ANON_KEY: string;
    readonly [key: string]: string | undefined;
};
};