// Updated reviews.js - Restores functionality with safeguards
let allReviews = [];
const apiKey = 'AIzaSyBWyfZTApDj2-IU-qAyIYVRQLVtRwq_cjI';
const placeId = 'ChIJc_dVAcckZ2gR54d2HZTTKrQ';

function initReviews() {
  if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
    console.error('Google Maps library not loaded yet. Retrying in 500ms...');
    setTimeout(initReviews, 500);
    return;
  }

  const service = new google.maps.places.PlacesService(document.createElement('div'));
  const request = {
    placeId: placeId,
    fields: ['reviews']
  };

  let retryCount = 0;
  const maxRetries = 3;

  function attemptFetch() {
    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.reviews && place.reviews.length > 0) {
        allReviews = place.reviews;
        shuffleArray(allReviews);
        const selectedReviews = getRandomReviews(allReviews, 5);
        displayReviews(selectedReviews);
        startCarousel();
        console.log('Reviews loaded successfully:', allReviews.length, 'total reviews');
      } else {
        retryCount++;
        console.error(`Fetch failed (attempt ${retryCount}/${maxRetries}):`, status);
        if (retryCount < maxRetries) {
          console.log('Retrying in 1 second...');
          setTimeout(attemptFetch, 1000);
        } else {
          // Final fallback: Show error in UI
          showErrorMessage();
        }
      }
    });
  }

  function showErrorMessage() {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = `
      <div class="carousel-item" style="display:block; opacity:1;">
        <div style="text-align:center; font-family:Georgia, serif; background:#fdf8f9; border:1px solid #f0e6e8; border-radius:16px; padding:40px 45px; max-width:420px; margin:0 auto; box-shadow:0 8px 25px rgba(0,0,0,0.05);">
          <div style="font-size:2rem; color:#d8b8c4; margin-bottom:24px;">★★★★★</div>
          <p style="font-size:1.15rem; line-height:1.9; color:#444; font-style:italic; margin:0 0 28px 0;">
            Unable to load reviews right now—refresh the page or <a href="https://maps.app.goo.gl/Jis5sQ6UGGzLbQ9v8" target="_blank" style="color:#A57C91;">view on Google</a>.
          </p>
          <p style="font-size:1.1rem; color:#777; margin:0; font-weight:500;">
            — The StringSisters
          </p>
        </div>
      `;
  }

  attemptFetch();
}

// Rest of your original functions (unchanged)
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
  reviewsContainer.innerHTML = ''; // Clear existing
  reviews.forEach((review, index) => {
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('carousel-item');
    // Initial visibility for fade effect
    if (index === 0) {
      reviewItem.style.opacity = '1';
      reviewItem.style.display = 'block';
    } else {
      reviewItem.style.opacity = '0';
      reviewItem.style.display = 'none';
    }
    const cleanText = removeEmojis(review.text || '');
    const starRating = Math.round(review.rating);
    let starHTML = '';
    for (let i = 0; i < 5; i++) {
      starHTML += i < starRating ? '★' : '☆';
    }
    reviewItem.innerHTML = `
      <div style="
        background:#fdf8f9;
        border:1px solid #f0e6e8;
        border-radius:16px;
        padding:40px 45px;
        max-width:420px;
        margin:0 auto;
        box-shadow:0 8px 25px rgba(0,0,0,0.05);
        font-family:Georgia, serif;
        text-align:center;
      ">
        <div style="font-size:2rem; color:#A57C91; letter-spacing:4px; margin-bottom:24px;">
          ${starHTML}
        </div>
        <p style="font-size:1.15rem; line-height:1.9; color:#444; margin:0 0 28px 0; font-style:italic;">
          "${cleanText}"
        </p>
        <p style="font-size:1.1rem; color:#777; margin:0; font-weight:500;">
          — ${review.author_name}
        </p>
      </div>
    `;
    reviewsContainer.appendChild(reviewItem);
  });
}

function startCarousel() {
  const items = document.querySelectorAll('.carousel-item');
  if (items.length === 0) return; // No reviews to show
  let currentIndex = 0;
  const intervalTime = 7000;

  function showNextItem() {
    const currentItem = items[currentIndex];
    const nextIndex = (currentIndex + 1) % items.length;
    const nextItem = items[nextIndex];
    // Fade out current item
    currentItem.style.transition = 'opacity 1.5s ease';
    currentItem.style.opacity = '0';
    // After fade-out, hide the current item and show the next one
    setTimeout(() => {
      currentItem.style.display = 'none';
      // Fade in the next item
      nextItem.style.display = 'block';
      setTimeout(() => {
        nextItem.style.transition = 'opacity 1.5s ease';
        nextItem.style.opacity = '1';
      }, 50);
    }, 1500);
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

// Initialize on DOM ready, but defer to Google load
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Google script to load
  if (window.google && window.google.maps) {
    initReviews();
  } else {
    google.maps.event.addDomListener(window, 'load', initReviews);
  }
});
