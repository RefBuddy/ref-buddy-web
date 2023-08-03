import React, { useMemo } from 'react';
import cn from 'classnames';

export interface ButtonProps {
  type?: 'primary' | 'secondary';
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  loading?: boolean;
  'data-testid'?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  [x: string | number | symbol]: unknown;
}

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  children,
  className = '',
  disabled = false,
  href,
  loading = false,
  onClick = () => {},
  ...props
}) => {
  const ElementType = useMemo(() => (href ? 'a' : 'button'), [href]);

  const buttonType = useMemo(() => {
    switch (type) {
      case 'secondary':
        return 'button--secondary';
      default:
        return 'button--primary';
    }
  }, [type]);

  return (
    <ElementType
      type="button"
      className={cn(
        'button',
        {
          [buttonType]: !!type,
          'button--disabled': disabled,
          'button--loading': loading,
        },
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
      href={href}
      data-testid={props['data-testid'] ?? 'Button'}
      {...props}
    >
      {children}
    </ElementType>
  );
};

export default Button;
