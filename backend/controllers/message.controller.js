import Message from "../models/message.model.js";
import openRouter from "../config/openRouter.js";

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
    console.log("The propmt", prompt)
    const AIresponse = await openRouter(prompt)
    console.log("The response ---->", AIresponse)

    res.status(201).json({
      success:true,
      message: "Response successfully",
      data: prompt,
      response:AIresponse
    });

  } catch (error) {
    console.error("Create message error:", error);

    res.status(500).json({
      success:false,
      message: "Server error",
    });
  }
};