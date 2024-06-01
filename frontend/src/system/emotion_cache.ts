"use client";

import createCache from "@emotion/cache";

// eslint-disable-next-line
function createEmotionCache() {
  return createCache({ key: "css", prepend: true });
}

export const emotionCache = createEmotionCache();
