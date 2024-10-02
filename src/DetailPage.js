import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        const response = await axios.get(`https://restaurant-api.dicoding.dev/detail/${id}`);
        setRestaurant(response.data.restaurant);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant detail:', error);
        setLoading(false);
      }
    };

    fetchRestaurantDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!restaurant) return <div>Restaurant not found.</div>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <img src={restaurant.pictureUrl} alt={restaurant.name} style={{ width: '300px' }} />
      <p>{restaurant.description}</p>
      <p>Rating: {restaurant.rating}</p>
      <p>Category: {restaurant.category}</p>

      <h2>Menu</h2>
      <h3>Foods</h3>
      <ul>
        {restaurant.menus.foods.map((food) => (
          <li key={food.name}>{food.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DetailPage;
