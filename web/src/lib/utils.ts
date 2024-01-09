import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function reorder<T>(
  list: T[],
  sourceIndex: number,
  destinationIndex: number,
) {
  const result = Array.from(list);
  const [removed] = result.splice(sourceIndex, 1); // Remove the item from the source
  result.splice(destinationIndex, 0, removed!); // Insert the removed item to the destination
  return result;
}
