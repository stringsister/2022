document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'AIzaSyBWyfZTApDj2-IU-qAyIYVRQLVtRwq_cjI';
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
                displayReviews(allReviews);
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

    function removeEmojis(text) {
        return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2B50}\u{2B55}\u{2600}-\u{26FF}\u{2702}-\u{27B0}\u{1F004}\u{1F0CF}]+/gu, '');
    }

    function displayReviews(reviews) {
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = '';  // Clear any existing content

        reviews.forEach((review, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('carousel-item');
            if (index === 0) reviewItem.classList.add('active');  // First item is active

            const cleanText = removeEmojis(review.text);
            reviewItem.innerHTML = `
                <div class="review-stars">★★★★★</div> <!-- 5 Black Stars added -->
                <p class="review-text">${cleanText}</p>
                <p class="review-author">- ${review.author_name}</p>
            `;
            reviewsContainer.appendChild(reviewItem);
        });
    }

    function startCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        let currentIndex = 0;
        const intervalTime = 5000;

        function showNextItem() {
            items[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % items.length;
            items[currentIndex].classList.add('active');
        }

        let autoSlide = setInterval(showNextItem, intervalTime);

        const reviewsContainer = document.querySelector('.carousel-inner');
        reviewsContainer.addEventListener('mouseover', () => {
            clearInterval(autoSlide);
        });

        reviewsContainer.addEventListener('mouseout', () => {
            autoSlide = setInterval(showNextItem, intervalTime);
        });
    }

    fetchReviews();
});