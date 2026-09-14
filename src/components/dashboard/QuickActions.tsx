import type { FC } from 'react';
import { Camera, Sprout, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface QuickActionsProps {
  onScanField: () => void;
  onRecordAction: () => void;
  onEvidenceMode: () => void;
  onViewPassport: () => void;
}

export const QuickActions: FC<QuickActionsProps> = ({
  onScanField,
  onRecordAction,
  onEvidenceMode,
  onViewPassport,
}) => {
  const actions = [
    {
      id: 'scan',
      title: 'Scan Field',
      desc: 'Capture and analyze your field',
      icon: Camera,
      onClick: onScanField,
      iconBg: 'bg-[#E8F5E9]',
      iconColor: 'text-[#2E7D32]',
    },
    {
      id: 'action',
      title: 'Record Action',
      desc: 'Log interventions and activities',
      icon: Sprout,
      onClick: onRecordAction,
      iconBg: 'bg-[#F1F8E9]',
      iconColor: 'text-[#43A047]',
    },
    {
      id: 'evidence',
      title: 'Evidence Mode',
      desc: 'Create verifiable evidence packages',
      icon: ShieldCheck,
      onClick: onEvidenceMode,
      iconBg: 'bg-[#E0F2F1]',
      iconColor: 'text-[#00897B]',
    },
    {
      id: 'passport',
      title: 'View Passport',
      desc: 'Explore your field history',
      icon: FileText,
      onClick: onViewPassport,
      iconBg: 'bg-[#FFF8E1]',
      iconColor: 'text-[#F57F17]',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <div
            key={act.id}
            onClick={act.onClick}
            className="bg-white rounded-2xl p-4 border border-[#EAE4D5] shadow-xs hover:shadow-md hover:border-[#81C784] transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-98"
          >
            <div>
              <div className={`w-10 h-10 rounded-xl ${act.iconBg} ${act.iconColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-[#0C2518]">
                {act.title}
              </h3>
              <p className="text-[11px] text-[#6D4C41] mt-1 leading-snug">
                {act.desc}
              </p>
            </div>

            <div className="mt-4 pt-2 flex justify-start">
              <div className="w-7 h-7 rounded-full bg-[#F5F2EA] group-hover:bg-[#0C2518] group-hover:text-white text-[#2D1E16] flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
