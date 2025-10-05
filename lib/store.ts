import type { PayloadStore } from "@/lib/types";

export const store: PayloadStore = {};

// Helper functions for type safety
export const setPayload = (key: "payload1" | "payload2", data: any) => {
  store[key] = data;
  console.log(`Set ${key}:`, store[key]);
};

export const getPayloads = () => {
  console.log("Getting payloads:", store);
  return {
    payload1: store.payload1,
    payload2: store.payload2,
  };
};

export const clearStore = () => {
  store.payload1 = undefined;
  store.payload2 = undefined;
};
