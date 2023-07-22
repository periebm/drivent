import { Router } from "express";
import { authenticateToken } from "../middlewares";
import { bookRoom, getBooking, updateBooking } from "../controllers";

const bookingRouter = Router();

bookingRouter
    .all("/*", authenticateToken)
    .get("/", getBooking)
    .post("/", bookRoom)
    .put("/:bookingId", updateBooking)

export { bookingRouter };