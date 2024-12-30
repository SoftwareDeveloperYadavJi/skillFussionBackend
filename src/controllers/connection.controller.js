import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const sendConnetionRequest = async (req, res) =>{
    // requestId shoud be send via body from frontend
    const { userId, requestedUserId } = req.body;
    try {
        const existingRequest = await prisma.userConnectionRequest.findFirst({
            where: {
                userId,
                requestedUserId,
                status: "pending",
            },
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already sent." });
        }

        const connectionRequest = await prisma.userConnectionRequest.create({
            data: {
                userId,
                requestedUserId,
            },
        });

        res.status(201).json({ message: "Connection request sent.", connectionRequest });

    }catch(error){
        console.error("Error in sending connection request in Controller:", error);
        res.status(500).send("Error sending connection request.");
    }
}


export const acceptConnectionRequest = async (req, res) =>{
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

        // Update the connection request status to accepted
        await prisma.userConnectionRequest.update({
            where: { id: requestId },
            data: { status: "accepted" },
        });

        // Create mutual connections
        await prisma.userConnection.createMany({
            data: [
                { userId: connectionRequest.userId, connectionId: connectionRequest.requestedUserId },
                { userId: connectionRequest.requestedUserId, connectionId: connectionRequest.userId },
            ],
        });

        res.status(200).json({ message: "Connection request accepted and users are now connected." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// get all users to show in the list in user slect only name,email, avatar
export const getConnectionRequests = async (req, res) => {
    const { userId } = req.body;
    try {
        const connectionRequests = await prisma.userConnectionRequest.findMany({
            where: {
                // userId: req.user.id, this for middleware working stage
                userId,
                status: "pending",
            },
        });
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
    const { userId } = req.body;
    try {
        const acceptedConnections = await prisma.userConnection.findMany({
            where: {
                userId: userId,
            },
        });
        res.status(200).json(acceptedConnections);
    } catch (error) {
        console.error("Error getting accepted connections:", error);
        res.status(500).json({ error: "An error occurred while getting accepted connections" });
    }
};
