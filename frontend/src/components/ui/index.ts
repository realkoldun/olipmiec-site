/**
 * UI Components — базовые компоненты интерфейса
 * 
 * @module @/components/ui
 */

export { Button } from './button/button';
export { buttonVariants } from './button/button.variants'
export type { ButtonProps } from './button/button';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card/card';

export { Input } from './input/input';
export type { InputProps } from './input/input.types';

export { Label } from './label/label';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select/select';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog/dialog';

export { Pagination } from './pagination';
export type { PaginationProps } from './pagination';
