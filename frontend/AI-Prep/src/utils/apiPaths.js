export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",//signup
        LOGIN: "/api/auth/login",//authenticate user and return JWT token
        GET_PROFILE:  "/api/auth/profile",//get logged-in user details
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",//upload profile picture
    },

    AI: {
        GENERATE_QUESTIONS : "/api/ai/generate-questions",//genearte interview questions and answer using gemini
        GENERATE_EXPLANATION : "/api/ai/generate-explanation",//generate concept explanation using gemini
    },

    SESSION:{
        CREATE:"/api/sessions/create",//creata new interview session with questions
        GET_ALL:"/api/sessions/my-sessions",// get all user sessions
        GET_ONE :(id)=>`/api/sessions/${id}`,//get session details with questions
        DELETE:(id)=>`/api/sessions/${id}`,//delete a session
    },

    QUESTION:{
        ADD_TO_SESSION: "/api/questions/add",//add more qquestion to a session
        PIN: (id)=> `api/questions/${id}/pin`,//pin or unpin a questions
        UPDATE_NOTE: (id)  => `/api/questions/${id}/note`,//update or add note to a wquestins
    },
}
