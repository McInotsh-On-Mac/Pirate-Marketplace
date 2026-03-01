
import React, { useState } from 'react';
import './listings.css';
import pmlogo from './pmlogo.png';

// Sample data for listings
const listingsData = [
  {
    id: 1,
    name: 'Antique Pirate Map',
    price: '$150.00',
    image: 'https://via.placeholder.com/250',
    description: 'A very old and definitely real map to treasure.'
  },
  {
    id: 2,
    name: 'Wooden Leg',
    price: '$80.00',
    image: 'https://via.placeholder.com/250',
    description: 'A sturdy wooden leg, barely used.'
  },
  {
    id: 3,
    name: 'Parrot',
    price: '$200.00',
    image: 'https://via.placeholder.com/250',
    description: 'A well-trained parrot that knows all the sea shanties.'
  },
  // Add more listings as needed
];

const DetailedCardView = ({ card, onClose }) => {
    if (!card) return null;
  
    return (
      <div className="detailed-card-overlay" onClick={onClose}>
        <div className="detailed-card-view" onClick={e => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>&times;</button>
          <div className="image-placeholder">Image will go here</div>
          <h2>{card.name}</h2>
          <p>{card.price}</p>
          <p>{card.description}</p>
        </div>
      </div>
    );
  };

const ListingCard = ({ listing, onMoreDetails }) => (
  <div className="listing-card">
    <div className="image-placeholder">Image will go here</div>
    <h3>{listing.name}</h3>
    <p>{listing.price}</p>
    <button className="details-button" onClick={() => onMoreDetails(listing)}>
      More Details
    </button>
  </div>
);

const Listings = () => {
    const [selectedCard, setSelectedCard] = useState(null);

    const handleMoreDetails = (card) => {
        setSelectedCard(card);
    };

    const handleCloseDetails = () => {
        setSelectedCard(null);
    };

    const handleProfileClick = () => {
        // For now, just logging to console. Later, this will navigate to the profile page.
        console.log("Navigate to profile page.");
    };

    const handleLogoClick = () => {
        window.location.reload();
    };

  return (
    <div className="listings-page">
      <header className="toolbar">
        <div/>
        <img src={pmlogo} alt="Pirate Marketplace Logo" className="toolbar-logo" onClick={handleLogoClick}/>
        <button className="profile-button" onClick={handleProfileClick}>Profile</button>
      </header>
      <main className="main-content">
        <aside className="search-section">
          <input type="text" placeholder="Search for items..." className="search-bar" />
          {/* Future filter fields will go here */}
        </aside>
        <section className="listings-section">
          <div className="listings-grid">
            {listingsData.map(listing => (
              <ListingCard key={listing.id} listing={listing} onMoreDetails={handleMoreDetails} />
            ))}
          </div>
        </section>
      </main>
      <DetailedCardView card={selectedCard} onClose={handleCloseDetails} />
    </div>
  );
};

export default Listings;
