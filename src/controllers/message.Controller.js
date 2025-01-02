    import { prisma } from "../app.js";

    export const messageController = {
        // Get conversation history
        async getConversation(req, res) {
            try {
                const { userId, otherUserId } = req.params;

                // Check if both users exist
                const user = await prisma.user.findUnique({ where: { id: userId } });
                const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });

                if (!user || !otherUser) {
                    return res.status(400).json({ error: "Both users must exist to create a conversation" });
                }

                // Attempt to find an existing conversation
                let conversation = await prisma.conversation.findFirst({
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

                // If no conversation exists, create one
                if (!conversation) {
                    conversation = await prisma.conversation.create({
                        data: {
                            participants: {
                                connect: [{ id: userId }, { id: otherUserId }], // Ensure both users are connected
                            },
                        },
                    });
                }

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
                            take: 7,
                        },
                    },
                });

                // If no conversations exist
                if (!conversations.length) {
                    return res.json([]); // Return an empty array if no conversations are found
                }

                res.json(conversations);
            } catch (error) {
                console.error("Error getting user conversations:", error);
                res.status(500).json({ error: "Failed to get user conversations" });
            }
        },
    };

