'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Simple dropdown menu implementation
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className="relative"
      onBlur={(e) => {
        // Close when clicking outside
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsOpen(false);
        }
      }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { isOpen, setIsOpen } as any)
          : child,
      )}
    </div>
  );
};

interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const DropdownMenuTrigger = ({
  children,
  asChild = false,
  isOpen = false,
  setIsOpen = () => {},
  ...props
}: DropdownMenuTriggerProps) => {
  const handleClick = () => setIsOpen(!isOpen);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: handleClick,
    } as any);
  }

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
};

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end';
  forceMount?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const DropdownMenuContent = ({
  children,
  className,
  align = 'start',
  forceMount = false,
  isOpen = false,
  setIsOpen = () => {},
  ...props
}: DropdownMenuContentProps) => {
  if (!isOpen && !forceMount) return null;

  return (
    <div
      className={cn(
        'absolute top-full mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50',
        align === 'end' ? 'right-0' : 'left-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const DropdownMenuItem = ({
  className,
  children,
  asChild = false,
  ...props
}: DropdownMenuItemProps) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
        className,
      ),
      ...props,
    } as any);
  }

  return (
    <div
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuLabel = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props}>
    {children}
  </div>
);

const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
