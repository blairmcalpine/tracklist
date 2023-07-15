import { forwardRef, type HTMLProps } from "react";

const Container = forwardRef<HTMLElement, HTMLProps<HTMLElement>>(
  function Container({ children, className, ...rest }, ref) {
    return (
      <main
        ref={ref}
        className={`flex min-h-screen w-full ${className ?? ""}`}
        {...rest}
      >
        {children}
      </main>
    );
  }
);

export default Container;
