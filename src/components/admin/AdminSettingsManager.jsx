import React from 'react';
import { Settings, Mail, Phone, MessageSquare, Globe, BadgeDollarSign, Save, Loader2 } from 'lucide-react';

const AdminSettingsManager = ({ settingsData, setSettingsData, handleSaveSettings, isSavingSettings }) => {
  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="bg-bg-primary rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-4 flex items-center">
            <div className="bg-white/20 p-1.5 rounded-lg mr-3 backdrop-blur-sm">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h5 className="mb-0 text-white font-bold text-lg">Contact & Social Settings</h5>
          </div>
          
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Contact Information Section */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Support Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-text-muted" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                      placeholder="e.g. contact@teachingtorch.com"
                      value={settingsData.email}
                      onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-text-muted" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                      placeholder="e.g. +94 77 123 4567"
                      value={settingsData.phone}
                      onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">WhatsApp Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MessageSquare className="w-5 h-5 text-success" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                      placeholder="e.g. 94771234567"
                      value={settingsData.whatsapp}
                      onChange={(e) => setSettingsData({ ...settingsData, whatsapp: e.target.value })}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-text-muted">For direct link generation, use format like 94771234567 (include country code, without spaces or +)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Facebook Page Link</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="w-5 h-5 text-[#1877F2]" />
                    </div>
                    <input
                      type="url"
                      className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                      placeholder="e.g. https://facebook.com/teachingtorch"
                      value={settingsData.facebook}
                      onChange={(e) => setSettingsData({ ...settingsData, facebook: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border my-8"></div>

              {/* AdSense Settings Section */}
              <div className="space-y-5">
                <h6 className="flex items-center text-primary font-bold text-lg mb-4">
                  <BadgeDollarSign className="w-5 h-5 mr-2" />
                  Google AdSense Settings
                </h6>
                
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-6">
                  <label className="block text-sm font-bold text-primary mb-1.5">Publisher ID (ca-pub-XXX)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 bg-bg-primary border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    placeholder="e.g. ca-pub-1234567890123456"
                    value={settingsData.adsenseClientId}
                    onChange={(e) => setSettingsData({ ...settingsData, adsenseClientId: e.target.value })}
                  />
                  <p className="mt-1.5 text-xs text-primary/80">Your global AdSense Publisher ID.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">Home Hero Slot</label>
                    <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm" value={settingsData.slotHomeHero} onChange={e => setSettingsData({...settingsData, slotHomeHero: e.target.value})} placeholder="Slot ID" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">Home Footer Slot</label>
                    <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm" value={settingsData.slotHomeFooter} onChange={e => setSettingsData({...settingsData, slotHomeFooter: e.target.value})} placeholder="Slot ID" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">Grade Header Slot</label>
                    <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm" value={settingsData.slotGradeHeader} onChange={e => setSettingsData({...settingsData, slotGradeHeader: e.target.value})} placeholder="Slot ID" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">Textbooks Header Slot</label>
                    <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm" value={settingsData.slotTextbooksHeader} onChange={e => setSettingsData({...settingsData, slotTextbooksHeader: e.target.value})} placeholder="Slot ID" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">Papers Header Slot</label>
                    <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm" value={settingsData.slotPapersHeader} onChange={e => setSettingsData({...settingsData, slotPapersHeader: e.target.value})} placeholder="Slot ID" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">Notes Header Slot</label>
                    <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm" value={settingsData.slotNotesHeader} onChange={e => setSettingsData({...settingsData, slotNotesHeader: e.target.value})} placeholder="Slot ID" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center"
                  disabled={isSavingSettings}
                >
                  {isSavingSettings ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-5 h-5 mr-2" /> Save Settings</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsManager;
