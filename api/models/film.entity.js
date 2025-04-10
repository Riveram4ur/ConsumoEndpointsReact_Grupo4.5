// models/film.entity.js
class Film {
    constructor({ film_id, title, description, release_year, language_id, rental_duration, rental_rate, length, rating }) {
        this.film_id = film_id;
        this.title = title;
        this.description = description;
        this.release_year = release_year;
        this.language_id = language_id;
        this.rental_duration = rental_duration;
        this.rental_rate = rental_rate;
        this.length = length;
        this.rating = rating;
    }
}

module.exports = Film;