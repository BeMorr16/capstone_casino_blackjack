/**
 * 
 * @param {Array<object>} cards 
 * @returns {number}
 */
export default function cardCount(cards) {
    let count = 0;
    let aces = 0;
        for (let card of cards){
            if (card.value === 'A') {
                aces += 1;
                count += 11; 
            } else {
                count += card.weight;
            }
        }
    
        while (count > 21 && aces > 0) {
            count -= 10;
            aces -= 1;
        }
    
    return count
}