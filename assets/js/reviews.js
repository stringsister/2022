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
                    const selectedReviews = getRandomReviews(allReviews, 5);
                    displayReviews(selectedReviews);
                    startCarousel();
                } else {
                    console.error('Failed to fetch reviews:', status);
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

    function getRandomReviews(reviews, num) {
        const shuffled = [...reviews];
        shuffleArray(shuffled);
        return shuffled.slice(0, num);
    }

    function removeEmojis(text) {
        return text.replace(
            /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,
            ''
        );
    }

    function displayReviews(reviews) {
        const container = document.getElementById('reviews-container');
        container.innerHTML = '';
        container.style.display = 'flex';
        container.style.width = '100%';
        container.style.transition = 'transform 1.2s ease-in-out';

        [...reviews, ...reviews].forEach(review => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.style.minWidth = '100%';
            item.style.flexShrink = '0';

            const cleanText = removeEmojis(review.text || '');
            const rating = Math.round(review.rating || 5);
            const stars = '★★★★★☆☆☆☆☆'.slice(5 - rating, 10 - rating);

            item.innerHTML = `
                <div>
                    <div class="review-stars">${stars}</div>
                    <p class="review-quote">"${cleanText}"</p>
                    <p class="review-author">— ${review.author_name}</p>
                </div>
            `;

            container.appendChild(item);
        });

        container.style.transform = 'translateX(0%)';
    }

    function startCarousel() {
        const carousel = document.querySelector('.carousel');
        const track = document.getElementById('reviews-container');
        const items = track.querySelectorAll('.carousel-item');

        let index = 0;
        const realCount = items.length / 2;
        const intervalTime = 7000;

        function setHeight() {
            const active = items[index];
            if (!active) return;
            carousel.style.height = active.offsetHeight + 'px';
        }

        setHeight();

        function next() {
            index++;
            track.style.transform = `translateX(-${index * 100}%)`;
            setHeight();

            if (index >= realCount) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    index = 0;
                    track.style.transform = 'translateX(0%)';
                    setHeight();
                    requestAnimationFrame(() => {
                        track.style.transition = 'transform 1.2s ease-in-out';
                    });
                }, 1200);
            }
        }

        let autoSlide = setInterval(next, intervalTime);

        carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
        carousel.addEventListener('mouseleave', () => {
            autoSlide = setInterval(next, intervalTime);
        });

        window.addEventListener('resize', setHeight);
    }

    fetchReviews();
});
