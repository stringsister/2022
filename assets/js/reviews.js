document.addEventListener('DOMContentLoaded', () => {
    const placeId = 'ChIJc_dVAcckZ2gR54d2HZTTKrQ';
    let allReviews = [];

    function fetchReviews() {
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        const request = {
            placeId: placeId,
            fields: ['reviews']
        };
        service.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
                allReviews = place.reviews;
                shuffleArray(allReviews);
                const selectedReviews = getRandomReviews(allReviews, 5);
                displayReviews(selectedReviews);
                startCarousel();
            } else {
                console.error('Failed to fetch reviews:', status);
            }
        });
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
        return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2B50}\u{2B55}\u{2600}-\u{26FF}\u{2702}-\u{27B0}\u{1F004}\u{1F0CF}]+/gu, '');
    }

    function displayReviews(reviews) {
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = ''; // Clear placeholder

        reviewsContainer.style.display = 'flex';
        reviewsContainer.style.width = '100%';
        reviewsContainer.style.transition = 'transform 1.2s ease-in-out';

        // Duplicate reviews for infinite loop
        [...reviews, ...reviews].forEach((review) => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('carousel-item');
            reviewItem.style.minWidth = '100%';
            reviewItem.style.boxSizing = 'border-box';
            reviewItem.style.flexShrink = '0';

            const cleanText = removeEmojis(review.text || '');

            const starRating = Math.round(review.rating || 5);
            let starHTML = '';
            for (let i = 0; i < 5; i++) {
                starHTML += i < starRating ? '★' : '☆';
            }

            // Mobile-responsive max-width
            reviewItem.innerHTML = `
                <div style="
                    width: 100%;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    text-align: center;
                    font-family: Georgia, serif;
                    box-sizing: border-box;
                ">
                    <div style="font-size: 1.8rem; color: #F6D9E5; letter-spacing: 5px; margin-bottom: 20px;">
                        ${starHTML}
                    </div>
                    <p style="font-size: 1.25rem; line-height: 1.8; color: #444; margin: 0 0 24px 0; font-style: italic; word-wrap: break-word;">
                        "${cleanText}"
                    </p>
                    <p style="font-size: 1.1rem; color: #777; margin: 0; text-align: right;">
                        — ${review.author_name}
                    </p>
                </div>
            `;

            reviewsContainer.appendChild(reviewItem);
        });

        reviewsContainer.style.transform = 'translateX(0%)';
    }

    function startCarousel() {
        const container = document.getElementById('reviews-container');
        const items = container.querySelectorAll('.carousel-item');
        let currentIndex = 0;
        const totalRealReviews = items.length / 2;
        const intervalTime = 7000;

        function showNextItem() {
            currentIndex++;
            container.style.transform = `translateX(-${currentIndex * 100}%)`;

            if (currentIndex >= totalRealReviews) {
                setTimeout(() => {
                    container.style.transition = 'none';
                    currentIndex = 0;
                    container.style.transform = 'translateX(0%)';
                    setTimeout(() => {
                        container.style.transition = 'transform 1.2s ease-in-out';
                    }, 50);
                }, 1200);
            }
        }

        let autoSlide = setInterval(showNextItem, intervalTime);

        document.querySelector('.carousel').addEventListener('mouseover', () => clearInterval(autoSlide));
        document.querySelector('.carousel').addEventListener('mouseout', () => {
            autoSlide = setInterval(showNextItem, intervalTime);
        });
    }

    fetchReviews();
});
