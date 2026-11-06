import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Clock, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function TruthLedgerView() {
  const { truthLedger, addLedgerEntry, updateLedgerEntry, deleteLedgerEntry } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [historyModalItem, setHistoryModalItem] = useState(null);
  const [editModalItem, setEditModalItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newEntry, setNewEntry] = useState({
    category: 'Commercial Pricing',
    claim: '',
    approvedValue: '',
    outdatedValue: '',
    sourceReference: '',
    status: 'VERIFIED'
  });

  const categories = [
    'ALL',
    'Commercial Pricing',
    'Product Terminology',
    'Clinical & Efficacy Claims',
    'Brand Attribution',
    'Sourcing & Quality'
  ];

  const filteredLedger = truthLedger.filter(item => {
    const matchesSearch = 
      item.claim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.approvedValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.claim.trim() || !newEntry.approvedValue.trim()) return;
    addLedgerEntry(newEntry);
    setNewEntry({
      category: 'Commercial Pricing',
      claim: '',
      approvedValue: '',
      outdatedValue: '',
      sourceReference: '',
      status: 'VERIFIED'
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editModalItem) return;
    updateLedgerEntry(editModalItem.id, {
      category: editModalItem.category,
      claim: editModalItem.claim,
      approvedValue: editModalItem.approvedValue,
      outdatedValue: editModalItem.outdatedValue,
      sourceReference: editModalItem.sourceReference,
      status: editModalItem.status,
      historyNote: editModalItem.historyNote || 'Updated fact entry in Brand Truth Ledger'
    });
    setEditModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-depth rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Database className="w-4 h-4 text-midnight-950" />
            <span>Evidentiary Records Management</span>
          </div>
          <h1 className="text-xl font-extrabold text-midnight-950 tracking-tight">
            Brand Truth Ledger
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            The authoritative versioned ledger of certified brand facts, approved claims, price schedules, and evidentiary citations used to verify public communications.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-lime px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 self-start md:self-auto shadow-lime-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Truth Record</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by claim, approved value, citation or ID..."
            className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'btn-dark'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="card-depth rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-28">Fact ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Subject / Claim</th>
                <th className="py-3 px-4">Approved Truth Value</th>
                <th className="py-3 px-4">Outdated Value</th>
                <th className="py-3 px-4">Certified Source Document</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                    No truth ledger entries match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-midnight-950">
                      {item.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-midnight-950">{item.claim}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Updated: {item.lastUpdated}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-midnight-950 bg-lime-400/25 px-2.5 py-1 rounded border border-lime-500/40 inline-block shadow-sm">
                        {item.approvedValue}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.outdatedValue ? (
                        <span className="text-slate-400 line-through bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block">
                          {item.outdatedValue}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate" title={item.sourceReference}>
                      <span className="font-medium">{item.sourceReference}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setHistoryModalItem(item)}
                        className="inline-flex items-center gap-1 font-mono text-xs text-midnight-950 hover:text-lime-700 font-bold"
                        title="View revision audit trail"
                      >
                        <Clock className="w-3.5 h-3.5 text-lime-600" />
                        <span>{item.version}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditModalItem(item)}
                          className="p-1.5 text-slate-500 hover:text-midnight-950 hover:bg-slate-100 rounded transition-colors"
                          title="Edit fact"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteLedgerEntry(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete fact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revision History Modal with 3D Depth */}
      {historyModalItem && (
        <div className="fixed inset-0 z-50 bg-midnight-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-lime-600" />
                <h3 className="font-extrabold text-midnight-950 text-sm">
                  Revision Audit Trail — {historyModalItem.id}
                </h3>
              </div>
              <button
                onClick={() => setHistoryModalItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Subject / Fact</span>
              <div className="font-bold text-midnight-950 text-sm">{historyModalItem.claim}</div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                Historical Versions & Directives
              </span>

              {historyModalItem.changeHistory && historyModalItem.changeHistory.length > 0 ? (
                <div className="relative border-l-2 border-slate-200 ml-2 space-y-4 py-1">
                  {historyModalItem.changeHistory.map((h, i) => (
                    <div key={i} className="ml-4 relative text-xs">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-lime-500 ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-midnight-950">{h.version}</span>
                        <span className="text-[11px] text-slate-400">{h.date}</span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed">
                        {h.note}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Initial baseline version {historyModalItem.version}. No subsequent modifications recorded.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setHistoryModalItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                Close Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {editModalItem && (
        <div className="fixed inset-0 z-50 bg-midnight-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-midnight-950" />
                <h3 className="font-extrabold text-midnight-950 text-sm">
                  Update Fact — {editModalItem.id}
                </h3>
              </div>
              <button onClick={() => setEditModalItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={editModalItem.category}
                  onChange={(e) => setEditModalItem({ ...editModalItem, category: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                >
                  {categories.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Claim</label>
                <input
                  type="text"
                  value={editModalItem.claim}
                  onChange={(e) => setEditModalItem({ ...editModalItem, claim: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-midnight-950 mb-1">Approved Value</label>
                  <input
                    type="text"
                    value={editModalItem.approvedValue}
                    onChange={(e) => setEditModalItem({ ...editModalItem, approvedValue: e.target.value })}
                    className="w-full p-2.5 bg-white border border-lime-500/50 font-bold rounded-lg focus:border-lime-600 focus:outline-none shadow-inner-subtle"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Outdated / Superseded Value</label>
                  <input
                    type="text"
                    value={editModalItem.outdatedValue || ''}
                    onChange={(e) => setEditModalItem({ ...editModalItem, outdatedValue: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-slate-400 focus:outline-none shadow-inner-subtle"
                    placeholder="Previous value to flag"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Certified Policy / Source Document</label>
                <input
                  type="text"
                  value={editModalItem.sourceReference}
                  onChange={(e) => setEditModalItem({ ...editModalItem, sourceReference: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Revision Audit Note</label>
                <input
                  type="text"
                  value={editModalItem.historyNote || ''}
                  onChange={(e) => setEditModalItem({ ...editModalItem, historyNote: e.target.value })}
                  placeholder="Reason for revision (e.g. Price revised per Q1 budget directive)"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-lime px-4 py-2 rounded-lg font-bold shadow-lime-sm"
                >
                  Save Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-midnight-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-midnight-950" />
                <h3 className="font-extrabold text-midnight-950 text-sm">
                  Add Record to Truth Ledger
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                >
                  {categories.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Claim</label>
                <input
                  type="text"
                  value={newEntry.claim}
                  onChange={(e) => setNewEntry({ ...newEntry, claim: e.target.value })}
                  placeholder="e.g. Protein Blend Current Retail Price"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-midnight-950 mb-1">Approved Value</label>
                  <input
                    type="text"
                    value={newEntry.approvedValue}
                    onChange={(e) => setNewEntry({ ...newEntry, approvedValue: e.target.value })}
                    placeholder="e.g. ₹1,199"
                    className="w-full p-2.5 bg-white border border-lime-500/50 font-bold rounded-lg focus:border-lime-600 focus:outline-none shadow-inner-subtle"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Outdated Value</label>
                  <input
                    type="text"
                    value={newEntry.outdatedValue}
                    onChange={(e) => setNewEntry({ ...newEntry, outdatedValue: e.target.value })}
                    placeholder="e.g. ₹999"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-slate-400 focus:outline-none shadow-inner-subtle"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Certified Policy Citation / Source</label>
                <input
                  type="text"
                  value={newEntry.sourceReference}
                  onChange={(e) => setNewEntry({ ...newEntry, sourceReference: e.target.value })}
                  placeholder="e.g. Finance Directive Q1 / FSSAI Guidelines"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-lime px-4 py-2 rounded-lg font-bold shadow-lime-sm"
                >
                  Add Truth Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
