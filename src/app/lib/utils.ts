import { format, formatDistanceToNow } from 'date-fns';

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()} UGX`;
}

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function formatTimeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
