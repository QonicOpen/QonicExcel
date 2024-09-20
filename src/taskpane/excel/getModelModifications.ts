import {ModelData, ModelModifications} from "../utils/types";

export async function getModelModifications(prevData: ModelData): Promise<ModelModifications> {
    return getUpdatedModelData().then((newData) => newData ? computeModifications(prevData, newData) : null)
}

async function getUpdatedModelData(): Promise<ModelData> {
    return Excel.run(async function (context): Promise<ModelData> {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        const usedRange = sheet.getUsedRange();
        usedRange.load(["values", "rowCount", "columnCount"]);
        await context.sync()

        const lastColumnIndex = usedRange.columnCount - 1;
        const updatedData = [] as Record<string, string>[];
        for (let row = 1; row < usedRange.values.length; row++) {
            let record = {} as Record<string, string>;
            for (let column = 0; column <= lastColumnIndex; column++) {
                const fieldName = usedRange.values[0][column]
                if(!!fieldName) record[fieldName] = usedRange.values[row][column] as string;
            }

            updatedData.push(record);
        }

        return { records: updatedData } as ModelData
    })
}

function computeModifications(oldData: ModelData, newData: ModelData): ModelModifications {
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
            if (oldRow[field] !== newValue) {
                // log old and new value and guid and the types of the values
                console.log(`Field: ${field}, Old: ${typeof oldRow[field]} ${oldRow[field]}, New: ${typeof newValue} ${newValue}, Guid: ${rowId}`)
                changes[field] = {...changes[field], [rowId]: newValue}
            }
        }
    }

    return {Values: changes}
}