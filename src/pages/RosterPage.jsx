import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import PlayerCard from '../components/PlayerCard';
import PlayerModal from '../components/PlayerModal';
import playersData from '../data/players.json';
import notesData from '../data/notes.json';

const RosterPage = () => {
  const [players, setPlayers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPlayers(playersData);
      setNotes(notesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getLastNote = (playerId) => {
    const playerNotes = notes.filter(note => note.playerId === playerId);
    if (!playerNotes.length) return null;
    return playerNotes.reduce((latest, current) => new Date(current.date) > new Date(latest.date) ? current : latest);
  };

  const isPlayerOverdue = (playerId) => {
    const lastNote = getLastNote(playerId);
    if (!lastNote) return true;
    const diffDays = Math.floor((new Date() - new Date(lastNote.date)) / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  };

  const getPlayerNotes = (playerId) => notes.filter(note => note.playerId === playerId);

  const handleAddNote = (playerId, noteText) => {
    const newNote = {
      id: notes.length + 1,
      playerId,
      date: new Date().toISOString().split('T')[0],
      note: noteText,
      createdBy: 'Coach Ahmed'
    };
    setNotes([...notes, newNote]);
  };

  const getFilteredAndSortedPlayers = () => {
    let filteredPlayers = [...players];

    if (searchTerm.trim()) {
      filteredPlayers = filteredPlayers.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType === 'missing-notes') {
      filteredPlayers = filteredPlayers.filter(player => isPlayerOverdue(player.id));
    } else if (filterType === 'recent-notes') {
      filteredPlayers = filteredPlayers.filter(player => !isPlayerOverdue(player.id));
    }

    filteredPlayers.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'position': return a.position.localeCompare(b.position);
        case 'recent-note':
          const lastA = getLastNote(a.id), lastB = getLastNote(b.id);
          if (!lastA && !lastB) return 0;
          if (!lastA) return 1;
          if (!lastB) return -1;
          return new Date(lastB.date) - new Date(lastA.date);
        case 'oldest-note':
          const oldA = getLastNote(a.id), oldB = getLastNote(b.id);
          if (!oldA && !oldB) return 0;
          if (!oldA) return 1;
          if (!oldB) return -1;
          return new Date(oldA.date) - new Date(oldB.date);
        default: return 0;
      }
    });

    return filteredPlayers;
  };

  const handlePlayerClick = (player) => { setSelectedPlayer(player); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedPlayer(null); };
  const filteredPlayers = getFilteredAndSortedPlayers();
  const overdueCount = players.filter(player => isPlayerOverdue(player.id)).length;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-sm text-gray-600">Loading roster...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Team Roster</h1>
            <p className="mt-1 text-sm text-gray-600">Manage and track player performance notes</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <span className="text-xs font-medium text-gray-600">Total Players:</span>
              <span className="font-semibold text-gray-900">{players.length}</span>
            </div>
            {overdueCount > 0 && (
              <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-red-700">{overdueCount} Overdue</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterType={filterType} setFilterType={setFilterType} sortBy={sortBy} setSortBy={setSortBy} />

        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredPlayers.length}</span> of <span className="font-medium text-gray-900">{players.length}</span> players
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-base font-medium text-gray-900 mb-1">No players found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map(player => (
              <PlayerCard key={player.id} player={player} lastNote={getLastNote(player.id)} isOverdue={isPlayerOverdue(player.id)} onPlayerClick={handlePlayerClick} />
            ))}
          </div>
        )}
      </div>

      <PlayerModal player={selectedPlayer} playerNotes={selectedPlayer ? getPlayerNotes(selectedPlayer.id) : []} isOpen={isModalOpen} onClose={handleCloseModal} onAddNote={handleAddNote} />
    </div>
  );
};

export default RosterPage;
