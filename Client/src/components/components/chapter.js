import React, { useRef } from "react";
import { Link } from "react-router-dom";

const Chapter = ({ chap, isDarkModeEnable, currentChapterRef, readHistory, story }) => {
    const isCurrentChapter = () => {
        const currentChapterIndex = readHistory?.findIndex(
            (item) =>
                parseInt(item.chapter) === parseInt(chap.chapter_name) &&
                item.slug === story.params.slug
        );
        return currentChapterIndex !== -1;
    };

    const currentChapter = isCurrentChapter();

    return (
        <Link to={`view/${chap.chapter_api_data.split("/").pop()}`} key={chap.chapter_name}>
            <div
                ref={currentChapter ? currentChapterRef : null}
                className={`${
                    isDarkModeEnable ? "bg-[#252A34]" : "bg-[#EEF3FD]"
                } ${
                    currentChapter ? "bg-red-200 font-semibold" : ""
                } rounded-md border-[1px] border-bd-color transition flex-row justify-start items-center p-4 hover:bg-primary-color hover:text-white`}
            >
                <p className="w-full flex justify-between">
                    Chapter {chap.chapter_name}
                    {currentChapter && (
                        <span className="text-end italic">
                            {" "}
                            Đang đọc{" "}
                        </span>
                    )}
                </p>
            </div>
        </Link>
    );
};

export default Chapter;
