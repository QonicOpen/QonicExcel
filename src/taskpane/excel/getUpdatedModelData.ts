
export async function getUpdatedData() {
    return Excel.run(async function (context) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        // get used range
        const usedRange = sheet.getUsedRange();
        usedRange.load(["values", "rowCount", "columnCount"]);

        await context.sync()

        const firstColumnIndex = 3;
        const lastColumnIndex = usedRange.columnCount - 1;

        const updatedData = [] as Record<string, string>[];
        for (let row = 1; row < usedRange.values.length; row++) {
            let record = {} as Record<string, string>;
            for (let column = firstColumnIndex; column <= lastColumnIndex; column++) {
                const fieldName = usedRange.values[0][column];
                record[fieldName] = usedRange.values[row][column];
            }

            updatedData.push(record);
        }

        return updatedData
    });
}