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
        reviewsContainer.innerHTML = '';  // Clear any existing content
    
        reviews.forEach((review, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('carousel-item');
            if (index === 0) {
                reviewItem.style.opacity = '1'; // Make the first review visible by default
                reviewItem.style.display = 'block'; 
            } else {
                reviewItem.style.opacity = '0'; // Hide other reviews
                reviewItem.style.display = 'none'; 
            }
            const cleanText = removeEmojis(review.text);
            
            // Dynamically create the star rating based on the review rating
            const starRating = Math.round(review.rating); // Round the rating to the nearest integer
            let starHTML = '';
            for (let i = 0; i < starRating; i++) {
                starHTML += '★';
            }
            for (let i = starRating; i < 5; i++) {
                starHTML += '☆'; // Fill in empty stars if less than 5 stars
            }
    
            // Insert the review text, author, and dynamically generated stars with reduced spacing
            reviewItem.innerHTML = `
                <p class="review-text">${cleanText}</p>
                <p class="review-author" style="margin-bottom: 2px;">- ${review.author_name}</p>
                <div class="review-stars" style="font-size: 1.5em; margin-top: 2px;">${starHTML}</div>
            `;
            reviewsContainer.appendChild(reviewItem);
        });
    }

    function startCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        let currentIndex = 0;
        const intervalTime = 7000; // Increased interval time to allow more time between transitions
    
        // Function to fade out current item and fade in next item
        function showNextItem() {
            const currentItem = items[currentIndex];
            const nextIndex = (currentIndex + 1) % items.length;
            const nextItem = items[nextIndex];
    
            // Fade out current item
            currentItem.style.transition = 'opacity 1.5s ease'; // Slower fade-out
            currentItem.style.opacity = '0';
    
            // After fade-out, hide the current item and show the next one
            setTimeout(() => {
                currentItem.style.display = 'none'; // Hide the current item
    
                // Fade in the next item
                nextItem.style.display = 'block';
                setTimeout(() => {
                    nextItem.style.transition = 'opacity 1.5s ease'; // Slower fade-in
                    nextItem.style.opacity = '1'; // Fade in
                }, 50); // Delay for display to take effect before fading in
            }, 1500); // Wait for the fade-out effect to complete (1.5s)
    
            currentIndex = nextIndex;
        }
    
        // Start the automatic sliding of reviews
        let autoSlide = setInterval(showNextItem, intervalTime);
    
        // Pause auto-slide on hover
        document.querySelector('.carousel').addEventListener('mouseover', () => {
            clearInterval(autoSlide);
        });
    
        // Resume auto-slide on mouse out
        document.querySelector('.carousel').addEventListener('mouseout', () => {
            autoSlide = setInterval(showNextItem, intervalTime);
        });
    }

    fetchReviews();
});