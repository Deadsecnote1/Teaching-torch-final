import React from 'react';

const AdminSettingsManager = ({ settingsData, setSettingsData, handleSaveSettings, isSavingSettings }) => {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-primary text-white d-flex align-items-center">
            <i className="bi bi-gear-fill me-2 bg-white text-primary rounded-circle p-1"></i>
            <h5 className="mb-0 text-white">Contact & Social Settings</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSaveSettings}>
              <div className="mb-3">
                <label className="form-label">Support Email</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. contact@teachingtorch.com"
                    value={settingsData.email}
                    onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. +94 77 123 4567"
                    value={settingsData.phone}
                    onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">WhatsApp Number</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-whatsapp text-success"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 94771234567"
                    value={settingsData.whatsapp}
                    onChange={(e) => setSettingsData({ ...settingsData, whatsapp: e.target.value })}
                  />
                </div>
                <div className="form-text">For direct link generation, use format like 94771234567 (include country code, without spaces or +)</div>
              </div>

              <div className="mb-4">
                <label className="form-label">Facebook Page Link</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-facebook" style={{ color: '#1877F2' }}></i></span>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="e.g. https://facebook.com/teachingtorch"
                    value={settingsData.facebook}
                    onChange={(e) => setSettingsData({ ...settingsData, facebook: e.target.value })}
                  />
                </div>
              </div>

              <hr className="my-4" />
              <h6 className="mb-3 text-primary"><i className="bi bi-google me-2"></i>Google AdSense Settings</h6>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Publisher ID (ca-pub-XXX)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ca-pub-1234567890123456"
                  value={settingsData.adsenseClientId}
                  onChange={(e) => setSettingsData({ ...settingsData, adsenseClientId: e.target.value })}
                />
                <div className="form-text">Your global AdSense Publisher ID.</div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small mb-1">Home Hero Slot</label>
                  <input type="text" className="form-control form-control-sm" value={settingsData.slotHomeHero} onChange={e => setSettingsData({...settingsData, slotHomeHero: e.target.value})} placeholder="Slot ID" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small mb-1">Home Footer Slot</label>
                  <input type="text" className="form-control form-control-sm" value={settingsData.slotHomeFooter} onChange={e => setSettingsData({...settingsData, slotHomeFooter: e.target.value})} placeholder="Slot ID" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small mb-1">Grade Header Slot</label>
                  <input type="text" className="form-control form-control-sm" value={settingsData.slotGradeHeader} onChange={e => setSettingsData({...settingsData, slotGradeHeader: e.target.value})} placeholder="Slot ID" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small mb-1">Textbooks Header Slot</label>
                  <input type="text" className="form-control form-control-sm" value={settingsData.slotTextbooksHeader} onChange={e => setSettingsData({...settingsData, slotTextbooksHeader: e.target.value})} placeholder="Slot ID" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small mb-1">Papers Header Slot</label>
                  <input type="text" className="form-control form-control-sm" value={settingsData.slotPapersHeader} onChange={e => setSettingsData({...settingsData, slotPapersHeader: e.target.value})} placeholder="Slot ID" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small mb-1">Notes Header Slot</label>
                  <input type="text" className="form-control form-control-sm" value={settingsData.slotNotesHeader} onChange={e => setSettingsData({...settingsData, slotNotesHeader: e.target.value})} placeholder="Slot ID" />
                </div>
              </div>

              <div className="d-grid pt-3 border-top">
                <button type="submit" className="btn btn-primary btn-lg" disabled={isSavingSettings}>
                  {isSavingSettings ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving...</>
                  ) : (
                    <><i className="bi bi-save me-2"></i> Save Settings</>
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
