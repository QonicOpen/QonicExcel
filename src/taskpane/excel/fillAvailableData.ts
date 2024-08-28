
export async function fillAvailableData(fields: string[]) {
    try {
        return await Excel.run(async function (context) {
            const sheet = context.workbook.worksheets.getActiveWorksheet();
            sheet.load("name")

            sheet.getUsedRange().clear();

            sheet.getRange("A1").values = [["Field Name"]];
            sheet.getRange("B1").values = [["Include Field"]];
            sheet.getRange("C1").values = [["Filter Value"]];

            const fieldNamesRange = sheet.getRange(`A2:A${fields.length + 1}`);
            fieldNamesRange.values = fields.map(field => [field]);

            for (let i = 2; i <= fields.length + 1; i++) {
                let range = sheet.getRange(`B${i}`);
                range.dataValidation.rule = {
                    wholeNumber: {
                        formula1: 0,
                        formula2: 1,
                        operator: Excel.DataValidationOperator.between
                    }
                }
                range.values = [[0]];
            }

            sheet.getRange("1:1").format.rowHeight = 30;
            sheet.getRange("C:C").format.columnWidth = 200;
            sheet.getRange("1:1").format.fill.color = "#F2F2F2";  // Make the header row light grey
            sheet.getRange("1:1").format.verticalAlignment = "Center";  // Vertically center the text
            sheet.getRange("1:1").format.font.bold = true;
            sheet.getRange("A:C").format.autofitColumns();

            const borderRange = sheet.getRange(`A1:C${fields.length + 1}`);
            borderRange.format.borders.getItem('EdgeTop').style = 'Double';
            borderRange.format.borders.getItem('EdgeBottom').style = 'Double';
            borderRange.format.borders.getItem('EdgeLeft').style = 'Double';
            borderRange.format.borders.getItem('EdgeRight').style = 'Double';
            await context.sync()
            return sheet.name;
        })
    } catch (error) {
        console.error(error);
        return null;
    }
}
