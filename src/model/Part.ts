import type { CategoryKey } from "./Categories";

export interface PartSpec {
    label: string;
    value: string;
}

export interface Part {
    id: string;
    category: CategoryKey;
    image: string;
    badge?: { label: string; color: string };
    name: string;
    price: string;
    subtitle: string;
    tag: string;
    specs: PartSpec[];
}