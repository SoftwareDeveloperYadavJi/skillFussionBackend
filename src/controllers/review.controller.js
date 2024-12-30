import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createReview = async (req, res) => {
    const userId = "cm53ojiix0000ffmszuq27s93";
    
    let {  reviewDescription, rating } = req.body;
    rating = parseInt(rating);
    try {
        const review = await prisma.review.create({
            data: {
                userId,
                rating,
                reviewDescription,
            },
        });
        res.status(201).json({ message: "Review created successfully.", review });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "An error occurred while creating the review." });
    }
};

// get all reviews
export const getReviews = async (req, res) => {
    const userId = "cm53ojiix0000ffmszuq27s93";
    // const { userId } = req.body;
    // we are gettkng the userid in this by that I wnat to feth the user name who is reviewing

    try {
        const reviews = await prisma.review.findMany({
            where: { userId },
            // in this we have ID of a user who is reviewing
            // we need to get the name of the user who is reviewing
            select: {
                id: true,
                userId: true,
                rating: true,
                reviewDescription: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error getting reviews:", error);
        res.status(500).json({ error: "An error occurred while getting reviews." });
    }
};