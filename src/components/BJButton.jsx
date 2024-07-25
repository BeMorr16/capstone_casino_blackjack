import PropTypes from 'prop-types';

/**
 * 
 * @param {function} setBetAmount
 * @param {number} num
 * @param {number} chipCount 
 * @returns {JSX.Element}
 */
export default function BJButton({ setBetAmount, num, chipCount }) {
  return (
    <button
                            type="button"
                            onClick={(e) => {
                                const increment = parseInt(e.target.value, 10);
                                setBetAmount((prev) => prev + increment);
                            }}
          value={num}
          disabled={num > chipCount + 1}
                        >
                            {num}
                        </button>
  )
    
}

BJButton.propTypes = {
    setBetAmount: PropTypes.func.isRequired,
    num: PropTypes.number.isRequired,
    chipCount: PropTypes.number.isRequired,
};