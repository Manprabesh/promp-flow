import Message from "../models/message.model.js";
import openRouter from "../config/openRouter.js";
import messageModel from "../models/message.model.js";

//get response from AI
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
      success: true,
      message: "Response successfully",
      prompt: prompt,
      data: AIresponse
    });

  } catch (error) {
    console.error("Create message error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//save prompt and AI response in database
export const saveMessage = async (req, res) => {
  try {
    const { prompt, response } = req.body;
    const { userId } = req;
    console.log("user id-->", userId);
    console.log("prompt -->", prompt);
    console.log("response -->", response);

    if (!prompt || !response) {
      console.log("credentails undefined");
      return res.status(401).json({ message: "Credentails undefined" });
    }

    //saved the messagw
    const message = await Message.create({
      prompt,
      response,
      user: userId
    });

    console.log("messages", message)

    return res.status(201).json({
      success: true,
      data: message,
      message: "message saved successfully"
    });


  } catch (error) {
    console.log("error is saving message ", error)
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

//get the message model
export const getMessage = async (req, res) => {
  try {
    const { userId } = req;
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    console.log("page -->", page)
    console.log("limit -->", limit)

    /**
     * pagintaion 
     * page = 1, limit = 6, skip =0
     * page = 2, limit = 6, skip =6
     * page = 3, limit = 6, skip =12
     */
    const skip = (page - 1) * limit;
    console.log("skippp->", skip)
    let message = await Message.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

      if (message.length < 1) {
      console.log("all messages", message.length);
      return res.status(404).json({ success: false, mesage: "No message exist" })
    }

    if (message.lengh < 1) {
      console.log(message)
      return res.status(404).json({ message: "No messages found" })
    }

    let messageData = [];
    for (let i = 0; i < message.length; i++) {
      messageData.push(
        {
          prompt: message[i]["prompt"],
          response: message[i]["response"],
          message_id: message[i]["_id"]
        }
      )
    }

    return res.json({
      success: true,
      message: "fetch successfully",
      data: {
        user: userId,
        message: messageData
      }
    });
  } catch (error) {
    console.log("error in fetch message model", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}