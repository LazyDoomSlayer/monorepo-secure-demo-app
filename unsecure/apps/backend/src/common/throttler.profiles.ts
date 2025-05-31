import { seconds, minutes } from '@nestjs/throttler';

export const SHORT = { short: { limit: 3, ttl: seconds(1) } };
export const MEDIUM = { medium: { limit: 20, ttl: seconds(10) } };
export const LONG = { long: { limit: 100, ttl: minutes(1) } };
