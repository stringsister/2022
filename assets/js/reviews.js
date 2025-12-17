

document.addEventListener('DOMContentLoaded', () => {
    const placeId = 'ChIJc_dVAcckZ2gR54d2HZTTKrQ';
    let allReviews = [];

    function fetchReviews() {
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails(
            { placeId, fields: ['reviews'] },
            (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
                    allReviews = place.reviews;
                    shuffleArray(allReviews);
                    displayReviews(allReviews.slice(0, 5));
                    startCarousel();
                }
            }
        );
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function removeEmojis(text) {
        return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    }

    function displayReviews(reviews) {
        const container = document.getElementById('reviews-container');
        container.innerHTML = '';

        [...reviews, ...reviews].forEach(review => {
            const item = document.createElement('div');
            item.className = 'carousel-item';

            const stars = '★★★★★'.slice(0, review.rating || 5);

            item.innerHTML = `
                <div>
                    <div class="review-stars">${stars}</div>
                    <p class="review-quote">"${removeEmojis(review.text || '')}"</p>
                    <p class="review-author">— ${review.author_name}</p>
                </div>
            `;

            container.appendChild(item);
        });
    }

    function startCarousel() {
        const track = document.getElementById('reviews-container');
        const items = track.querySelectorAll('.carousel-item');
        let index = 0;
        const visibleCount = items.length / 2;
        const interval = 7000;

        function resizeToActiveSlide() {
            const active = items[index];
            const content = active.querySelector('div');
            track.style.height = content.offsetHeight + 'px';
        }

        function next() {
            index++;
            track.style.transform = `translateX(-${index * 100}vw)`;
            resizeToActiveSlide();

            if (index >= visibleCount) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    index = 0;
                    track.style.transform = 'translateX(0)';
                    resizeToActiveSlide();
                    requestAnimationFrame(() => {
                        track.style.transition = 'transform 1.2s ease-in-out';
                    });
                }, 1200);
            }
        }

        resizeToActiveSlide();
        setInterval(next, interval);
        window.addEventListener('resize', resizeToActiveSlide);
    }

    fetchReviews();
});
