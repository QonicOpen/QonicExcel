
export async function selectCell(row: number, column: number): Promise<void> {
    return Excel.run(async function (context) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const cell = sheet.getCell(row, column);
        cell.select();
        await context.sync();
    })
}
