"use client";

import { useSyncExternalStore } from "react";

const PHONE_QUERY = "(max-width: 767px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(PHONE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(PHONE_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** True below 768px — dedicated phone chrome, not a stacked desktop layout. */
export function usePhoneLayout() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
