import Message from "../models/message.model.js";

export const createMessage = async (req, res) => {
  try {
    const { prompt } = req.body;

    /* -------- VALIDATION -------- */
    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    //generate response
    const response = `Processed: ${prompt}`;

    /* -------- SAVE TO DB -------- */
    // const message = await Message.create({
    //   prompt,
    //   response,
    // });

    /* -------- RESPONSE -------- */
    res.status(201).json({
      message: "Saved successfully",
      data: prompt,
    });

  } catch (error) {
    console.error("Create message error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};