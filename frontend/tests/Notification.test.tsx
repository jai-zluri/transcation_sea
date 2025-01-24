import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Notification from '../src/components/Notification';

describe('Notification', () => {
  const defaultProps = {
    message: 'Test notification',
    type: 'success' as const,
    isVisible: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders notification with correct message', () => {
    render(<Notification {...defaultProps} />);

    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  test('applies correct color based on type', () => {
    const { rerender } = render(<Notification {...defaultProps} type="success" />);
    let notification = screen.getByText('Test notification').closest('div');
    expect(notification).toHaveClass('bg-green-500');

    rerender(<Notification {...defaultProps} type="error" />);
    notification = screen.getByText('Test notification').closest('div');
    expect(notification).toHaveClass('bg-red-500');

    rerender(<Notification {...defaultProps} type="info" />);
    notification = screen.getByText('Test notification').closest('div');
    expect(notification).toHaveClass('bg-blue-500');
  });

  test('does not render when isVisible is false', () => {
    const { container } = render(<Notification {...defaultProps} isVisible={false} />);
    expect(container.firstChild).toBeNull();
  });

  test('calls onClose after 3 seconds', () => {
    render(<Notification {...defaultProps} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when close button is clicked', () => {
    render(<Notification {...defaultProps} />);

    const closeButton = screen.getByText('X');
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});