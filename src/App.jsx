import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Eye, EyeOff, Menu, X } from 'lucide-react';

const MCUViewingOrderViewer = () => {
  const mcu_data = [
    // Phase 1
    { id: 1, order: 1, title: "Captain America: The First Avenger", year: 2011, prereq: "None", watched: false, essential: true, phase: 1 },
    { id: 2, order: 2, title: "Agent Carter (short film)", year: 2013, prereq: "CATFA", watched: false, essential: false, phase: 1 },
    { id: 3, order: 3, title: "Agent Carter (Seasons 1 & 2)", year: 2015, prereq: "CATFA", watched: false, essential: true, phase: 1 },
    { id: 4, order: 4, title: "Captain Marvel (main film only - skip end-credits)", year: 2019, prereq: "None", watched: false, essential: true, phase: 1 },
    { id: 5, order: 5, title: "Iron Man", year: 2008, prereq: "None", watched: false, essential: true, phase: 1 },
    { id: 6, order: 6, title: "Iron Man 2", year: 2010, prereq: "Iron Man", watched: false, essential: true, phase: 1 },
    { id: 7, order: 7, title: "The Incredible Hulk", year: 2008, prereq: "None", watched: false, essential: true, phase: 1 },
    { id: 8, order: 8, title: "A Funny Thing Happened on the Way to Thor's Hammer (short)", year: 2011, prereq: "None", watched: false, essential: false, phase: 1 },
    { id: 9, order: 9, title: "Thor", year: 2011, prereq: "None", watched: false, essential: true, phase: 1 },
    { id: 10, order: 10, title: "The Consultant (short)", year: 2011, prereq: "The Avengers", watched: false, essential: false, phase: 1 },
    { id: 11, order: 11, title: "The Avengers", year: 2012, prereq: "IM1, IM2, IH, Thor", watched: false, essential: true, phase: 1 },
    { id: 12, order: 12, title: "Item 47 (short)", year: 2012, prereq: "The Avengers", watched: false, essential: false, phase: 1 },
    
    // Phase 2
    { id: 13, order: 13, title: "Agents of SHIELD Season 1, Episodes 1-7", year: 2013, prereq: "The Avengers", watched: false, essential: false, phase: 2 },
    { id: 14, order: 14, title: "Thor: The Dark World", year: 2013, prereq: "Thor, The Avengers", watched: false, essential: true, phase: 2 },
    { id: 15, order: 15, title: "Agents of SHIELD Season 1, Episodes 8-12", year: 2013, prereq: "The Avengers", watched: false, essential: false, phase: 2 },
    { id: 16, order: 16, title: "Iron Man 3", year: 2013, prereq: "Iron Man 2, The Avengers", watched: false, essential: true, phase: 2 },
    { id: 17, order: 17, title: "All Hail the King (short)", year: 2014, prereq: "Iron Man 3", watched: false, essential: false, phase: 2 },
    { id: 18, order: 18, title: "Agents of SHIELD Season 1, Episodes 13-15", year: 2013, prereq: "The Avengers", watched: false, essential: false, phase: 2 },
    { id: 19, order: 19, title: "Agents of SHIELD Season 1, Episode 16", year: 2013, prereq: "The Avengers", watched: false, essential: false, phase: 2 },
    { id: 20, order: 20, title: "Captain America: The Winter Soldier", year: 2014, prereq: "CATFA, The Avengers", watched: false, essential: true, phase: 2 },
    { id: 21, order: 21, title: "Agents of SHIELD S1 Episodes 17-22 & S2 Episodes 1-2", year: 2014, prereq: "CATWS", watched: false, essential: false, phase: 2 },
    { id: 22, order: 22, title: "Guardians of the Galaxy", year: 2014, prereq: "None (standalone)", watched: false, essential: true, phase: 2 },
    { id: 23, order: 23, title: "I Am Groot Season 1, Episode 1", year: 2023, prereq: "Guardians of the Galaxy Vol. 1", watched: false, essential: false, phase: 2 },
    { id: 24, order: 24, title: "Agents of SHIELD Season 2, Episode 3", year: 2014, prereq: "CATWS", watched: false, essential: false, phase: 2 },
    { id: 25, order: 25, title: "Guardians of the Galaxy Vol. 2", year: 2017, prereq: "Guardians of the Galaxy Vol. 1", watched: false, essential: true, phase: 2 },
    { id: 26, order: 26, title: "I Am Groot S1 Episodes 2-5 & S2", year: 2023, prereq: "GotG films", watched: false, essential: false, phase: 2 },
    { id: 27, order: 27, title: "Agents of SHIELD Season 2, Episodes 4-5", year: 2014, prereq: "CATWS", watched: false, essential: false, phase: 2 },
    { id: 28, order: 28, title: "Daredevil Season 1", year: 2015, prereq: "None (mostly standalone)", watched: false, essential: true, phase: 2 },
    { id: 29, order: 29, title: "Jessica Jones Season 1", year: 2015, prereq: "None (mostly standalone)", watched: false, essential: true, phase: 2 },
    { id: 30, order: 30, title: "Agents of SHIELD Season 2, Episodes 6-19", year: 2014, prereq: "CATWS", watched: false, essential: false, phase: 2 },
    { id: 31, order: 31, title: "Avengers: Age of Ultron", year: 2015, prereq: "All Phase 1-2 films", watched: false, essential: true, phase: 2 },
    { id: 32, order: 32, title: "Agents of SHIELD Season 2, Episodes 20-22", year: 2014, prereq: "CATWS", watched: false, essential: false, phase: 2 },
    { id: 33, order: 33, title: "WHiH News Front Season 1", year: 2014, prereq: "Age of Ultron context", watched: false, essential: false, phase: 2 },
    { id: 34, order: 34, title: "Ant-Man", year: 2015, prereq: "Age of Ultron", watched: false, essential: true, phase: 2 },
    { id: 35, order: 35, title: "Daredevil Season 2", year: 2016, prereq: "Daredevil Season 1", watched: false, essential: true, phase: 2 },
    { id: 36, order: 36, title: "Luke Cage Season 1", year: 2016, prereq: "Jessica Jones (recommended)", watched: false, essential: true, phase: 2 },
    { id: 37, order: 37, title: "Agents of SHIELD Season 3, Episodes 1-10", year: 2015, prereq: "Previous SHIELD seasons", watched: false, essential: false, phase: 2 },
    { id: 38, order: 38, title: "Iron Fist Season 1", year: 2017, prereq: "Daredevil, Luke Cage, Jessica Jones", watched: false, essential: true, phase: 2 },
    { id: 39, order: 39, title: "Agents of SHIELD Season 3, Episodes 11-22", year: 2015, prereq: "Previous SHIELD seasons", watched: false, essential: false, phase: 2 },
    { id: 40, order: 40, title: "WHiH News Front Season 2", year: 2015, prereq: "Ongoing MCU events", watched: false, essential: false, phase: 2 },
    { id: 41, order: 41, title: "The Defenders Season 1", year: 2017, prereq: "All Netflix street-level shows", watched: false, essential: true, phase: 2 },
    
    // Phase 3
    { id: 42, order: 42, title: "Captain America: Civil War", year: 2016, prereq: "All previous MCU films", watched: false, essential: true, phase: 3 },
    { id: 43, order: 43, title: "Black Widow (main film only - skip end-credits)", year: 2021, prereq: "Captain America: Civil War", watched: false, essential: true, phase: 3 },
    { id: 44, order: 44, title: "Agents of SHIELD Season 4", year: 2016, prereq: "Previous SHIELD seasons", watched: false, essential: false, phase: 3 },
    { id: 45, order: 45, title: "Agents of SHIELD: Slingshot Season 1", year: 2016, prereq: "SHIELD context", watched: false, essential: false, phase: 3 },
    { id: 46, order: 46, title: "Black Panther", year: 2018, prereq: "Civil War (for Killmonger)", watched: false, essential: true, phase: 3 },
    { id: 47, order: 47, title: "Eyes of Wakanda Season 1", year: 2024, prereq: "Black Panther", watched: false, essential: false, phase: 3 },
    { id: 48, order: 48, title: "Spider-Man: Homecoming", year: 2017, prereq: "Civil War (Tony cameo)", watched: false, essential: true, phase: 3 },
    { id: 49, order: 49, title: "The Punisher Season 1", year: 2017, prereq: "Daredevil Season 2", watched: false, essential: true, phase: 3 },
    { id: 50, order: 50, title: "Doctor Strange", year: 2016, prereq: "General MCU knowledge", watched: false, essential: true, phase: 3 },
    { id: 51, order: 51, title: "Cloak & Dagger Season 1", year: 2018, prereq: "None (mostly standalone)", watched: false, essential: false, phase: 3 },
    { id: 52, order: 52, title: "Jessica Jones Season 2", year: 2018, prereq: "Jessica Jones Season 1", watched: false, essential: true, phase: 3 },
    { id: 53, order: 53, title: "Luke Cage Season 2", year: 2018, prereq: "Luke Cage Season 1", watched: false, essential: true, phase: 3 },
    { id: 54, order: 54, title: "Iron Fist Season 2", year: 2018, prereq: "Iron Fist Season 1", watched: false, essential: true, phase: 3 },
    { id: 55, order: 55, title: "Daredevil Season 3", year: 2018, prereq: "Daredevil Seasons 1-2", watched: false, essential: true, phase: 3 },
    { id: 56, order: 56, title: "Cloak & Dagger Season 2", year: 2019, prereq: "Cloak & Dagger Season 1", watched: false, essential: false, phase: 3 },
    { id: 57, order: 57, title: "Thor: Ragnarok", year: 2017, prereq: "Thor, The Dark World", watched: false, essential: true, phase: 3 },
    { id: 58, order: 58, title: "Runaways Seasons 1-3", year: 2017, prereq: "None (standalone)", watched: false, essential: false, phase: 3 },
    { id: 59, order: 59, title: "The Punisher Season 2", year: 2019, prereq: "The Punisher Season 1", watched: false, essential: false, phase: 3 },
    { id: 60, order: 60, title: "Jessica Jones Season 3", year: 2019, prereq: "Jessica Jones Seasons 1-2", watched: false, essential: false, phase: 3 },
    { id: 61, order: 61, title: "Ant-Man and the Wasp (main film - skip end-credits)", year: 2018, prereq: "Ant-Man", watched: false, essential: true, phase: 3 },
    { id: 62, order: 62, title: "Avengers: Infinity War", year: 2018, prereq: "All previous MCU films", watched: false, essential: true, phase: 3 },
    { id: 63, order: 63, title: "Captain Marvel (end-credit scenes)", year: 2019, prereq: "Infinity War", watched: false, essential: true, phase: 3 },
    { id: 64, order: 64, title: "Avengers: Endgame", year: 2019, prereq: "Infinity War, all MCU films", watched: false, essential: true, phase: 3 },
    
    // Phase 4
    { id: 65, order: 65, title: "Loki Season 1", year: 2021, prereq: "Avengers: Endgame", watched: false, essential: true, phase: 4 },
    { id: 66, order: 66, title: "What If...? Season 1", year: 2021, prereq: "Various MCU films/shows", watched: false, essential: false, phase: 4 },
    { id: 67, order: 67, title: "WandaVision Season 1", year: 2021, prereq: "Endgame, Captain Marvel", watched: false, essential: true, phase: 4 },
    { id: 68, order: 68, title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, prereq: "General MCU knowledge", watched: false, essential: true, phase: 4 },
    { id: 69, order: 69, title: "The Falcon and the Winter Soldier Season 1", year: 2021, prereq: "Endgame, Civil War", watched: false, essential: true, phase: 4 },
    { id: 70, order: 70, title: "Spider-Man: Far From Home", year: 2019, prereq: "Homecoming, Endgame", watched: false, essential: true, phase: 4 },
    { id: 71, order: 71, title: "The Daily Bugle Seasons 1 & 2", year: 2020, prereq: "Spider-Man films", watched: false, essential: false, phase: 4 },
    { id: 72, order: 72, title: "She-Hulk: Attorney at Law Season 1", year: 2022, prereq: "The Incredible Hulk, Endgame", watched: false, essential: true, phase: 4 },
    { id: 73, order: 73, title: "Eternals", year: 2021, prereq: "Endgame (Eternals flashbacks)", watched: false, essential: true, phase: 4 },
    { id: 74, order: 74, title: "Spider-Man: No Way Home", year: 2021, prereq: "Homecoming, Far From Home", watched: false, essential: true, phase: 4 },
    { id: 75, order: 75, title: "Doctor Strange in the Multiverse of Madness", year: 2022, prereq: "Doctor Strange, WandaVision", watched: false, essential: true, phase: 4 },
    { id: 76, order: 76, title: "Hawkeye Season 1", year: 2021, prereq: "MCU films, Black Widow context", watched: false, essential: true, phase: 4 },
    { id: 77, order: 77, title: "Moon Knight Season 1", year: 2022, prereq: "None (standalone)", watched: false, essential: true, phase: 4 },
    { id: 78, order: 78, title: "Black Panther: Wakanda Forever", year: 2022, prereq: "Black Panther", watched: false, essential: true, phase: 4 },
    { id: 79, order: 79, title: "Echo Season 1", year: 2024, prereq: "Hawkeye (Kingpin setup)", watched: false, essential: true, phase: 4 },
    { id: 80, order: 80, title: "Ms. Marvel Season 1", year: 2022, prereq: "None (mostly standalone)", watched: false, essential: true, phase: 4 },
    { id: 81, order: 81, title: "Thor: Love and Thunder", year: 2022, prereq: "Thor: Ragnarok, Infinity War", watched: false, essential: true, phase: 4 },
    { id: 82, order: 82, title: "Ironheart Season 1", year: 2023, prereq: "Homecoming/No Way Home", watched: false, essential: true, phase: 4 },
    { id: 83, order: 83, title: "Werewolf by Night", year: 2022, prereq: "None (supernatural entry)", watched: false, essential: false, phase: 4 },
    { id: 84, order: 84, title: "The Guardians of the Galaxy Holiday Special", year: 2022, prereq: "GotG films", watched: false, essential: false, phase: 4 },
    
    // Phase 5
    { id: 85, order: 85, title: "Ant-Man and the Wasp: Quantumania", year: 2023, prereq: "Ant-Man and the Wasp", watched: false, essential: true, phase: 5 },
    { id: 86, order: 86, title: "Guardians of the Galaxy Vol. 3", year: 2023, prereq: "GotG Vol. 2, Holiday Special", watched: false, essential: true, phase: 5 },
    { id: 87, order: 87, title: "Secret Invasion Season 1", year: 2023, prereq: "General MCU knowledge", watched: false, essential: false, phase: 5 },
    { id: 88, order: 88, title: "The Marvels", year: 2023, prereq: "Captain Marvel, Ms. Marvel, FATWS", watched: false, essential: true, phase: 5 },
    { id: 89, order: 89, title: "Loki Season 2", year: 2023, prereq: "Loki Season 1", watched: false, essential: true, phase: 5 },
    { id: 90, order: 90, title: "What If...? Season 2", year: 2023, prereq: "Various MCU content", watched: false, essential: false, phase: 5 },
    { id: 91, order: 91, title: "Deadpool & Wolverine", year: 2024, prereq: "None (multiverse)", watched: false, essential: true, phase: 5 },
    { id: 92, order: 92, title: "Agatha All Along Season 1", year: 2024, prereq: "WandaVision", watched: false, essential: true, phase: 5 },
    { id: 93, order: 93, title: "What If...? Season 3", year: 2024, prereq: "Various MCU content", watched: false, essential: false, phase: 5 },
    { id: 94, order: 94, title: "Your Friendly Neighborhood Spider-Man Season 1", year: 2024, prereq: "None (prequel to Homecoming)", watched: false, essential: true, phase: 5 },
    
    // Phase 6
    { id: 95, order: 95, title: "Daredevil: Born Again Season 1", year: 2025, prereq: "Daredevil Seasons 1-3", watched: false, essential: true, phase: 6 },
    { id: 96, order: 96, title: "Captain America: Brave New World", year: 2025, prereq: "The Falcon and the Winter Soldier", watched: false, essential: true, phase: 6 },
    { id: 97, order: 97, title: "Thunderbolts*", year: 2025, prereq: "CACBW, Black Widow, Civil War", watched: false, essential: true, phase: 6 },
    { id: 98, order: 98, title: "The Fantastic Four: First Steps", year: 2025, prereq: "None (intro to FF)", watched: false, essential: true, phase: 6 },
  ];

  const [items, setItems] = useState(mcu_data);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('order');
  const [showWatchedOnly, setShowWatchedOnly] = useState(false);
  const [hideNonEssential, setHideNonEssential] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWatched = localStorage.getItem('mcu-watched-items');
    if (savedWatched) {
      const watchedIds = JSON.parse(savedWatched);
      setItems(prev => prev.map(item => ({
        ...item,
        watched: watchedIds.includes(item.id)
      })));
    }
  }, []);

  // Save to localStorage whenever watched status changes
  const saveWatchedStatus = (updatedItems) => {
    const watchedIds = updatedItems.filter(item => item.watched).map(item => item.id);
    localStorage.setItem('mcu-watched-items', JSON.stringify(watchedIds));
  };

  const filteredItems = items
    .filter(item => {
      if (hideNonEssential && !item.essential) return false;
      if (selectedPhase && item.phase !== selectedPhase) return false;
      if (showWatchedOnly && !item.watched) return false;
      return item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.prereq.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'order') return a.order - b.order;
    if (sortBy === 'year') {
      const yearA = typeof a.year === 'string' ? parseInt(a.year.split('-')[0]) : a.year;
      const yearB = typeof b.year === 'string' ? parseInt(b.year.split('-')[0]) : b.year;
      return yearA - yearB;
    }
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const toggleWatched = (id) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, watched: !item.watched } : item
    );
    setItems(updatedItems);
    saveWatchedStatus(updatedItems);
  };

  const resetOrder = () => {
    const resetItems = items.map(item => ({ ...item, watched: false }));
    setItems(resetItems);
    saveWatchedStatus(resetItems);
    setSearchTerm('');
    setShowWatchedOnly(false);
    setHideNonEssential(false);
    setSelectedPhase(null);
  };

  const watchedCount = items.filter(i => i.watched).length;
  const progress = Math.round((watchedCount / items.length) * 100);

  const phases = [
    { id: 1, name: 'Phase 1', color: '#d4af37' },
    { id: 2, name: 'Phase 2', color: '#e74c3c' },
    { id: 3, name: 'Phase 3', color: '#3498db' },
    { id: 4, name: 'Phase 4', color: '#9b59b6' },
    { id: 5, name: 'Phase 5', color: '#f39c12' },
    { id: 6, name: 'Phase 6', color: '#1abc9c' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            <span style={{ color: '#d4af37' }}>MCU</span> Viewing Order
          </h1>
          <p className="text-slate-400 text-lg">Chronological narrative guide • Interactive viewer</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 font-semibold">Progress: {watchedCount} / {items.length} watched</span>
            <span style={{ color: '#d4af37' }} className="text-sm font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full transition-all duration-400" 
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #d4af37 0%, #c41e3a 100%)'
              }}
            ></div>
          </div>
        </div>

        {/* Phase Menu Button */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-yellow-500 transition-all flex items-center gap-2"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
            {selectedPhase ? `${phases.find(p => p.id === selectedPhase)?.name}` : 'All Phases'}
          </button>
        </div>

        {/* Phase Menu */}
        {menuOpen && (
          <div className="mb-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-300 text-sm font-semibold mb-3">Select Phase:</p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <button
                onClick={() => {
                  setSelectedPhase(null);
                  setMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedPhase === null
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All
              </button>
              {phases.map(phase => (
                <button
                  key={phase.id}
                  onClick={() => {
                    setSelectedPhase(phase.id);
                    setMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedPhase === phase.id
                      ? 'text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  style={selectedPhase === phase.id ? { backgroundColor: phase.color } : {}}
                >
                  {phase.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search by title or prerequisites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 cursor-pointer text-sm"
          >
            <option value="order">Sort: Order</option>
            <option value="year">Sort: Year</option>
            <option value="title">Sort: Title</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setHideNonEssential(!hideNonEssential)}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
                hideNonEssential
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-yellow-500'
              }`}
              title="Hide shorts and non-essential content"
            >
              Essential
            </button>
            <button
              onClick={() => setShowWatchedOnly(!showWatchedOnly)}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
                showWatchedOnly
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-yellow-500'
              }`}
            >
              {showWatchedOnly ? <Eye size={16} className="inline mr-1" /> : <EyeOff size={16} className="inline mr-1" />}
              Watched
            </button>
            <button
              onClick={resetOrder}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-slate-600 transition-all"
              title="Reset all filters and progress"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-slate-800 border-l-4 border-yellow-600 rounded-lg p-4 mb-6">
          <p className="text-slate-300 text-sm">
            <span style={{ color: '#d4af37' }} className="font-bold">✨ Features:</span> Click eye icon to mark watched (localStorage saves your progress). "Essential" hides shorts. Select Phase. Fixed year sorting! Progress persists across browser sessions.
          </p>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-sm" style={{ color: '#d4af37' }}>#</th>
                  <th className="px-4 py-3 text-left font-bold text-sm" style={{ color: '#d4af37' }}>Title</th>
                  <th className="px-4 py-3 text-center font-bold text-sm" style={{ color: '#d4af37' }}>Year</th>
                  <th className="px-4 py-3 text-left font-bold text-sm" style={{ color: '#d4af37' }}>Prerequisites</th>
                  <th className="px-4 py-3 text-center font-bold text-sm" style={{ color: '#d4af37' }}>Watched</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.length > 0 ? (
                  sortedItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-slate-700 transition-all hover:bg-slate-700 ${
                        item.watched ? 'bg-slate-700 opacity-60' : 'bg-slate-800'
                      }`}
                    >
                      <td className="px-4 py-3 font-bold" style={{ color: '#d4af37' }}>{item.order}</td>
                      <td className={`px-4 py-3 text-sm ${item.watched ? 'text-slate-500 line-through' : 'text-white'}`}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: phases.find(p => p.id === item.phase)?.color }}
                          ></div>
                          {item.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-400 text-sm">{item.year}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{item.prereq}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleWatched(item.id)}
                          className={`p-2 rounded transition-all ${
                            item.watched
                              ? 'bg-green-600 text-white'
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                        >
                          {item.watched ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                      No results found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-500 text-sm">
          <p>Cleaned MCU list • Phases 1-6 • Updated: 2025</p>
          <p className="text-xs mt-2">Uses localStorage for persistence • {items.filter(i => !i.essential).length} optional items • Year sorting fixed ✓</p>
        </div>
      </div>
    </div>
  );
};

export default MCUViewingOrderViewer;
