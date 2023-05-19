import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';//змінили назву
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(1547);
    const [charEnded, setCharEnded] = useState(false);
    //видалили стани які є в кастом хуках і витягнули їх з обєкта переданого в useMarvelServic
    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {//замість componentDidMount
        onRequest(offset, true);
    }, [])//пустий масив - ф-ція виконається 1 раз при створенні компонента 

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)//якщо це первична загрузка(в onRequest другим аргументом стоїть true), то setNewItemLoading(false) 
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }
   
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }
    
    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    function renderItems(arr) {
        console.log(charList);
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
             <CSSTransition key={item.id} timeout={500} classNames="char__item">
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                             props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
             </CSSTransition>   
            )
        });
        
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }
        
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading? <Spinner/> : null;// і тут виправляємо баг, було: loading ? <Spinner/> : null; а тепер кажемо що НЕ загрузка нових персонажів
    /* const content = !(loading || error) ? items : null;--видаляємо це компонент, бо тут перемальовується верстка і всі персонажі зникають при кліку на load more */

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items} 
           {/*  {content}-- і тут видаляємо */}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
         </div>
        )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;