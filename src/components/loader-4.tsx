import React from 'react';
import styled from 'styled-components';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
}

const Loader = ({ className }: LoaderProps) => {
  return (
    <StyledWrapper className={cn("flex justify-center items-center", className)}>
      <div className="loader">
        <div className="cell d-0" />
        <div className="cell d-1" />
        <div className="cell d-2" />
        <div className="cell d-1" />
        <div className="cell d-2" />
        <div className="cell d-2" />
        <div className="cell d-3" />
        <div className="cell d-3" />
        <div className="cell d-4" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    --cell-size: 12px;
    --cell-spacing: 1px;
    --cells: 3;
    --total-size: calc(var(--cells) * (var(--cell-size) + 2 * var(--cell-spacing)));
    display: flex;
    flex-wrap: wrap;
    width: var(--total-size);
    height: var(--total-size);
  }

  .cell {
    flex: 0 0 var(--cell-size);
    margin: var(--cell-spacing);
    background-color: transparent;
    box-sizing: border-box;
    border-radius: 2px;
    animation: 0.8s ripple ease infinite;
  }

  .cell.d-1 {
    animation-delay: 50ms;
  }

  .cell.d-2 {
    animation-delay: 100ms;
  }

  .cell.d-3 {
    animation-delay: 150ms;
  }

  .cell.d-4 {
    animation-delay: 200ms;
  }

  .cell:nth-child(1) { --cell-color: #581c87; }
  .cell:nth-child(2) { --cell-color: #6b21a8; }
  .cell:nth-child(3) { --cell-color: #7e22ce; }
  .cell:nth-child(4) { --cell-color: #9333ea; }
  .cell:nth-child(5) { --cell-color: #a855f7; }
  .cell:nth-child(6) { --cell-color: #c084fc; }
  .cell:nth-child(7) { --cell-color: #d8b4fe; }
  .cell:nth-child(8) { --cell-color: #e9d5ff; }
  .cell:nth-child(9) { --cell-color: #f3e8ff; }

  @keyframes ripple {
    0% {
      background-color: transparent;
    }

    30% {
      background-color: var(--cell-color);
    }

    60% {
      background-color: transparent;
    }

    100% {
      background-color: transparent;
    }
  }
`;

export { Loader };
export default Loader;
