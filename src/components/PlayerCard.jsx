import React from 'react';

const PlayerCard = ({ player, lastNote, isOverdue, onPlayerClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No notes';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysAgo = (dateString) => {
    if (!dateString) return null;
    const noteDate = new Date(dateString);
    const today = new Date();
    const diffTime = today - noteDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysAgo = getDaysAgo(lastNote?.date);

  return (
    <div onClick={() => onPlayerClick(player)} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            <span className="text-gray-700 font-semibold text-sm">#{player.jerseyNumber}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">{player.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{player.position}</span>
              <span className="text-xs text-gray-500">Age {player.age}</span>
            </div>
          </div>
        </div>
        {isOverdue && (
          <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-200">
            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-red-700">Overdue</span>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-gray-600">Last Note</p>
          {daysAgo !== null && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{lastNote?.note || 'No notes available for this player yet.'}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{formatDate(lastNote?.date)}</span>
          <span className="text-blue-600 font-medium">View details →</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
