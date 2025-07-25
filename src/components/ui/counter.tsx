'use client';

import cn from 'classnames';
import { PlusIcon } from '@/components/icons/plus-icon';
import { MinusIcon } from '@/components/icons/minus-icon';
import { twMerge } from 'tailwind-merge';
import { PlusIconNew } from '@/components/icons/plus-icon';
import { MinusIconNew } from '@/components/icons/minus-icon';

type ButtonEvent = (
  e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
) => void;

type CounterProps = {
  value: number;
  variant?:
    | 'helium'
    | 'neon'
    | 'argon'
    | 'oganesson'
    | 'single'
    | 'details'
    | 'pillVertical'
    | 'big'
    | 'text'
    | 'bordered'
    | 'yellow'
    | 'florine';
  onDecrement: ButtonEvent;
  onIncrement: ButtonEvent;
  className?: string;
  disabled?: boolean;
};

const variantClasses = {
  helium:
    'w-7 h-18 sm:w-20 sm:h-7 md:h-9 md:w-24 bg-[#F11602] flex-col-reverse sm:flex-row absolute sm:static bottom-3 ltr:right-3 rtl:left-3 sm:bottom-0 ltr:sm:right-0 ltr:sm:left-0 text-light rounded',
  neon: 'w-full h-7 md:h-9 bg-[#F11602] text-light rounded',
  argon:
    'w-7 h-18 sm:w-20 sm:h-7 md:h-9 md:w-24 bg-[#F11602] flex-col-reverse sm:flex-row text-light rounded',
  oganesson:
    'w-20 h-8 md:w-24 md:h-10 bg-[#F11602] text-light rounded-full shadow-500',
  single:
    'order-5 sm:order-4 w-9 sm:w-24 h-24 sm:h-10 bg-[#F11602] text-light rounded-full flex-col-reverse sm:flex-row absolute sm:relative bottom-2 sm:bottom-auto ltr:right-2 rtl:left-0 ltr:sm:right-auto ltr:sm:left-auto ml-auto',
  details:
    'order-5 sm:order-4 w-full sm:w-24 h-10 bg-[#F11602] text-light rounded-full',
  pillVertical:
    'flex-col-reverse items-center w-8 h-24 bg-gray-100 text-heading rounded-full',
  big: 'w-full h-14 rounded text-light bg-[#F11602] inline-flex justify-between',
  text: 'w-7 h-18 sm:w-20 sm:h-7 md:h-9 md:w-24 bg-[#F11602] flex-col-reverse sm:flex-row text-light rounded',
  bordered:
    'w-full h-12 border border-gray-300 bg-white text-heading rounded',
  yellow: 'w-full h-7 md:h-9 bg-yellow-400 text-black rounded',
  florine: 'w-full h-10 bg-gray-100 text-heading rounded',
};

const Counter: React.FC<CounterProps> = ({
  value,
  variant = 'helium',
  onDecrement,
  onIncrement,
  className,
  disabled,
}) => {
  const size = variant === 'single' ? '10' : '12';
  
  return (
    <div
      className={twMerge(
        cn(
          'flex overflow-hidden rounded border border-border-200',
          {
            'pointer-events-none cursor-not-allowed': disabled,
            'border-0': variant !== 'bordered',
          },
          variantClasses[variant],
          className,
        ),
      )}
    >
      <button
        onClick={onDecrement}
        disabled={disabled}
        className={
          variant !== 'florine'
            ? cn(
                'cursor-pointer p-2 transition-colors duration-200 hover:bg-[#F11602]-hover focus:outline-0',
                {
                  'px-3 py-3 sm:px-2': variant === 'single',
                  'px-5': variant === 'big',
                  'border-0 border-r border-gray-300 px-5 hover:border-accent hover:!bg-transparent hover:!text-accent':
                    variant === 'bordered',
                  'hover:!bg-gray-100': variant === 'pillVertical',
                },
              )
            : cn('p-2 text-base', disabled ? 'text-[#c1c1c1]' : 'text-accent')
        }
        title={disabled ? 'Out of stock' : ''}
      >
        <span className="sr-only">Minus</span>
        {variant !== 'florine' ? (
          <MinusIcon className="md:w-4.5 h-3.5 w-3.5 stroke-2.5 md:h-4.5" />
        ) : (
          <MinusIconNew />
        )}
      </button>
      <div
        className={cn(
          'flex flex-1 items-center justify-center px-3 text-sm font-semibold',
          variant === 'pillVertical' && '!px-0 text-heading',
          variant === 'bordered' &&
            'border-t border-b border-gray-300 !px-8 text-heading',
        )}
      >
        {value}
      </div>
      <button
        onClick={onIncrement}
        disabled={disabled}
        className={
          variant !== 'florine'
            ? cn(
                'cursor-pointer p-2 transition-colors duration-200 hover:bg-[#F11602]-hover focus:outline-0',
                {
                  'px-3 py-3 sm:px-2': variant === 'single',
                  'px-5': variant === 'big',
                  'border border-gray-300 px-5 hover:border-accent hover:!bg-transparent hover:!text-accent ltr:rounded-r rtl:rounded-l':
                    variant === 'bordered',
                  'hover:!bg-gray-100': variant === 'pillVertical',
                },
              )
            : cn('p-2 text-base', disabled ? 'text-[#c1c1c1]' : 'text-accent')
        }
        title={disabled ? 'Out of stock' : ''}
      >
        <span className="sr-only">Plus</span>
        {variant !== 'florine' ? (
          <PlusIcon className="md:w-4.5 h-3.5 w-3.5 stroke-2.5 md:h-4.5" />
        ) : (
          <PlusIconNew />
        )}
      </button>
    </div>
  );
};

export default Counter;