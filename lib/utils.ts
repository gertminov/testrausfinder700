export { cn } from "cn";


export function toEntries<K extends string, V> (obj: Partial<Record<K, V>>): [K, V][] { return Object.entries(obj) as [K, V][]; }