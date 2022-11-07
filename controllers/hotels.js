import fetch from "node-fetch";
import hotelSearchApis from "../resources/hotel_search_apis.js";

export default {
    async searchForHotels(req, res) {
        // EXPECT THE FOLLOWING REQ.BODY FROM THE FRONT END:
        // const { ski_site, from_date, to_date, group_size } = req.body;
        // NO NEED TO DESTRUCTURE BECAUSE WE GET IT IN THE reduce BELOW

        const hotelSearchPromises = [];

        Object.keys(hotelSearchApis).forEach((api) => {
            // Supposed to be a way to wrap the 4 req.body parameters in a way that suits each hotelSearchApi
            const searchParameters = hotelSearchApis[api].requiredFields.reduce((accumulator, value) => {
                return { ...accumulator, [value]: req.body.query[value] };
            }, {});
            const wrappedBody = {
                query: searchParameters,
            };

            hotelSearchPromises.push(
                fetch(hotelSearchApis[api].url, {
                    method: "POST",
                    body: JSON.stringify(wrappedBody),
                    headers: { "Content-Type": "application/json" },
                })
            );
        });
        try {
            const arrayOfRawReponses = await Promise.all(hotelSearchPromises);
            const rawReponsesToJsonPromises = arrayOfRawReponses.map((reponsePromise) => {
                return reponsePromise.json();
            });

            const arrayOfResponses = await Promise.all(rawReponsesToJsonPromises);

            const arrayOfArrayOfHotels = arrayOfResponses.map((response) => response.body.accommodations);

            res.send(arrayOfArrayOfHotels.flat());
        } catch (error) {
            res.status(400).send(`Error occurred: ${error}`);
        }
    },
};
