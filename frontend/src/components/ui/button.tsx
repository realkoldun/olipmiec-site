import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/utils/cn';

/**
 * Варианты кнопки
 */
const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        /** Основная кнопка (синяя) */
        primary:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        /** Вторичная кнопка (зелёная) */
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90',
        /** Акцентная кнопка (оранжевая) */
        accent:
          'bg-accent text-accent-foreground shadow-sm hover:bg-accent/90',
        /** Кнопка с обводкой */
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        /** Прозрачная кнопка */
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        /** Только ссылка (без фона) */
        link: 'text-primary underline-offset-4 hover:underline',
        /** Деструктивная кнопка (красная) */
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      },
      size: {
        /** Маленькая кнопка */
        sm: 'h-9 px-3 text-xs',
        /** Стандартная кнопка */
        default: 'h-10 px-4 py-2',
        /** Большая кнопка */
        lg: 'h-11 px-8 text-base',
        /** Кнопка-иконка */
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
