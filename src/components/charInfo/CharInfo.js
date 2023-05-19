import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';//змінили назву

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';


const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    // видалили стан loading, error і витягнули те шо треба з useMarvelService
    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar()
    }, [props.charId])


    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacter(charId)// коли прийде відповідь від сервера(1 обєкт з персонажем)
            .then(onCharLoaded)//то він попаде в onCharLoaded і запишеться в стан       
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }



  
    const skeleton = char || loading || error ? null : <Skeleton/>; //якщо в нас є щось з char, loading, error - то ми нічого не рендерим (null), якщо нічого - то skeleton(заглушка, поки не вибраний персонаж)
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;//коли не заглушка, не посилка, але є персонаж
    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}


const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    return (
        <>  
            <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length < 0 ? (
                        comics.slice(0, 10).map((item, i) => {
                            return (
                                <li key={i} className="char__comics-item">
                                 {item.name}
                                </li>
                            )
                        })
                    ) : ( <li className="char__comics-item">У цього персонажа немає коміксів</li>)
                    }
                </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}
export default CharInfo;