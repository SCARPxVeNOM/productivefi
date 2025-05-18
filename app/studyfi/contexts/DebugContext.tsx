"use client";

import React, { createContext, useContext, useState } from "react";

interface DebugContextType {
    isDebug: boolean;
    setIsDebug: (value: boolean) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: React.ReactNode }) {
    const [isDebug, setIsDebug] = useState(false);

    return (
        <DebugContext.Provider value={{ isDebug, setIsDebug }}>
            {children}
        </DebugContext.Provider>
    );
}

export function useDebug() {
    const context = useContext(DebugContext);
    if (context === undefined) {
        throw new Error("useDebug must be used within a DebugProvider");
    }
    return context;
} 