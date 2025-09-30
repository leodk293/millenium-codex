import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import archetype from "../archetype";
import Kaiba from "../src/assets/kaiba.jpg";
import Yugi from "../src/assets/yugi.jpg";


const types = [
  "Normal Monster",
  "Effect Monster",
  "Fusion Monster",
  "Tuner Monster",
  "XYZ Monster",
  "Synchro Monster",
  "Flip Effect Monster",
  "Pendulum Effect Monster",
  "Pendulum Flip Effect Monster",
  "Pendulum Normal Monster",
  "Pendulum Effect Fusion Monster",
  "Synchro Pendulum Effect Monster",
  "Synchro Tuner Monster",
  "XYZ Pendulum Effect Monster",
  "Ritual Monster",
  "Spirit Monster",
  "Toon Monster",
  "Link Monster",
  "Union Effect Monster",
  "Spell Card",
  "Trap Card",
];

const attributes = [
  "Light",
  "Dark",
  "Fire",
  "Water",
  "Wind",
  "Earth",
  "Divine",
];

const races = [
  "Aqua",
  "Beast",
  "Beast-Warrior",
  "Creator-God",
  "Cyberse",
  "Dinosaur",
  "Divine-Beast",
  "Dragon",
  "Fairy",
  "Fiend",
  "Fish",
  "Insect",
  "Machine",
  "Plant",
  "Psychic",
  "Pyro",
  "Reptile",
  "Rock",
  "Sea Serpent",
  "Spellcaster",
  "Thunder",
  "Warrior",
  "Winged Beast",
  "Wyrm",
  "Zombie",
  "Illusion",
];

const formats = [
  "tcg",
  "goat",
  "ocg goat",
  "speed duel",
  "master duel",
  "duel links",
];

const archetypes = [
  "Blue-Eyes",
  "Elemental HERO",
  "Dark Magician",
  "Burning Abyss",
  "Kuriboh",
  "Red-Eyes",
];

const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const pendulumScales = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const links = [1, 2, 3, 4, 5, 6];

const saveStateToSession = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save state to sessionStorage:", error);
  }
};

const loadStateFromSession = (key, defaultValue) => {
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.warn("Failed to load state from sessionStorage:", error);
    return defaultValue;
  }
};

function Home() {
  const [cards, setCards] = useState({
    error: false,
    data: loadStateFromSession("millennium_codex_cards_data", []),
    loading: false,
  });
  console.log(archetype);

  const [searchedCard, setSearchedCard] = useState(
    loadStateFromSession("millennium_codex_searched_card", "")
  );
  const [selectedType, setSelectedType] = useState(
    loadStateFromSession("millennium_codex_selected_type", "")
  );
  const [selectedAttribute, setSelectedAttribute] = useState(
    loadStateFromSession("millennium_codex_selected_attribute", "")
  );
  const [selectedRace, setSelectedRace] = useState(
    loadStateFromSession("millennium_codex_selected_race", "")
  );
  const [selectedFormat, setSelectedFormat] = useState(
    loadStateFromSession("millennium_codex_selected_format", "")
  );
  const [selectedLevel, setSelectedLevel] = useState(
    loadStateFromSession("millennium_codex_selected_level", "")
  );
  const [selectedPendulumScale, setSelectedPendulumScale] = useState(
    loadStateFromSession("millennium_codex_selected_pendulum_scale", "")
  );
  const [selectedLink, setSelectedLink] = useState(
    loadStateFromSession("millennium_codex_selected_link", "")
  );

  const [archetypeInput, setArchetypeInput] = useState("");
  const navigate = useNavigate();

  const handleArchetypeSubmit = (e) => {
    e.preventDefault();
    const name = archetypeInput.trim();
    if (!name) return;
    navigate(`/archetype/${encodeURIComponent(name)}`);
    setArchetypeInput("");
  };

  useEffect(() => {
    saveStateToSession("millennium_codex_searched_card", searchedCard);
  }, [searchedCard]);

  useEffect(() => {
    saveStateToSession("millennium_codex_selected_type", selectedType);
  }, [selectedType]);

  useEffect(() => {
    saveStateToSession(
      "millennium_codex_selected_attribute",
      selectedAttribute
    );
  }, [selectedAttribute]);

  useEffect(() => {
    saveStateToSession("millennium_codex_selected_race", selectedRace);
  }, [selectedRace]);

  useEffect(() => {
    saveStateToSession("millennium_codex_selected_format", selectedFormat);
  }, [selectedFormat]);

  useEffect(() => {
    saveStateToSession("millennium_codex_selected_level", selectedLevel);
  }, [selectedLevel]);

  useEffect(() => {
    saveStateToSession(
      "millennium_codex_selected_pendulum_scale",
      selectedPendulumScale
    );
  }, [selectedPendulumScale]);

  useEffect(() => {
    saveStateToSession("millennium_codex_selected_link", selectedLink);
  }, [selectedLink]);

  useEffect(() => {
    if (cards.data.length > 0) {
      saveStateToSession("millennium_codex_cards_data", cards.data);
    }
  }, [cards.data]);

  async function fetchCards() {
    setCards({ error: false, data: [], loading: true });

    let url = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
    const params = new URLSearchParams();

    if (searchedCard) params.append("fname", searchedCard);
    if (selectedType) params.append("type", selectedType);
    if (selectedAttribute) params.append("attribute", selectedAttribute);
    if (selectedRace) params.append("race", selectedRace);
    if (selectedFormat) params.append("format", selectedFormat);
    if (selectedLevel) params.append("level", selectedLevel);
    if (selectedPendulumScale) params.append("scale", selectedPendulumScale);
    if (selectedLink) params.append("link", selectedLink);

    if (params.toString()) {
      url += "?" + params.toString();
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch cards");
      const data = await res.json();
      setCards({ error: false, data: data.data || [], loading: false });
    } catch (error) {
      console.error(error.message);
      setCards({ error: true, data: [], loading: false });
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCards();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [
    searchedCard,
    selectedType,
    selectedAttribute,
    selectedRace,
    selectedFormat,
    selectedLevel,
    selectedPendulumScale,
    selectedLink,
  ]);

  useEffect(() => {
    if (cards.data.length === 0) {
      fetchCards();
    }
  }, []);

  const clearAllFilters = () => {
    setSearchedCard("");
    setSelectedType("");
    setSelectedAttribute("");
    setSelectedRace("");
    setSelectedFormat("");
    setSelectedLevel("");
    setSelectedPendulumScale("");
    setSelectedLink("");

    // Clear from sessionStorage as well
    try {
      sessionStorage.removeItem("millennium_codex_searched_card");
      sessionStorage.removeItem("millennium_codex_selected_type");
      sessionStorage.removeItem("millennium_codex_selected_attribute");
      sessionStorage.removeItem("millennium_codex_selected_race");
      sessionStorage.removeItem("millennium_codex_selected_format");
      sessionStorage.removeItem("millennium_codex_selected_level");
      sessionStorage.removeItem("millennium_codex_selected_pendulum_scale");
      sessionStorage.removeItem("millennium_codex_selected_link");
      sessionStorage.removeItem("millennium_codex_cards_data");
    } catch (error) {
      console.warn("Failed to clear sessionStorage:", error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className=" flex flex-row justify-center gap-5">
          <img
            className=" w-60 h-60 self-center rounded-full object-cover border-2 border-gray-600 hidden md:block"
            src={Yugi}
            alt="Yugi Muto"
            loading="lazy"
          />
          <div className="flex flex-col items-center gap-4 text-white mb-8">
            <h1 className="text-3xl text-center text-gray-500 font-extrabold md:text-5xl">
              Welcome to Millennium Codex
            </h1>
            <span className=" mt-3 border border-transparent p-[2px] rounded-full w-[25rem] bg-gray-800 hidden md:block" />
            <div className=" flex flex-col items-center gap-3">
              <h1 className=" text-gray-200 font-medium text-2xl">Discover your favorite archetype</h1>
              <div className=" flex flex-wrap justify-center gap-2">
                {archetypes.map((archetype, index) => (
                  <Link key={index} to={`/archetype/${archetype}`}>
                    <button className=" text-white cursor-pointer border border-white/20 rounded-full px-4 py-2 hover:bg-white/5 hover:scale-105 duration-200">
                      {archetype}
                    </button>
                  </Link>
                ))}
              </div>

              <form onSubmit={handleArchetypeSubmit} className=" flex flex-row">
                <input
                  className=" bg-transparent p-2 text-lg outline-0 border border-white/20 rounded-tl-sm rounded-bl-sm border-r-0 "
                  type="text"
                  placeholder="Enter an archetype..."
                  list="archetypes"
                  value={archetypeInput}
                  onChange={(e) => setArchetypeInput(e.target.value)}
                />
                <datalist id="archetypes">
                  {archetype.map((name, index) => (
                    <option key={index} value={name} />
                  ))}
                </datalist>
                <button
                  type="submit"
                  className=" text-white px-4 py-2 font-bold bg-white/5 outline-0 border border-white/20 rounded-tr-sm rounded-br-sm border-l-0 "
                >
                  GO
                </button>
              </form>
            </div>
            <span className=" border border-transparent p-[2px] rounded-full w-[25rem] bg-gray-800 hidden md:block" />

            <p className="text-xl mt-10 font-semibold">
              Search for any card or archetype you want
            </p>
          </div>
          <img
            className=" w-60 h-60 self-center rounded-full object-cover border-2 border-gray-600 hidden md:block"
            src={Kaiba}
            alt="Seto Kaiba"
            loading="lazy"
          />
        </div>

        <div className="w-full max-w-7xl flex flex-wrap justify-center gap-4 mb-8 text-sm text-gray-300">
          <input
            onChange={(e) => setSearchedCard(e.target.value)}
            value={searchedCard}
            className="outline-0 border bg-white/10 border-gray-400 rounded-sm p-2 text-white placeholder-gray-400"
            type="text"
            placeholder="Enter a card name..."
          />

          <select
            onChange={(e) => setSelectedType(e.target.value)}
            value={selectedType}
            className="cursor-pointer outline-0 border bg-white/10 border-gray-400 rounded-sm p-2 text-white"
          >
            <option value="" className="text-black bg-white">
              Type
            </option>
            {types.map((type, index) => (
              <option className="text-black bg-white" key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              setSelectedAttribute(e.target.value);
            }}
            value={selectedAttribute}
            className="cursor-pointer outline-0 border bg-white/10 border-gray-400 rounded-sm p-2 text-white"
          >
            <option value="" className="text-black bg-white">
              Attribute
            </option>
            {attributes.map((attr, index) => (
              <option className="text-black bg-white" key={index} value={attr}>
                {attr}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              setSelectedRace(e.target.value);
            }}
            value={selectedRace}
            className="cursor-pointer outline-0 border bg-white/10 border-gray-400 rounded-sm p-2 text-white"
          >
            <option value="" className="text-black bg-white">
              Race
            </option>
            {races.map((race, index) => (
              <option className="text-black bg-white" key={index} value={race}>
                {race}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              setSelectedFormat(e.target.value);
            }}
            value={selectedFormat}
            className="cursor-pointer outline-0 border bg-white/10 border-gray-400 rounded-sm p-2 text-white"
          >
            <option value="" className="text-black bg-white">
              Format
            </option>
            {formats.map((format, index) => (
              <option
                className="text-black bg-white"
                key={index}
                value={format}
              >
                {format}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              setSelectedLevel(e.target.value);
            }}
            value={selectedLevel}
            className="cursor-pointer outline-0 border bg-white/10 border-gray-400 rounded-sm p-2 text-white"
          >
            <option value="" className="text-black bg-white">
              Level/Rank
            </option>
            {levels.map((level, index) => (
              <option className="text-black bg-white" key={index} value={level}>
                {level}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              setSelectedPendulumScale(e.target.value);
            }}
            value={selectedPendulumScale}
            className="cursor-pointer outline-0 border bg-white/10 border-gray-400 rounded-sm p-2 text-white"
          >
            <option value="" className="text-black bg-white">
              Pendulum Scale
            </option>
            {pendulumScales.map((scale, index) => (
              <option className="text-black bg-white" key={index} value={scale}>
                {scale}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              setSelectedLink(e.target.value);
            }}
            value={selectedLink}
            className="cursor-pointer outline-0 border bg-white/10 border-gray-400 rounded-sm p-2 text-white"
          >
            <option value="" className="text-black bg-white">
              Link
            </option>
            {links.map((link, index) => (
              <option className="text-black bg-white" key={index} value={link}>
                {link}
              </option>
            ))}
          </select>

          {(searchedCard ||
            selectedType ||
            selectedAttribute ||
            selectedRace ||
            selectedFormat ||
            selectedLevel ||
            selectedPendulumScale ||
            selectedLink) && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-red-600/20 border border-red-400/50 text-red-300 rounded-sm hover:bg-red-600/30 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className=" text-white font-bold text-sm flex flex-wrap gap-2">
          {searchedCard && (
            <div className=" flex flex-row justify-center items-center gap-1 border border-white/10 bg-white/5 p-2 rounded-sm">
              <p>{searchedCard}</p>
              <button
                className=" cursor-pointer"
                onClick={() => setSearchedCard("")}
              >
                <X
                  className=" border-2 border-white p-1 rounded-full"
                  color="#ffffff"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          )}
          {selectedType && (
            <div className=" flex flex-row justify-center items-center gap-1 border border-white/10 bg-white/5 p-2 rounded-sm">
              <p>{selectedType}</p>
              <button
                className=" cursor-pointer"
                onClick={() => setSelectedType("")}
              >
                <X
                  className=" border-2 border-white p-1 rounded-full"
                  color="#ffffff"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          )}
          {selectedAttribute && (
            <div className=" flex flex-row justify-center items-center gap-1 border border-white/10 bg-white/5 p-2 rounded-sm">
              <p> {selectedAttribute}</p>
              <button
                className=" cursor-pointer"
                onClick={() => setSelectedAttribute("")}
              >
                <X
                  className=" border-2 border-white p-1 rounded-full"
                  color="#ffffff"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          )}
          {selectedRace && (
            <div className=" flex flex-row justify-center items-center gap-1 border border-white/10 bg-white/5 p-2 rounded-sm">
              <p> {selectedRace}</p>
              <button
                className=" cursor-pointer"
                onClick={() => setSelectedRace("")}
              >
                <X
                  className=" border-2 border-white p-1 rounded-full"
                  color="#ffffff"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          )}
          {selectedFormat && (
            <div className=" flex flex-row justify-center items-center gap-1 border border-white/10 bg-white/5 p-2 rounded-sm">
              <p>{selectedFormat}</p>
              <button
                className=" cursor-pointer"
                onClick={() => setSelectedFormat("")}
              >
                <X
                  className=" border-2 border-white p-1 rounded-full"
                  color="#ffffff"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          )}
          {selectedLevel && (
            <div className=" flex flex-row justify-center items-center gap-1 border border-white/10 bg-white/5 p-2 rounded-sm">
              <p> Level/Rank: {selectedLevel}</p>
              <button
                className=" cursor-pointer"
                onClick={() => setSelectedLevel("")}
              >
                <X
                  className=" border-2 border-white p-1 rounded-full"
                  color="#ffffff"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          )}
          {selectedPendulumScale && (
            <div className=" flex flex-row justify-center items-center gap-1 border border-white/10 bg-white/5 p-2 rounded-sm">
              <p>Pendulum Scale: {selectedPendulumScale}</p>
              <button
                className=" cursor-pointer"
                onClick={() => setSelectedPendulumScale("")}
              >
                <X
                  className=" border-2 border-white p-1 rounded-full"
                  color="#ffffff"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          )}
          {selectedLink && (
            <div className=" flex flex-row justify-center items-center gap-1 border border-white/10 bg-white/5 p-2 rounded-sm">
              <p> Link: {selectedLink}</p>
              <button
                className=" cursor-pointer"
                onClick={() => setSelectedLink("")}
              >
                <X
                  className=" border-2 border-white p-1 rounded-full"
                  color="#ffffff"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          )}
        </div>

        {/* Cards Display */}
        {cards.loading ? (
          <div className="text-center text-white text-lg mt-5">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            Loading...
          </div>
        ) : cards.error ? (
          <p className="text-center text-red-400 text-lg mt-5">
            Error loading cards. Please try again.
          </p>
        ) : cards.data.length === 0 ? (
          <p className="text-center text-white text-lg mt-5">
            No cards found...
          </p>
        ) : (
          <div className="w-full max-w-7xl flex flex-wrap justify-center gap-6 mt-8">
            {cards.data.map((card) => (
              <div key={card.id} className="group cursor-pointer">
                <Link to={`/card/${card.id}`}>
                  <img
                    src={card.card_images[0].image_url}
                    alt={card.name}
                    className="object-cover w-[150px] md:w-[220px] shadow-xl rounded-lg transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
                <p className="text-white text-center mt-2 text-sm font-medium max-w-[180px] md:max-w-[220px] truncate">
                  {card.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
