// ================================
// PENGATURAN TMDB
// ================================

const API_KEY = "MASUKKAN_API_KEY_KAMU";

const BASE_URL = "https://api.themoviedb.org/3";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";


// ================================
// ELEMENT WEBSITE
// ================================

const movieContainer =
    document.getElementById("movieContainer");

const searchContainer =
    document.getElementById("searchContainer");

const loading =
    document.getElementById("loading");

const searchInput =
    document.getElementById("searchInput");

const searchTitle =
    document.getElementById("searchTitle");

const movieModal =
    document.getElementById("movieModal");

const movieDetail =
    document.getElementById("movieDetail");


// ================================
// SAAT WEBSITE DIBUKA
// ================================

document.addEventListener("DOMContentLoaded", function () {

    loadPopularMovies();

});


// ================================
// FILM POPULER
// ================================

async function loadPopularMovies() {

    loading.style.display = "block";

    movieContainer.innerHTML = "";

    try {

        const url =
            BASE_URL +
            "/movie/popular?api_key=" +
            API_KEY +
            "&language=id-ID&page=1";

        const response = await fetch(url);

        const data = await response.json();

        if (data.results) {

            displayMovies(
                data.results,
                movieContainer
            );

        } else {

            showError(
                movieContainer,
                "Film tidak dapat dimuat."
            );

        }

    } catch (error) {

        console.log(error);

        showError(
            movieContainer,
            "Gagal mengambil data film."
        );

    }

    loading.style.display = "none";
}


// ================================
// PENCARIAN FILM
// ================================

async function searchMovies() {

    const query =
        searchInput.value.trim();

    if (query === "") {

        alert("Masukkan judul film terlebih dahulu.");

        return;

    }

    searchTitle.textContent =
        "Hasil pencarian: " + query;

    searchContainer.innerHTML =
        '<div class="loading">Mencari film...</div>';

    document
        .getElementById("film")
        .scrollIntoView({
            behavior: "smooth"
        });

    try {

        const url =
            BASE_URL +
            "/search/movie?api_key=" +
            API_KEY +
            "&language=id-ID&query=" +
            encodeURIComponent(query) +
            "&page=1&include_adult=false";

        const response = await fetch(url);

        const data = await response.json();

        if (
            data.results &&
            data.results.length > 0
        ) {

            displayMovies(
                data.results,
                searchContainer
            );

        } else {

            searchContainer.innerHTML =
                '<div class="loading">' +
                "Film tidak ditemukan." +
                "</div>";

        }

    } catch (error) {

        console.log(error);

        showError(
            searchContainer,
            "Pencarian gagal."
        );

    }

}


// ================================
// ENTER UNTUK MENCARI
// ================================

function handleSearch(event) {

    if (event.key === "Enter") {

        searchMovies();

    }

}


// ================================
// TAMPILKAN FILM
// ================================

function displayMovies(
    movies,
    container
) {

    container.innerHTML = "";

    movies.forEach(function (movie) {

        const card =
            document.createElement("div");

        card.className = "movie-card";


        // Poster

        let poster;

        if (movie.poster_path) {

            poster =
                IMAGE_URL +
                movie.poster_path;

        } else {

            poster =
                createPlaceholderPoster(
                    movie.title
                );

        }


        // Tahun

        let year =
            "Tahun tidak diketahui";

        if (movie.release_date) {

            year =
                movie.release_date.substring(0, 4);

        }


        // Rating

        let rating = "N/A";

        if (
            movie.vote_average !== undefined
        ) {

            rating =
                Number(
                    movie.vote_average
                ).toFixed(1);

        }


        card.innerHTML =
            '<img class="movie-poster" ' +
            'src="' + poster + '" ' +
            'alt="' + escapeHTML(movie.title) + '" ' +
            'loading="lazy">' +

            '<div class="movie-info">' +

            '<div class="movie-title">' +
            escapeHTML(movie.title) +
            "</div>" +

            '<div class="movie-rating">' +
            "⭐ " + rating +
            "</div>" +

            '<div class="movie-year">' +
            year +
            "</div>" +

            "</div>";


        card.addEventListener(
            "click",
            function () {

                openMovieDetail(movie.id);

            }
        );


        container.appendChild(card);

    });

}


// ================================
// DETAIL FILM
// ================================

async function openMovieDetail(movieId) {

    movieModal.classList.add("active");

    movieDetail.innerHTML =
        '<div class="loading">' +
        "Memuat detail film..." +
        "</div>";

    try {

        const url =
            BASE_URL +
            "/movie/" +
            movieId +
            "?api_key=" +
            API_KEY +
            "&language=id-ID";

        const response = await fetch(url);

        const movie = await response.json();


        // Poster

        let poster;

        if (movie.poster_path) {

            poster =
                IMAGE_URL +
                movie.poster_path;

        } else {

            poster =
                createPlaceholderPoster(
                    movie.title
                );

        }


        // Rating

        let rating = "N/A";

        if (movie.vote_average) {

            rating =
                Number(
                    movie.vote_average
                ).toFixed(1);

        }


        // Genre

        let genreHTML = "";

        if (
            movie.genres &&
            movie.genres.length > 0
        ) {

            movie.genres.forEach(
                function (genre) {

                    genreHTML +=
                        '<span class="genre">' +
                        escapeHTML(genre.name) +
                        "</span>";

                }
            );

        } else {

            genreHTML =
                '<span class="genre">' +
                "Genre tidak tersedia" +
                "</span>";

        }


        // Sinopsis

        let overview =
            movie.overview;

        if (!overview) {

            overview =
                "Sinopsis tidak tersedia.";

        }


        movieDetail.innerHTML =
            '<div class="detail">' +

            '<div>' +

            '<img class="detail-poster" ' +
            'src="' + poster + '" ' +
            'alt="' + escapeHTML(movie.title) + '">' +

            "</div>" +

            '<div class="detail-info">' +

            "<h2>" +
            escapeHTML(movie.title) +
            "</h2>" +

            '<div class="detail-rating">' +
            "⭐ " + rating + "/10" +
            "</div>" +

            '<div class="detail-genres">' +
            genreHTML +
            "</div>" +

            '<p class="detail-overview">' +
            escapeHTML(overview) +
            "</p>" +

            "</div>" +

            "</div>";

    } catch (error) {

        console.log(error);

        movieDetail.innerHTML =
            '<div class="loading">' +
            "Gagal memuat detail film." +
            "</div>";

    }

}


// ================================
// TUTUP DETAIL
// ================================

function closeMovieDetail() {

    movieModal.classList.remove("active");

}


// ================================
// KLIK LUAR MODAL
// ================================

movieModal.addEventListener(
    "click",
    function (event) {

        if (event.target === movieModal) {

            closeMovieDetail();

        }

    }
);


// ================================
// MENU HP
// ================================

function toggleMenu() {

    const navigation =
        document.getElementById("navigation");

    navigation.classList.toggle("active");

}


// ================================
// PESAN ERROR
// ================================

function showError(
    container,
    message
) {

    container.innerHTML =
        '<div class="loading">' +
        message +
        "</div>";

}


// ================================
// POSTER JIKA TIDAK ADA
// ================================

function createPlaceholderPoster(title) {

    const text =
        title || "No Poster";

    const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'width="500" height="750">' +

        '<rect width="100%" height="100%" ' +
        'fill="#22222a"/>' +

        '<text x="50%" y="50%" ' +
        'dominant-baseline="middle" ' +
        'text-anchor="middle" ' +
        'fill="white" font-size="30">' +

        escapeHTML(text) +

        "</text>" +

        "</svg>";

    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


// ================================
// AMANKAN TEKS
// ================================

function escapeHTML(text) {

    if (!text) {

        return "";

    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}