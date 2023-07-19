import { forwardRef, type HTMLProps } from "react";

const Container = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  function Container({ children, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={`flex min-h-[100dvh] w-full ${className ?? ""}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default Container;
