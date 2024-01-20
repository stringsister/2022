
    document.addEventListener("DOMContentLoaded", function () {
      const placeId = 'ChIJc_dVAcckZ2gR54d2HZTTKrQ';
      const reviewsContainer = document.getElementById('google-reviews');

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }

      function removeEmojis(text) {
        return text.replace(/[\u{1F600}-\u{1F64F} \u{1F300}-\u{1F5FF} \u{1F680}-\u{1F6FF} \u{1F700}-\u{1F77F} \u{1F780}-\u{1F7FF} \u{1F800}-\u{1F8FF} \u{1F900}-\u{1F9FF} \u{1FA00}-\u{1FA6F} \u{2600}-\u{26FF} \u{2700}-\u{27BF}]/gu, ' ');
      }

      function getGoogleReviews() {
        const service = new google.maps.places.PlacesService(reviewsContainer);
        service.getDetails({ placeId: placeId }, function (place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            shuffleArray(place.reviews);
            displayReviews(place.reviews);
          }
        });
      }

      function displayReviews(reviews) {
        let reviewsHTML = '';
        reviews.forEach(function (review) {
          const sanitizedText = removeEmojis(review.text);
          reviewsHTML += `
            <div class="review-bubble">
              <div class="review-header">
              </div>
              <p class="review-text">${sanitizedText}</p>
              <span class="star-rating"> &#9733;&#9733;&#9733;&#9733;&#9733;</span> <br>
              <span class="reviewer-name">- ${review.author_name} </span> 
            </div>`;
        });

        reviewsContainer.innerHTML = reviewsHTML;
      }

      // Call the function to fetch and display reviews on page load
      getGoogleReviews();
    });