import Button from "./Button";
import React from "react";
import {PressEvent} from "@react-types/shared/src/events";
import classNames from "../../utils/class-names";

interface ButtonOverlayProps {
    onPress: (e: PressEvent) => void;
    label: string;
    variant?:  'primary' | 'secondary' | 'error' | 'error-ghost' | 'text' | 'basic'
    className?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    icon?: React.FC
}

export const ButtonOverlay: React.FC<ButtonOverlayProps> = ({ onPress, label, variant = "primary", isLoading = false, isDisabled = false, icon, className = '' }: ButtonOverlayProps) => {
    return (
        <Button variant={variant} size="lg" onPress={onPress} isDisabled={isDisabled} icon={icon} isLoading={isLoading}
                className={classNames("z-9999 fixed left-1/2 -translate-x-1/2 bottom-10 w-44 flex justify-center", className)}>{label}</Button>
    )
}