import cardCount from "./cardCount";


export const handleHit = (randomizedDecks, setPlayersCards, setIsPlayerBusted, setIsDealersTurn, setRandomizedDecks) => {
    const drawnUserCard = randomizedDecks.slice(0, 1);
    if (!Array.isArray(drawnUserCard) || drawnUserCard.length === 0) {
        console.error('No cards drawn');
        return;
    }
    setPlayersCards((prev) => {
      const newCards = [...prev, ...drawnUserCard];
        const newCount = cardCount(newCards);
        console.log('New Cards:', newCards); // Debugging output
        console.log('New Count:', newCount); 
      if (newCount > 21) {
        setIsPlayerBusted(true);
        setIsDealersTurn(true);
      }
        console.log(newCards)
      return newCards;
    });
    setRandomizedDecks(randomizedDecks.slice(1));
  };
  
  export const handleStand = (setIsDealersTurn) => {
      setIsDealersTurn(true);
  };
  
  export const handleDouble = (chipCount, lockedBet, setChipCount, handleHit, setIsDealersTurn, setLockedBet, randomizedDecks, setPlayersCards, setIsPlayerBusted, setRandomizedDecks) => {
    setChipCount((prev) => prev - lockedBet);
    setLockedBet(lockedBet * 2);
    handleHit(randomizedDecks, setPlayersCards, setIsPlayerBusted, setIsDealersTurn, setRandomizedDecks)
    setIsDealersTurn(true);
  };
  
  export const handleSubmit = (e, setIsDealersTurn, setIsHandComplete, setLockedBet, betAmount, setChipCount, randomizedDecks, setPlayersCards, setDealersCards, setRandomizedDecks, setBetAmount, setWinner, lockedBet) => {
    e.preventDefault();
    setIsDealersTurn(false);
    setIsHandComplete(false);
    setLockedBet(betAmount);
    setChipCount((prev) => prev - betAmount);
      setBetAmount(() => 0);
    const drawnUserCards = randomizedDecks.slice(0, 2);
    setPlayersCards((prev) => [...prev, ...drawnUserCards]);
    const drawnHouseCards = randomizedDecks.slice(2, 4);
    setDealersCards((prev) => [...prev, ...drawnHouseCards]);
    setRandomizedDecks(randomizedDecks.slice(4));
    let userCount = cardCount(drawnUserCards);
    let dealerCount = cardCount(drawnHouseCards);
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
  