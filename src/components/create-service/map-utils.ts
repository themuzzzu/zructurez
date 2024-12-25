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
  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'IN' },
    fields: ['formatted_address', 'geometry']
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry?.location && place.formatted_address) {
      map.setCenter(place.geometry.location);
      marker.setPosition(place.geometry.location);
      setSelectedLocation(place.formatted_address);
      map.setZoom(16);
    }
  });

  return autocomplete;
};

export const createMapInstance = (container: HTMLElement) => {
  return new google.maps.Map(container, {
    center: TADIPATRI_CENTER,
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false,
  });
};

export const createMarker = (map: google.maps.Map) => {
  return new google.maps.Marker({
    map,
    draggable: true,
    position: map.getCenter(),
  });
};