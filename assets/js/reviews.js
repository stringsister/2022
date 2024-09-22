document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'AIzaSyBWyfZTApDj2-IU-qAyIYVRQLVtRwq_cjI';  // Replace with your actual key
    const placeId = 'ChIJc_dVAcckZ2gR54d2HZTTKrQ';
    let allReviews = [];

    // Fetch reviews from Google Places API
    function fetchReviews() {
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        const request = {
            placeId: placeId,
            fields: ['reviews']
        };

        service.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
                console.log('Reviews fetched successfully', place.reviews); // Debugging
                allReviews = place.reviews;
                shuffleArray(allReviews);
                displayReviews(allReviews);
                startCarousel();
            } else {
                console.error('Failed to fetch reviews:', status);
            }
        });
    }

    // Shuffle reviews to display randomly
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Remove unwanted emojis from reviews
    function removeEmojis(text) {
        return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, '');
    }

    // Dynamically display reviews in the HTML container
    function displayReviews(reviews) {
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = '';  // Clear any existing content

        if (reviews.length === 0) {
            console.error('No reviews to display');  // Debugging
            return;
        }

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

        console.log('Reviews displayed successfully'); // Debugging
    }

    // Start the review carousel with fade-in effect
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

        // Pause carousel on hover
        const reviewsContainer = document.querySelector('.carousel-inner');
        reviewsContainer.addEventListener('mouseover', () => {
            clearInterval(autoSlide);
        });

        reviewsContainer.addEventListener('mouseout', () => {
            autoSlide = setInterval(showNextItem, intervalTime);
        });
    }

    // Fetch the reviews once the DOM is fully loaded
    fetchReviews();
});