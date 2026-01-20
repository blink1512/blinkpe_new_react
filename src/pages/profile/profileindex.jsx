import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  Copy,
  Check,
  Webhook
} from 'lucide-react';

// MUI
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// ---------------- MOCK DATA ----------------
const mockProfile = {
  company_name: 'Acme Corporation',
  company_email: 'contact@acme.com',
  contact_detail: '+91 98765 43210',
  website: 'https://acme.com',
  gstin: '27AABCU9603R1ZM',
  pancard: 'VERIFIED',
  webhook: 'https://api.acme.com/webhook',
  status: 'Active'
};

export default function Profileindex() {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setProfile(mockProfile);
      setIsLoading(false);
    }, 500);
  }, []);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const InfoCard = ({
    icon: Icon,
    label,
    value,
    copyable = false,
    fieldKey,
    isChip = false
  }) => {
    const displayValue = value || 'Not Provided';
    const isCopied = copiedField === fieldKey;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <div className="h-full rounded-xl border bg-card p-5 hover:shadow-lg">
          <div className="flex flex-col h-full space-y-4">

            {/* HEADER */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Icon size={20} />
              </div>
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                {label}
              </span>
            </div>

            {/* VALUE */}
            <div className="flex items-start justify-between gap-3 mt-auto">
              {isChip ? (
                <Chip
                  size="small"
                  icon={
                    value === 'PENDING'
                      ? <Clock size={14} />
                      : <CheckCircle size={14} />
                  }
                  label={displayValue}
                  color={value === 'PENDING' ? 'warning' : 'success'}
                  variant="outlined"
                />
              ) : (
                <>
                  <p
                    className={`font-medium break-all max-w-[85%] ${
                      displayValue === 'Not Provided'
                        ? 'text-muted-foreground italic'
                        : ''
                    }`}
                  >
                    {displayValue}
                  </p>

                  {copyable && displayValue !== 'Not Provided' && (
                    <Tooltip title={isCopied ? 'Copied!' : 'Copy'}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          copyToClipboard(displayValue, fieldKey)
                        }
                      >
                        {isCopied ? (
                          <Check size={18} color="green" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="w-full max-w-[1400px] mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Company Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage your registered business details
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <InfoCard
            icon={Building2}
            label="Company Name"
            value={profile.company_name}
          />
          <InfoCard
            icon={Mail}
            label="Company Email"
            value={profile.company_email}
            copyable
            fieldKey="email"
          />
          <InfoCard
            icon={Phone}
            label="Contact Number"
            value={profile.contact_detail}
            copyable
            fieldKey="phone"
          />
          <InfoCard
            icon={Globe}
            label="Website"
            value={profile.website}
            copyable
            fieldKey="website"
          />
          <InfoCard
            icon={FileText}
            label="GSTIN"
            value={profile.gstin}
            copyable
            fieldKey="gstin"
          />
          <InfoCard
            icon={CreditCard}
            label="PAN Status"
            value={profile.pancard}
            isChip
          />
          <InfoCard
            icon={Webhook}
            label="Webhook URL"
            value={profile.webhook}
            copyable
            fieldKey="webhook"
          />
        </div>

      </div>
    </div>
  );
}
