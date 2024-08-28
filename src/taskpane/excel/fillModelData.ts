import toast from "react-hot-toast";

export async function fillModelData(data: Record<string, string>[])
{
    await Excel.run(async function (context) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        const usedRange = sheet.getUsedRange();
        usedRange.load(["rowCount", "columnCount"]);
        await context.sync()

        const lastUsedColumn = usedRange.columnCount + 4;
        const firstColumn = "D";
        const clearRange = sheet.getRange(`${firstColumn}1:${String.fromCharCode(64 + lastUsedColumn)}${usedRange.rowCount}`);
        clearRange.clear(Excel.ClearApplyTo.contents);

        const properties = Array.from(new Set(data.flatMap(item => Object.keys(item))))
        const lastColumn = String.fromCharCode(68 + properties.length - 1);
        const headerRange = sheet.getRange(`${firstColumn}1:${lastColumn}1`);
        headerRange.values = [properties];
        headerRange.format.font.bold = true; // Make headers bold
        const rows = data.map(item => properties.map(prop => item[prop as string] || ""));
        const dataRange = sheet.getRange(`${firstColumn}2:${lastColumn}${data.length + 1}`);
        dataRange.values = rows;
        sheet.getRange(`${firstColumn}:${lastColumn}`).format.autofitColumns()
        await context.sync();
    });
}