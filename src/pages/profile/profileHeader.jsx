import { motion } from 'framer-motion';
import { CheckCircle, Edit, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ProfileHeader({ companyName, status, onEdit }) {
  const initial = companyName?.charAt(0)?.toUpperCase() || '-';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl p-6 md:p-8',
          'gradient-primary shadow-primary'
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/20" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
        </div>

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-xl',
                'bg-white/20 backdrop-blur-sm',
                'text-2xl font-bold text-white'
              )}
            >
              {initial !== '-' ? (
                initial
              ) : (
                <Building2 className="h-8 w-8" />
              )}
            </div>

            <div className="text-white">
              <h1 className="text-2xl font-bold md:text-3xl">
                Company Profile
              </h1>
              <p className="mt-1 text-sm text-white/80 md:text-base">
                Manage your company information
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Badge
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5',
                'bg-success/90 text-success-foreground',
                'backdrop-blur-sm'
              )}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span className="font-semibold">{status || 'N/A'}</span>
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className={cn(
                'h-10 w-10 rounded-xl',
                'bg-white/20 text-white hover:bg-white/30',
                'backdrop-blur-sm transition-colors'
              )}
            >
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
