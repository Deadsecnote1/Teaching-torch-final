import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Grid } from '../ui/Layout';
import { GraduationCap, BookOpen, Plus, Check, X, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getLucideIcon } from '../../utils/iconUtils';

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
    <Grid cols={2} gap={6}>
      {/* Grades Management */}
      <div className="col-span-1">
        <Card className="h-full flex flex-col shadow-sm border-border overflow-hidden">
          <CardHeader className="bg-primary/10 border-b border-primary/10 py-4">
            <CardTitle className="text-primary flex items-center gap-2 text-lg">
              <GraduationCap className="w-5 h-5" /> Manage Grades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col bg-bg-primary">
            {/* Add New Grade Form */}
            <div className="mb-6 pb-6 border-b border-border">
              <h6 className="text-sm font-bold text-text-primary mb-3">Add New Grade Level</h6>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <Input placeholder="Code (e.g. grade6)" value={newGradeCode} onChange={e => setNewGradeCode(e.target.value)} />
                </div>
                <div className="col-span-5">
                  <Input placeholder="Display Name (e.g. Grade 6)" value={newGradeName} onChange={e => setNewGradeName(e.target.value)} />
                </div>
                <div className="col-span-3">
                   <Input type="number" placeholder="Order" value={newGradeOrder} onChange={e => setNewGradeOrder(e.target.value)} />
                </div>
                <div className="col-span-12 mt-1">
                  <Button className="w-full" onClick={handleAddGrade} disabled={isSubmitting}>
                    <Plus className="w-4 h-4 mr-2" /> Add Grade
                  </Button>
                </div>
              </div>
            </div>

            {/* Grades List */}
            <h6 className="text-sm font-bold text-text-primary mb-3">Existing Grades</h6>
            <div className="flex flex-col gap-2 overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
              {Object.entries(grades).sort((a, b) => (a[1].order || 99) - (b[1].order || 99)).map(([key, grade]) => (
                <div key={key} className="bg-bg-secondary border border-border rounded-lg p-3 hover:border-primary/30 transition-colors">
                  {editingGradeId === key ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input value={editGradeData.name} onChange={e => setEditGradeData({ ...editGradeData, name: e.target.value })} />
                      </div>
                      <div className="w-24">
                        <Input type="number" placeholder="Order" value={editGradeData.order} onChange={e => setEditGradeData({ ...editGradeData, order: e.target.value })} />
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="success" className="h-10 w-10 text-white" onClick={handleSaveEditGrade}><Check className="w-4 h-4" /></Button>
                        <Button size="icon" variant="outline" className="h-10 w-10" onClick={() => setEditingGradeId(null)}><X className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <strong className="text-text-primary">{grade.display}</strong>
                        <span className="ml-2 text-[10px] uppercase font-bold bg-bg-tertiary text-text-muted px-2 py-0.5 rounded-full border border-border">ID: {key}</span>
                        {grade.order !== undefined && <span className="ml-2 text-[10px] uppercase font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Order: {grade.order}</span>}
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-info hover:bg-info/10" onClick={() => {
                          setEditingGradeId(key);
                          setEditGradeData({ name: grade.display, order: grade.order || '' });
                        }}><Edit2 className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-danger hover:bg-danger/10" onClick={() => handleDeleteGrade(key)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Management */}
      <div className="col-span-1">
        <Card className="h-full flex flex-col shadow-sm border-border overflow-hidden">
          <CardHeader className="bg-success/10 border-b border-success/10 py-4">
            <CardTitle className="text-success flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5" /> Manage Subjects
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col bg-bg-primary">
            {/* Add New Subject Form */}
            <div className="mb-6 pb-6 border-b border-border">
              <h6 className="text-sm font-bold text-text-primary mb-3">Add New Subject</h6>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                  <Input placeholder="Subject Name (English)" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} />
                </div>
                <div className="col-span-5">
                   <Input placeholder="Subject Code (e.g. maths)" value={newSubjectCode} onChange={e => setNewSubjectCode(e.target.value)} />
                </div>
                <div className="col-span-2">
                   <Input type="number" placeholder="Order" value={newSubjectOrder} onChange={e => setNewSubjectOrder(e.target.value)} />
                </div>
                <div className="col-span-6">
                  <Input placeholder="Name Sinhala (Optional)" value={newSubjectSinhala} onChange={e => setNewSubjectSinhala(e.target.value)} />
                </div>
                <div className="col-span-6">
                   <Input placeholder="Name Tamil (Optional)" value={newSubjectTamil} onChange={e => setNewSubjectTamil(e.target.value)} />
                </div>
                <div className="col-span-12">
                   <Input placeholder="Icon Name (e.g. book, calculator, lab)" value={newSubjectIcon} onChange={e => setNewSubjectIcon(e.target.value)} />
                </div>
                <div className="col-span-12">
                  <div className="border border-border rounded-lg p-3 bg-bg-secondary h-[120px] overflow-y-auto">
                    <span className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Select Grades:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(grades).map(([key, g]) => (
                        <label key={`new-sub-g-${key}`} className="flex items-center gap-2 cursor-pointer text-sm text-text-primary hover:text-primary transition-colors">
                          <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-4 w-4" checked={selectedGradesForSubject.includes(key)} onChange={e => {
                            if (e.target.checked) setSelectedGradesForSubject([...selectedGradesForSubject, key]);
                            else setSelectedGradesForSubject(selectedGradesForSubject.filter(id => id !== key));
                          }} />
                          {g.display}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-12 mt-1">
                  <Button className="w-full bg-success hover:bg-success-dark text-white border-0" onClick={handleAddSubject} disabled={isSubmitting}>
                    <Plus className="w-4 h-4 mr-2" /> Add Subject
                  </Button>
                </div>
              </div>
            </div>

            {/* Subjects List */}
            <h6 className="text-sm font-bold text-text-primary mb-3">Existing Subjects</h6>
            <div className="flex flex-col gap-3 overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
              {Object.entries(subjects).sort((a, b) => (a[1].order || 999) - (b[1].order || 999)).map(([key, subject]) => (
                <div key={key} className="bg-bg-secondary border border-border rounded-lg p-3 hover:border-success/30 transition-colors">
                  {editingSubjectPrefix === key ? (
                    <div className="flex flex-col gap-3">
                      <Input placeholder="English Name" value={editSubjectData.name} onChange={e => setEditSubjectData({ ...editSubjectData, name: e.target.value })} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Sinhala Name" value={editSubjectData.nameSinhala} onChange={e => setEditSubjectData({ ...editSubjectData, nameSinhala: e.target.value })} />
                        <Input placeholder="Tamil Name" value={editSubjectData.nameTamil} onChange={e => setEditSubjectData({ ...editSubjectData, nameTamil: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Icon" value={editSubjectData.icon} onChange={e => setEditSubjectData({ ...editSubjectData, icon: e.target.value })} />
                        <Input type="number" placeholder="Order" value={editSubjectData.order} onChange={e => setEditSubjectData({ ...editSubjectData, order: e.target.value })} />
                      </div>
                      <div className="border border-border rounded-lg p-3 bg-bg-tertiary">
                         <span className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Grades:</span>
                         <div className="flex flex-wrap gap-3">
                           {Object.entries(grades).map(([gk, g]) => (
                             <label key={`edit-sub-g-${gk}`} className="flex items-center gap-2 cursor-pointer text-xs text-text-primary">
                               <input type="checkbox" className="rounded border-border text-success focus:ring-success h-3.5 w-3.5" checked={editSubjectData.grades.includes(gk)} onChange={e => {
                                 const newGrades = e.target.checked ? [...editSubjectData.grades, gk] : editSubjectData.grades.filter(id => id !== gk);
                                 setEditSubjectData({ ...editSubjectData, grades: newGrades });
                               }} />
                               {g.display}
                             </label>
                           ))}
                         </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" onClick={handleCancelEditSubject}>Cancel</Button>
                        <Button className="bg-success hover:bg-success-dark text-white border-0" onClick={handleSaveEditSubject}>Save Changes</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getLucideIcon(subject.icon, "text-success w-5 h-5")}
                          <strong className="text-text-primary">{subject.name}</strong>
                          <span className="text-[10px] uppercase font-bold bg-bg-tertiary text-text-muted px-2 py-0.5 rounded-full border border-border">ID: {key}</span>
                        </div>
                        <div className="text-xs text-text-muted mt-2 flex flex-wrap gap-1">
                           {subject.grades?.filter(gk => !!grades[gk]).map(gk => (
                             <span key={gk} className="bg-card px-1.5 py-0.5 rounded border border-border shadow-sm">{grades[gk].display}</span>
                           ))}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-info hover:bg-info/10" onClick={() => handleEditSubjectClick(key, subject)}><Edit2 className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-danger hover:bg-danger/10" onClick={() => handleDeleteSubject(key)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Grid>
  );
};

export default AdminGradeManager;
