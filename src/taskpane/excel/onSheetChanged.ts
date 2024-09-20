let eventResult;

export function onSheetChanged(onChanged: (sheetId: string) => void) {
    Excel.run(async (context) => {
        eventResult = context.workbook.worksheets.onActivated.add(() => handleSelectionChange(onChanged));
        await context.sync();
        await handleSelectionChange(onChanged);
    }).catch((error) => console.error(error));
}

function handleSelectionChange(onChanged: (sheetId: string) => void) {
    return Excel.run(async (context) => {
        // get current worksheet
        const worksheet = context.workbook.worksheets.getActiveWorksheet();
        worksheet.load('id');
        await context.sync();
        onChanged(worksheet.id);
    }).catch((error) => console.error(error));
}

export function removeOnSheetChanged() {
    // The `RequestContext` used to create the event handler is needed to remove it.
    // In this example, `eventContext` is being used to keep track of that context.
    Excel.run(eventResult.context, async (context) => {
        eventResult.remove();
        await context.sync();
        eventResult = null;
    }).catch((error) => console.error(error));
}