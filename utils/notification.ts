type NotificationType = 'success' | 'error' | 'info' | 'warning';

export const notification = {
  success: (message: string) => {
    console.log('Success:', message);
    // You can replace this with your preferred notification system
    alert(`Success: ${message}`);
  },
  error: (message: string) => {
    console.error('Error:', message);
    // You can replace this with your preferred notification system
    alert(`Error: ${message}`);
  },
  info: (message: string) => {
    console.info('Info:', message);
    // You can replace this with your preferred notification system
    alert(`Info: ${message}`);
  },
  warning: (message: string) => {
    console.warn('Warning:', message);
    // You can replace this with your preferred notification system
    alert(`Warning: ${message}`);
  },
}; 