import PropTypes from 'prop-types';
import css from './Btn.module.css';

export const Btn = ({loadMore}) => {
    return (
        <button type="button" onClick={loadMore} className={css.Button}>Load more</button>
    )
}

Btn.propTypes = {
    loadMore: PropTypes.func.isRequired,
  };
