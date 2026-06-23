/// <reference path="../../../api/config/auth.ts" />

import { registry } from "@repo/api/registry";
import { createTuyau } from "@tuyau/core/client";
import { createTuyauReactQueryClient } from "@tuyau/react-query";

export const tuyau = createTuyau({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3333",
  registry,
  headers: { Accept: "application/json" },
  credentials: "include",
  redirect: "manual",
});

export const query = createTuyauReactQueryClient({ client: tuyau });
