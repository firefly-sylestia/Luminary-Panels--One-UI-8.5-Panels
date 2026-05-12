import React, { useState, useEffect, useRef } from 'react';
import { Search, Eye, EyeOff, Star, Film, Tv, Zap, ChevronDown } from 'lucide-react';

const PHASES = [
  { id: 1, name: 'Phase 1', color: '#e8b84b', glow: 'rgba(232,184,75,0.28)',  bg: 'rgba(232,184,75,0.06)' },
  { id: 2, name: 'Phase 2', color: '#e05252', glow: 'rgba(224,82,82,0.28)',   bg: 'rgba(224,82,82,0.06)' },
  { id: 3, name: 'Phase 3', color: '#4a9ede', glow: 'rgba(74,158,222,0.28)',  bg: 'rgba(74,158,222,0.06)' },
  { id: 4, name: 'Phase 4', color: '#a06cd5', glow: 'rgba(160,108,213,0.28)', bg: 'rgba(160,108,213,0.06)' },
  { id: 5, name: 'Phase 5', color: '#3ec47a', glow: 'rgba(62,196,122,0.28)',  bg: 'rgba(62,196,122,0.06)' },
  { id: 6, name: 'Phase 6', color: '#25c4a0', glow: 'rgba(37,196,160,0.28)',  bg: 'rgba(37,196,160,0.06)' },
];

const TYPE_META = {
  film:   { label: 'Film',   Icon: Film, color: '#e8b84b' },
  series: { label: 'Series', Icon: Tv,   color: '#4a9ede' },
  short:  { label: 'Short',  Icon: Zap,  color: '#a06cd5' },
};

const NO_PREREQ = new Set([
  'None','None (standalone)','None (mostly standalone)',
  'None (multiverse)','None (intro to FF)','None (supernatural entry)',
  'None (prequel to Homecoming)','General MCU knowledge',
]);

const RAW = [
  { id:1,  order:1,  title:"Captain America: The First Avenger",            year:2011, prereq:"None",                              essential:true,  phase:1, type:'film'   },
  { id:2,  order:2,  title:"Agent Carter (short film)",                     year:2013, prereq:"CATFA",                             essential:false, phase:1, type:'short'  },
  { id:3,  order:3,  title:"Agent Carter (Seasons 1 & 2)",                  year:2015, prereq:"CATFA",                             essential:true,  phase:1, type:'series' },
  { id:4,  order:4,  title:"Captain Marvel (main film only)",               year:2019, prereq:"None",                              essential:true,  phase:1, type:'film'   },
  { id:5,  order:5,  title:"Iron Man",                                      year:2008, prereq:"None",                              essential:true,  phase:1, type:'film'   },
  { id:6,  order:6,  title:"Iron Man 2",                                    year:2010, prereq:"Iron Man",                          essential:true,  phase:1, type:'film'   },
  { id:7,  order:7,  title:"The Incredible Hulk",                           year:2008, prereq:"None",                              essential:true,  phase:1, type:'film'   },
  { id:8,  order:8,  title:"A Funny Thing Happened on the Way to Thor's Hammer", year:2011, prereq:"None",                         essential:false, phase:1, type:'short'  },
  { id:9,  order:9,  title:"Thor",                                          year:2011, prereq:"None",                              essential:true,  phase:1, type:'film'   },
  { id:10, order:10, title:"The Consultant (short)",                        year:2011, prereq:"The Avengers",                      essential:false, phase:1, type:'short'  },
  { id:11, order:11, title:"The Avengers",                                  year:2012, prereq:"IM1, IM2, IH, Thor",                essential:true,  phase:1, type:'film'   },
  { id:12, order:12, title:"Item 47 (short)",                               year:2012, prereq:"The Avengers",                      essential:false, phase:1, type:'short'  },
  { id:13, order:13, title:"Agents of SHIELD S1, Eps 1–7",                 year:2013, prereq:"The Avengers",                      essential:false, phase:2, type:'series' },
  { id:14, order:14, title:"Thor: The Dark World",                          year:2013, prereq:"Thor, The Avengers",                essential:true,  phase:2, type:'film'   },
  { id:15, order:15, title:"Agents of SHIELD S1, Eps 8–12",                year:2013, prereq:"The Avengers",                      essential:false, phase:2, type:'series' },
  { id:16, order:16, title:"Iron Man 3",                                    year:2013, prereq:"Iron Man 2, The Avengers",          essential:true,  phase:2, type:'film'   },
  { id:17, order:17, title:"All Hail the King (short)",                    year:2014, prereq:"Iron Man 3",                        essential:false, phase:2, type:'short'  },
  { id:18, order:18, title:"Agents of SHIELD S1, Eps 13–15",               year:2013, prereq:"The Avengers",                      essential:false, phase:2, type:'series' },
  { id:19, order:19, title:"Agents of SHIELD S1, Ep 16",                   year:2013, prereq:"The Avengers",                      essential:false, phase:2, type:'series' },
  { id:20, order:20, title:"Captain America: The Winter Soldier",           year:2014, prereq:"CATFA, The Avengers",               essential:true,  phase:2, type:'film'   },
  { id:21, order:21, title:"Agents of SHIELD S1 Eps 17–22 & S2 Eps 1–2",  year:2014, prereq:"CATWS",                             essential:false, phase:2, type:'series' },
  { id:22, order:22, title:"Guardians of the Galaxy",                       year:2014, prereq:"None (standalone)",                 essential:true,  phase:2, type:'film'   },
  { id:23, order:23, title:"I Am Groot S1, Ep 1",                          year:2023, prereq:"GotG Vol. 1",                       essential:false, phase:2, type:'short'  },
  { id:24, order:24, title:"Agents of SHIELD S2, Ep 3",                    year:2014, prereq:"CATWS",                             essential:false, phase:2, type:'series' },
  { id:25, order:25, title:"Guardians of the Galaxy Vol. 2",               year:2017, prereq:"GotG Vol. 1",                       essential:true,  phase:2, type:'film'   },
  { id:26, order:26, title:"I Am Groot S1 Eps 2–5 & S2",                  year:2023, prereq:"GotG films",                        essential:false, phase:2, type:'short'  },
  { id:27, order:27, title:"Agents of SHIELD S2, Eps 4–5",                 year:2014, prereq:"CATWS",                             essential:false, phase:2, type:'series' },
  { id:28, order:28, title:"Daredevil Season 1",                           year:2015, prereq:"None (mostly standalone)",          essential:true,  phase:2, type:'series' },
  { id:29, order:29, title:"Jessica Jones Season 1",                       year:2015, prereq:"None (mostly standalone)",          essential:true,  phase:2, type:'series' },
  { id:30, order:30, title:"Agents of SHIELD S2, Eps 6–19",                year:2014, prereq:"CATWS",                             essential:false, phase:2, type:'series' },
  { id:31, order:31, title:"Avengers: Age of Ultron",                      year:2015, prereq:"All Phase 1–2 films",               essential:true,  phase:2, type:'film'   },
  { id:32, order:32, title:"Agents of SHIELD S2, Eps 20–22",               year:2014, prereq:"CATWS",                             essential:false, phase:2, type:'series' },
  { id:33, order:33, title:"WHiH News Front Season 1",                     year:2014, prereq:"Age of Ultron context",             essential:false, phase:2, type:'short'  },
  { id:34, order:34, title:"Ant-Man",                                       year:2015, prereq:"Age of Ultron",                     essential:true,  phase:2, type:'film'   },
  { id:35, order:35, title:"Daredevil Season 2",                           year:2016, prereq:"Daredevil Season 1",                essential:true,  phase:2, type:'series' },
  { id:36, order:36, title:"Luke Cage Season 1",                           year:2016, prereq:"Jessica Jones (recommended)",       essential:true,  phase:2, type:'series' },
  { id:37, order:37, title:"Agents of SHIELD S3, Eps 1–10",                year:2015, prereq:"Previous SHIELD seasons",           essential:false, phase:2, type:'series' },
  { id:38, order:38, title:"Iron Fist Season 1",                           year:2017, prereq:"Daredevil, Luke Cage, JJ",          essential:true,  phase:2, type:'series' },
  { id:39, order:39, title:"Agents of SHIELD S3, Eps 11–22",               year:2015, prereq:"Previous SHIELD seasons",           essential:false, phase:2, type:'series' },
  { id:40, order:40, title:"WHiH News Front Season 2",                     year:2015, prereq:"Ongoing MCU events",               essential:false, phase:2, type:'short'  },
  { id:41, order:41, title:"The Defenders Season 1",                       year:2017, prereq:"All Netflix street-level shows",    essential:true,  phase:2, type:'series' },
  { id:42, order:42, title:"Captain America: Civil War",                   year:2016, prereq:"All previous MCU films",            essential:true,  phase:3, type:'film'   },
  { id:43, order:43, title:"Black Widow (main film only)",                  year:2021, prereq:"Captain America: Civil War",        essential:true,  phase:3, type:'film'   },
  { id:44, order:44, title:"Agents of SHIELD Season 4",                    year:2016, prereq:"Previous SHIELD seasons",           essential:false, phase:3, type:'series' },
  { id:45, order:45, title:"Agents of SHIELD: Slingshot S1",               year:2016, prereq:"SHIELD context",                   essential:false, phase:3, type:'series' },
  { id:46, order:46, title:"Black Panther",                                year:2018, prereq:"Civil War",                        essential:true,  phase:3, type:'film'   },
  { id:47, order:47, title:"Eyes of Wakanda Season 1",                     year:2024, prereq:"Black Panther",                    essential:false, phase:3, type:'series' },
  { id:48, order:48, title:"Spider-Man: Homecoming",                       year:2017, prereq:"Civil War (Tony cameo)",           essential:true,  phase:3, type:'film'   },
  { id:49, order:49, title:"The Punisher Season 1",                        year:2017, prereq:"Daredevil Season 2",               essential:true,  phase:3, type:'series' },
  { id:50, order:50, title:"Doctor Strange",                               year:2016, prereq:"General MCU knowledge",            essential:true,  phase:3, type:'film'   },
  { id:51, order:51, title:"Cloak & Dagger Season 1",                      year:2018, prereq:"None (mostly standalone)",         essential:false, phase:3, type:'series' },
  { id:52, order:52, title:"Jessica Jones Season 2",                       year:2018, prereq:"Jessica Jones Season 1",           essential:true,  phase:3, type:'series' },
  { id:53, order:53, title:"Luke Cage Season 2",                           year:2018, prereq:"Luke Cage Season 1",               essential:true,  phase:3, type:'series' },
  { id:54, order:54, title:"Iron Fist Season 2",                           year:2018, prereq:"Iron Fist Season 1",               essential:true,  phase:3, type:'series' },
  { id:55, order:55, title:"Daredevil Season 3",                           year:2018, prereq:"Daredevil Seasons 1–2",            essential:true,  phase:3, type:'series' },
  { id:56, order:56, title:"Cloak & Dagger Season 2",                      year:2019, prereq:"Cloak & Dagger Season 1",          essential:false, phase:3, type:'series' },
  { id:57, order:57, title:"Thor: Ragnarok",                               year:2017, prereq:"Thor, The Dark World",             essential:true,  phase:3, type:'film'   },
  { id:58, order:58, title:"Runaways Seasons 1–3",                         year:2017, prereq:"None (standalone)",                essential:false, phase:3, type:'series' },
  { id:59, order:59, title:"The Punisher Season 2",                        year:2019, prereq:"The Punisher Season 1",            essential:false, phase:3, type:'series' },
  { id:60, order:60, title:"Jessica Jones Season 3",                       year:2019, prereq:"Jessica Jones Seasons 1–2",        essential:false, phase:3, type:'series' },
  { id:61, order:61, title:"Ant-Man and the Wasp (main film)",             year:2018, prereq:"Ant-Man",                         essential:true,  phase:3, type:'film'   },
  { id:62, order:62, title:"Avengers: Infinity War",                       year:2018, prereq:"All previous MCU films",           essential:true,  phase:3, type:'film'   },
  { id:63, order:63, title:"Captain Marvel (end-credit scenes)",           year:2019, prereq:"Infinity War",                    essential:true,  phase:3, type:'film'   },
  { id:64, order:64, title:"Avengers: Endgame",                            year:2019, prereq:"Infinity War, all MCU films",      essential:true,  phase:3, type:'film'   },
  { id:65, order:65, title:"Loki Season 1",                                year:2021, prereq:"Avengers: Endgame",               essential:true,  phase:4, type:'series' },
  { id:66, order:66, title:"What If...? Season 1",                         year:2021, prereq:"Various MCU films/shows",         essential:false, phase:4, type:'series' },
  { id:67, order:67, title:"WandaVision Season 1",                         year:2021, prereq:"Endgame, Captain Marvel",         essential:true,  phase:4, type:'series' },
  { id:68, order:68, title:"Shang-Chi and the Legend of the Ten Rings",    year:2021, prereq:"General MCU knowledge",           essential:true,  phase:4, type:'film'   },
  { id:69, order:69, title:"The Falcon and the Winter Soldier",            year:2021, prereq:"Endgame, Civil War",              essential:true,  phase:4, type:'series' },
  { id:70, order:70, title:"Spider-Man: Far From Home",                    year:2019, prereq:"Homecoming, Endgame",             essential:true,  phase:4, type:'film'   },
  { id:71, order:71, title:"The Daily Bugle Seasons 1 & 2",               year:2020, prereq:"Spider-Man films",               essential:false, phase:4, type:'short'  },
  { id:72, order:72, title:"She-Hulk: Attorney at Law Season 1",           year:2022, prereq:"The Incredible Hulk, Endgame",   essential:true,  phase:4, type:'series' },
  { id:73, order:73, title:"Eternals",                                     year:2021, prereq:"Endgame (Eternals flashbacks)",   essential:true,  phase:4, type:'film'   },
  { id:74, order:74, title:"Spider-Man: No Way Home",                      year:2021, prereq:"Homecoming, Far From Home",       essential:true,  phase:4, type:'film'   },
  { id:75, order:75, title:"Doctor Strange in the Multiverse of Madness",  year:2022, prereq:"Doctor Strange, WandaVision",    essential:true,  phase:4, type:'film'   },
  { id:76, order:76, title:"Hawkeye Season 1",                             year:2021, prereq:"MCU films, Black Widow context",  essential:true,  phase:4, type:'series' },
  { id:77, order:77, title:"Moon Knight Season 1",                         year:2022, prereq:"None (standalone)",              essential:true,  phase:4, type:'series' },
  { id:78, order:78, title:"Black Panther: Wakanda Forever",               year:2022, prereq:"Black Panther",                  essential:true,  phase:4, type:'film'   },
  { id:79, order:79, title:"Echo Season 1",                                year:2024, prereq:"Hawkeye (Kingpin setup)",        essential:true,  phase:4, type:'series' },
  { id:80, order:80, title:"Ms. Marvel Season 1",                          year:2022, prereq:"None (mostly standalone)",       essential:true,  phase:4, type:'series' },
  { id:81, order:81, title:"Thor: Love and Thunder",                       year:2022, prereq:"Thor: Ragnarok, Infinity War",   essential:true,  phase:4, type:'film'   },
  { id:82, order:82, title:"Ironheart Season 1",                           year:2023, prereq:"Homecoming / No Way Home",       essential:true,  phase:4, type:'series' },
  { id:83, order:83, title:"Werewolf by Night",                            year:2022, prereq:"None (supernatural entry)",      essential:false, phase:4, type:'short'  },
  { id:84, order:84, title:"The Guardians of the Galaxy Holiday Special",  year:2022, prereq:"GotG films",                    essential:false, phase:4, type:'short'  },
  { id:85, order:85, title:"Ant-Man and the Wasp: Quantumania",            year:2023, prereq:"Ant-Man and the Wasp",          essential:true,  phase:5, type:'film'   },
  { id:86, order:86, title:"Guardians of the Galaxy Vol. 3",               year:2023, prereq:"GotG Vol. 2, Holiday Special",  essential:true,  phase:5, type:'film'   },
  { id:87, order:87, title:"Secret Invasion Season 1",                     year:2023, prereq:"General MCU knowledge",         essential:false, phase:5, type:'series' },
  { id:88, order:88, title:"The Marvels",                                  year:2023, prereq:"Captain Marvel, Ms. Marvel",    essential:true,  phase:5, type:'film'   },
  { id:89, order:89, title:"Loki Season 2",                                year:2023, prereq:"Loki Season 1",                 essential:true,  phase:5, type:'series' },
  { id:90, order:90, title:"What If...? Season 2",                         year:2023, prereq:"Various MCU content",           essential:false, phase:5, type:'series' },
  { id:91, order:91, title:"Deadpool & Wolverine",                         year:2024, prereq:"None (multiverse)",             essential:true,  phase:5, type:'film'   },
  { id:92, order:92, title:"Agatha All Along Season 1",                    year:2024, prereq:"WandaVision",                   essential:true,  phase:5, type:'series' },
  { id:93, order:93, title:"What If...? Season 3",                         year:2024, prereq:"Various MCU content",           essential:false, phase:5, type:'series' },
  { id:94, order:94, title:"Your Friendly Neighborhood Spider-Man S1",     year:2024, prereq:"None (prequel to Homecoming)",  essential:true,  phase:5, type:'series' },
  { id:95, order:95, title:"Daredevil: Born Again Season 1",               year:2025, prereq:"Daredevil Seasons 1–3",         essential:true,  phase:6, type:'series' },
  { id:96, order:96, title:"Captain America: Brave New World",             year:2025, prereq:"The Falcon and the Winter Soldier", essential:true, phase:6, type:'film' },
  { id:97, order:97, title:"Thunderbolts*",                                year:2025, prereq:"CACBW, Black Widow, Civil War",  essential:true,  phase:6, type:'film'   },
  { id:98, order:98, title:"The Fantastic Four: First Steps",              year:2025, prereq:"None (intro to FF)",            essential:true,  phase:6, type:'film'   },
].map(d => ({ ...d, watched: false }));

const SORT_LABELS = { order: 'Chronological', year: 'By Year', title: 'Alphabetical' };

export default function MCUViewer() {
  const [items, setItems]             = useState(RAW);
  const [search, setSearch]           = useState('');
  const [sortBy, setSortBy]           = useState('order');
  const [essentialOnly, setEssOnly]   = useState(false);
  const [watchedOnly, setWatchedOnly] = useState(false);
  const [typeFilter, setTypeFilter]   = useState(null);
  const [activePhase, setActivePhase] = useState(1);
  const [sortOpen, setSortOpen]       = useState(false);

  const phaseRefs  = useRef({});
  const sortRef    = useRef(null);
  const obsRef     = useRef(null);

  // Load saved
  useEffect(() => {
    const s = localStorage.getItem('mcu-v3');
    if (s) {
      const ids = new Set(JSON.parse(s));
      setItems(prev => prev.map(i => ({ ...i, watched: ids.has(i.id) })));
    }
  }, []);

  const persist = (next) =>
    localStorage.setItem('mcu-v3', JSON.stringify(next.filter(i => i.watched).map(i => i.id)));

  const toggle = (id) =>
    setItems(prev => { const n = prev.map(i => i.id === id ? { ...i, watched: !i.watched } : i); persist(n); return n; });

  // IntersectionObserver for active nav tab
  useEffect(() => {
    obsRef.current?.disconnect();
    obsRef.current = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActivePhase(+e.target.dataset.phase); }),
      { rootMargin: '-25% 0px -65% 0px' }
    );
    Object.values(phaseRefs.current).forEach(el => el && obsRef.current.observe(el));
    return () => obsRef.current?.disconnect();
  });

  // Close sort dropdown outside
  useEffect(() => {
    const fn = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const scrollTo = (id) => phaseRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const q = search.toLowerCase();
  const filtered = items
    .filter(i => {
      if (essentialOnly && !i.essential) return false;
      if (watchedOnly   && !i.watched)   return false;
      if (typeFilter    && i.type !== typeFilter) return false;
      return i.title.toLowerCase().includes(q) || i.prereq.toLowerCase().includes(q);
    })
    .sort((a, b) =>
      sortBy === 'title' ? a.title.localeCompare(b.title) :
      sortBy === 'year'  ? a.year - b.year : a.order - b.order
    );

  const grouped = {};
  filtered.forEach(i => (grouped[i.phase] = grouped[i.phase] || []).push(i));
  const phaseKeys = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  const totalWatched  = items.filter(i => i.watched).length;
  const essTotal      = items.filter(i => i.essential).length;
  const essWatched    = items.filter(i => i.essential && i.watched).length;
  const pct           = Math.round((totalWatched / items.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#cdd4e4', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #07070f; }
        ::-webkit-scrollbar-thumb { background: #18182a; border-radius: 3px; }
        input, button, select { font-family: inherit; }
        input:focus { outline: none; }
        button:focus { outline: none; }

        /* shimmer sweep */
        @keyframes sweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        .sweep::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: sweep 2.4s ease-in-out infinite;
        }

        /* glow pulse on watched */
        @keyframes glowPulse {
          0%, 100% { opacity: 0.08; }
          50%       { opacity: 0.22; }
        }

        /* row slide-in */
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .row-in { animation: rowIn 0.28s ease both; }

        /* section fade-up */
        @keyframes sectionUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .section-up { animation: sectionUp 0.4s ease both; }

        /* watch button */
        .wbtn {
          width: 34px; height: 34px; border-radius: 50%;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.18s, box-shadow 0.2s, background 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .wbtn:hover  { transform: scale(1.14); }
        .wbtn:active { transform: scale(0.9); }

        /* nav tab */
        .ntab {
          position: relative;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px; letter-spacing: 2.5px;
          padding: 12px 20px;
          border: none; background: transparent; cursor: pointer;
          transition: color 0.2s; white-space: nowrap;
          flex-shrink: 0;
        }
        .ntab::after {
          content: '';
          position: absolute;
          bottom: 0; left: 20px; right: 20px; height: 2px;
          border-radius: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.24s ease;
        }
        .ntab.on::after { transform: scaleX(1); }

        /* pill filter */
        .fpill {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px;
          border: 1px solid #181828; background: #0d0d1c;
          cursor: pointer; font-size: 12px; font-weight: 600;
          letter-spacing: 0.05em; color: #334;
          transition: all 0.18s;
        }
        .fpill:hover { border-color: #242438; color: #667; }

        /* sort dropdown item */
        .sopt {
          padding: 10px 18px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px; letter-spacing: 2px;
          cursor: pointer; color: #445;
          transition: background 0.15s, color 0.15s;
        }
        .sopt:hover  { background: #101022; color: #aab; }
        .sopt.picked { color: #e8b84b; }

        /* row hover scan */
        .rrow { position: relative; transition: background 0.15s; }
        .rrow::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%);
          opacity: 0; pointer-events: none; transition: opacity 0.2s;
        }
        .rrow:hover::before { opacity: 1; }

        /* hex dot grid bg */
        .hexbg {
          background-image: radial-gradient(circle, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 26px 26px;
        }
      `}</style>

      {/* ━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="hexbg" style={{ background: 'linear-gradient(180deg,#0e0e20 0%,#07070f 100%)', borderBottom: '1px solid #11111f', padding: '40px 24px 30px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 30 }}>

            {/* Title */}
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.9, marginBottom: 10 }}>
                <div style={{ fontSize: 64, letterSpacing: 5, color: '#c0392b', textShadow: '0 0 50px rgba(192,57,43,0.45)' }}>MCU</div>
                <div style={{ fontSize: 38, letterSpacing: 8, color: '#dde3ee' }}>VIEWING ORDER</div>
                <div style={{ fontSize: 14, letterSpacing: 6, color: '#1c1c30', marginTop: 4 }}>COMPLETE CHRONOLOGICAL GUIDE</div>
              </div>
              <div style={{ fontSize: 11, color: '#1c1c30', letterSpacing: 3, fontFamily: "'Bebas Neue', sans-serif" }}>
                PHASES 1–6  ·  {items.length} ENTRIES  ·  2025
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'WATCHED',   cur: totalWatched, tot: items.length, color: '#4a9ede', glow: 'rgba(74,158,222,0.3)' },
                { label: 'ESSENTIAL', cur: essWatched,   tot: essTotal,     color: '#e8b84b', glow: 'rgba(232,184,75,0.3)' },
              ].map(s => (
                <div key={s.label} style={{ background: '#0d0d1c', border: '1px solid #11111f', borderRadius: 12, padding: '14px 20px', minWidth: 112, textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2, color: s.color, lineHeight: 1, textShadow: `0 0 20px ${s.glow}` }}>
                    {s.cur}<span style={{ fontSize: 20, color: '#18182a' }}>/{s.tot}</span>
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: '#1c1c30', marginTop: 4, fontFamily: "'Bebas Neue', sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background: '#0d0d1c', borderRadius: 999, height: 8, overflow: 'hidden', position: 'relative', marginBottom: 8 }}>
            <div className="sweep" style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #8e0000 0%, #c0392b 30%, #e05252 65%, #e8b84b 100%)', borderRadius: 999, transition: 'width 0.7s cubic-bezier(.4,0,.2,1)', position: 'relative', overflow: 'hidden' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#1c1c30', letterSpacing: 2, fontFamily: "'Bebas Neue', sans-serif" }}>
            <span>{pct}% COMPLETE</span>
            <span>{items.length - totalWatched} REMAINING</span>
          </div>
        </div>
      </header>

      {/* ━━ PHASE NAVBAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav style={{ background: '#09091a', borderBottom: '1px solid #11111f', position: 'sticky', top: 0, zIndex: 50, overflowX: 'auto' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex' }}>
          {PHASES.map(ph => (
            <button key={ph.id} className={`ntab ${activePhase === ph.id ? 'on' : ''}`}
              style={{ color: activePhase === ph.id ? ph.color : '#222238' }}
              onClick={() => scrollTo(ph.id)}>
              {ph.name}
            </button>
          ))}
        </div>
      </nav>

      {/* ━━ FILTER BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ background: '#08081a', borderBottom: '1px solid #0f0f1e', padding: '11px 24px', position: 'sticky', top: 44, zIndex: 40 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 190px', minWidth: 150 }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#222238' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              style={{ width: '100%', background: '#0d0d1c', border: '1px solid #181828', borderRadius: 999, padding: '7px 12px 7px 30px', color: '#8892aa', fontSize: 12, letterSpacing: 0.3 }} />
          </div>

          {/* Sort */}
          <div ref={sortRef} style={{ position: 'relative' }}>
            <button className="fpill" onClick={() => setSortOpen(o => !o)}
              style={{ borderColor: '#1c1c30', color: '#e8b84b', fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2, paddingLeft: 16, paddingRight: 12 }}>
              {SORT_LABELS[sortBy]}
              <ChevronDown size={12} style={{ opacity: 0.5, transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {sortOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#0d0d1c', border: '1px solid #181828', borderRadius: 10, overflow: 'hidden', zIndex: 100, boxShadow: '0 14px 44px rgba(0,0,0,0.7)', minWidth: 180 }}>
                {Object.entries(SORT_LABELS).map(([k, v]) => (
                  <div key={k} className={`sopt ${sortBy === k ? 'picked' : ''}`} onClick={() => { setSortBy(k); setSortOpen(false); }}>{v}</div>
                ))}
              </div>
            )}
          </div>

          {/* Type pills */}
          {['film','series','short'].map(t => {
            const m = TYPE_META[t];
            const on = typeFilter === t;
            return (
              <button key={t} className="fpill"
                style={on ? { borderColor: m.color, background: m.color + '18', color: m.color } : {}}
                onClick={() => setTypeFilter(on ? null : t)}>
                <m.Icon size={11} />
                {m.label}
              </button>
            );
          })}

          {/* Essential */}
          <button className="fpill"
            style={essentialOnly ? { borderColor: '#e8b84b', background: '#e8b84b18', color: '#e8b84b' } : {}}
            onClick={() => setEssOnly(o => !o)}>
            <Star size={11} />
            Essential
          </button>

          {/* Watched */}
          <button className="fpill"
            style={watchedOnly ? { borderColor: '#3ec47a', background: '#3ec47a18', color: '#3ec47a' } : {}}
            onClick={() => setWatchedOnly(o => !o)}>
            <Eye size={11} />
            Watched
          </button>

          <div style={{ marginLeft: 'auto', fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: '#181828', letterSpacing: 2 }}>
            {filtered.length} RESULTS
          </div>
        </div>
      </div>

      {/* ━━ CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 24px 90px' }}>
        {phaseKeys.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#181828', letterSpacing: 4 }}>
            NO RESULTS — ADJUST YOUR FILTERS
          </div>
        )}

        {phaseKeys.map(pid => {
          const ph   = PHASES.find(p => p.id === pid);
          const rows = grouped[pid];
          const done = rows.filter(r => r.watched).length;
          const phasePct = rows.length ? Math.round((done / rows.length) * 100) : 0;

          return (
            <section
              key={pid}
              className="section-up"
              data-phase={pid}
              ref={el => { phaseRefs.current[pid] = el; }}
              style={{ marginBottom: 44, scrollMarginTop: 104 }}
            >
              {/* Phase heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 4, height: 42, background: ph.color, borderRadius: 2, flexShrink: 0, boxShadow: `0 0 16px ${ph.glow}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 6, color: ph.color, lineHeight: 1, textShadow: `0 0 22px ${ph.glow}` }}>
                    {ph.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#1c1c30', letterSpacing: 2, fontFamily: "'Bebas Neue', sans-serif", marginTop: 2 }}>
                    {done}/{rows.length} WATCHED · {phasePct}%
                  </div>
                </div>
                {/* Per-phase mini bar */}
                <div style={{ flex: 1, maxWidth: 180, background: '#0d0d1c', borderRadius: 999, height: 3, overflow: 'hidden', position: 'relative' }}>
                  <div className="sweep" style={{ height: '100%', width: `${phasePct}%`, background: ph.color, borderRadius: 999, transition: 'width 0.5s ease', position: 'relative', overflow: 'hidden', opacity: 0.7 }} />
                </div>
              </div>

              {/* Row table */}
              <div style={{ border: '1px solid #11111f', borderRadius: 12, overflow: 'hidden' }}>
                {rows.map((item, i) => {
                  const m = TYPE_META[item.type];
                  const showPre = !NO_PREREQ.has(item.prereq);
                  return (
                    <div
                      key={item.id}
                      className={`rrow row-in`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '46px 1fr 58px 46px',
                        alignItems: 'center',
                        padding: '0 16px',
                        borderBottom: i < rows.length - 1 ? '1px solid #0c0c18' : 'none',
                        background: item.watched
                          ? `${ph.bg}`
                          : i % 2 === 0 ? '#0b0b18' : '#080814',
                        minHeight: 54,
                        animationDelay: `${Math.min(i * 0.025, 0.25)}s`,
                        position: 'relative',
                      }}
                    >
                      {/* Watched glow overlay */}
                      {item.watched && (
                        <div style={{ position: 'absolute', inset: 0, background: ph.color, borderRadius: 0, opacity: 0, animation: 'glowPulse 3s ease-in-out infinite', pointerEvents: 'none' }} />
                      )}

                      {/* Order number */}
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1, color: item.watched ? ph.color : '#1c1c2e', transition: 'color 0.3s', position: 'relative' }}>
                        {item.watched ? '✓' : item.order}
                      </div>

                      {/* Title block */}
                      <div style={{ padding: '10px 8px 10px 0', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: 13.5, fontWeight: 500, lineHeight: 1.4,
                            color: item.watched ? '#202035' : '#c5cde0',
                            textDecoration: item.watched ? 'line-through' : 'none',
                            textDecorationColor: '#1c2028',
                            transition: 'color 0.3s',
                          }}>
                            {item.title}
                          </span>
                          <span style={{ fontSize: 10, color: m.color, opacity: 0.55, fontWeight: 600, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <m.Icon size={9} />{m.label.toUpperCase()}
                          </span>
                          {!item.essential && (
                            <span style={{ fontSize: 9, color: '#18182a', background: '#0c0c1c', border: '1px solid #14141e', borderRadius: 3, padding: '1px 5px', letterSpacing: 1, fontFamily: "'Bebas Neue', sans-serif" }}>
                              OPT
                            </span>
                          )}
                        </div>
                        {showPre && (
                          <div style={{ fontSize: 10, color: '#1a1a2c', marginTop: 3 }}>
                            Needs: {item.prereq}
                          </div>
                        )}
                      </div>

                      {/* Year */}
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 1, color: '#1c1c2e', textAlign: 'center', position: 'relative' }}>
                        {item.year}
                      </div>

                      {/* Watch button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                        <button className="wbtn" onClick={() => toggle(item.id)}
                          style={{
                            background: item.watched ? `${ph.color}22` : 'rgba(255,255,255,0.025)',
                            color: item.watched ? ph.color : '#1c1c2e',
                            border: `1px solid ${item.watched ? ph.color + '66' : '#131325'}`,
                            boxShadow: item.watched ? `0 0 12px ${ph.glow}` : 'none',
                          }}>
                          {item.watched ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div style={{ textAlign: 'center', marginTop: 60, fontFamily: "'Bebas Neue', sans-serif", fontSize: 10, color: '#0e0e1c', letterSpacing: 4 }}>
          MCU VIEWING ORDER  ·  PHASES 1–6  ·  PROGRESS SAVED TO LOCALSTORAGE
        </div>
      </main>
    </div>
  );
}
