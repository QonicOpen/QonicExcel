import {Loading} from "../elements/Loading";
import React from "react";
import {ButtonOverlay} from "../elements/ButtonOverlay";

export const LoadQueryData: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loading message={"Retrieving data..."}/>
            <ButtonOverlay onPress={() => {}} label="Importing data..." isDisabled={true} isLoading={true} className="w-60"/>
        </div>
    )
}