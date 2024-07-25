import { useCallback, useEffect, useState } from "react";
import getDecks from "../utils/createShuffleCards";
import cardCount from "../utils/cardCount";
import "./blackjack.css";
import BJButton from "./BJButton";
import { handleDouble, handleHit, handleStand, handleSubmit } from "../utils/BJgameUtils";

export default function Blackjack() {
  const [randomizedDecks, setRandomizedDecks] = useState([]);
  const [chipCount, setChipCount] = useState(1000);
  const [betAmount, setBetAmount] = useState(25);
  const [lockedBet, setLockedBet] = useState(0);
  const [previousBet, setPreviousBet] = useState(0);
  const [dealersCards, setDealersCards] = useState([]);
  const [dealerCount, setDealerCount] = useState(0);
  const [playersCards, setPlayersCards] = useState([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [isPlayerBusted, setIsPlayerBusted] = useState(false);
  // const [didSplit, setDidSplit] = useState(false)
  const [isDealersTurn, setIsDealersTurn] = useState(false);
  const [isHandComplete, setIsHandComplete] = useState(true);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    const decks = getDecks();
    setRandomizedDecks(decks);
  }, []);

  const dealerHitAgain = useCallback(() => {
    const drawnDealerCard = randomizedDecks.slice(0, 1);
    setDealersCards((prev) => {
      const newCards = [...prev, ...drawnDealerCard];
      setDealerCount(cardCount(newCards));
      return newCards;
    });
    setRandomizedDecks((prev) => prev.slice(1));
  }, [randomizedDecks]);

  const handleEndOfGame = useCallback(() => {
    if (isPlayerBusted) {
      setWinner("Dealer wins!");
    } else if (dealerCount > 21) {
      setWinner(`Player wins ${lockedBet * 2}!`);
      setChipCount((prev) => prev + lockedBet * 2);
    } else if (dealerCount >= 17) {
      if (playerCount > dealerCount) {
        setWinner(`Player wins ${lockedBet * 2}!`);
        setChipCount((prev) => prev + lockedBet * 2);
      } else if (playerCount < dealerCount) {
        setWinner("Dealer wins!");
      } else if (playerCount === dealerCount) {
        setWinner("Push");
        setChipCount((prev) => prev + lockedBet);
      }
    }
    setIsHandComplete(true);
    setIsPlayerBusted(false);
    setPreviousBet(lockedBet);
    //   setLockedBet(0);
    // setIsDealersTurn(false);
    if (randomizedDecks.length < 30) {
      const decks = getDecks();
      setRandomizedDecks(decks);
    }
  }, [dealerCount, playerCount, isPlayerBusted, randomizedDecks, lockedBet]);

  useEffect(() => {
    if (isDealersTurn && !isHandComplete) {
      const dealerPlay = () => {
        if (dealerCount < 17 && !isPlayerBusted) {
          setTimeout(dealerHitAgain, 500);
        } else {
          handleEndOfGame();
        }
      };
      dealerPlay();
    }
  }, [
    dealerCount,
    isDealersTurn,
    dealerHitAgain,
    handleEndOfGame,
    isHandComplete,
    isPlayerBusted,
  ]);

  return (
    <>
      <div className="blackjackTopOuterContainer">
        {isHandComplete && <h2 className="BJWinnerDisplay">{winner}</h2>}
        <div className="blackjackCardSection">
          {/* {isHandComplete && <h2 className="BJWinnerDisplay">{winner}</h2>} */}
          <section className="BJDealerSection">
            {dealersCards.length > 0 && <div>{dealerCount}</div>}
            {dealersCards.map((card, index) => {
              const isSecondChild = index === 1;
              return (
                <div key={index}>
                  <img
                    src={
                      isDealersTurn || !isSecondChild
                        ? card.frontImage
                        : card.backImage
                    }
                    className={`blackjackImages ${
                      !isSecondChild || isDealersTurn ? "" : "BJsecondCard"
                    }`}
                  />
                </div>
              );
            })}
          </section>

          <section className="BJUserSection">
            {playersCards.length > 0 && <div>{playerCount}</div>}
            {playersCards.map((card, index) => {
              return (
                <div key={index}>
                  <img src={card.frontImage} className="blackjackImages" />
                </div>
              );
            })}
          </section>

          {!isHandComplete && (
            <div className="BJTurnContainer">
              <h3 className="">Wager: {lockedBet}</h3>
              <div className="blackjackTurnControls">
                <button
                  onClick={() => handleHit(randomizedDecks, setPlayersCards, setPlayerCount, setIsPlayerBusted, setIsDealersTurn, setRandomizedDecks)}
                  disabled={isDealersTurn || isHandComplete}
                >
                  HIT
                </button>
                <button
                  onClick={() => handleStand(setIsDealersTurn)}
                  disabled={isDealersTurn || isHandComplete}
                >
                  STAND
                </button>
                {/* <button onClick={handleSplit}>SPLIT</button> */}
                <button
                  onClick={()=> handleDouble(chipCount, lockedBet, setChipCount, handleHit, setIsDealersTurn, setLockedBet, randomizedDecks, setPlayersCards, setPlayerCount, setIsPlayerBusted, setRandomizedDecks)}
                  disabled={isDealersTurn || isHandComplete}
                >
                  DOUBLE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="blackjackUserControls">
        <form onSubmit={(e)=> handleSubmit(e, setIsDealersTurn, setIsHandComplete, setLockedBet, betAmount, setChipCount, randomizedDecks, setPlayersCards, setDealersCards, setRandomizedDecks, setPlayerCount, setDealerCount, cardCount, setBetAmount, setWinner, lockedBet)}>
          <BJButton setBetAmount={setBetAmount} num={5} chipCount={chipCount} />
          <BJButton setBetAmount={setBetAmount} num={25} chipCount={chipCount} />
          <BJButton setBetAmount={setBetAmount} num={100} chipCount={chipCount}/>
          <BJButton setBetAmount={setBetAmount} num={500} chipCount={chipCount} />
          <button disabled={!isHandComplete} onClick={() => setBetAmount(previousBet)} >
            Same bet
          </button>
          <button disabled={!isHandComplete || betAmount < 1}>
            BET: {betAmount}
          </button>
          <button type="button" disabled={!isHandComplete} onClick={() => { setBetAmount(0);}}>
            CLEAR
          </button>
          <BJButton setBetAmount={setBetAmount} num={1000} chipCount={chipCount} />
          <BJButton setBetAmount={setBetAmount} num={5000} chipCount={chipCount} />
          <BJButton setBetAmount={setBetAmount} num={10000} chipCount={chipCount}/>
          <BJButton setBetAmount={setBetAmount} num={chipCount} chipCount={chipCount} />
        </form>
        <div className="BJChipCount">Chips: {chipCount}</div>
        {/* <div>{chipCount}</div> */}
      </div>
      <div className="BJPreviousBet">
        <h2>Previous Bet:</h2>
        <p>{winner}</p>
        <p> wagered: {previousBet}</p>
      </div>
      <button className="BJtoCasinoFloorButton">Back to Casino Floor</button>
      <button className="BJtoSlotsButton">To Slots</button>
      <button className="BJtoRouletteButton">To Roulette</button>
      <h3 className="BJTableMin">Table minimum $5</h3>
    </>
  );
}
