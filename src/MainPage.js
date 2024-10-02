import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarRating from './StarRating'; // Pastikan ini diimpor
import './MainPage.css'; // Pastikan CSS untuk styling grid sudah diimpor

const MainPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNow, setOpenNow] = useState(true); // Mulai dengan filter buka yang aktif
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('https://restaurant-api.dicoding.dev/list');
        setRestaurants(response.data.restaurants);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restoran berdasarkan buka, kategori, dan harga
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const isOpen = openNow ? restaurant.opening_hours?.is_open : true; // Hanya menampilkan yang sedang buka
    const isInCategory = selectedCategory ? restaurant.category === selectedCategory : true;
    const isInPriceRange = priceRange ? restaurant.price === priceRange : true;

    return isOpen && isInCategory && isInPriceRange;
  });

  const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Restoran</h1>
      <p>
        Temukan berbagai pilihan restoran terbaik di sekitar Anda. Kami menawarkan informasi lengkap
        tentang restoran termasuk menu, jam buka, dan ulasan pelanggan. Pilih restoran yang Anda
        sukai dan nikmati pengalaman bersantap yang luar biasa!
      </p>

      {/* Filter Now Open */}
      <label>
        <input 
          type="checkbox" 
          checked={openNow} 
          onChange={() => setOpenNow(!openNow)} 
        />
        Now Open
      </label>

      {/* Filter Harga */}
      <select onChange={(e) => setPriceRange(e.target.value)} value={priceRange}>
        <option value="">Semua Harga</option>
        <option value="cheap">Murah</option>
        <option value="medium">Sedang</option>
        <option value="expensive">Mahal</option>
      </select>

      {/* Filter Kategori */}
      <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
        <option value="">Semua Kategori</option>
        <option value="Japanese Food">Japanese Food</option>
        <option value="Thai Food">Thai Food</option>
        <option value="Italian Food">Italian Food</option>
        <option value="Chinese Food">Chinese Food</option>
      </select>

      {/* Tampilan Grid untuk Restoran */}
      <div className="grid-container">
        {visibleRestaurants.map((restaurant) => (
          <div className="grid-item" key={restaurant.id}>
            <Link to={`/detail/${restaurant.id}`}>
              <img src={`https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}`} alt={restaurant.name} style={{ width: '100%', height: 'auto' }} />
              <h2 style={{ textAlign: 'left', margin: '8px 0' }}>{restaurant.name}</h2>
              <StarRating rating={restaurant.rating} />
              <p style={{ textAlign: 'left' }}>Harga: {restaurant.price}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ textAlign: 'left' }}>Kategori: {restaurant.category}</p> {/* Kategori di sebelah kiri */}
                <p style={{ textAlign: 'right' }}>Status: {restaurant.opening_hours?.is_open ? "Buka" : "Tutup"}</p> {/* Status di sebelah kanan */}
              </div>
            </Link>
            <button>Learn More</button> {/* Pindahkan tombol di sini, di luar Link */}
          </div>
        ))}
      </div>

      {/* Tombol Load More */}
      {visibleCount < filteredRestaurants.length && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={() => setVisibleCount(visibleCount + 4)}>Load More</button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
