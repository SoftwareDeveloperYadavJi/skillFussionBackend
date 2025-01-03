import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const sendConnetionRequest = async (req, res) => {
    const { userId, requestedUserId } = req.body;

    try {
        // Use a transaction to ensure atomicity
        const result = await prisma.$transaction(async (prisma) => {
            // Check if the user is already connected
            const connectedUser = await prisma.userConnection.findFirst({
                where: {
                    userId,
                    connectionId: requestedUserId,
                },
            });

            if (connectedUser) {
                throw new Error("User is already connected.");
            }

            // Check if there is an existing pending request
            const existingRequest = await prisma.userConnectionRequest.findFirst({
                where: {
                    userId,
                    requestedUserId,
                    status: "pending",
                },
            });

            if (existingRequest) {
                throw new Error("Connection request already sent.");
            }

            // If no connection and no existing request, create the new request
            const connectionRequest = await prisma.userConnectionRequest.create({
                data: {
                    userId,
                    requestedUserId,
                },
            });

            return connectionRequest;
        });

        res.status(201).json({ message: "Connection request sent.", connectionRequest: result });

    } catch (error) {
        console.error("Error in sending connection request:", error.message);
        res.status(500).send({ message: error.message || "Error sending connection request." });
    }
};


export const acceptConnectionRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        // Find the connection request
        const connectionRequest = await prisma.userConnectionRequest.findUnique({
            where: { id: requestId },
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found." });
        }

        if (connectionRequest.status !== "pending") {
            return res.status(400).json({ message: "Connection request is not pending." });
        }

        // Check if the user is already connected
        const connectedUser = await prisma.userConnection.findFirst({
            where: {
                userId: req.user.id,
                connectionId: connectionRequest.userId,
            },
        });

        if (connectedUser) {
            return res.status(210).json({ message: "You are already connected." });
        }

        // Check if the reverse connection already exists
        const reverseConnection = await prisma.userConnection.findFirst({
            where: {
                userId: connectionRequest.userId,
                connectionId: req.user.id,
            },
        });

        if (reverseConnection) {
            return res.status(210).json({ message: "You are already connected." });
        }

        // Update the connection request status to accepted
        await prisma.userConnectionRequest.update({
            where: { id: requestId },
            data: { status: "accepted" },
        });

        // Create mutual connections only if they do not exist already
        await prisma.userConnection.createMany({
            data: [
                { userId: connectionRequest.userId, connectionId: connectionRequest.requestedUserId },
                { userId: connectionRequest.requestedUserId, connectionId: connectionRequest.userId },
            ],
            skipDuplicates: true, // Ensure duplicates are skipped if the same connection already exists
        });

        res.status(200).json({ message: "Connection request accepted and users are now connected." });

    } catch (error) {
        console.error("Error accepting connection request:", error);
        res.status(500).json({ error: error.message });
    }
};



// get all users to show in the list in user slect only name,email, avatar
export const getConnectionRequests = async (req, res) => {
    const { id } = req.user;

    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // Fetching the connection requests and including user details from the 'requestedUserId'
        const connectionRequests = await prisma.userConnectionRequest.findMany({
            where: {
                userId: id,
                status: "pending",
            },
            distinct: ['connectionId'],  // Ensure unique 'requestedUserId'
            include: {
                receiver: { // Include the receiver (requestedUserId)
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        city: true,
                    },
                },
            },
        });

        // Returning the connection requests with the receiver's user details
        res.status(200).json(connectionRequests);
    } catch (error) {
        console.error("Error getting connection requests:", error);
        res.status(500).json({ error: "An error occurred while getting connection requests" });
    }
};





// reject connection request
export const rejectConnectionRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        // Find the connection request
        const connectionRequest = await prisma.userConnectionRequest.findUnique({
            where: { id: requestId },
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found." });
        }

        if (connectionRequest.status !== "pending") {
            return res.status(400).json({ message: "Connection request is not pending." });
        }

        // Update the connection request status to rejected
        await prisma.userConnectionRequest.update({
            where: { id: requestId },
            data: { status: "rejected" },
        });

        res.status(200).json({ message: "Connection request rejected." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// get all the connection that are accepted
export const getAcceptedConnections = async (req, res) => {
    const { id } = req.user;
    try {

        // do not accept the dubplicate connection
        const connectedUser = await prisma.userConnection.findFirst({
            where: {
                userId: id,
                connectionId: id,
            },
        });

        if (connectedUser) {
            return res.status(210).json({ message: "You are already connected." });
        }
        const acceptedConnections = await prisma.userConnection.findMany({
            where: {
                userId: id,
            },
            distinct: ['connectionId'],  // Ensure unique 'connectionId'
            include: {
                connection: {
                    select: {
                        id: true,
                        name: true, // Fetch user's name
                        role: true, 
                        email: true, // Add other fields as needed
                    },
                },
            },
        });

        res.status(200).json(acceptedConnections);
    } catch (error) {
        console.error("Error getting accepted connections:", error);
        res.status(500).json({ error: "An error occurred while getting accepted connections" });
    }
};
