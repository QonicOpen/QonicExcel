import {ModelData} from "../utils/types";
import {getColumnLetter} from "./utils";

const lockedColumns = ["Guid", "Class", "MaterialLayerSet", "SpatialLocation: Site", "SpatialLocation: Building", "SpatialLocation: Floor",, "SpatialLocation: Space"]

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


        // Update headers
        const properties = Array.from(new Set(data.records.flatMap(item => {
            return Object.entries(item).flatMap((kvp) => {
                const [key, value] = kvp;
                if (typeof value === 'object') return Object.keys(value).map(subKey => `${key}: ${subKey}`)
                return key;
            });
        })))

        const lastColumn = getColumnLetter(properties.length - 1);
        const headerAddress = `A1:${lastColumn}1`;
        const headerRange = sheet.getRange(headerAddress);
        headerRange.values = [properties];
        headerRange.format.font.bold = true;

        // Update data
        const lastRow = data.records.length + 1;
        const dataAddress = `A2:${lastColumn}${lastRow}`;
        const rows = data.records.map(item => properties.map(property => {
            const [key, subKey] = property.split(': ');
            if (subKey) return item[key][subKey];
            return item[key];
        }));

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
        const lockedColumnIndices = properties.map((property, index) => lockedColumns.includes(property) ? index : -1).filter(index => index !== -1);
        for (let i = 0; i < properties.length; i++) {
            const isLocked = lockedColumnIndices.includes(i);
            const columnLetter = getColumnLetter(i);
            if (!isLocked) sheet.getRange(`${columnLetter}2:${columnLetter}${lastRow}`).format.protection.locked = false;
        }

        await context.sync();
    }).catch(error => {
        console.error(error);
        throw error;
    })
}

