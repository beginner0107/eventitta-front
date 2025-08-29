'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within DropdownMenu');
  }
  return context;
};

// Simple dropdown menu implementation
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative" ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const DropdownMenuTrigger = ({ children, asChild = false, ...props }: DropdownMenuTriggerProps) => {
  const { isOpen, setIsOpen } = useDropdown();
  const handleClick = () => setIsOpen(!isOpen);

  if (asChild && React.isValidElement(children)) {
    return (
      <Slot {...props} onClick={handleClick}>
        {children}
      </Slot>
    );
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
}

const DropdownMenuContent = ({
  children,
  className,
  align = 'start',
  forceMount = false,
  ...props
}: DropdownMenuContentProps) => {
  const { isOpen } = useDropdown();

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
  onClick,
  ...props
}: DropdownMenuItemProps) => {
  const { setIsOpen } = useDropdown();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(false); // Close dropdown when item is clicked
    onClick?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    // For Next.js Link components, close dropdown before navigation
    const handleAsChildClick = () => {
      setIsOpen(false);
    };

    return (
      <Slot
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        onClick={handleAsChildClick}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <div
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        className,
      )}
      onClick={handleClick}
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
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props}>
      {children}
    </div>
  );
};

const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
