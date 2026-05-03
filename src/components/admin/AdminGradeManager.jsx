import React from 'react';

const AdminGradeManager = ({
  grades,
  subjects,
  newGradeName,
  setNewGradeName,
  newGradeCode,
  setNewGradeCode,
  newGradeOrder,
  setNewGradeOrder,
  handleAddGrade,
  isSubmitting,
  editingGradeId,
  setEditingGradeId,
  editGradeData,
  setEditGradeData,
  handleSaveEditGrade,
  handleDeleteGrade,
  newSubjectName,
  setNewSubjectName,
  newSubjectSinhala,
  setNewSubjectSinhala,
  newSubjectTamil,
  setNewSubjectTamil,
  newSubjectCode,
  setNewSubjectCode,
  newSubjectIcon,
  setNewSubjectIcon,
  newSubjectOrder,
  setNewSubjectOrder,
  selectedGradesForSubject,
  setSelectedGradesForSubject,
  handleAddSubject,
  editingSubjectPrefix,
  editSubjectData,
  setEditSubjectData,
  handleEditSubjectClick,
  handleCancelEditSubject,
  handleSaveEditSubject,
  handleDeleteSubject
}) => {
  return (
    <div className="row g-4">
      {/* Grades Management */}
      <div className="col-lg-6">
        <div className="card shadow-sm h-100">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0"><i className="bi bi-mortarboard me-2"></i>Manage Grades</h5>
          </div>
          <div className="card-body">
            {/* Add New Grade Form */}
            <div className="mb-4 pb-4 border-bottom">
              <h6 className="mb-3">Add New Grade Level</h6>
              <div className="row g-2">
                <div className="col-md-4">
                  <input type="text" className="form-control form-control-sm" placeholder="Code (e.g. grade6)" value={newGradeCode} onChange={e => setNewGradeCode(e.target.value)} />
                </div>
                <div className="col-md-5">
                  <input type="text" className="form-control form-control-sm" placeholder="Display Name (e.g Grade 6)" value={newGradeName} onChange={e => setNewGradeName(e.target.value)} />
                </div>
                <div className="col-md-3">
                   <input type="number" className="form-control form-control-sm" placeholder="Order" value={newGradeOrder} onChange={e => setNewGradeOrder(e.target.value)} />
                </div>
                <div className="col-12 mt-2">
                  <button className="btn btn-primary btn-sm w-100" onClick={handleAddGrade} disabled={isSubmitting}>
                    <i className="bi bi-plus-circle me-1"></i> Add Grade
                  </button>
                </div>
              </div>
            </div>

            {/* Grades List */}
            <h6 className="mb-3">Existing Grades</h6>
            <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {Object.entries(grades).sort((a, b) => (a[1].order || 99) - (b[1].order || 99)).map(([key, grade]) => (
                <div key={key} className="list-group-item px-0">
                  {editingGradeId === key ? (
                    <div className="edit-grade-inline">
                      <div className="row g-1 align-items-center">
                        <div className="col-6">
                          <input type="text" className="form-control form-control-sm" value={editGradeData.name} onChange={e => setEditGradeData({ ...editGradeData, name: e.target.value })} />
                        </div>
                        <div className="col-3">
                          <input type="number" className="form-control form-control-sm" value={editGradeData.order} onChange={e => setEditGradeData({ ...editGradeData, order: e.target.value })} />
                        </div>
                        <div className="col-3 d-flex gap-1">
                          <button className="btn btn-sm btn-success p-1" onClick={handleSaveEditGrade}><i className="bi bi-check2"></i></button>
                          <button className="btn btn-sm btn-secondary p-1" onClick={() => setEditingGradeId(null)}><i className="bi bi-x"></i></button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{grade.display}</strong>
                        <span className="badge bg-light text-muted ms-2 small">ID: {key}</span>
                        {grade.order !== undefined && <span className="badge bg-light text-primary ms-1 small">Order: {grade.order}</span>}
                      </div>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary py-0" onClick={() => {
                          setEditingGradeId(key);
                          setEditGradeData({ name: grade.display, order: grade.order || '' });
                        }}><i className="bi bi-pencil small"></i></button>
                        <button className="btn btn-sm btn-outline-danger py-0" onClick={() => handleDeleteGrade(key)}><i className="bi bi-trash small"></i></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Management */}
      <div className="col-lg-6">
        <div className="card shadow-sm h-100">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0"><i className="bi bi-book me-2"></i>Manage Subjects</h5>
          </div>
          <div className="card-body">
            {/* Add New Subject Form */}
            <div className="mb-4 pb-4 border-bottom">
              <h6 className="mb-3">Add New Subject</h6>
              <div className="row g-2">
                <div className="col-md-5">
                  <input type="text" className="form-control form-control-sm mb-2" placeholder="Subject Name (English)" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} />
                </div>
                <div className="col-md-5">
                   <input type="text" className="form-control form-control-sm mb-2" placeholder="Subject Code (e.g. maths)" value={newSubjectCode} onChange={e => setNewSubjectCode(e.target.value)} />
                </div>
                <div className="col-md-2">
                   <input type="number" className="form-control form-control-sm mb-2" placeholder="Order" value={newSubjectOrder} onChange={e => setNewSubjectOrder(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <input type="text" className="form-control form-control-sm mb-2" placeholder="Name Sinhala (Optional)" value={newSubjectSinhala} onChange={e => setNewSubjectSinhala(e.target.value)} />
                </div>
                <div className="col-md-6">
                   <input type="text" className="form-control form-control-sm mb-2" placeholder="Name Tamil (Optional)" value={newSubjectTamil} onChange={e => setNewSubjectTamil(e.target.value)} />
                </div>
                <div className="col-md-6">
                   <input type="text" className="form-control form-control-sm mb-2" placeholder="Icon Class (bi-book)" value={newSubjectIcon} onChange={e => setNewSubjectIcon(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <div className="border rounded px-2 py-1 bg-light" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    <small className="d-block text-muted mb-1">Select Grades:</small>
                    {Object.entries(grades).map(([key, g]) => (
                      <div className="form-check" key={`new-sub-g-${key}`}>
                        <input className="form-check-input" type="checkbox" id={`new-sub-g-${key}`} checked={selectedGradesForSubject.includes(key)} onChange={e => {
                          if (e.target.checked) setSelectedGradesForSubject([...selectedGradesForSubject, key]);
                          else setSelectedGradesForSubject(selectedGradesForSubject.filter(id => id !== key));
                        }} />
                        <label className="form-check-label small" htmlFor={`new-sub-g-${key}`}>{g.display}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <button className="btn btn-success btn-sm w-100" onClick={handleAddSubject} disabled={isSubmitting}>
                    <i className="bi bi-plus-circle me-1"></i> Add Subject
                  </button>
                </div>
              </div>
            </div>

            {/* Subjects List */}
            <h6 className="mb-3">Existing Subjects</h6>
            <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {Object.entries(subjects).sort((a, b) => (a[1].order || 999) - (b[1].order || 999)).map(([key, subject]) => (
                <div key={key} className="list-group-item px-0">
                  {editingSubjectPrefix === key ? (
                    <div className="edit-subject-inline bg-light p-2 rounded">
                      <input type="text" className="form-control form-control-sm mb-1" placeholder="English Name" value={editSubjectData.name} onChange={e => setEditSubjectData({ ...editSubjectData, name: e.target.value })} />
                      <div className="row g-1 mb-1">
                        <div className="col-6">
                          <input type="text" className="form-control form-control-sm" placeholder="Sinhala Name" value={editSubjectData.nameSinhala} onChange={e => setEditSubjectData({ ...editSubjectData, nameSinhala: e.target.value })} />
                        </div>
                        <div className="col-6">
                          <input type="text" className="form-control form-control-sm" placeholder="Tamil Name" value={editSubjectData.nameTamil} onChange={e => setEditSubjectData({ ...editSubjectData, nameTamil: e.target.value })} />
                        </div>
                      </div>
                      <div className="row g-1 mb-1">
                        <div className="col-6">
                          <input type="text" className="form-control form-control-sm" placeholder="Icon" value={editSubjectData.icon} onChange={e => setEditSubjectData({ ...editSubjectData, icon: e.target.value })} />
                        </div>
                        <div className="col-6">
                           <input type="number" className="form-control form-control-sm" placeholder="Order" value={editSubjectData.order} onChange={e => setEditSubjectData({ ...editSubjectData, order: e.target.value })} />
                        </div>
                      </div>
                      <div className="mb-2">
                         <small className="text-muted">Grades:</small>
                         <div className="d-flex flex-wrap gap-1 mt-1">
                           {Object.entries(grades).map(([gk, g]) => (
                             <div className="form-check form-check-inline m-0" key={`edit-sub-g-${gk}`}>
                               <input className="form-check-input" type="checkbox" id={`edit-sub-g-${gk}`} checked={editSubjectData.grades.includes(gk)} onChange={e => {
                                 const newGrades = e.target.checked ? [...editSubjectData.grades, gk] : editSubjectData.grades.filter(id => id !== gk);
                                 setEditSubjectData({ ...editSubjectData, grades: newGrades });
                               }} />
                               <label className="form-check-label small" htmlFor={`edit-sub-g-${gk}`}>{g.display}</label>
                             </div>
                           ))}
                         </div>
                      </div>
                      <div className="d-flex justify-content-end gap-1">
                        <button className="btn btn-sm btn-success p-1 px-2" onClick={handleSaveEditSubject}>Save</button>
                        <button className="btn btn-sm btn-secondary p-1 px-2" onClick={handleCancelEditSubject}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className={`bi ${subject.icon || 'bi-book'} me-2 text-success`}></i>
                        <strong>{subject.name}</strong>
                        <span className="badge bg-light text-muted ms-2 small">ID: {key}</span>
                        <div className="small text-muted mt-1">
                           {subject.grades?.map(gk => grades[gk]?.display).join(', ')}
                        </div>
                      </div>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary py-0" onClick={() => handleEditSubjectClick(key, subject)}><i className="bi bi-pencil small"></i></button>
                        <button className="btn btn-sm btn-outline-danger py-0" onClick={() => handleDeleteSubject(key)}><i className="bi bi-trash small"></i></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGradeManager;
