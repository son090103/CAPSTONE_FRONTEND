export type CategoryKey =
    | "dong-co"
    | "truyen-dong"
    | "treo"
    | "dien-tu"
    | "loc-gio";

export interface Category {
    key: CategoryKey;
    label: string;
    icon: React.ReactNode;
}