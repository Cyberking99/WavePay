export type FieldType = "text" | "select" | "textarea";

export interface CustomField {
    id: string;
    label: string;
    type: FieldType;
    required: boolean;
    options?: string[];
}