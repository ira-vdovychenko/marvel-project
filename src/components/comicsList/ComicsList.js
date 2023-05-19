import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';



const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {//замість componentDidMount
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {// offset - ск коміксів пропустити при запиті до API
        initial ? setNewItemLoading(false) : setNewItemLoading(true)//якщо це первична загрузка(в onRequest другим аргументом стоїть true), то setNewItemLoading(false) 
        getAllComics(offset)//ф-ція робить запит до АРІ і повертає список коміксів
            .then(onComicsListLoaded)//обробляє список коміксів та відображення їх на сторінці
    }
    const onComicsListLoaded = (newComicsList) => {// викликається в результаті успішного завантаження списку коміксів, який було отримано з API. Вона приймає список newComicsList як аргумент.
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }
        //Спочатку функція встановлює змінну ended як false. Потім перевіряється, чи довжина newComicsList менше 8 (здебільшого це кількість елементів, яку вибирає користувач за один раз для показу на сторінці). Якщо довжина менше 8, то ended встановлюється як true. Це означає, що списку коміксів на сервері більше немає, тому далі відбуватиметься запит до API.

        setComicsList(comicsList => [...comicsList, ...newComicsList]);//Перша команда встановлює новий список коміксів, який складається зі старого списку та нового newComicsList, використовуючи синтаксис розширення масиву 
        setNewItemLoading(newItemLoading => false);//процес завантаження нових коміксів закінчено
        setOffset(offset => offset + 8);// збільшує значення offset на 8. Це потрібно для наступного запиту до API, щоб отримати наступну партію коміксів.
        setComicsEnded(comicsEnded => ended);//значення стану comicsEnded на значення ended, що означає, чи закінчилися комікси на сервері
    }
    
    function renderItems (arr) {//Ця функція є частиною веб-сайту, який відображає список коміксів. Функція renderItems бере масив коміксів, який передається як аргумент arr, та генерує список зображень коміксів разом з їх назвами та цінами.
        const items = arr.map((item, i) => {// метод map(), щоб пройтися по кожному елементу масиву arr та створити новий масив items, який містить відповідні React-елементи для кожного коміксу.
            return ( //Для кожного елементу масиву arr, функція створює новий React-елемент <li>, який містить зображення коміксу, назву та ціну коміксу. Дані про зображення, назву та ціну коміксу отримуються з кожного елементу arr за допомогою властивостей thumbnail, title та price
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })//У кінці функція повертає список елементів items, який містить відповідні React-елементи для кожного коміксу в масиві arr

        return ( //Цей код повертає рендеринг HTML-коду, який містить елемент списку <ul> з класом comics__grid. Усередині цього елементу відображається список елементів <li>, які створюються за допомогою методу map() на основі переданого в функцію масиву arr. Кожен елемент списку містить зображення коміксу, його назву та ціну
            <ul className="comics__grid">
                {items}
            </ul>//масив елементів списку, який відображається на сторінці. Значення цієї змінної отримується за допомогою виклику функції renderItems
        )
    }

    const items = renderItems(comicsList);//Змінна items містить результат виклику функції renderItems, яка відповідає за створення HTML-структури для кожного елементу списку коміксів. В цій HTML-структурі використовуються дані про кожен комікс зі списку

    const errorMessage = error ? <ErrorMessage/> : null;//якщо помилка-повідоблення інакше-нічого
    const spinner = loading && !newItemLoading ? <Spinner/> : null;//якщо загрузка і НЕзагрузканових-показувати спінер інакше - нічого

    return (////{items} - виводить кожен li який ми отримуємо з renderItems + спінер + помилку
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                disabled={newItemLoading} //якщо грузяться нові комікси- кнопка неактивна
                style={{'display' : comicsEnded ? 'none' : 'block'}}//цей параметр вказує, чи має бути кнопка видимою або ні, залежно від того, чи закінчився список коміксів. Якщо закінчився, кнопка приховується.
                className="button button__main button__long"
                onClick={() => onRequest(offset)}> 
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;