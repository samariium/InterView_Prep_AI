const Session = require("../models/Session");
const Question = require("../models/Question");

//@desc Create a new session
//@route POST /api/sessions/create
//@access Private
exports.createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = req.body;
        const userId = req.user._id;

        // Fix: Use different variable name for the model to avoid conflict
        const sessionModel = require("../models/Session");
        
        // Fix: Use sessionModel instead of Session to avoid constructor conflict
        const Session = await sessionModel.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        // Fix: Properly handle questions creation
        const questionDocs = [];
        for (const question of questions) {
            const newQuestion = await Question.create({
                session: Session._id,
                question: question.question,
                answer: question.answer,
            });
            questionDocs.push(newQuestion._id);
        }

        Session.questions = questionDocs;
        await Session.save();

        res.status(201).json({ success: true, session: Session });
    } catch (error) {
        console.error("Error in createSession:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error",
            error: error.message // Added for debugging
        });
    }
};

//@desc Get all sessions for the logged-in user
//@route GET /api/sessions/my-sessions
//@access Private
exports.getSessions = async (req, res) => {
    try{
        const sessions = await Session.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("questions");
        res.status(200).json(sessions);
    }catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
    }
};

//desc get a session by ID with populated questions
//@route GET /api/sessions/:id
//@access Private
exports.getSessionById = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id)
         .populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: -1 } }
         })
         .exec();

        if(!session){
            return res
                .status(404)
                .json({ success: false, message: "Session not found" });
        }

        res.status(200).json({ success: true, session });

    }catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
    }
};

//desc delete a session and its questions
//@route DELETE /api/sessions/:id
//@access Private
exports.deleteSession = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Check if the user is authorized to delete the session
        // if (session.user.toString() !== req.user._id) {
        //     return res 
        //         .status(401)
        //         .json({ message: "User not authorized to delete this session" });
        // }

        // Delete associated questions
        await Question.deleteMany({ session: session._id });

        // Delete the session
        await session.deleteOne();

        res.status(200).json({ success: true, message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
    }
};
