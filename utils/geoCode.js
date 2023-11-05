import { Client, Status } from "@googlemaps/google-maps-services-js";

async function geocodeAddress(address) {
	const client = new Client({});

	try {
		const geocodeResponse = await client.geocode({
			params: {
				address: address,
				key: process.env.GOOGLE_MAPS_KEY,
			},
		});

		if (geocodeResponse.data.status === Status.OK) {
			const location = geocodeResponse.data.results[0].geometry.location;
			return location;
		} else {
			throw new Error("Geocoding failed");
		}
	} catch (error) {
		throw error;
	}
}

export { geocodeAddress };
