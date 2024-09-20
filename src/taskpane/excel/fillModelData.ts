import {ModelData} from "../utils/types";
import {getColumnLetter} from "./utils";

export async function fillModelData(data: ModelData): Promise<void>
{
    return Excel.run(async function (context) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        sheet.protection.unprotect();

        const usedRange = sheet.getUsedRange();
        usedRange.clear(Excel.ClearApplyTo.contents);

        if(data.records.length === 0) {
            await context.sync();
            return;
        }

        const lastColumn = getColumnLetter(Object.keys(data.records[0]).length - 1);
        const lastRow = data.records.length + 1;
        const headerAddress = `A1:${lastColumn}1`;
        const dataAddress = `A2:${lastColumn}${lastRow}`;

        // Update headers
        const properties = Array.from(new Set(data.records.flatMap(item => Object.keys(item))))
        const headerRange = sheet.getRange(headerAddress);
        headerRange.values = [properties];
        headerRange.format.font.bold = true;

        // Update data
        const rows = data.records.map(item => properties.map(prop => item[prop] as string));
        const dataRange = sheet.getRange(dataAddress);
        dataRange.values = rows;
        dataRange.numberFormat = rows.map(row =>
            row.map(_ => '@') // Treat all values as text
        );

        sheet.getRange(`A:${lastColumn}`).format.autofitColumns()
        await context.sync();

        sheet.freezePanes.freezeRows(1); // Make the header row sticky
        sheet.protection.protect({
            allowAutoFilter: true,
            allowFormatCells: true,
            allowFormatColumns: true,
            allowFormatRows: true,
            allowPivotTables: true,
            allowSort: true
        });

        sheet.getRange().format.protection.locked = true; // Lock everything by default
        const guidColumnIndex = properties.indexOf("Guid");
        const classColumnIndex = properties.indexOf("Class");
        for (let i = 0; i < properties.length; i++) {
            const isLocked = i === guidColumnIndex || i === classColumnIndex;
            const columnLetter = getColumnLetter(i);
            if (!isLocked) sheet.getRange(`${columnLetter}2:${columnLetter}${lastRow}`).format.protection.locked = false;
        }

        await context.sync();
    })
}

