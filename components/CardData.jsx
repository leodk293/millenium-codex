import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Zap, Shield, Star, Eye } from "lucide-react";

export default function CardData() {
  const { card_id } = useParams();
  const [cardData, setCardData] = useState({
    error: false,
    data: null,
    loading: false,
  });

  async function fetchCardData() {
    setCardData({ error: false, data: null, loading: true });
    try {
      const response = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${card_id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setCardData({ error: false, data: data.data[0], loading: false });
    } catch (error) {
      console.error("Error fetching card data:", error);
      setCardData({ error: true, data: null, loading: false });
    }
  }

  useEffect(() => {
    if (card_id) {
      fetchCardData();
    }
  }, [card_id]);

  // Enhanced loading state
  if (cardData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/5 via-slate-900 to-white/5 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
            <div className="animate-pulse absolute inset-0 rounded-full bg-purple-600/20"></div>
          </div>
          <p className="text-purple-200 text-xl font-semibold">
            Summoning card data...
          </p>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (cardData.error || !card_id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/5 via-gray-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-100 mb-2">
            Card Not Found
          </h2>
          <p className="text-red-200">
            The requested card data could not be loaded. Please check the card
            ID and try again.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!cardData.data) {
    return null;
  }

  const card = cardData.data;

  // Helper function to get card type styling
  const getCardTypeStyles = (type) => {
    if (type?.includes("Monster")) {
      return "from-orange-600 to-red-600 border-orange-400";
    } else if (type?.includes("Spell")) {
      return "from-green-600 to-emerald-600 border-green-400";
    } else if (type?.includes("Trap")) {
      return "from-purple-600 to-pink-600 border-purple-400";
    }
    return "from-blue-600 to-indigo-600 border-blue-400";
  };

  const cardTypeStyles = getCardTypeStyles(card.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-white/5 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
            {card.name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
              {card.type}
            </span>
            {card.race && (
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                {card.race}
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Card Image */}
            <div className="flex justify-center">
              <div className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${cardTypeStyles} rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity`}
                ></div>
                <div className="relative bg-gray-900 p-4 rounded-xl border-2 border-gray-700">
                  <img
                    src={card.card_images[0].image_url}
                    alt={card.name}
                    className="w-80 md:w-96 rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {card.atk !== undefined && (
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-semibold">ATK</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {card.atk}
                    </div>
                  </div>
                )}

                {card.def && (
                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-semibold">DEF</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {card.def}
                    </div>
                  </div>
                )}

                {card.level && (
                  <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">
                        Level
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {card.level}
                    </div>
                  </div>
                )}

                {card.attribute && (
                  <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400 font-semibold">
                        Attribute
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {card.attribute}
                    </div>
                  </div>
                )}
              </div>

              {/* Archetype */}
              {card.archetype && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Archetype
                  </h3>
                  <p className="text-white text-lg">{card.archetype}</p>
                </div>
              )}

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {card.scale && (
                  <div className="bg-gray-800/30 rounded p-3">
                    <span className="text-gray-400">Pendulum Scale:</span>
                    <span className="text-white ml-2 font-semibold">
                      {card.scale}
                    </span>
                  </div>
                )}

                {card.linkval && (
                  <div className="bg-gray-800/30 rounded p-3">
                    <span className="text-gray-400">Link Rating:</span>
                    <span className="text-white ml-2 font-semibold">
                      {card.linkval}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded"></div>
              Card Description
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {card.desc}
            </p>
          </div>

          {/* Card Sets */}
          {card.card_sets && card.card_sets.length > 0 && (
            <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded"></div>
                Card Sets
              </h3>
              <div className="grid gap-3">
                {card.card_sets.slice(0, 5).map((set, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-700/30 rounded p-3"
                  >
                    <span className="text-gray-300">{set.set_name}</span>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {set.set_code}
                      </div>
                      <div className="text-sm text-gray-400">
                        {set.set_rarity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card Prices */}
          {card.card_prices && card.card_prices.length > 0 && (
            <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded"></div>
                Card Prices
              </h3>
              <div className=" flex flex-col gap-4">
                {card.card_prices[0].cardmarket_price && (
                  <div className="flex justify-between items-center bg-gray-700/30 rounded p-3">
                    <p className=" font-medium text-gray-300">cardmarket Price</p>
                    <p className=" font-bold text-white">$ {card.card_prices[0].cardmarket_price}</p>
                  </div>
                )}

                {card.card_prices[0].tcgplayer_price && (
                  <div className="flex justify-between items-center bg-gray-700/30 rounded p-3">
                    <p className=" font-medium text-gray-300">TCGplayer Price</p>
                    <p className=" font-bold text-white">$ {card.card_prices[0].tcgplayer_price}</p>
                  </div>
                )}

                {card.card_prices[0].ebay_price && (
                  <div className="flex justify-between items-center bg-gray-700/30 rounded p-3">
                    <p className=" font-medium text-gray-300">Ebay Price</p>
                    <p className=" font-bold text-white">$ {card.card_prices[0].ebay_price}</p>
                  </div>
                )}

                {card.card_prices[0].amazon_price && (
                  <div className="flex justify-between items-center bg-gray-700/30 rounded p-3">
                    <p className=" font-medium text-gray-300">Amazon Price</p>
                    <p className=" font-bold text-white">$ {card.card_prices[0].amazon_price}</p>
                  </div>
                )}

                {card.card_prices[0].coolstuffinc_price && (
                  <div className="flex justify-between items-center bg-gray-700/30 rounded p-3">
                    <p className=" font-medium text-gray-300">Coolstuffinc Price</p>
                    <p className=" font-bold text-white">$ {card.card_prices[0].coolstuffinc_price}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
