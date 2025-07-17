import React from "react";

const DeleteAlertContent = ({ content = "Are you sure you want to delete this?", onDelete }) => {
    return (
        <div className="p-5">
            <p className="text-[14px] text-gray-700">{content}</p>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteAlertContent;
