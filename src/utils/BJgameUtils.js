import cardCount from "./cardCount";

export const handleHit = (randomizedDecks, setPlayersCards, setPlayerCount, setIsPlayerBusted, setIsDealersTurn, setRandomizedDecks) => {
    const drawnUserCard = randomizedDecks.slice(0, 1);
    setPlayersCards((prev) => {
      const newCards = [...prev, ...drawnUserCard];
      const newCount = cardCount(newCards);
      setPlayerCount(newCount);
      if (newCount > 21) {
        setIsPlayerBusted(true);
        setIsDealersTurn(true);
      }
      return newCards;
    });
    setRandomizedDecks((prev) => prev.slice(1));
    console.log("in hit ")
  };
  
  export const handleStand = (setIsDealersTurn) => {
      setIsDealersTurn(true);
  };
  
  export const handleDouble = (chipCount, lockedBet, setChipCount, handleHit, setIsDealersTurn, setLockedBet, randomizedDecks, setPlayersCards, setPlayerCount, setIsPlayerBusted, setRandomizedDecks) => {
    setChipCount(chipCount - lockedBet);
    setLockedBet(lockedBet * 2);
    handleHit(randomizedDecks, setPlayersCards, setPlayerCount, setIsPlayerBusted, setIsDealersTurn, setRandomizedDecks)
    setIsDealersTurn(true);
  };
  
  export const handleSubmit = (e, setIsDealersTurn, setIsHandComplete, setLockedBet, betAmount, setChipCount, randomizedDecks, setPlayersCards, setDealersCards, setRandomizedDecks, setPlayerCount, setDealerCount, cardCount, setBetAmount, setWinner, lockedBet) => {
    e.preventDefault();
    setIsDealersTurn(false);
    setIsHandComplete(false);
    setLockedBet(betAmount);
    setChipCount((prev) => prev - betAmount);
    setBetAmount(25);
    const drawnUserCards = randomizedDecks.slice(0, 2);
    setPlayersCards(drawnUserCards);
    const drawnHouseCards = randomizedDecks.slice(2, 4);
    setDealersCards(drawnHouseCards);
    setRandomizedDecks(randomizedDecks.slice(4));
    let userCount = cardCount(drawnUserCards);
    setPlayerCount(userCount);
    let dealerCount = cardCount(drawnHouseCards);
    setDealerCount(dealerCount);
  
    if (drawnUserCards.length === 2 && userCount === 21) {
      setIsDealersTurn(true);
      if (dealerCount === 21) {
        setWinner("Push");
        setChipCount((prev) => prev + lockedBet);
      } else {
        setWinner(`Player wins ${lockedBet * 2.5} with Blackjack!`);
        setChipCount((prev) => prev + lockedBet * 2.5);
      }
      setIsHandComplete(true);
    }
  };
  