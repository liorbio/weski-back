import hotelsController from "../controllers/hotels.js";

export default (app) => {
    app.post("/hotels", hotelsController.searchForHotels);
};
