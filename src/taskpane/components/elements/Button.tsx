import React, {createElement, FC, PropsWithChildren, useRef} from 'react'
import {useButton} from '@react-aria/button'
import {AriaButtonProps} from '@react-types/button'
import classNames from '../../utils/class-names'

type IElementSize = 'tiny' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'

interface CustomButtonProps {
    variant?: 'primary' | 'secondary' | 'error' | 'error-ghost' | 'text' | 'basic'
    size?: IElementSize
    shape?: 'round' | 'circle' | 'default'
    isLoading?: boolean
    icon?: FC | null
}

interface Props extends AriaButtonProps<'a' | 'button'>, CustomButtonProps {
    className?: string
    overrideTheme?: boolean
    assignedRef?: React.MutableRefObject<null> | null
}

const sharedCls =
    'inline-flex items-center font-medium shadow-sm focus:outline-none focus:ring-offset-2 focus:ring-offset-white ' +
    'disabled:cursor-not-allowed'

const sizeCls = {
    tiny: 'px-1.5 py-1 text-sm',
    xs: 'px-2.5 py-1 text-sm',
    sm: 'px-3 py-2 text-md leading-4',
    md: 'px-5 py-2 text-sm leading-4 h-10',
    lg: 'px-5 py-3 text-md leading-4 h-12',
    xl: 'px-6 py-3.5 text-base h-12',
    '2xl': 'px-6 py-3.5 text-base h-[52px]',
    '3xl': 'px-7 py-4 text-base h-[52px]',
    '4xl': 'px-7 py-4 text-base h-14',
    '5xl': 'px-8 py-5 text-base h-14',
    '6xl': 'px-8 py-5 text-base h-16',
    '7xl': 'px-9 py-6 text-base h-18'
}

const variantCls = {
    primary:
        'bg-primary-500 border-transparent hover:bg-primary-700 ' +
        'disabled:pointer-events-none focus:ring-primary-500 focus:ring-2 ' +
        'font-semibold text-qonic-black disabled:bg-gray-100',
    secondary:
        'bg-transparent border border-primary-500 text-primary-500 font-semibold hover:text-primary-700 hover:border-primary-700 focus:outline-none focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-100',
    error:
        'text-white font-semibold bg-red-500 hover:bg-red-600 ' +
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ' +
        'disabled:!opacity-100 disabled:!bg-gray-100 disabled:text-gray-400 disabled:hover:bg-gray-100 ',
    'error-ghost':
        'text-red-500 font-semibold border border-red-500 hover:text-red-600 hover:border-red-600 ' +
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ' +
        'disabled:!opacity-100 disabled:!border-gray-100 disabled:text-gray-400 disabled:hover:border-gray-100 ',
    text: 'bg-transparent border-0 text-qonic-black font-semibold text-qonic-black shadow-inherit hover:text-qonic-slate-800 pl-0 pr-0 pt-0 pb-0 focus:ring-0 focus:outline-none',
    basic:
        'bg-transparent border border-gray-500 text-gray-500 font-semibold hover:text-slate-600 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-100'
}

const shapeCls = {
    default: 'rounded',
    round: 'rounded-full',
    circle: {
        tiny: 'rounded-full p-0.5',
        xs: 'rounded-full p-1',
        sm: 'rounded-full p-1.5',
        md: 'rounded-full p-2',
        lg: 'rounded-full p-2',
        xl: 'rounded-full p-3',
        '2xl': 'rounded-full p-3',
        '3xl': 'rounded-full p-4',
        '4xl': 'rounded-full p-4',
        '5xl': 'rounded-full p-5',
        '6xl': 'rounded-full p-5',
        '7xl': 'rounded-full p-6'
    }
}

function Button({
                    variant = 'primary',
                    shape = 'round',
                    size = 'md',
                    className = '',
                    overrideTheme = false,
                    isLoading,
                    icon,
                    assignedRef = null,
                    children,
                    ...defaultProps
                }: PropsWithChildren<Props>) {
    const ref = useRef(null)
    const {buttonProps} = useButton(defaultProps, ref)

    return (
        <button
            {...buttonProps}
            ref={assignedRef || ref}
            disabled={defaultProps.isDisabled}
            className={classNames(
                sharedCls,
                !overrideTheme && variantCls[variant],
                shape !== 'circle' && sizeCls[size],
                shape === 'circle' ? shapeCls['circle'][size] : shapeCls[shape],
                defaultProps.isDisabled && '',
                className
            )}
        >
            {isLoading ? (
                <div className={classNames('h-6 w-6', Boolean(children) && 'mr-2')}>
                    <svg
                        aria-hidden="true"
                        role="status"
                        className="mt-0.5 h-5 w-5 text-gray-200 animate-spin dark:text-gray-200"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        ></path>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            className="fill-primary-500"
                        ></path>
                    </svg>
                </div>
            ) : (
                <>
                    {icon && (
                        <div
                            className={classNames(
                                'h-6 w-6',
                                Boolean(children) && 'mr-2',
                                defaultProps.isDisabled && 'opacity-50'
                            )}
                        >
                            {createElement(icon)}
                        </div>
                    )}
                </>
            )}
            <span
                className={classNames(
                    'block mb-0.5',
                    defaultProps.isDisabled && 'opacity-50'
                )}
            >
        {children}
                {isLoading && <span>...</span>}
      </span>
        </button>
    )
}

export default Button
