interface Window {
  handleCheckClick?: (checkId: string) => void;
  handleCheckHover?: (checkId: string, event: MouseEvent) => void;
  handleCheckLeave?: () => void;
  hideTimeout?: NodeJS.Timeout;
} 