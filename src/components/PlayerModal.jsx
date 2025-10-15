import React, { useState } from 'react';

const PlayerModal = ({ player, playerNotes, isOpen, onClose, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !player) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAddNote(player.id, newNote.trim());
      setNewNote('');
      setIsSubmitting(false);
    }, 500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const sortedNotes = [...playerNotes].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <span className="text-gray-700 font-semibold text-lg">#{player.jerseyNumber}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{player.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{player.position}</span>
                <span className="text-sm text-gray-500">Age {player.age}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Note */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Add New Note</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your observations..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!newNote.trim() || isSubmitting}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isSubmitting ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>

          {/* Notes History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Notes History</h3>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{sortedNotes.length} notes</span>
            </div>

            {sortedNotes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-900 mb-1">No notes yet</p>
                <p className="text-sm text-gray-500">Start by adding the first note for this player.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedNotes.map((note, index) => (
                  <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-gray-600">{formatDate(note.date)}</span>
                      {index === 0 && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">Latest</span>}
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed mb-2">{note.note}</p>
                    <span className="text-xs text-gray-500">by {note.createdBy}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
