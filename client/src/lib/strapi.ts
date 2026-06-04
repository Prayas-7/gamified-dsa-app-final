export const strapi = {
  url: 'http://localhost:1337/api',
  get: async (path: string) => {
    // We add { cache: 'no-store' } to force a fresh fetch every time
    const response = await fetch(`${strapi.url}${path}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.json();
  },
};

import { PuzzleStage } from '@/src/types/game';
export const getRandomChallengeByTopic = async (topicId: string): Promise<PuzzleStage | null> => {
  try {
    const response = await strapi.get(
      `/challenges?filters[topic][topicId][$eq]=${topicId}&populate=*`
    );

    const allChallenges = response.data;

    if (!allChallenges || allChallenges.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * allChallenges.length);
    const randomChallenge = allChallenges[randomIndex];

    // Strapi sometimes returns JSON fields as strings. 
    // We safely parse them here to prevent component crashes.
    const safeParseJSON = (data: unknown) => {
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error("Failed to parse JSON field from Strapi:", e);
          return [];
        }
      }
      return data; // It's already an array/object
    };

    return {
      id: randomChallenge.id.toString(), 
      type: 'puzzle',
      instruction: randomChallenge.instruction || 'No instructions provided.',
      initialState: safeParseJSON(randomChallenge.initialState),
      targetState: safeParseJSON(randomChallenge.targetState),
      targetValue: randomChallenge.targetValue,
    } as PuzzleStage;

  } catch (error) {
    console.error("Failed to fetch random challenge:", error);
    return null;
  }
};