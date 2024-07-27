import { useEffect, useCallback, useState } from "react";
import "./blackjack.css";
import BJButton from "./BJButton";
// import PlayerSection from "./PlayerSection";
// import DealerSection from "./DealerSection";
import useStore from "../store/store";
import { handleDouble, handleHit, handleStand, handleSubmit } from "../utils/BJgameUtils";

export default function Blackjack() {
    const {
        randomizedDecks,
        chipCount,
        betAmount,
        lockedBet,
        previousBet,
        dealersCards,
        dealerCount,
        playersCards,
        playerCount,
        isPlayerBusted,
        isDealersTurn,
        isHandComplete,
        winner,
        setRandomizedDecks,
        setChipCount,
        setBetAmount,
        setLockedBet,
        setPreviousBet,
        setDealersCards,
        setPlayersCards,
        setIsPlayerBusted,
        setIsDealersTurn,
        setIsHandComplete,
        setWinner,
        resetGame,
        reshuffleDecks
    } = useStore((state) => ({
        randomizedDecks: state.randomizedDecks,
        chipCount: state.chipCount,
        betAmount: state.betAmount,
        lockedBet: state.lockedBet,
        previousBet: state.previousBet,
        dealersCards: state.dealersCards,
        dealerCount: state.dealerCount,
        playersCards: state.playersCards,
        playerCount: state.playerCount,
        isPlayerBusted: state.isPlayerBusted,
        isDealersTurn: state.isDealersTurn,
        isHandComplete: state.isHandComplete,
        winner: state.winner,
        setRandomizedDecks: state.setRandomizedDecks,
        setChipCount: state.setChipCount,
        setBetAmount: state.setBetAmount,
        setLockedBet: state.setLockedBet,
        setPreviousBet: state.setPreviousBet,
        setDealersCards: state.setDealersCards,
        setPlayersCards: state.setPlayersCards,
        setIsPlayerBusted: state.setIsPlayerBusted,
        setIsDealersTurn: state.setIsDealersTurn,
        setIsHandComplete: state.setIsHandComplete,
        setWinner: state.setWinner,
        resetGame: state.resetGame,
        drawCards: state.drawCards,
        reshuffleDecks: state.reshuffleDecks
    }));
    const [showWinner, setShowWinner] = useState(false)
    

    const dealerHitAgain = useCallback(() => {
        const drawnDealerCard = randomizedDecks.slice(0, 1);
        setDealersCards((prev) => {
            const newCards = [...prev, ...drawnDealerCard]
            return newCards
        });
        setRandomizedDecks(randomizedDecks.slice(1));
    }, [setDealersCards, randomizedDecks, setRandomizedDecks]);


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
        setShowWinner(true)
        setPreviousBet(lockedBet);
        setTimeout(() => {
            setShowWinner(false)
        }, 1000)
        setTimeout(() => {
            resetGame();
            if (randomizedDecks.length < 30) {
                reshuffleDecks(); // Reshuffle if needed
            }
        }, 2000)
    }, [dealerCount, playerCount, isPlayerBusted, randomizedDecks, lockedBet, setChipCount, setPreviousBet, setWinner, reshuffleDecks, resetGame]);

    
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
            <div className="BJBody">
            <div className="blackjackTopOuterContainer">
                    {showWinner && <h2 className="BJWinnerDisplay">{winner}</h2>}
                    <div className="blackjackMainSection">
                        <section className="BJTableMinSection">
                        <h3 className="BJTableMin">Table minimum $5</h3>
                        </section>
                    <div className="blackjackCardSection">
                    <section className="BJDealerSection">
                                {dealersCards.length > 0 && (isDealersTurn ? <div>{dealerCount}</div> : <div>{dealersCards[0].weight}</div>)}
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
                                        className={`blackjackImages ${!isSecondChild || isDealersTurn ? "" : "BJsecondCard"
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
                </div>
                    {!isHandComplete && (
                        <div className="BJTurnContainer">
                            <h3>Wager: {lockedBet}</h3>
                            <div className="blackjackTurnControls">
                                <button onClick={() => handleHit(randomizedDecks, setPlayersCards, setIsPlayerBusted, setIsDealersTurn, setRandomizedDecks)} disabled={isDealersTurn || isHandComplete}>
                                    HIT
                                </button>
                                <button onClick={() => handleStand(setIsDealersTurn)} disabled={isDealersTurn || isHandComplete}>
                                    STAND
                                </button>
                                <button onClick={() => handleDouble(chipCount, lockedBet, setChipCount, handleHit, setIsDealersTurn, setLockedBet, randomizedDecks, setPlayersCards, setIsPlayerBusted, setRandomizedDecks)} disabled={isDealersTurn || isHandComplete || ((lockedBet * 2)  > chipCount) }>
                                    DOUBLE
                                </button>
                            </div>
                        </div>
                    )}
            </div>
            </div>
            <div className="blackjackUserControls">
                <div className="BJButtonsContainer">
                <BJButton setBetAmount={setBetAmount} num={5} chipCount={chipCount} />
                <BJButton setBetAmount={setBetAmount} num={25} chipCount={chipCount} />
                <BJButton setBetAmount={setBetAmount} num={100} chipCount={chipCount} />
                <BJButton setBetAmount={setBetAmount} num={500} chipCount={chipCount} />
                <BJButton setBetAmount={setBetAmount} num={1000} chipCount={chipCount} />
                <BJButton setBetAmount={setBetAmount} num={5000} chipCount={chipCount} />
                <BJButton setBetAmount={setBetAmount} num={10000} chipCount={chipCount} />
            </div>
                <form onSubmit={(e) => handleSubmit(e, setIsDealersTurn, setIsHandComplete, setLockedBet, betAmount, setChipCount, randomizedDecks, setPlayersCards, setDealersCards, setRandomizedDecks, setBetAmount, setWinner, lockedBet)}>
            <div className="betControls">
                <button disabled={!isHandComplete || previousBet < 1 || previousBet > chipCount} onClick={() => setBetAmount(() => previousBet)}>
                    SAME BET
                </button>
                <button disabled={!isHandComplete || betAmount < 1 || betAmount > chipCount}>
                    BET
                </button>
                <button type="button" disabled={!isHandComplete} onClick={() => setBetAmount(() => 0)}>
                    CLEAR
                </button>
                <button disabled={chipCount < 1} onClick={() => setBetAmount(() => chipCount)} type="button">ALL IN</button>
            </div>
                </form>
                <div className="BJChipCountContainer">
    <h2 className="BJChipCountHeader">CHIPS</h2>
    <div className="BJChipCount">{chipCount - betAmount}</div>
                    </div>
                    
            </div>
            {winner &&
                <div className="BJPreviousBet">
                    <h2>Previous Bet:</h2>
                    <p>{winner}</p>
                    <p>wagered: {previousBet}</p>
                </div>
                }
              
                    <div className="BJbetAmountBeforeHand"> 
                        {betAmount > 0 && <h3>{betAmount}</h3>}
                    </div>
            <button className="BJtoCasinoFloorButton">Back to Casino Floor</button>
            <button className="BJtoSlotsButton">To Slots</button>
            <button className="BJtoRouletteButton">To Roulette</button>
            </div>
        </>
    )
}