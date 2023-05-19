import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {// переназвали, щоб було зрозуміло що це наш кастомний хук
    const {loading, request, error, clearError} = useHttp();//імпортуємо,через деструктуризацію витягуємо потрібні сутності-2 стани і метод 
    
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=1812524e11367b4b67ec0572790157a7';
    const _baseOffet = 210;

    const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

    const getAllCharacters = async (offset = _baseOffet) => {// ф-ція що отримує усіх персонажів
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => { // ф-ція що отримує 1 персонажа
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => { // ф-ція що отримує 8 коміксів
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`)
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => { // ф-ція що отримує 1 комікс
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};


    const _transformCharacter = (char) => {//трансформуємо дані з Response body
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url, 
            comics: char.comics.items
        }
    }
    const _transformComics = (comics) => { //трансформуємо дані з Response body
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			// optional chaining operator
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
	};
    return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic, getCharacterByName} // це як експорт
}

export default useMarvelService;