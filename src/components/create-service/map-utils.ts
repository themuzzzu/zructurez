import { toast } from "sonner";

export const TADIPATRI_CENTER = {
  lat: 14.9041,
  lng: 77.9813
};

export const initializeGeocoder = (
  position: google.maps.LatLng,
  setSelectedLocation: (location: string) => void
) => {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    { location: position },
    (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
      if (status === "OK" && results?.[0]) {
        setSelectedLocation(results[0].formatted_address);
        toast.success("Location selected successfully");
      } else {
        console.error('Geocoding failed:', status);
        toast.error("Failed to get address for selected location");
      }
    }
  );
};

export const initializeAutocomplete = (
  input: HTMLInputElement,
  map: google.maps.Map,
  marker: google.maps.Marker,
  setSelectedLocation: (location: string) => void
) => {
  try {
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'IN' },
      fields: ['formatted_address', 'geometry', 'name'],
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(TADIPATRI_CENTER.lat - 0.5, TADIPATRI_CENTER.lng - 0.5),
        new google.maps.LatLng(TADIPATRI_CENTER.lat + 0.5, TADIPATRI_CENTER.lng + 0.5)
      ),
      strictBounds: false
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry?.location) {
        toast.error("No location found for this place");
        return;
      }

      // Update map and marker
      map.setCenter(place.geometry.location);
      marker.setPosition(place.geometry.location);
      map.setZoom(16);

      // Update selected location
      if (place.formatted_address) {
        setSelectedLocation(place.formatted_address);
        toast.success("Location selected: " + place.formatted_address);
      }
    });

    return autocomplete;
  } catch (error) {
    console.error("Error initializing autocomplete:", error);
    toast.error("Failed to initialize location search");
    return null;
  }
};

export const createMapInstance = (container: HTMLElement) => {
  const map = new google.maps.Map(container, {
    center: TADIPATRI_CENTER,
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  // Add a custom style to make the map more visible
  map.setOptions({
    backgroundColor: '#f8fafc'
  });

  return map;
};

export const createMarker = (map: google.maps.Map) => {
  return new google.maps.Marker({
    map,
    draggable: true,
    position: map.getCenter(),
    animation: google.maps.Animation.DROP,
  });
};