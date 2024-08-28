export async function getModelQuery(): Promise<string> {
    return Excel.run(async function (context) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        const usedRange = sheet.getUsedRange();
        usedRange.load(["values"]);
        await context.sync()

        const includeFields = [] as string[];
        const includeFilters = {} as Record<string, string>;

        for (let row = 1; row < usedRange.values.length; row++) {
            const fieldName = usedRange.values[row][0];
            const includeField = usedRange.values[row][1];
            const filterValue = usedRange.values[row][2];
            if (includeField) includeFields.push(fieldName);
            if (filterValue) includeFilters[fieldName] = filterValue;
        }

        let query = "?";

        if (includeFields.length > 0) {
            query += "fields=" + includeFields.join("&fields=");

            if(includeFields.length > 0) query += "&";
        }


        for (const [key, value] of Object.entries(includeFilters)) {
            query += `filters[${encodeURIComponent(key)}]=${encodeURIComponent(value)}&`;
        }

        return query;
    });
}