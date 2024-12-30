export const setupSocketHandlers = (io, prisma) => {
    // Store connected users
    const connectedUsers = new Map();

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Handle user connection with their ID
        socket.on("userconnected", async (userId) => {
            console.log("User connected to socket:", userId);
            connectedUsers.set(userId, socket.id);
            io.emit("user_status_change", { userId, status: "online" });
        });

        // Handle private messages
        socket.on("sendmessage", async ({ senderId, receiverId, content }) => {
            try {
                // Find or create conversation
                console.log("Sending message:", senderId, receiverId, content);
                let conversation = await prisma.conversation.findFirst({
                    where: {
                        AND: [
                            { participants: { some: { id: senderId } } },
                            { participants: { some: { id: receiverId } } },
                        ],
                    },
                });

                if (!conversation) {
                    conversation = await prisma.conversation.create({
                        data: {
                            participants: {
                                connect: [{ id: senderId }, { id: receiverId }],
                            },
                        },
                    });
                }

                // Create message
                const message = await prisma.message.create({
                    data: {
                        content,
                        senderId,
                        receiverId,
                        conversationId: conversation.id,
                    },
                    include: {
                        sender: true,
                        receiver: true,
                    },
                });

                // Send to receiver if online
                const receiverSocketId = connectedUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                }

                // Send confirmation to sender
                socket.emit("message_sent", message);
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("message_error", { error: "Failed to send message" });
            }
        });

        // Handle typing status
        socket.on("typingstart", ({ userId, conversationId }) => {
            socket.broadcast.to(conversationId).emit("user_typing", userId);
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    connectedUsers.delete(userId);
                    io.emit("user_status_change", { userId, status: "offline" });
                    break;
                }
            }
        });
    });
};