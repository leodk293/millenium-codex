import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AlertCircle, Zap, Shield, Star, Eye } from "lucide-react";

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

export default function Archetype() {
  const { archetype_name } = useParams();

  const [cardsArchetype, setCardsArchetype] = useState(() => {
    const savedData = loadStateFromSession(
      `archetype_${archetype_name}_data`,
      []
    );
    return {
      error: false,
      data: savedData,
      loading: false,
    };
  });

  async function fetchCardsByArchetype() {
    setCardsArchetype({ error: false, data: [], loading: true });

    try {
      const response = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=${archetype_name}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const newState = { error: false, data: data.data, loading: false };
      setCardsArchetype(newState);

      // Save the fetched data to sessionStorage
      saveStateToSession(`archetype_${archetype_name}_data`, data.data);
      saveStateToSession(`archetype_${archetype_name}_timestamp`, Date.now());
    } catch (error) {
      console.error("Error fetching cards by archetype:", error.message);
      setCardsArchetype({ error: true, data: [], loading: false });

      // Clear saved data on error
      try {
        sessionStorage.removeItem(`archetype_${archetype_name}_data`);
        sessionStorage.removeItem(`archetype_${archetype_name}_timestamp`);
      } catch (storageError) {
        console.warn("Failed to clear sessionStorage on error:", storageError);
      }
    }
  }

  const shouldFetchFreshData = () => {
    const savedTimestamp = loadStateFromSession(
      `archetype_${archetype_name}_timestamp`,
      0
    );
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    return (
      !cardsArchetype.data.length ||
      !savedTimestamp ||
      currentTime - savedTimestamp > fiveMinutes
    );
  };

  useEffect(() => {
    if (archetype_name) {
      const savedData = loadStateFromSession(
        `archetype_${archetype_name}_data`,
        []
      );

      if (savedData.length > 0 && !shouldFetchFreshData()) {
        setCardsArchetype({
          error: false,
          data: savedData,
          loading: false,
        });
      } else {
        // Fetch fresh data
        fetchCardsByArchetype();
      }
    }
  }, [archetype_name]);

  const clearCache = () => {
    try {
      sessionStorage.removeItem(`archetype_${archetype_name}_data`);
      sessionStorage.removeItem(`archetype_${archetype_name}_timestamp`);
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
    fetchCardsByArchetype();
  };

  if (cardsArchetype.loading) {
    return (
      <main className="mt-8 flex flex-col gap-5 items-center">
        <div className="text-center text-white text-lg mt-5">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading {archetype_name} archetype cards...</p>
        </div>
      </main>
    );
  }

  if (cardsArchetype.error || !archetype_name) {
    return (
      <main className="mt-8 flex flex-col gap-5 items-center">
        <div className="text-center text-red-500 text-lg mt-5">
          <AlertCircle className="mx-auto mb-4" size={48} />
          <p className="mb-4">
            Error loading archetype data. Please try again later.
          </p>
          <button
            onClick={() => fetchCardsByArchetype()}
            className="px-4 py-2 bg-red-600/20 border border-red-400/50 text-red-300 rounded-sm hover:bg-red-600/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mt-8 flex flex-col gap-5 items-center">
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-white md:text-4xl">
            {archetype_name} archetype cards
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {cardsArchetype.data.length} cards found
            </span>
           
            <button
              onClick={clearCache}
              className="text-xs text-gray-500 hover:text-gray-300 underline"
              title="Refresh data"
            >
              Refresh
            </button>
          </div>
        </div>
        <span className="border border-transparent p-[2px] rounded-full w-[20rem] bg-gray-100 hidden md:block" />
      </div>

      {cardsArchetype.data.length === 0 ? (
        <div className="text-center text-white text-lg mt-5">
          <p>No cards found for {archetype_name} archetype.</p>
        </div>
      ) : (
        <div className="w-full max-w-7xl mt-5 mx-auto flex flex-wrap justify-center gap-6">
          {cardsArchetype.data.map((card) => (
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
    </main>
  );
}
