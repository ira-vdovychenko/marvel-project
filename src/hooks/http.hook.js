import { useState, useCallback } from "react";

export const useHttp = () => {// назва починаючи з use - бо власний хук, http - gthtdf;yj nfr yfpbdf.nm [er zrbq ghfw.' p pfgbnfvb
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
//метод по запиту на сервер
    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {//використовуємо useCallback, бо знаємо що ця ф-ція буде використовуватись всередині додатку і може передаватись всередину дочірніх компонентів. Щоб не робити повторних запитів

        setLoading(true);//перед тим як відправляти запит - загрузку в тру

        try {
            const response = await fetch(url, {method, body, headers});//відповідь (promise) від серверу буде поміщатись в response
            if (!response.ok) {//перевіряємо на метод 'ok', якщо не ок
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);// викине помилку і запише в catch
            }
            const data = await response.json();//це вже відповідь(дані від сервера, знаємо що буде формат json)
            
            setLoading(false);//якщо код дійшов сюди і дані загрузились-ставимо загрузку в фолс
            return data;//повертаємо дані(ще не трансформовані)
        } catch(e) {
            setLoading(false);//якщо помилка-загрузку в фолс, вона закінчилась
            setError(e.message);//е-обєкт помилки, message-метод який виводить повідомлення про помилку
            throw e;//викидуємо помилку
        }
    }, [])
//ф-ція яка буде чистити помилки і в стейт замість e.message запише назад null
    const clearError = useCallback(() => setError(null), []);

    return {loading, error, request, clearError}// це як експорт
}