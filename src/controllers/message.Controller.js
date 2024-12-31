import { prisma } from "../app.js";

export const messageController = {
    // Get conversation history
    async getConversation(req, res) {
        try {
            const { userId, otherUserId } = req.params;

            const conversation = await prisma.conversation.findFirst({
                where: {
                    AND: [
                        { participants: { some: { id: userId } } },
                        { participants: { some: { id: otherUserId } } },
                    ],
                },
                include: {
                    messages: {
                        include: {
                            sender: true,
                            receiver: true,
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                },
            });

            res.json(conversation || { messages: [] });
        } catch (error) {
            console.error("Error getting conversation:", error);
            res.status(500).json({ error: "Failed to get conversation" });
        }
    },

    // Get all conversations for a user
    async getUserConversations(req, res) {
        try {
            const { userId } = req.params;

            const conversations = await prisma.conversation.findMany({
                where: {
                    participants: {
                        some: {
                            id: userId,
                        },
                    },
                },
                include: {
                    participants: true,
                    messages: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take:7,
                    },
                },
            });

            res.json(conversations);
        } catch (error) {
            console.error("Error getting user conversations:", error);
            res.status(500).json({ error: "Failed to get user conversations" });
        }
    },
};