const apiKey = 'e98e90d6524a441d8bd1c5bfb92c1fa0'; // Replace with your NewsAPI key
const newsfeed = document.getElementById('newsfeed');

fetch('/api/news')
  .then(res => res.json())
  .then(data => {
    if (!data.articles || data.articles.length === 0) {
      newsfeed.innerHTML = '<p>No news found.</p>';
      return;
    }

    data.articles.forEach(article => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';
      newsItem.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.description || 'No description available.'}</p>
        <a href="${article.url}" target="_blank">Read more →</a>
        <p class="news-date">${new Date(article.publishedAt).toLocaleDateString()}</p>
      `;
      newsfeed.appendChild(newsItem);
    });
  })
  .catch(err => {
    console.error(err);
    newsfeed.innerHTML = '<p>Error loading news. Please try again later.</p>';
  });
