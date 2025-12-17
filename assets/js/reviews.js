// assets/js/reviews.js - FULL-WIDTH VERSION (perfect on mobile + desktop)

const PLACE_ID = 'ChIJc_dVAcckZ2gR54d2HZTTKrQ';

function initGoogleReviews() {
  if (!window.google?.maps?.places) {
    setTimeout(initGoogleReviews, 500);
    return;
  }

  const service = new google.maps.places.PlacesService(document.createElement('div'));
  
  service.getDetails({ placeId: PLACE_ID, fields: ['reviews'] }, (place, status) => {
    if (status === 'OK' && place?.reviews?.length > 0) {
      const reviews = place.reviews;
      shuffleArray(reviews);
      displayReviews(reviews.slice(0, 5));
      startCarousel();
    } else {
      showFallback();
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayReviews(reviews) {
  const container = document.getElementById('reviews-container');
  container.innerHTML = '';

  reviews.forEach((review, i) => {
    const text = (review.text || '').replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{2600}-\u{27BF}]+/gu, '');
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.style.cssText = i === 0 ? 'display:block; opacity:1' : 'display:none; opacity:0';

    item.innerHTML = `
      <div style="
        background:#fdf8f9;
        border:1px solid #f0e6e8;
        border-radius:16px;
        padding:40px 45px;
        width:100%;                 /* ← full width */
        max-width:680px;            /* ← optional soft cap – remove if you want 100% on huge screens too */
        margin:0 auto;
        box-shadow:0 8px 25px rgba(0,0,0,0.05);
        font-family:Georgia,serif;
        text-align:center;
        box-sizing:border-box;
      ">
        <div style="font-size:2rem; color:#A57C91; letter-spacing:4px; margin-bottom:24px;">
          ${stars}
        </div>
        <p style="font-size:1.15rem; line-height:1.9; color:#444; margin:0 0 28px 0; font-style:italic;">
          "${text || 'Amazing experience!'}"
        </p>
        <p style="font-size:1.1rem; color:#777; margin:0; font-weight:500;">
          — ${review.author_name}
        </p>
      </div>`;

    container.appendChild(item);
  });
}

function startCarousel() {
  const items = document.querySelectorAll('.carousel-item');
  if (items.length <= 1) return;
  let idx = 0;
  setInterval(() => {
    items[idx].style.opacity = '0';
    setTimeout(() => {
      items[idx].style.display = 'none';
      idx = (idx + 1) % items.length;
      items[idx].style.display = 'block';
      setTimeout(() => items[idx].style.opacity = '1', 50);
    }, 1500);
  }, 7000);
}

function showFallback() {
  document.getElementById('reviews-container').innerHTML = `
    <div class="carousel-item" style="display:block; opacity:1;">
      <div style="background:#fdf8f9; border:1px solid #f0e6e8; border-radius:16px; padding:40px 45px; width:100%; max-width:680px; margin:0 auto; box-shadow:0 8px 25px rgba(0,0,0,0.05); font-family:Georgia,serif; text-align:center; box-sizing:border-box;">
        <div style="font-size:2rem; color:#d8b8c4; margin-bottom:24px;">★★★★★</div>
        <p style="font-size:1.15rem; line-height:1.9; color:#444; font-style:italic; margin:0 0 28px 0;">
          Be the first to leave a review!
        </p>
        <p style="font-size:1.1rem; color:#777; font-weight:500;">— The StringSisters</p>
      </div>
    </div>`;
}

// Start
if (window.google?.maps?.places) {
  initGoogleReviews();
} else {
  window.addEventListener('load', initGoogleReviews);
}
