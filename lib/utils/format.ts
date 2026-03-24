import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR').format(amount);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export function formatMultiplier(mult: number): string {
  return `${mult.toFixed(2)}x`;
}
