// ================================
// PENGATURAN TMDB
// ================================

const API_KEY = "5d2ccb46cf4af3dfb8a1be0e97bbb573";

const BASE_URL = "https://api.themoviedb.org/3";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const GENRE_NAMES = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    14: "Fantasy",
    27: "Horror",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

// ================================
// ELEMENT WEBSITE
// ================================

const movieContainer =
    document.getElementById("movieContainer");
const loadMoreButton =
    document.getElementById("loadMoreButton");

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
  loadTopMovies();
  loadNewMovies();

});


// ================================
// FILM POPULER
// ================================

async function loadPopularMovies() {

    currentPage = 1;
    currentGenre = null;

      loadMoreButton.style.display = "none";

document.querySelectorAll(".genre-filter button").forEach(function (button) {
    button.classList.remove("active");
});

document.querySelector(".genre-filter button").classList.add("active");
  
    movieContainer.dataset.append = "";

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

async function filterGenre(genreId, button) {
    currentPage = 1;
    currentGenre = genreId;

  document.querySelectorAll(".genre-filter button").forEach(function (button) {
    button.classList.remove("active");
});

button.classList.add("active");

loadMoreButton.style.display = "block";

    loading.style.display = "block";
    movieContainer.innerHTML = "";

    try {
        const url =
            BASE_URL +
            "/discover/movie?api_key=" +
            API_KEY +
            "&language=id-ID&with_genres=" +
            genreId +
            "&sort_by=popularity.desc&page=" +
            currentPage;

        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displayMovies(data.results, movieContainer);
        } else {
            showError(
                movieContainer,
                "Film genre ini tidak ditemukan."
            );
        }

    } catch (error) {
        console.log(error);

        showError(
            movieContainer,
            "Gagal memuat film genre."
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
    .querySelector(".search-result-section")
    .scrollIntoView({
        behavior: "smooth",
        block: "start"
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

    if (!container.dataset.append) {
    container.innerHTML = "";
    }

    movies.forEach(function (movie) {

        const card =
            document.createElement("div");

        card.className = "movie-card";
      
      card.onclick = function () {
    showMovieDetail(movie.id);
};
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

'<button class="favorite-button" ' +
'data-movie-id="' + movie.id + '" ' +
'onclick="toggleFavorite(event, ' + movie.id + ')">♡</button>' +

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

           '<div class="movie-genre">' +
(movie.genre_ids && movie.genre_ids.length > 0
    ? movie.genre_ids.slice(0, 2).map(function (id) {
        return GENRE_NAMES[id] || "";
    }).filter(Boolean).join(" • ")
    : "Film") +
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

   updateFavoriteButtons();

}

// ================================
// FAVORIT / WATCHLIST
// ================================

function getFavorites() {

    return JSON.parse(
        localStorage.getItem("filmkuFavorites")
    ) || [];

}


function toggleFavorite(event, movieId) {

    event.stopPropagation();

    let favorites = getFavorites();

    const index = favorites.indexOf(movieId);

    if (index === -1) {

        favorites.push(movieId);

    } else {

        favorites.splice(index, 1);

    }

    localStorage.setItem(
        "filmkuFavorites",
        JSON.stringify(favorites)
    );

    updateFavoriteButtons();

}


function updateFavoriteButtons() {

    const favorites = getFavorites();

    document
        .querySelectorAll(".favorite-button")
        .forEach(function (button) {

            const movieId =
                Number(button.dataset.movieId);

            if (favorites.includes(movieId)) {

                button.textContent = "♥";
                button.classList.add("active");

            } else {

                button.textContent = "♡";
                button.classList.remove("active");

            }

        });

}

// ================================
// FILM PEMERAN
// ================================

async function openActorMovies(actorId, event) {

    event.stopPropagation();

    movieModal.classList.add("active");

    movieDetail.innerHTML =
        '<div class="loading">' +
        "Memuat film pemeran..." +
        "</div>";

    try {

        const url =
            BASE_URL +
            "/person/" +
            actorId +
            "/combined_credits?api_key=" +
            API_KEY +
            "&language=id-ID";

        const response = await fetch(url);
        const data = await response.json();

        const movies = data.cast
            ? data.cast
                .filter(function (item) {
                    return item.media_type === "movie" &&
                           item.poster_path;
                })
                .sort(function (a, b) {
                    return (b.popularity || 0) -
                           (a.popularity || 0);
                })
                .slice(0, 12)
            : [];

        if (movies.length === 0) {

            movieDetail.innerHTML =
                "<p>Film pemeran tidak ditemukan.</p>";

            return;
        }

        movieDetail.innerHTML =
            '<div class="actor-movies">' +

            '<h2>🎭 Film yang Dibintangi</h2>' +

            '<div class="movie-container">' +

            movies.map(function (movie) {

                const poster =
                    IMAGE_URL + movie.poster_path;

                const title =
                    movie.title || movie.name || "Tanpa Judul";

                return (
                    '<div class="movie-card actor-movie-card" ' +
                    'onclick="openMovieDetail(' +
                    movie.id +
                    ')">' +

                    '<img class="movie-poster" ' +
                    'src="' + poster + '" ' +
                    'alt="' + escapeHTML(title) + '">' +

                    '<div class="movie-info">' +

                    '<div class="movie-title">' +
                    escapeHTML(title) +
                    "</div>" +

                    "</div>" +

                    "</div>"
                );

            }).join("") +

            "</div>" +

            "</div>";

    } catch (error) {

        console.log(error);

        movieDetail.innerHTML =
            "<p>Gagal memuat film pemeran.</p>";
    }
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

      const creditsUrl =
    BASE_URL +
    "/movie/" +
    movieId +
    "/credits?api_key=" +
    API_KEY +
    "&language=id-ID";

const creditsResponse = await fetch(creditsUrl);
const creditsData = await creditsResponse.json();

const cast = creditsData.cast
    ? creditsData.cast.slice(0, 8)
    : [];

      const runtime = movie.runtime
    ? Math.floor(movie.runtime / 60) + "j " + (movie.runtime % 60) + "m"
    : "Durasi tidak tersedia";

      const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Tanggal rilis tidak tersedia";

      const videoUrl =
    BASE_URL +
    "/movie/" +
    movieId +
    "/videos?api_key=" +
    API_KEY;

const videoResponse = await fetch(videoUrl);
const videoData = await videoResponse.json();

let trailerKey = null;

if (videoData.results) {
    const trailer = videoData.results.find(function (video) {
        return video.site === "YouTube" &&
               video.type === "Trailer" &&
               video.official === true;
    });

    if (trailer) {
        trailerKey = trailer.key;
    }
}

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

            '<div class="detail-runtime">' +
            "⏱️ " + runtime +
            "</div>" +

            '<div class="detail-release">' +
            "📅 " + releaseDate +
            "</div>" +

            '<div class="detail-genres">' +
            genreHTML +
            "</div>" +

            '<p class="detail-overview">' +
            escapeHTML(overview) +
            "</p>" +

          (
    trailerKey
        ? '<div class="trailer-container">' +
  '<iframe ' +
  'src="https://www.youtube.com/embed/' +
  trailerKey +
  '" ' +
  'title="Trailer" ' +
  'frameborder="0" ' +
  'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
  'allowfullscreen>' +
  '</iframe>' +
  '</div>'
: ""
) +
          '<div class="trailer-container">' +
    '<video controls playsinline style="width:100%; height:100%;">' +
        '<source src="VID_20260911_231001_101.mp4" type="video/mp4">' +
        'Browser kamu tidak mendukung video.' +
    '</video>' +
'</div>' +


    "</div>" +

    '<div class="detail-cast">' +

    '<h3>👥 Pemeran</h3>' +

    '<div class="cast-list">' +

    cast.map(function (actor) {

        const actorPhoto =
            actor.profile_path
                ? IMAGE_URL + actor.profile_path
                : "https://via.placeholder.com/100x150?text=No+Photo";

        return (
            '<div class="cast-item">' +

            '<img src="' +
            actorPhoto +
            '" alt="' +
            escapeHTML(actor.name) +
            '">' +

            '<div class="cast-name" ' +
'onclick="openActorMovies(' + actor.id + ', event)">' +
escapeHTML(actor.name) +
"</div>" +

            '<div class="cast-character">' +
            escapeHTML(actor.character || "") +
            "</div>" +

            "</div>"
        );

    }).join("") +

    "</div>" +

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

// ================================
// BANNER FILM
// ================================

let currentPage = 1;
let currentGenre = null;

let bannerMovies = [];
let currentBanner = 0;
let bannerTimer;

async function loadBannerMovies() {

    try {

        const url =
            BASE_URL +
            "/movie/popular?api_key=" +
            API_KEY +
            "&language=id-ID&page=1";

        const response = await fetch(url);
        const data = await response.json();

        if (
            !data.results ||
            data.results.length === 0
        ) {
            return;
        }

        bannerMovies =
            data.results.slice(0, 5);

        showBannerMovie();

        createBannerIndicators();

        startBannerAutoPlay();

    } catch (error) {

        console.log(
            "Banner gagal dimuat:",
            error
        );

    }

}


// ================================
// TAMPILKAN BANNER
// ================================

function showBannerMovie() {

    const movie =
        bannerMovies[currentBanner];

    if (!movie) {
        return;
    }

    const banner =
        document.getElementById("home");

    const title =
        document.getElementById("bannerTitle");

    const description =
        document.getElementById("bannerDescription");

    const rating =
        document.getElementById("bannerRating");

    const year =
        document.getElementById("bannerYear");

    const button =
        document.getElementById("bannerButton");


    if (movie.backdrop_path) {

        banner.style.backgroundImage =
            "linear-gradient(90deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.7) 45%, rgba(0,0,0,.25) 100%), url('" +
            IMAGE_URL.replace("/w500", "/original") +
            movie.backdrop_path +
            "')";

    }


    title.textContent =
        movie.title || "Film";

    description.textContent =
        movie.overview ||
        "Temukan film favoritmu di FilmKu.";

    rating.textContent =
        "⭐ " +
        Number(
            movie.vote_average || 0
        ).toFixed(1);

    year.textContent =
        "📅 " +
        (
            movie.release_date || "-"
        ).substring(0, 4);


    button.onclick = function () {

        openMovieDetail(movie.id);

    };

    updateBannerIndicators();

}


// ================================
// INDIKATOR
// ================================

function createBannerIndicators() {

    const container =
        document.getElementById(
            "bannerIndicators"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    bannerMovies.forEach(
        function (movie, index) {

            const dot =
                document.createElement("span");

            dot.onclick = function () {

                currentBanner = index;

                showBannerMovie();

                restartBannerAutoPlay();

            };

            container.appendChild(dot);

        }
    );

    updateBannerIndicators();

}


function updateBannerIndicators() {

    const dots =
        document.querySelectorAll(
            "#bannerIndicators span"
        );

    dots.forEach(
        function (dot, index) {

            dot.classList.toggle(
                "active",
                index === currentBanner
            );

        }
    );

}


// ================================
// AUTO GANTI FILM
// ================================

function startBannerAutoPlay() {

    clearInterval(bannerTimer);

    bannerTimer =
        setInterval(
            function () {

                currentBanner++;

                if (
                    currentBanner >=
                    bannerMovies.length
                ) {

                    currentBanner = 0;

                }

                showBannerMovie();

            },
            7000
        );

}


function restartBannerAutoPlay() {

    startBannerAutoPlay();

}


// ================================
// JALANKAN BANNER
// ================================

loadBannerMovies();

async function loadMoreMovies() {
    if (!currentGenre) {
        return;
    }

    currentPage++;

    loadMoreButton.textContent = "Memuat...";
    loadMoreButton.disabled = true;

    try {
        const url =
            BASE_URL +
            "/discover/movie?api_key=" +
            API_KEY +
            "&language=id-ID&with_genres=" +
            currentGenre +
            "&sort_by=popularity.desc&page=" +
            currentPage;

        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
    movieContainer.dataset.append = "true";

    displayMovies(
        data.results,
        movieContainer
    );
}

        if (currentPage >= data.total_pages) {
            loadMoreButton.style.display = "none";
        }

    } catch (error) {
        console.log(error);
        currentPage--;
        alert("Gagal memuat film berikutnya.");
    }

    loadMoreButton.textContent = "Muat Lebih Banyak";
    loadMoreButton.disabled = false;
}

// FILM TERPOPULER
async function loadTopMovies() {

    const topMovieContainer =
        document.getElementById("topMovieContainer");

    if (!topMovieContainer) {
        return;
    }

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
                data.results.slice(0, 10),
                topMovieContainer
            );
        }

    } catch (error) {

        console.log(error);

        topMovieContainer.innerHTML =
            "<p>Gagal memuat film terpopuler.</p>";
    }
}

// FILM TERBARU
async function loadNewMovies() {

    const newMovieContainer =
        document.getElementById("newMovieContainer");

    if (!newMovieContainer) {
        return;
    }

    try {

        const today = new Date().toISOString().split("T")[0];

const url =
    BASE_URL +
    "/discover/movie?api_key=" +
    API_KEY +
    "&language=id-ID" +
    "&sort_by=primary_release_date.desc" +
    "&primary_release_date.lte=" +
    today +
    "&page=1";

        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {

            displayMovies(
                data.results.slice(0, 10),
                newMovieContainer
            );

        }

    } catch (error) {

        console.log(error);

        newMovieContainer.innerHTML =
            "<p>Gagal memuat film terbaru.</p>";
    }
}