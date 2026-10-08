import React, { useState, useEffect } from 'react';
import { useInstitutions, useUpdateInstitution } from '../hooks/useInstitution';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { useToast } from '../../../components/common/ToastContext';
import { Save, Building } from 'lucide-react';

export const InstitutionSettingsView: React.FC = () => {
  const { success, error } = useToast();
  const { data: institutions = [], isLoading } = useInstitutions();
  const updateMutation = useUpdateInstitution();

  const currentInst = institutions[0];

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  useEffect(() => {
    if (currentInst) {
      setFormData({
        name: currentInst.name || '',
        code: currentInst.code || '',
        email: currentInst.email || '',
        phone: currentInst.phone || '',
        website: currentInst.website || '',
        address: currentInst.address || '',
        city: currentInst.city || '',
        state: currentInst.state || '',
        country: currentInst.country || '',
        postalCode: currentInst.postalCode || '',
      });
    }
  }, [currentInst]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInst?.id) return;

    try {
      await updateMutation.mutateAsync({
        id: currentInst.id,
        data: formData,
      });
      success('Institution Profile Updated', 'Campus configuration saved successfully.');
    } catch (err: any) {
      error('Update Failed', err?.message || 'Could not update institution details.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center text-xs text-[#737373]">
        Loading institution profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#F97316] shrink-0">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#171717]">{currentInst?.name || 'Institution Profile'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentInst?.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-[#737373] mt-0.5">
              Code: <span className="font-mono font-bold text-[#171717]">{currentInst?.code || 'EDU-CONFLUX'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-[#171717]">Campus Identity & Contact</h3>
          <p className="text-xs text-[#737373]">Configure public organizational details and official contact information.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Institution Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Institution Code *"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <Input
            type="email"
            label="Official Contact Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="sm:col-span-2">
            <Input
              label="Official Website URL"
              placeholder="https://example.edu"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E5E5]">
          <h3 className="text-sm font-bold text-[#171717]">Campus Location</h3>
          <p className="text-xs text-[#737373] mb-4">Official physical campus registry address.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Street Address"
                placeholder="100 University Avenue"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <Input
              label="City *"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <Input
              label="State / Province *"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />
            <Input
              label="Country *"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
            <Input
              label="Postal / ZIP Code"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#E5E5E5]">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={updateMutation.isPending || !currentInst?.id}
            className="gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Saving Changes...' : 'Save Settings'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
