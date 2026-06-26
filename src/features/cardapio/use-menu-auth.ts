"use client";

import { useEffect } from "react";
import { refreshAuthToken } from "@/hooks/use-auth";

export function useMenuAuth() {
  useEffect(() => {
    void refreshAuthToken().catch(console.error);
  }, []);
}
