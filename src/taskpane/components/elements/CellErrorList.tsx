import {CellError} from "../../utils/types";
import React from "react";
import {selectCell} from "../../excel/selectCell";

interface CellErrorListProps {
    cellErrors: CellError[];
}

export const CellErrorList: React.FC<CellErrorListProps> = ({cellErrors}: CellErrorListProps) => {
    return (
        <>
            {cellErrors.sort((a, b) => a.row - b.row).map((cellError, index) => (
                <div key={index} className="py-3 border-b border-slate-100 flex justify-start gap-2">
                        <span onClick={() => selectCell(cellError.row, cellError.column)}
                            className="text-gray-500 hover:text-qonic-black cursor-pointer min-w-8 underline">{cellError.cellName}</span>
                    <span className="ml-2 text-qonic-gray-400">{cellError.modificationError.description}</span>
                </div>
            ))}
        </>
    )

}