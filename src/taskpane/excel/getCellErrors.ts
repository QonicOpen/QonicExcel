import {CellError, ModelData, ModificationError} from "../utils/types";
import {getColumnLetter} from "./utils";

export async function getCellErrors(modificationErrors: ModificationError[]): Promise<CellError[]> {
    if (!modificationErrors) return [];

    return Excel.run(async function (context): Promise<CellError[]> {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        const usedRange = sheet.getUsedRange();
        usedRange.load(["values", "rowCount", "columnCount"]);
        await context.sync();

        const cellErrors = [] as CellError[];

        for (const error of modificationErrors) {
            const guidColumn = findColumn(usedRange, error.field);
            const fieldRow = findRow(usedRange, error.guid);
            const cellName = `${getColumnLetter(guidColumn)}${fieldRow + 1}`;
            if (guidColumn === null || fieldRow === null) {
                continue;
            }

            cellErrors.push({row: fieldRow, column: guidColumn, cellName, modificationError: error} as CellError);
        }

        return cellErrors;
    })
}

function findColumn(usedRange: Excel.Range, field: string): number | null {
    const headerRow = usedRange.values[0] as string[];
    const columnIndex = headerRow.indexOf(field)
    if (columnIndex === -1) return null;
    return columnIndex
}

function findRow(usedRange: Excel.Range, guid: string): number | null {
    const headerRow = usedRange.values[0] as string[];
    const guidColumn = headerRow.indexOf("Guid");
    if (guidColumn === -1) return null;

    for (let row = 1; row < usedRange.values.length; row++) {
        if (usedRange.values[row][guidColumn] === guid) return row;
    }

    return -1;
}
