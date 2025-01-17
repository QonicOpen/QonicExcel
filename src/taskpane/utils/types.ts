

export interface Model {
    id: string;
    name: string;
    image: string;
    discipline: string;
}

export interface Project {
    id: string;
    name: string;
    image: string;
}

export interface ModelData {
    records: ModelRecord[];
}

export interface ModelRecord {
    Guid: string;
    [key: string]: any;
}

export interface ModelModificationErrors {
    errors: ModificationError[];
}

export interface ModificationError {
    guid: string;
    field: string;
    error: string;
    description: string;
}

export interface CellError {
    row: number;
    column: number;
    cellName: string;
    modificationError: ModificationError;
}

export interface ModelModifications {
    Values: Record<string, Record<string, string>>;
}

export interface ModelProps {
    projectId: string;
    modelId: string;
    sessionId: string;
}

export interface ProductsQuery {
    fields: string[];
    filters: Record<string, string>;
}