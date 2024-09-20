import {Loading} from "../elements/Loading";
import React from "react";
import {ButtonOverlay} from "../elements/ButtonOverlay";

export const LoadDataFilters: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loading message={"Retrieving properties from the model..."}/>
            <ButtonOverlay className="w-60" onPress={() => {}} label="Loading properties..." isDisabled={true} isLoading={true}/>
        </div>
    )
}