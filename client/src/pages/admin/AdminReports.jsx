import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Flag, CheckCircle, AlertCircle, Clock, ExternalLink, X } from 'lucide-react';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchReports = async () => {
        try {
            const res = await api.get('/exams/reports');
            setReports(res.data);
        } catch (err) {
            console.error('Failed to fetch reports', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleResolve = async (id) => {
        try {
            await api.put(`/exams/reports/${id}/resolve`);
            fetchReports();
        } catch (err) {
            console.error('Failed to resolve report', err);
        }
    };

    const handleViewQuestion = async (questionId) => {
        try {
            const res = await api.get(`/quizzes/question/${questionId}`);
            setEditingQuestion(res.data);
        } catch (err) {
            console.error('Failed to fetch question details', err);
            alert('Could not load question details.');
        }
    };

    const handleSaveQuestion = async () => {
        setSaving(true);
        try {
            await api.put(`/quizzes/question/${editingQuestion.id}`, {
                question_text: editingQuestion.question_text,
                options: editingQuestion.options
            });
            setEditingQuestion(null);
            fetchReports(); // Refresh reports to see updated text if referenced
            alert('Question updated successfully!');
        } catch (err) {
            console.error('Failed to update question', err);
            alert('Failed to update question.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-text">Question Reports</h1>
                    <p className="text-text/60 font-medium">Manage and resolve issues reported by users.</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold flex items-center space-x-2">
                    <Flag size={20} />
                    <span>{reports.filter(r => r.status === 'pending').length} Pending</span>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-text">No active reports</h2>
                    <p className="text-text/50 max-w-sm mx-auto">All good! No questions have been reported recently.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reports.map((report) => (
                        <div 
                            key={report.id} 
                            className={`bg-card border rounded-3xl p-6 shadow-sm transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 ${
                                report.status === 'pending' ? 'border-amber-500/30 ring-1 ring-amber-500/10' : 'border-neutral-200 dark:border-neutral-800 opacity-70'
                            }`}
                        >
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-xl ${report.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                        {report.status === 'pending' ? <Clock size={20} /> : <CheckCircle size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-black text-text text-lg">Question #{report.question_id}</p>
                                        <p className="text-xs text-text/40 font-bold uppercase tracking-widest">{new Date(report.created_at).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                                    <p className="text-xs font-bold text-text/40 uppercase tracking-widest mb-1">Question Text</p>
                                    <p className="text-text font-medium leading-relaxed italic">"{report.question_text}"</p>
                                </div>

                                <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <AlertCircle size={14} className="text-amber-500" />
                                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">User Reason</p>
                                    </div>
                                    <p className="text-text/80 font-semibold">{report.reason}</p>
                                </div>

                                <div className="flex items-center space-x-2 text-xs font-medium text-text/40">
                                    <span>Reported by:</span>
                                    <span className="text-primary/70">{report.user_email}</span>
                                </div>
                            </div>

                            <div className="flex md:flex-col items-center justify-end gap-3 pt-4 md:pt-0">
                                {report.status === 'pending' && (
                                    <button 
                                        onClick={() => handleResolve(report.id)}
                                        className="flex-1 md:w-full flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        <CheckCircle size={18} />
                                        <span>Resolve</span>
                                    </button>
                                )}
                                <button 
                                    className="flex-1 md:w-full flex items-center justify-center space-x-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-text/60 font-bold rounded-2xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                                    onClick={() => handleViewQuestion(report.question_id)}
                                >
                                    <ExternalLink size={18} />
                                    <span>View Question</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for editing question */}
            {editingQuestion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-text">Edit Question #{editingQuestion.id}</h2>
                            <button onClick={() => setEditingQuestion(null)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text/40 uppercase tracking-widest mb-2">Question Text</label>
                                <textarea
                                    value={editingQuestion.question_text}
                                    onChange={(e) => setEditingQuestion(prev => ({...prev, question_text: e.target.value}))}
                                    rows={4}
                                    className="w-full bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-medium text-text"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-text/40 uppercase tracking-widest mb-1">Options</label>
                                {editingQuestion.options.map((opt, idx) => (
                                    <div key={opt.id} className={`flex items-center space-x-3 p-2 rounded-2xl border transition-all ${opt.is_correct ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-neutral-200 dark:border-neutral-800'}`}>
                                        <button 
                                            onClick={() => {
                                                const newOpts = editingQuestion.options.map(o => ({...o, is_correct: o.id === opt.id}));
                                                setEditingQuestion(prev => ({...prev, options: newOpts}));
                                            }}
                                            title="Mark as correct answer"
                                            className={`w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center transition-all ${opt.is_correct ? 'bg-emerald-500 text-white shadow-sm' : 'bg-neutral-100 dark:bg-neutral-800 text-text/40 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                                        >
                                            {opt.is_correct ? <CheckCircle size={18} /> : String.fromCharCode(65 + idx)}
                                        </button>
                                        <input
                                            type="text"
                                            value={opt.option_text}
                                            onChange={(e) => {
                                                const newOpts = [...editingQuestion.options];
                                                newOpts[idx].option_text = e.target.value;
                                                setEditingQuestion(prev => ({...prev, options: newOpts}));
                                            }}
                                            className="flex-1 bg-transparent border-none text-sm text-text focus:outline-none font-medium h-full px-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-neutral-100 dark:border-neutral-800">
                            <button onClick={() => setEditingQuestion(null)} className="px-6 py-3 font-bold text-text/60 hover:text-text transition-colors">
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveQuestion}
                                disabled={saving}
                                className="flex items-center justify-center space-x-2 w-40 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                            >
                                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
