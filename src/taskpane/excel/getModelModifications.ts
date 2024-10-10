import {ModelData, ModelModifications} from "../utils/types";

export async function getUpdatedModelData(): Promise<ModelData> {
    return Excel.run(async function (context): Promise<ModelData> {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        const usedRange = sheet.getUsedRange();
        usedRange.load(["values", "rowCount", "columnCount"]);
        await context.sync()

        const lastColumnIndex = usedRange.columnCount - 1;
        const updatedData = [] as Record<string, string>[];
        for (let row = 1; row < usedRange.values.length; row++) {
            let record = {} as Record<string, any>;
            for (let column = 0; column <= lastColumnIndex; column++) {
                const fieldName = usedRange.values[0][column]
                const fieldValue = usedRange.values[row][column]
                if(!!fieldValue) record[fieldName] = isJSON(fieldValue) ? JSON.parse(fieldValue) : fieldValue;
            }

            updatedData.push(record);
        }

        return { records: updatedData } as ModelData
    })
}

export function computeModifications(oldData: ModelData, newData: ModelData): ModelModifications {
    const changes = {} as Record<string, Record<string, string>>
    const availableFields = Object.keys(oldData.records[0])

    for (const newRow of newData.records) {
        const oldRow = oldData.records.find(row => row.Guid === newRow.Guid);
        if (!oldRow) continue;

        const rowId = newRow.Guid
        for (const [field, value] of Object.entries(newRow)) {
            if (!availableFields.includes(field)) continue;
            if (!oldRow[field] && !value) continue;
            const newValue = !!value ? value : null;
            if (JSON.stringify(oldRow[field]) !== JSON.stringify(newValue)) {
                changes[field] = {...changes[field], [rowId]: newValue}
            }
        }
    }

    return {Values: changes}
}

function isJSON(str) {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
}