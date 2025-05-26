'use client'; 

import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react'; // Or your authentication library

export function AuthButtons() {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Or a loading indicator if you prefer
    }

    return (
        <>
            {session?.user && (
                <button
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => signOut()}
                >
                    LogOut
                </button>
            )}
            {!session?.user && (
                <button
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => signIn()}
                >
                    Signin
                </button>
            )}
        </>
    );
}
