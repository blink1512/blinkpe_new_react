import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

export function InfoCard({
  icon: Icon,
  label,
  value,
  isChip = false,
  chipVariant = 'success',
  copyable = false,
  delay = 0,
}) {

  const [copied, setCopied] = useState(false);
  const displayValue = value || 'Not Provided';
  const canCopy = copyable && displayValue !== 'Not Provided';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <div
        className={cn(
          'group relative h-full rounded-xl border border-border bg-card p-5',
          'shadow-soft transition-all duration-300 ease-out',
          'hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20'
        )}
      >
        <div className="flex flex-col gap-4">
          {/* Icon + Label */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>

          {/* Value */}
          <div className="flex items-center justify-between min-h-[32px]">
            {isChip ? (
              <Badge
                variant={chipVariant === 'success' ? 'default' : 'secondary'}
                className={cn(
                  'px-3 py-1.5 text-sm font-semibold',
                  chipVariant === 'success'
                    ? 'bg-success text-success-foreground'
                    : 'bg-warning text-warning-foreground'
                )}
              >
                {displayValue}
              </Badge>
            ) : (
              <>
                <p
                  className={cn(
                    'text-base font-medium break-words pr-2',
                    displayValue === 'Not Provided'
                      ? 'italic text-muted-foreground/60'
                      : 'text-foreground'
                  )}
                >
                  {displayValue}
                </p>

                {canCopy && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyToClipboard}
                        className={cn(
                          'h-8 w-8 opacity-0 transition-opacity duration-200',
                          'group-hover:opacity-100 hover:bg-secondary'
                        )}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? 'Copied!' : 'Copy'}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
