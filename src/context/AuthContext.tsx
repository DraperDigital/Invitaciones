import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for MOCK MODE
        if (!import.meta.env.VITE_SUPABASE_URL) {
            console.log('Running in MOCK MODE (Auth)');
            setSession({ user: { id: 'mock-user-id', email: 'demo@invitaciones.mx' } } as any);
            setUser({ id: 'mock-user-id', email: 'demo@invitaciones.mx' } as any);
            setLoading(false);
            return;
        }

        let isMounted = true;
        let unsubscribe: (() => void) | undefined;

        // Dynamic import keeps initial landing page bundle completely free of @supabase/supabase-js
        import('../lib/supabase')
            .then(({ supabase }) => {
                if (!isMounted) return;

                supabase.auth.getSession().then(({ data: { session } }) => {
                    if (!isMounted) return;
                    setSession(session);
                    setUser(session?.user ?? null);
                    setLoading(false);
                });

                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    if (!isMounted) return;
                    setSession(session);
                    setUser(session?.user ?? null);
                    setLoading(false);
                });

                unsubscribe = () => subscription.unsubscribe();
            })
            .catch((err) => {
                console.error('Failed to load auth client:', err);
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const signOut = async () => {
        const { supabase } = await import('../lib/supabase');
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
