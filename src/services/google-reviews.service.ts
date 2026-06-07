/**
 * google-reviews.service.ts
 *
 * Obtiene las reseñas de Google para el perfil de Elemotor
 * usando Google Places API (Legacy Details).
 *
 * Variables de entorno requeridas (server-side, sin NEXT_PUBLIC_):
 *   GOOGLE_PLACES_API_KEY  → API key con Places API habilitada
 *   GOOGLE_PLACE_ID        → Place ID del perfil de Google My Business
 *
 * Cómo obtener el Place ID:
 *   1. Abre Google Maps y busca "Elemotor"
 *   2. Clic en el negocio → la URL tendrá algo como: place_id=ChIJ...
 *   O usa: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
 */

export interface GoogleReview {
    author_name: string;
    rating: number;
    text: string;
    time: number;
    relative_time_description: string;
    profile_photo_url: string;
}

interface PlacesApiResponse {
    result?: { reviews?: GoogleReview[] };
    status: string;
    error_message?: string;
}

export async function getGoogleReviews(): Promise<GoogleReview[]> {
    const apiKey   = process.env.GOOGLE_PLACES_API_KEY;
    const placeId  = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
        console.warn('[GoogleReviews] GOOGLE_PLACES_API_KEY o GOOGLE_PLACE_ID no están definidos.');
        return [];
    }

    try {
        const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
        url.searchParams.set('place_id', placeId);
        url.searchParams.set('fields', 'reviews');
        url.searchParams.set('reviews_sort', 'newest');
        url.searchParams.set('language', 'es');
        url.searchParams.set('key', apiKey);

        const res = await fetch(url.toString(), {
            next: { revalidate: 3600 }, // Cache 1 hora
        });

        if (!res.ok) {
            console.error('[GoogleReviews] HTTP error:', res.status);
            return [];
        }

        const data: PlacesApiResponse = await res.json();

        if (data.status !== 'OK') {
            console.error('[GoogleReviews] API error:', data.status, data.error_message ?? '');
            return [];
        }

        // Filtrar solo reseñas con texto y con 4+ estrellas
        return (data.result?.reviews ?? []).filter((r) => r.text?.trim() && r.rating >= 4);
    } catch (err) {
        console.error('[GoogleReviews] fetch falló:', err);
        return [];
    }
}
