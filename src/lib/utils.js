import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import logger from '@/lib/logger';

export function cn(...inputs) {
  logger.debug({ file: 'src/lib/utils.js', function: 'cn', inputs }, 'cn function called');
  return twMerge(clsx(inputs));
}
